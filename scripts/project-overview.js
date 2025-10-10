/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

/** ======================
 *  Config (no CLI flags; just run `node project-overview.js`)
 *  ====================== */
const OUTPUT_DIR_NAME = path.join('chatgpt', 'full');

// Maximum size per output file (bytes)
const MAX_BUNDLE_BYTES = 5 * 1024 * 1024; // 5 MB
// Max number of output files
const MAX_OUTPUT_FILES = 10;
// Tree depth for project root overview
const ROOT_TREE_DEPTH = 3;

// Which file types to include in bundles (text-ish)
const ALLOWED_EXT = new Set([
  '.js','.jsx','.ts','.tsx','.mjs','.cjs',
  '.json','.md','.txt',
  '.css','.scss','.sass',
  '.html','.xml',
  '.sql','.sh','.bat','.ps1',
  '.yml','.yaml','.toml','.ini','.cfg','.conf',
  '.py','.go','.rb','.rs','.java','.kt',
  '.c','.h','.cpp','.hpp',
  '.dockerfile','.env.example'
]);

// Directories we skip to avoid noise/weight
const IGNORE_DIRS = new Set([
  'node_modules','dist','build','.next','.nuxt','out',
  '.cache','.parcel-cache','coverage',
  '.git','.github','.vscode','.idea','.vite',
  'assets','images','videos','media','uploads','public'
]);

// Files we skip explicitly
const IGNORE_FILES = new Set([
  '.DS_Store','Thumbs.db','package-lock.json','yarn.lock','pnpm-lock.yaml'
]);

/** ======================
 *  FS helpers
 *  ====================== */
function clearDir(dir) { fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true }); }
function isBinary(buf) { return buf.includes(0); }
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
 *  Root detection (walk up from this script)
 *  ====================== */
function findProjectRoot(startDir) {
  let dir = path.resolve(startDir);
  for (let i = 0; i < 12; i++) {
    const hasPkg = fs.existsSync(path.join(dir, 'package.json'));
    const hasGit = fs.existsSync(path.join(dir, '.git'));
    const hasFrontend = fs.existsSync(path.join(dir, 'frontend'));
    const hasChatgpt = fs.existsSync(path.join(dir, 'chatgpt'));
    if (hasPkg || hasGit || hasFrontend || hasChatgpt) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
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
      if (e.name.startsWith('.')) continue; // skip hidden by default
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

function walkDirLimitedDepth(dir, maxDepth, depth = 0) {
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
      tree += walkDirLimitedDepth(full, maxDepth, depth + 1);
    }
  }
  return tree;
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
    // Root & frontend tooling/config
    'package.json','frontend/package.json',
    'tsconfig.json','frontend/tsconfig.json','frontend/tsconfig.app.json','frontend/tsconfig.node.json','frontend/tsconfig.eslint.json',
    'vite.config.ts','vite.config.js','frontend/vite.config.ts','frontend/vite.config.js',
    'tailwind.config.js','tailwind.config.cjs','tailwind.config.ts',
    'postcss.config.js','postcss.config.cjs','postcss.config.ts',
    'eslint.config.js','eslint.config.cjs','eslint.config.mjs','.eslintrc','.eslintrc.json',
    'README.md','frontend/README.md',
    '.cursorrules'
  ].map(p => path.join(projectRoot, p));

  const router = detectRouterEntries(projectRoot);
  const maybes = [
    'site.json','frontend/src/site.json','src/site.json',
    'frontend/tailwind.config.js','frontend/postcss.config.js'
  ].map(p => path.join(projectRoot, p));

  const all = [...new Set([...candidates, ...router, ...maybes])]
    .filter(p => fs.existsSync(p))
    .map(full => ({ full, rel: path.relative(projectRoot, full), name: path.basename(full) }));

  // Ensure .cursorrules is first if present
  const idx = all.findIndex(f => f.rel === '.cursorrules');
  if (idx > -1) {
    const [it] = all.splice(idx, 1);
    all.unshift(it);
  }
  return all;
}

/** ======================
 *  Banners & packers
 *  ====================== */
function makeBanner(title, fileRel) { return `\n*** ${title}: ${fileRel} ***\n`; }
function makeEndBanner() { return `\n*** END FILE ***\n`; }

