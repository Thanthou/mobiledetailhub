import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** ======================
 *  Config (no CLI flags; just run `node project-overview.js`)
 *  ====================== */
const OUTPUT_DIR_NAME = 'chatgpt';

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


// --- add near the top with other imports ---
function writeText(filePath, text) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, text, 'utf8');
}

/** ======================
 *  FS helpers
 *  ====================== */
function clearDir(dir) { 
  fs.rmSync(dir, { recursive: true, force: true }); 
  fs.mkdirSync(dir, { recursive: true }); 
}
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
  
  // Allow common no-ext infra files
  if (name === 'Dockerfile' || name === 'Makefile') return false;
  
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
    
    // Require at least 2 signals to avoid false positives (e.g., scripts/chatgpt folder)
    const signals = [hasPkg, hasGit, hasFrontend, hasChatgpt].filter(Boolean).length;
    if (signals >= 2) return dir;
    
    // If we find package.json alone, that's also good enough
    if (hasPkg) return dir;
    
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
    '.cursorrules',
    // SEO & infra files
    'public/robots.txt','frontend/public/robots.txt',
    'public/sitemap.xml','frontend/public/sitemap.xml',
    'public/manifest.json','frontend/public/manifest.json',
    // Environment examples
    '.env.example','frontend/.env.example',
    // CI/CD workflows
    '.github/workflows/lighthouse.yml',
    '.github/workflows/ci.yml',
    '.github/workflows/tests.yml'
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



// --- add these helpers somewhere above MAIN ---
function detectSeoSignals(projectRoot) {
  // Cache walkDir calls for performance
  const files = walkDir(projectRoot);
  const rels = JSON.stringify(files.map(f => f.rel));
  
  const checks = [];
  const hasRobots = fs.existsSync(path.join(projectRoot, 'public', 'robots.txt')) ||
                    fs.existsSync(path.join(projectRoot, 'frontend', 'public', 'robots.txt')) ||
                    /robots/i.test(rels);
  const hasSitemapGen = /sitemap/i.test(rels);
  const hasSeoFeature = fs.existsSync(path.join(projectRoot, 'frontend', 'src', 'features', 'seo'));
  const hasSeoShared = fs.existsSync(path.join(projectRoot, 'frontend', 'src', 'shared', 'seo'));
  const hasLdJsonHelpers = /ldjson|structured.?data|json-ld|getLocalBusinessSchema|getServiceSchema|getFAQSchema/i.test(rels) ||
    files.some(f => f.rel.includes('jsonld.ts') && fs.existsSync(f.full));
  const hasPreviewRoute = /preview/i.test(rels);
  const hasHelmetOrHead = /react-helmet|next\/head|HelmetProvider|Helmet/i.test(rels) ||
    fs.existsSync(path.join(projectRoot, 'frontend', 'src', 'main.tsx')) && 
    fs.readFileSync(path.join(projectRoot, 'frontend', 'src', 'main.tsx'), 'utf8').includes('HelmetProvider');
  const hasSeoHead = /SeoHead/i.test(rels);
  const hasBackendSeoRoutes = fs.existsSync(path.join(projectRoot, 'backend', 'routes', 'seo'));
  const hasSeoDefaults = fs.existsSync(path.join(projectRoot, 'frontend', 'src', 'shared', 'seo', 'seoDefaults'));

  checks.push({ key: 'robots.txt', present: hasRobots });
  checks.push({ key: 'sitemap generator', present: hasSitemapGen });
  checks.push({ key: 'seo shared folder', present: hasSeoShared });
  checks.push({ key: 'seo feature folder', present: hasSeoFeature });
  checks.push({ key: 'ld-json helpers', present: hasLdJsonHelpers });
  checks.push({ key: 'SeoHead component', present: hasSeoHead });
  checks.push({ key: 'backend SEO routes', present: hasBackendSeoRoutes });
  checks.push({ key: 'SEO defaults (industry)', present: hasSeoDefaults });
  checks.push({ key: 'preview route', present: hasPreviewRoute });
  checks.push({ key: 'head manager (Helmet/NextHead)', present: hasHelmetOrHead });

  return checks;
}

function captureDatabaseOverview(projectRoot) {
  try {
    const dbScriptPath = path.join(projectRoot, 'backend', 'scripts', 'db-overview.js');
    if (!fs.existsSync(dbScriptPath)) {
      return '# Database Overview\n\n⚠️ db-overview.js not found in backend/scripts/\n';
    }
    
    // Run db-overview.js with level 3 (full details)
    const output = execSync(`node "${dbScriptPath}" 3`, {
      cwd: path.join(projectRoot, 'backend'),
      encoding: 'utf8',
      timeout: 30000, // 30 second timeout
      stdio: ['pipe', 'pipe', 'pipe'] // capture stdout, stderr
    });
    
    return `# Database Overview (Auto-Generated)\n\nGenerated: ${new Date().toISOString()}\n\n\`\`\`\n${output}\n\`\`\`\n`;
  } catch (error) {
    return `# Database Overview\n\n❌ Error running db-overview.js:\n\`\`\`\n${error.message}\n\`\`\`\n\nNote: Make sure your database is running and .env is configured.\n`;
  }
}

