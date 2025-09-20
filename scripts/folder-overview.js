/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/** ======================
 *  Config
 *  ====================== */
const OUTPUT_DIR_NAME = path.join('chatgpt', 'folder-overview');

// Maximum size per output file (in bytes) before we start a new "part"
const MAX_BUNDLE_BYTES = getCliNumber('--maxMB=', 5) * 1024 * 1024; // default 5 MB

// Tree depth for project root overview
const ROOT_TREE_DEPTH = getCliNumber('--rootDepth=', 3);

// Which file types to include in concatenated bundles
const ALLOWED_EXT = new Set([
  '.js','.jsx','.ts','.tsx','.json','.md','.txt','.css','.scss','.sass','.html','.xml',
  '.sql','.sh','.bat','.ps1','.yml','.yaml','.toml','.ini','.cfg','.conf','.mjs','.cjs'
]);

const IGNORE_DIRS = new Set([
  'node_modules','dist','build','.next','.nuxt','out','.cache','.parcel-cache','coverage',
  '.git','.github','.vscode','.idea','.vite','assets','images','videos','media','uploads','public'
]);

const IGNORE_FILES = new Set([
  '.DS_Store','Thumbs.db','package-lock.json','yarn.lock','pnpm-lock.yaml'
]);

/** ======================
 *  CLI helpers
 *  ====================== */
function getCliNumber(prefix, fallback) {
  const arg = process.argv.find(a => a.startsWith(prefix));
  if (!arg) return fallback;
  const n = Number(arg.slice(prefix.length));
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function looksLikeAbs(p) {
  return path.isAbsolute(p) || /^[a-zA-Z]:\\/.test(p); // Windows drive
}

function parseTargetPath(argv) {
  // Supports:
  //   node folder-overview.js --C:\path\to\folder
  //   node folder-overview.js --/Users/you/dev/app
  //   node folder-overview.js --path="C:\path\to\folder"
  //   node folder-overview.js /absolute/path
  for (const a of argv) {
    if (a.startsWith('--path=')) return stripQuotes(a.slice(7));
    if (a.startsWith('--') && a.includes(':\\')) return stripQuotes(a.slice(2));
    if (a.startsWith('--/') || a.startsWith('--\\')) return a.slice(2);
    if (looksLikeAbs(a)) return stripQuotes(a);
  }
  return process.cwd();
}

function stripQuotes(s) {
  return s.replace(/^['"]|['"]$/g, '');
}

/** ======================
 *  FS helpers
 *  ====================== */
function clearDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function isBinary(buf) {
  // crude check: contains NUL
  return buf.includes(0);
}

function safeRead(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    if (isBinary(buf)) return null;
    return buf.toString('utf8');
  } catch {
    return null;
  }
}

function shouldSkipFile(name) {
  if (IGNORE_FILES.has(name)) return true;
  const ext = path.extname(name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return true;
  return false;
}

/** ======================
 *  Project root detection
 *  ====================== */
function findProjectRoot(startDir) {
  let dir = path.resolve(startDir);
  for (let i = 0; i < 10; i++) {
    const hasPkg = fs.existsSync(path.join(dir, 'package.json'));
    const hasGit = fs.existsSync(path.join(dir, '.git'));
    const hasFrontend = fs.existsSync(path.join(dir, 'frontend'));
    const hasChatgpt = fs.existsSync(path.join(dir, 'chatgpt'));
    if (hasPkg || hasGit || hasFrontend || hasChatgpt) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // fallback: two levels up from src-like path
  if (/[\\/](frontend|app)[\\/](src|app)[\\/]?$/i.test(startDir)) {
    return path.resolve(startDir, '..', '..');
  }
  return path.resolve(startDir);
}

/** ======================
 *  Walkers
 *  ====================== */
function walkDir(dir, { allowAll = false } = {}) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    let entries = [];
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      if (e.name.startsWith('.')) continue;
      const full = path.join(d, e.name);
      if (e.isSymbolicLink()) continue;
      if (e.isDirectory()) {
        if (!IGNORE_DIRS.has(e.name)) stack.push(full);
      } else {
        if (!allowAll && shouldSkipFile(e.name)) continue;
        out.push({ full, rel: path.relative(dir, full), name: e.name });
      }
    }
  }
  return out.sort((a,b) => a.rel.localeCompare(b.rel));
}

function walkDirLimitedDepth(dir, maxDepth, depth = 0, relBase = '') {
  let tree = '';
  if (depth === 0) tree += `${path.basename(dir)}/\n`;
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return tree; }
  entries = entries
    .filter(e => !e.name.startsWith('.') && !IGNORE_DIRS.has(e.name))
    .sort((a,b) => a.name.localeCompare(b.name));
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const indent = '  '.repeat(depth + 1);
    tree += `${indent}${e.name}${e.isDirectory() ? '/' : ''}\n`;
    if (e.isDirectory() && depth + 1 < maxDepth) {
      tree += walkDirLimitedDepth(full, maxDepth, depth + 1, relBase);
    }
  }
  return tree;
}