function buildChunks(files, baseDir) {
  const chunks = [];
  for (const f of files) {
    const content = safeRead(f.full);
    if (content == null) continue;
    const rel = path.relative(baseDir, f.full);
    const chunk = `${makeBanner('FILE', rel)}${content}\n${makeEndBanner()}`;
    chunks.push({ rel, bytes: Buffer.byteLength(chunk, 'utf8'), text: chunk });
  }
  return chunks;
}

function packBySize(chunks, outDir, prefix, maxBytes, maxFiles) {
  const written = [];
  let part = 1;
  let current = '';
  let currentBytes = 0;

  const flush = () => {
    if (!current) return;
    const name = `${prefix}_part${String(part).padStart(2,'0')}.txt`;
    fs.writeFileSync(path.join(outDir, name), current);
    written.push(name);
    part++;
    current = '';
    currentBytes = 0;
  };

  for (const ch of chunks) {
    if (currentBytes + ch.bytes > maxBytes && current) {
      flush();
      // if we somehow exceed max files, we’ll merge later
    }
    current += ch.text;
    currentBytes += ch.bytes;
  }
  if (current) flush();

  // Enforce file cap by merging from the end
  while (written.length > maxFiles) {
    const keep = written[written.length - 2];
    const absorb = written[written.length - 1];
    const keepPath = path.join(outDir, keep);
    const absorbPath = path.join(outDir, absorb);
    fs.appendFileSync(keepPath, '\n' + fs.readFileSync(absorbPath, 'utf8'));
    fs.rmSync(absorbPath, { force: true });
    written.pop();
  }

  return written;
}

/** ======================
 *  Structure text
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

/** ======================
 *  MAIN
 *  ====================== */
(async function main() {
  // 1) Locate project root from this script’s directory
  const SCRIPT_DIR = __dirname;
  const PROJECT_ROOT = findProjectRoot(SCRIPT_DIR);
  const TARGET_PATH = PROJECT_ROOT; // Always pack the whole project root

  // 2) Prepare output directory
  const OUT_DIR = path.join(PROJECT_ROOT, OUTPUT_DIR_NAME);
  clearDir(OUT_DIR);

  console.log('[project-overview] Project root:', PROJECT_ROOT);
  console.log('[project-overview] Target folder:', TARGET_PATH);
  console.log('[project-overview] Output dir:', OUT_DIR);
  console.log(`[project-overview] Max bundle size: ${(MAX_BUNDLE_BYTES/1024/1024).toFixed(1)} MB`);
  console.log(`[project-overview] Max output files: ${MAX_OUTPUT_FILES}`);
  console.log('');

  // 3) Gather files
  const contextFiles = collectContextFiles(PROJECT_ROOT);
  const allFiles = walkDir(TARGET_PATH);

  // Build unified ordered list: .cursorrules/context first, then the rest
  const contextSet = new Set(contextFiles.map(f => f.full));
  const unified = [
    ...contextFiles,
    ...allFiles.filter(f => !contextSet.has(f.full)),
  ];

  // 4) Build chunks and pack
  const chunks = buildChunks(unified, PROJECT_ROOT);
  const written = packBySize(chunks, OUT_DIR, 'ALL', MAX_BUNDLE_BYTES, MAX_OUTPUT_FILES);

  // 5) Append structure info to PART 1 (no separate file)
  const treeRoot = walkDirLimitedDepth(PROJECT_ROOT, ROOT_TREE_DEPTH);
  const treeTarget = printFullTree(TARGET_PATH, allFiles);
  const stats = {
    generated: new Date().toISOString(),
    projectRoot: PROJECT_ROOT,
    targetFolder: TARGET_PATH,
    counts: {
      totalFilesInTarget: allFiles.length,
      byExtension: allFiles.reduce((acc, f) => {
        const ext = path.extname(f.name).toLowerCase() || '(noext)';
        acc[ext] = (acc[ext] || 0) + 1;
        return acc;
      }, {})
    },
    bundles: written
  };

  const structureTxt = [
    '\n*** PROJECT_STRUCTURE ***',
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
    '*** END PROJECT_STRUCTURE ***\n'
  ].join('\n');

  if (written.length > 0) {
    const part1Path = path.join(OUT_DIR, written[0]);
    fs.appendFileSync(part1Path, structureTxt);
  }

  console.log('Done.');
  console.log('Output files:', written);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