function buildSeoMarkdown({ projectRoot, stats }) {
  const checks = detectSeoSignals(projectRoot);
  const byExt = stats.counts.byExtension || {};
  const total = stats.counts.totalFilesInTarget || 0;

  const checklist = checks.map(c => `- [${c.present ? 'x' : ' '}] ${c.key}`).join('\n');

  return `# SEO Report (Auto-Generated)

Generated: ${new Date().toISOString()}

This file summarizes detected SEO signals and TODOs. Edit conventions in \`/docs/SEO.md\` by replacing this file with a curated version if needed.

## Snapshot
- Total files scanned: **${total}**
- By extension: \`${JSON.stringify(byExt)}\`

## Detected signals
${checklist}

## Conventions (recommended)
- **Canonicals**: live → custom domain; subdomain plan canonicalizes to subdomain; previews are **noindex,nofollow** with X-Robots-Tag.
- **Sitemaps**: per-tenant \`/sitemaps/<tenant>.xml\` including home, services, locations.
- **Robots**: allow live tenants; disallow \`/preview\`.
- **Meta**: title ≤ 60 chars; description 150–160 chars; OG + Twitter cards per page.
- **JSON-LD**: LocalBusiness + Service + FAQ where relevant, sourced from tenant config.
- **Assets**: WebP, width/height attributes, lazy loading.
- **Analytics**: GA4 per tenant (calls, form submit, booking events), cookie consent where required.

## TODOs
- [ ] Ensure preview routes send \`noindex\` meta and X-Robots-Tag headers
- [ ] Add per-tenant sitemap generation
- [ ] Add/verify robots.txt
- [ ] Centralize JSON-LD helpers
- [ ] Enforce meta/title via a shared SEO component
`;
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

  // 3.1) Extract .cursorrules to write separately
  const cursorRulesFile = contextFiles.find(f => f.rel === '.cursorrules');
  const contextFilesWithoutCursorRules = contextFiles.filter(f => f.rel !== '.cursorrules');

  // Build unified ordered list: context files (without .cursorrules), then the rest
  const contextSet = new Set(contextFiles.map(f => f.full));
  const unified = [
    ...contextFilesWithoutCursorRules,
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

  // Generate and write SEO report
  const seoReport = buildSeoMarkdown({ projectRoot: PROJECT_ROOT, stats });
  writeText(path.join(OUT_DIR, 'SEO.md'), seoReport);

  // Write .cursorrules as separate file
  if (cursorRulesFile) {
    const cursorRulesContent = safeRead(cursorRulesFile.full);
    if (cursorRulesContent) {
      // Parse and pretty-print the JSON for better readability
      try {
        const parsed = JSON.parse(cursorRulesContent);
        const formatted = JSON.stringify(parsed, null, 2);
        writeText(path.join(OUT_DIR, 'CURSORRULES.md'), 
          `# Cursor Rules (Auto-Generated)\n\nGenerated: ${new Date().toISOString()}\n\nSource: \`.cursorrules\`\n\n## Project Purpose\n\n${parsed.purpose || 'N/A'}\n\n## Priorities\n\n${(parsed.priorities || []).map(p => `- ${p}`).join('\n')}\n\n## Full Configuration\n\n\`\`\`json\n${formatted}\n\`\`\`\n`
        );
        console.log('✓ Extracted .cursorrules to CURSORRULES.md');
      } catch {
        // Fallback if JSON parsing fails
        writeText(path.join(OUT_DIR, 'CURSORRULES.md'), 
          `# Cursor Rules (Auto-Generated)\n\nGenerated: ${new Date().toISOString()}\n\nSource: \`.cursorrules\`\n\n\`\`\`\n${cursorRulesContent}\n\`\`\`\n`
        );
        console.log('✓ Extracted .cursorrules to CURSORRULES.md (raw format)');
      }
    }
  }

  // Capture and write database overview
  console.log('⏳ Capturing database overview (this may take a moment)...');
  const dbOverview = captureDatabaseOverview(PROJECT_ROOT);
  writeText(path.join(OUT_DIR, 'DATABASE.md'), dbOverview);
  console.log('✓ Generated DATABASE.md');

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

  // 6) Copy PROJECT_OVERVIEW.md from docs/ to output directory
  const overviewSource = path.join(PROJECT_ROOT, 'docs', 'PROJECT_OVERVIEW.md');
  const overviewDest = path.join(OUT_DIR, 'PROJECT_OVERVIEW.md');
  const finalFiles = [...written, 'SEO.md', 'DATABASE.md'];
  
  // Add CURSORRULES.md if it was written
  if (cursorRulesFile) {
    finalFiles.push('CURSORRULES.md');
  }
  
  if (fs.existsSync(overviewSource)) {
    fs.copyFileSync(overviewSource, overviewDest);
    finalFiles.push('PROJECT_OVERVIEW.md');
    console.log('✓ Copied PROJECT_OVERVIEW.md to output directory');
  } else {
    console.log('⚠ PROJECT_OVERVIEW.md not found in /docs/ - skipping');
  }

  console.log('\n✅ Done!');
  console.log('Output files:', finalFiles);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