/** ======================
 *  Content builders
 *  ====================== */
function makeBanner(title, fileRel) {
  return `\n*** ${title}: ${fileRel} ***\n`;
}
function makeEndBanner() {
  return `\n*** END FILE ***\n`;
}

function concatFilesToBundles(files, baseDir, outPrefix, outDir) {
  let partIdx = 1;
  let current = '';
  let written = [];

  const flush = () => {
    if (current.length === 0) return;
    const name = partIdx === 1 ? `${outPrefix}.txt` : `${outPrefix}_part${partIdx}.txt`;
    fs.writeFileSync(path.join(outDir, name), current);
    written.push(name);
    partIdx++;
    current = '';
  };

  for (const f of files) {
    const content = safeRead(f.full);
    if (content == null) continue;
    const rel = path.relative(baseDir, f.full);
    const chunk = `${makeBanner('FILE', rel)}${content}\n${makeEndBanner()}`;
    if (Buffer.byteLength(current, 'utf8') + Buffer.byteLength(chunk, 'utf8') > MAX_BUNDLE_BYTES) {
      flush();
    }
    current += chunk;
  }
  flush();
  return written;
}

/** ======================
 *  Context gatherers
 *  ====================== */
function detectRouterEntries(projectRoot) {
  const guesses = [
    // Vite/CRA-style
    'src/main.tsx','src/main.jsx','src/index.tsx','src/index.jsx','src/App.tsx','src/App.jsx',
    'frontend/src/main.tsx','frontend/src/main.jsx','frontend/src/index.tsx','frontend/src/index.jsx','frontend/src/App.tsx','frontend/src/App.jsx',
    // Next.js
    'pages/_app.tsx','pages/_app.jsx','pages/_document.tsx','pages/_document.jsx',
    'app/layout.tsx','app/layout.jsx','app/page.tsx','app/page.jsx'
  ];
  return guesses.map(g => path.join(projectRoot, g)).filter(p => fs.existsSync(p));
}

function collectContextFiles(projectRoot) {
  const candidates = [
    // package & tooling
    'package.json','frontend/package.json',
    'tsconfig.json','frontend/tsconfig.json',
    'vite.config.ts','vite.config.js','frontend/vite.config.ts','frontend/vite.config.js',
    'tailwind.config.js','tailwind.config.cjs','tailwind.config.ts',
    'postcss.config.js','postcss.config.cjs','postcss.config.ts',
    '.eslintrc','.eslintrc.json','eslint.config.js','eslint.config.cjs','eslint.config.mjs',
    'README.md','frontend/README.md',
    '.cursorrules'
  ].map(p => path.join(projectRoot, p));

  const router = detectRouterEntries(projectRoot);
  const all = [...new Set([...candidates, ...router])].filter(p => fs.existsSync(p));

  // Also collect the JSON site config if present (nice context for SEO)
  const maybes = ['site.json','frontend/src/site.json','src/site.json'].map(p => path.join(projectRoot, p));
  maybes.forEach(p => { if (fs.existsSync(p)) all.push(p); });

  return all.map(full => ({ full, rel: path.relative(projectRoot, full), name: path.basename(full) }));
}

/** ======================
 *  Stats helpers
 *  ====================== */
function extCounts(files) {
  const counts = {};
  files.forEach(f => {
    const ext = path.extname(f.name).toLowerCase() || '(noext)';
    counts[ext] = (counts[ext] || 0) + 1;
  });
  return counts;
}

/** ======================
 *  MAIN
 *  ====================== */
(async function main() {
  const targetPath = parseTargetPath(process.argv.slice(2));
  if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isDirectory()) {
    console.error(`Target path is not a directory or does not exist:\n${targetPath}`);
    process.exit(1);
  }

  const PROJECT_ROOT = findProjectRoot(targetPath);
  const OUT_DIR = path.join(PROJECT_ROOT, OUTPUT_DIR_NAME);
  clearDir(OUT_DIR);

  console.log('[folder-overview] Target:', targetPath);
  console.log('[folder-overview] Project root:', PROJECT_ROOT);
  console.log('[folder-overview] Output dir:', OUT_DIR);
  console.log(`[folder-overview] Max bundle size: ${(MAX_BUNDLE_BYTES/1024/1024).toFixed(1)} MB\n`);

  // 1) CONTEXT bundle
  const contextFiles = collectContextFiles(PROJECT_ROOT);
  const wroteContext = concatFilesToBundles(contextFiles, PROJECT_ROOT, '00_CONTEXT', OUT_DIR);

  // 2) FOLDER FILES bundle
  const folderFiles = walkDir(targetPath);
  const wroteFolder = concatFilesToBundles(folderFiles, targetPath, '01_FOLDER_FILES', OUT_DIR);

  // 3) PROJECT STRUCTURE (single file)
  const treeRoot = walkDirLimitedDepth(PROJECT_ROOT, ROOT_TREE_DEPTH);
  const treeTarget = printFullTree(targetPath, folderFiles);

  const stats = {
    generated: new Date().toISOString(),
    projectRoot: PROJECT_ROOT,
    targetFolder: targetPath,
    counts: {
      totalFilesInTarget: folderFiles.length,
      byExtension: extCounts(folderFiles)
    },
    bundles: {
      context: wroteContext,
      folderFiles: wroteFolder
    }
  };

  const structureTxt = [
    '# Project Structure',
    '',
    '## Summary',
    '```json',
    JSON.stringify(stats, null, 2),
    '```',
    '',
    '## Project Root (limited depth)',
    '```',
    treeRoot.trimEnd(),
    '```',
    '',
    '## Target Folder (full tree)',
    '```',
    treeTarget.trimEnd(),
    '```',
    ''
  ].join('\n');

  fs.writeFileSync(path.join(OUT_DIR, '02_PROJECT_STRUCTURE.txt'), structureTxt);

  console.log('\nDone.');
})().catch(err => {
  console.error(err);
  process.exit(1);
});

/** ======================
 *  Extra tree printer (full for target)
 *  ====================== */
function printFullTree(root, files) {
  const set = new Set(files.map(f => f.rel.split(/[\\/]/).join('/')));
  const allPaths = Array.from(set).sort();
  let tree = path.basename(root) + '/\n';
  let prev = [];
  for (const p of allPaths) {
    const parts = p.split('/');
    let i = 0;
    while (i < parts.length && prev[i] === parts[i]) i++;
    for (; i < parts.length; i++) {
      const indent = '  '.repeat(i + 1);
      tree += `${indent}${parts[i]}${i < parts.length - 1 ? '/' : ''}\n`;
    }
    prev = parts;
  }
  return tree;
}
