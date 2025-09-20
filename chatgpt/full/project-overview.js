/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ---------- Colors ----------
const C = {
  reset: '\x1b[0m', green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', blue: '\x1b[34m', cyan: '\x1b[36m'
};
const ok = s => C.green + s + C.reset;
const err = s => C.red + s + C.reset;
const info = s => C.cyan + s + C.reset;
const head = s => C.blue + s + C.reset;

// ---------- Config / Flags ----------
const DEBUG = process.env.PROJ_OVERVIEW_DEBUG === '1';

// ---------- Constants ----------
const MAX_FILE_SIZE = 500 * 1024; // 500 KB
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'chatgpt');

// ---------- NEW: output subfolders & limits ----------
const FULL_DIR = path.join(OUT_DIR, 'full');
const SEO_DIR  = path.join(OUT_DIR, 'seo');
const MAX_OUT_FILES_PER_DIR = 10;

function ensureDirs() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  if (!fs.existsSync(FULL_DIR)) fs.mkdirSync(FULL_DIR, { recursive: true });
  if (!fs.existsSync(SEO_DIR))  fs.mkdirSync(SEO_DIR,  { recursive: true });
}

function writeTextTo(dir, file, content, counter) {
  if (counter.count >= MAX_OUT_FILES_PER_DIR) {
    console.log(err(`SKIP (cap ${MAX_OUT_FILES_PER_DIR}): ${file}`));
    return;
  }
  const target = path.join(dir, file);
  fs.writeFileSync(target, content);
  counter.count++;
  console.log(ok(`PASS: ${path.relative(ROOT, target)} (${(content.length/1024).toFixed(1)}KB)`));
}

const IGNORE_DIRS = new Set([
  'node_modules','dist','build','.next','.nuxt','out','.cache','.parcel-cache','coverage',
  '.git','.github','.vscode','.idea','.vite','assets','images','videos','media','uploads'
]);

// Allowed text extensions (whitelist-first)
const ALLOWED = new Set([
  '.js','.jsx','.ts','.tsx','.json','.md','.txt','.css','.scss','.sass','.html','.xml',
  '.sql','.sh','.bat','.ps1','.yml','.yaml','.toml','.ini','.cfg','.conf'
]);

// Explicit extension blacklist (defensive)
const IGNORE_EXT = new Set([
  '.map','.bundle','.egg-info','.pyc','.key','.pem','.crt','.log','.lcov',
  '.exe','.dll','.so','.dylib','.zip','.tar','.gz','.7z','.rar','.bz2',
  '.png','.jpg','.jpeg','.gif','.svg','.ico','.webp','.bmp','.tiff','.tif',
  '.heic','.heif','.avif','.jxl','.jp2','.j2k','.mp4','.avi','.mov','.wmv',
  '.flv','.mkv','.webm','.m4v','.3gp','.ogv','.mts','.m2ts','.ts','.vob',
  '.asf','.rm','.rmvb','.divx','.xvid','.mp3','.wav','.flac','.aac','.ogg',
  '.wma','.m4a','.opus','.amr','.pdf','.doc','.docx','.xls','.xlsx','.ppt','.pptx',
  '.woff','.woff2','.ttf','.eot','.otf','.fnt','.bin','.dat','.db','.sqlite','.sqlite3',
  '.lock','.min.js','.min.css'
]);

// Filename patterns to ignore (only explicit names/globs)
const IGNORE_FILES = [
  '.env','.env.local','secrets.json','.DS_Store','Thumbs.db','.gitignore','.gitattributes',
  'package-lock.json','yarn.lock','pnpm-lock.yaml',
  'CODEBASE_OVERVIEW.json','CODEBASE_OVERVIEW.md'
];

// ---------- Small utils ----------
const npath = p => p.split(path.sep).join('/');
const rel = p => npath(path.relative(ROOT, p));
const hasStar = s => s.includes('*');

function globToRegex(glob) {
  // escape regex, then turn * into .*
  return new RegExp('^' + glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
}

const matchName = (name, list) =>
  list.some(p => hasStar(p) ? globToRegex(p).test(name) : name === p);

// whitelist-first file filter (no heuristic substrings)
function isIgnoredFile(full, name) {
  const ext = path.extname(name).toLowerCase();

  if (IGNORE_EXT.has(ext)) {
    if (DEBUG) console.log('[skip ext-blacklist]', rel(full));
    return true;
  }
  if (!ALLOWED.has(ext)) {
    if (DEBUG) console.log('[skip not-allowed-ext]', rel(full), 'ext=', ext || '(none)');
    return true;
  }
  if (matchName(name, IGNORE_FILES)) {
    if (DEBUG) console.log('[skip name-pattern]', rel(full), 'pattern match');
    return true;
  }
  // Directory skipping is handled in the walker; don’t repeat here.
  return false;
}

const readText = (p) => {
  try {
    const st = fs.statSync(p);
    if (st.size > MAX_FILE_SIZE) return `[File too large: ${(st.size/1024/1024).toFixed(2)}MB - Skipped]`;
    const buf = fs.readFileSync(p);
    if (buf.includes(0)) return '[Binary file detected - Skipped]';
    return buf.toString('utf8');
  } catch (e) {
    return `[Error reading file: ${e.message}]`;
  }
};

const trim = (content, maxLines = 100) => {
  const lines = content.split('\n');
  if (lines.length <= maxLines) return content;
  return [
    ...lines.slice(0, 50),
    `\n// ... (truncated ${lines.length - 100} lines) ...\n`,
    ...lines.slice(-50)
  ].join('\n');
};

const extractExported = (content) => {
  const out = [];
  (content.match(/export\s+(?:function|const|let|var)\s+(\w+)/g) || []).forEach(s => {
    const m = s.match(/export\s+(?:function|const|let|var)\s+(\w+)/);
    if (m) out.push(`function: ${m[1]}`);
  });
  (content.match(/export\s+(?:default\s+)?(?:function|const)\s+(\w+)/g) || []).forEach(s => {
    const m = s.match(/export\s+(?:default\s+)?(?:function|const)\s+(\w+)/);
    if (m && /^[A-Z]/.test(m[1])) out.push(`component: ${m[1]}`);
  });
  (content.match(/module\.exports\s*=\s*\{([^}]+)\}/g) || []).forEach(s => {
    const m = s.match(/\{([^}]+)\}/);
    if (m) m[1].split(',').map(x => x.trim().split(':')[0].trim()).forEach(exp => exp && out.push(`export: ${exp}`));
  });
  return out.slice(0, 10);
};

// ---------- Walker (single pass, debug-friendly) ----------
function walk(start, baseLabel = '') {
  const files = [];
  const todo = [start];

  while (todo.length) {
    const dir = todo.pop();
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) {
      if (DEBUG) console.log('[error readdir]', rel(dir), e.message);
      continue;
    }

    for (const ent of entries) {
      if (ent.name.startsWith('.')) continue;
      const full = path.join(dir, ent.name);
      if (ent.isSymbolicLink()) continue;

      if (ent.isDirectory()) {
        if (IGNORE_DIRS.has(ent.name)) {
          if (DEBUG) console.log('[skip dir]', npath(path.join(rel(dir), ent.name)));
          continue;
        }
        todo.push(full);
      } else {
        if (isIgnoredFile(full, ent.name)) continue;
        files.push({
          path: baseLabel ? npath(path.join(baseLabel, ent.name)) : rel(full),
          fullPath: full,
          content: readText(full)
        });
      }
    }
  }
  return files;
}

// ---------- Categorization ----------
function categorizeFrontend(files) {
  const cat = { pages:[],components:[],hooks:[],contexts:[],utils:[],config:[],types:[],data:[],styles:[],other:[] };
  for (const f of files) {
    const p = f.path.toLowerCase();
    const name = path.basename(f.path).toLowerCase();
    if (p.includes('/pages/') || p.includes('/page/')) cat.pages.push(f);
    else if (p.includes('/components/') || p.includes('/component/')) cat.components.push(f);
    else if (p.includes('/hooks/') || p.includes('/hook/') || name.startsWith('use')) cat.hooks.push(f);
    else if (p.includes('/contexts/') || p.includes('/context/') || name.includes('context')) cat.contexts.push(f);
    else if (p.includes('/utils/') || p.includes('/util/')) cat.utils.push(f);
    else if (p.includes('/config/') || p.includes('/configuration/')) cat.config.push(f);
    else if (p.includes('/types/') || p.includes('/type/') || name.endsWith('.d.ts')) cat.types.push(f);
    else if (p.includes('/data/') || p.includes('/mock/')) cat.data.push(f);
    else if (name.endsWith('.css') || name.endsWith('.scss') || name.endsWith('.sass')) cat.styles.push(f);
    else cat.other.push(f);
  }
  return cat;
}

function categorizeBackend(files) {
  const cat = { routes:[],middleware:[],utils:[],controllers:[],models:[],services:[],database:[],docs:[],tests:[],scripts:[],config:[],other:[] };
  for (const f of files) {
    const p = f.path.toLowerCase();
    theName = path.basename(f.path).toLowerCase();
    const name = theName; // avoid shadowing
    if (p.includes('/routes/') || p.includes('/route/')) cat.routes.push(f);
    else if (p.includes('/middleware/')) cat.middleware.push(f);
    else if (p.includes('/utils/') || p.includes('/util/')) cat.utils.push(f);
    else if (p.includes('/controllers/')) cat.controllers.push(f);
    else if (p.includes('/models/')) cat.models.push(f);
    else if (p.includes('/services/')) cat.services.push(f);
    else if (p.includes('/database/') || p.includes('/db/')) cat.database.push(f);
    else if (p.includes('/docs/') || p.includes('/documentation/')) cat.docs.push(f);
    else if (p.includes('/tests/') || p.includes('/test/') || name.startsWith('test')) cat.tests.push(f);
    else if (p.includes('/scripts/') || p.includes('/script/')) cat.scripts.push(f);
    else if (name.includes('config') || name.includes('env') || name.endsWith('.json')) cat.config.push(f);
    else cat.other.push(f);
  }
  return cat;
}

// ---------- Higher-level collectors ----------
function processDirectory(dir, label) {
  try {
    const files = walk(dir, label);
    const fileStructure = {};
    for (const f of files) fileStructure[path.basename(f.path)] = f.path;
    return { files, fileStructure, skippedCount: 0 };
  } catch {
    return { files: [], fileStructure: {}, skippedCount: 0 };
  }
}

function getFrontendAll() {
  const dirs = [
    { p: path.join(ROOT, 'frontend', 'src'), base: 'frontend/src' },
    { p: path.join(ROOT, 'frontend', 'app'), base: 'frontend/app' },
    { p: path.join(ROOT, 'frontend'), base: 'frontend' }
  ];
  const pub = path.join(ROOT, 'frontend', 'public');

  const all = [];
  for (const d of dirs) if (fs.existsSync(d.p)) all.push(...walk(d.p, d.base));
  if (fs.existsSync(pub)) all.push(...walk(pub, 'frontend/public'));

  const seen = new Set();
  return all.filter(f => { const k = npath(f.path); if (seen.has(k)) return false; seen.add(k); return true; });
}

// ---------- Detectors ----------
function detectDeploymentConfig() {
  const cfgs = [
    'vercel.json','vercel.yaml','render.yaml','render.yml','Dockerfile','docker-compose.yml','docker-compose.yaml',
    'netlify.toml','netlify.json','railway.json','railway.yaml','fly.toml','fly.yaml','heroku.yml','app.json',
    'now.json','now.yaml','serverless.yml','serverless.yaml','package.json'
  ];
  const info = { platforms:[],configFiles:[],buildSettings:{},environmentVars:[],hosting:'unknown' };

  for (const f of cfgs) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) { info.configFiles.push(f); info.platforms.push(f.split('.')[0] || f); }
  }

  const tryPkg = (p, key) => {
    if (fs.existsSync(p)) {
      try {
        const json = JSON.parse(fs.readFileSync(p,'utf8'));
        if (json.scripts) info.buildSettings[key] = json.scripts;
      } catch {}
    }
  };
  tryPkg(path.join(ROOT, 'frontend', 'package.json'), 'frontend');
  tryPkg(path.join(ROOT, 'backend', 'package.json'), 'backend');

  if (info.platforms.includes('vercel')) info.hosting = 'Vercel';
  else if (info.platforms.includes('render')) info.hosting = 'Render';
  else if (info.platforms.includes('netlify')) info.hosting = 'Netlify';
  else if (info.platforms.includes('railway')) info.hosting = 'Railway';
  else if (info.platforms.includes('fly')) info.hosting = 'Fly.io';
  else if (info.platforms.includes('heroku')) info.hosting = 'Heroku';
  else if (info.configFiles.includes('Dockerfile')) info.hosting = 'Docker-based';

  return info;
}

function detectDevelopmentGoals() {
  const goals = { features:[], priorities:[], recentChanges:[], todoItems:[], issues:[] };
  const scanRoots = [ path.join(ROOT, 'frontend'), path.join(ROOT, 'backend') ];
  const isCode = p => /\.(ts|tsx|js|jsx)$/.test(p.toLowerCase());

  const dive = (dir) => {
    let ents = [];
    try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      if (e.name.startsWith('.')) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!IGNORE_DIRS.has(e.name)) dive(full);
      } else if (isCode(full)) {
        try {
          const content = fs.readFileSync(full, 'utf8');
          (content.match(/\/\/\s*TODO[:\s]*(.+)/gi) || []).forEach(m =>
            goals.todoItems.push({ file: rel(full), todo: m.replace(/\/\/\s*TODO[:\s]*/i,'').trim() })
          );
          (content.match(/\/\/\s*FIXME[:\s]*(.+)/gi) || []).forEach(m =>
            goals.issues.push({ file: rel(full), issue: m.replace(/\/\/\s*FIXME[:\s]*/i,'').trim() })
          );
          (content.match(/\/\/\s*HACK[:\s]*(.+)/gi) || []).forEach(m =>
            goals.issues.push({ file: rel(full), issue: 'HACK: ' + m.replace(/\/\/\s*HACK[:\s]*/i,'').trim() })
          );
        } catch {}
      }
    }
  };
  scanRoots.forEach(p => fs.existsSync(p) && dive(p));

  try {
    const { execSync } = require('child_process');
    const recent = execSync('git log --oneline -10', { cwd: ROOT, encoding: 'utf8' });
    goals.recentChanges = recent.split('\n').filter(Boolean).map(s => s.trim());
  } catch {
    goals.recentChanges = ['Git history not available'];
  }
  return goals;
}

// ---------- Generators ----------
function generateBackendTxt() {
  const { files } = processDirectory(path.join(ROOT, 'backend'), 'backend');
  const cat = categorizeBackend(files);
  let out = 'BACKEND FILES CONTENT\n' + '='.repeat(50) + '\n\n';

  out += 'BACKEND STRUCTURE OVERVIEW\n' + '-'.repeat(40) + '\n';
  Object.entries(cat).forEach(([k,v]) => { out += `${k[0].toUpperCase()+k.slice(1)}: ${v.length} files\n`; });
  out += '\n';

  const order = ['routes','middleware','utils','controllers','models','services','database','docs','tests','scripts','config','other'];
  for (const key of order) {
    if (!cat[key].length) continue;
    out += `${key.toUpperCase()} (${cat[key].length} files)\n` + '='.repeat(60) + '\n\n';
    cat[key].forEach(f => {
      out += `FILE: ${f.path}\n` + '-'.repeat(30) + '\n' + f.content + '\n\n' + '='.repeat(50) + '\n\n';
    });
  }
  return out;
}

function generateFrontendTxt() {
  const all = getFrontendAll();
  const cat = categorizeFrontend(all);
  let out = 'FRONTEND FILES CONTENT\n' + '='.repeat(50) + '\n\n';

  out += 'FRONTEND STRUCTURE OVERVIEW\n' + '-'.repeat(40) + '\n';
  Object.entries(cat).forEach(([k,v]) => { out += `${k[0].toUpperCase()+k.slice(1)}: ${v.length} files\n`; });
  out += '\n';

  const order = ['pages','components','hooks','contexts','utils','config','types','data','styles','other'];
  for (const key of order) {
    if (!cat[key].length) continue;
    out += `${key.toUpperCase()} (${cat[key].length} files)\n` + '='.repeat(60) + '\n\n';
    cat[key].forEach(f => {
      out += `FILE: ${f.path}\n` + '-'.repeat(30) + '\n' + f.content + '\n\n' + '='.repeat(50) + '\n\n';
    });
  }
  return out;
}

function generateCoreAppFilesTxt() {
  const want = [
    // frontend
    'frontend/src/main.tsx','frontend/src/App.tsx','frontend/index.html',
    'frontend/vite.config.ts','frontend/tailwind.config.js','frontend/postcss.config.js','frontend/package.json',
    // backend
    'backend/server.js','backend/package.json','backend/database/pool.js','backend/database/connection.js'
  ];
  let out = 'CORE APPLICATION FILES\n' + '='.repeat(50) + '\n\n';

  for (const f of want) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) {
      out += `FILE: ${f}\n` + '-'.repeat(40) + '\n' + readText(p) + '\n\n' + '='.repeat(50) + '\n\n';
    }
  }
  return out;
}

function generateBuildAssetsTxt() {
  const want = [
    'frontend/scripts/convert-images.js','frontend/public/manifest.webmanifest','frontend/public/sw.js',
    'frontend/vite.config.ts','frontend/tailwind.config.js','frontend/postcss.config.js',
    'backend/package.json','package.json'
  ];
  let out = 'BUILD & ASSET CONFIGURATION\n' + '='.repeat(50) + '\n\n';
  for (const f of want) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) {
      out += `FILE: ${f}\n` + '-'.repeat(40) + '\n' + readText(p) + '\n\n' + '='.repeat(50) + '\n\n';
    }
  }
  return out;
}

function generateDeploymentConfigTxt() {
  const d = detectDeploymentConfig();
  let out = 'DEPLOYMENT CONFIGURATION\n' + '='.repeat(50) + '\n\n';
  out += 'HOSTING PLATFORM\n' + '-'.repeat(20) + '\n';
  out += `Platform: ${d.hosting}\n`;
  out += `Config Files: ${d.configFiles.length ? d.configFiles.join(', ') : 'None detected'}\n`;
  out += `Platforms Detected: ${d.platforms.length ? d.platforms.join(', ') : 'None detected'}\n\n`;

  if (Object.keys(d.buildSettings).length) {
    out += 'BUILD SETTINGS\n' + '-'.repeat(20) + '\n';
    for (const [scope, scripts] of Object.entries(d.buildSettings)) {
      out += scope.toUpperCase() + ':\n';
      for (const [name,cmd] of Object.entries(scripts)) out += `  ${name}: ${cmd}\n`;
      out += '\n';
    }
  }

  const cfgs = [
    'vercel.json','vercel.yaml','render.yaml','render.yml','Dockerfile','docker-compose.yml','docker-compose.yaml',
    'netlify.toml','netlify.json','railway.json','railway.yaml','fly.toml','fly.yaml','heroku.yml','app.json',
    'now.json','now.yaml','serverless.yml','serverless.yaml'
  ];
  let found = false;
  for (const f of cfgs) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) {
      found = true;
      out += `DEPLOYMENT CONFIG: ${f}\n` + '-'.repeat(30) + '\n' + readText(p) + '\n\n' + '='.repeat(50) + '\n\n';
    }
  }
  if (!found) {
    out += 'No deployment configuration files found.\n';
    out += 'Checked for: vercel.json, render.yaml, Dockerfile, netlify.toml, etc.\n\n';
  }
  return out;
}

function generateSourceDumpTxt() {
  let out = 'COMPREHENSIVE SOURCE CODE DUMP\n' + '='.repeat(60) + '\n\n';

  // Frontend
  const fAll = getFrontendAll();
  const fCat = categorizeFrontend(fAll);
  out += 'FRONTEND SOURCE CODE\n' + '='.repeat(40) + '\n\n';
  const fGroups = [['PAGES', fCat.pages], ['COMPONENTS', fCat.components], ['HOOKS', fCat.hooks], ['CONTEXTS', fCat.contexts], ['UTILS', fCat.utils]];
  for (const [label, arr] of fGroups) {
    if (!arr.length) continue;
    out += label + '\n' + '-'.repeat(20) + '\n\n';
    arr.forEach(file => {
      out += '******\n' + path.basename(file.path) + '\n' + file.path + '\n' + '******\n\n';
      const ex = extractExported(file.content);
      if (ex.length) out += '// Exports: ' + ex.join(', ') + '\n\n';
      out += trim(file.content) + '\n\n';
    });
  }

  // Backend
  const bAll = walk(path.join(ROOT, 'backend'), 'backend');
  const bCat = categorizeBackend(bAll);
  out += '\n\nBACKEND SOURCE CODE\n' + '='.repeat(40) + '\n\n';
  const bGroups = [['ROUTES', bCat.routes], ['MIDDLEWARE', bCat.middleware], ['UTILS', bCat.utils], ['SERVICES', bCat.services]];
  for (const [label, arr] of bGroups) {
    if (!arr.length) continue;
    out += label + '\n' + '-'.repeat(20) + '\n\n';
    arr.forEach(file => {
      out += '******\n' + path.basename(file.path) + '\n' + file.path + '\n' + '******\n\n';
      const ex = extractExported(file.content);
      if (ex.length) out += '// Exports: ' + ex.join(', ') + '\n\n';
      out += trim(file.content) + '\n\n';
    });
  }

  // Deployment
  out += '\n\nDEPLOYMENT CONFIGURATIONS\n' + '='.repeat(40) + '\n\n';
  out += generateDeploymentConfigTxt().split('\n').slice(4).join('\n'); // reuse section content
  return out;
}

function generateEnvExampleTxt() {
  return [
    '# Environment Variables Example',
    '# Copy to .env and fill values',
    '',
    '# Database',
    'DB_HOST=localhost',
    'DB_PORT=5432',
    'DB_NAME=mdh',
    'DB_USER=postgres',
    'DB_PASSWORD=your_password_here',
    'DATABASE_URL=postgresql://username:password@localhost:5432/database_name',
    '',
    '# JWT',
    'JWT_SECRET=your_jwt_secret_here',
    'JWT_REFRESH_SECRET=your_refresh_secret_here',
    'JWT_EXPIRES_IN=1h',
    'JWT_REFRESH_EXPIRES_IN=7d',
    '',
    '# Server',
    'PORT=3001',
    'NODE_ENV=development',
    '',
    '# CORS',
    'ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173',
    '',
    '# Admin',
    'ADMIN_EMAILS=admin@example.com,admin2@example.com',
    '',
    '# Uploads',
    'UPLOAD_MAX_SIZE=5242880',
    'UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif',
    '',
    '# Rate limiting',
    'RATE_LIMIT_WINDOW_MS=900000',
    'RATE_LIMIT_MAX_REQUESTS=100',
    '',
    '# Logging',
    'LOG_LEVEL=info',
    'LOG_FILE=logs/app.log',
    ''
  ].join('\n');
}

function generateAPIContractTxt() {
  return [
    '# API Contract',
    '',
    '## Authentication',
    '### POST /api/auth/register',
    'Body: { name, email, password, phone } → { user, token }',
    '### POST /api/auth/login',
    'Body: { email, password } → { user, token, refreshToken }',
    '### GET /api/auth/me',
    'Header: Authorization: Bearer <token> → { user }',
    '',
    '## Affiliates',
    '### GET /api/affiliates/slugs → { slugs: string[] }',
    '### GET /api/affiliates/lookup?zip=12345&state=CA → { affiliates: Affiliate[] }',
    '### GET /api/affiliates/:slug → { affiliate: Affiliate }',
    '',
    '## Services',
    '### GET /api/services → { services: Service[] }',
    '### GET /api/services/:id → { service: Service }',
    '',
    '## Reviews',
    '### GET /api/reviews → { reviews: Review[] }',
    '### POST /api/reviews (auth) Body: { rating, comment, affiliateId } → { review: Review }',
    '',
    '## Health',
    '### GET /api/health → { status: "ok", database: "connected" }',
    '',
    '## Admin',
    '### GET /admin (admin) → { dashboard: AdminDashboard }',
    '### POST /admin/query (admin) Body: { query: string } → { results: any[] }',
    ''
  ].join('\n');
}

function generateOverviewJson() {
  const overview = {
    timestamp: new Date().toISOString(),
    project: {
      name: 'mobiledetailhub',
      version: '1.0.0',
      description: 'Mobile Detail Hub - Multi-business detailing services platform'
    },
    structure: {
      root: processDirectory(ROOT, ''),
      frontend: processDirectory(path.join(ROOT, 'frontend'), 'frontend'),
      backend: processDirectory(path.join(ROOT, 'backend'), 'backend')
    },
    summary: { totalFiles: 0, totalDirectories: 0, frontendFiles: 0, backendFiles: 0, rootFiles: 0 },
    development: {
      goals: detectDevelopmentGoals(),
      deployment: detectDeploymentConfig()
    }
  };

  overview.summary.frontendFiles = overview.structure.frontend.files.length;
  overview.summary.backendFiles  = overview.structure.backend.files.length;
  overview.summary.rootFiles     = overview.structure.root.files.length;
  overview.summary.totalFiles    = overview.summary.frontendFiles + overview.summary.backendFiles + overview.summary.rootFiles;

  const countDirs = (struct) => {
    let count = 0;
    for (const k in struct.fileStructure) if (struct.fileStructure[k].includes('/')) count++;
    return count;
  };
  overview.summary.totalDirectories =
    countDirs(overview.structure.root) + countDirs(overview.structure.frontend) + countDirs(overview.structure.backend);

  return overview;
}

function generateFileStructureJson(overview) {
  const all = overview.structure.frontend.files.concat(overview.structure.backend.files);
  const map = {};
  for (const f of all) {
    const p = npath(f.path);
    const parts = p.split('/');
    for (let i=0;i<parts.length-1;i++) {
      const dir = parts.slice(0, i+1).join('/');
      const child = parts.slice(0, i+2).join('/');
      if (!map[dir]) map[dir] = [];
      if (i+1 < parts.length-1) { if (!map[dir].includes(child + '/')) map[dir].push(child + '/'); }
      else { if (!map[dir].includes(p)) map[dir].push(p); }
    }
  }
  return {
    frontend: overview.structure.frontend.fileStructure,
    backend:  overview.structure.backend.fileStructure,
    root:     overview.structure.root.fileStructure,
    directories: map,
    timestamp: new Date().toISOString()
  };
}

function generateChecksumsJson(overview) {
  const all = overview.structure.frontend.files.concat(overview.structure.backend.files);
  const timestamp = new Date().toISOString();
  const out = {};
  for (const f of all) {
    const sha1 = crypto.createHash('sha1').update(f.content).digest('hex');
    out[f.path] = { sha1, size: f.content.length, timestamp };
  }
  return out;
}

// ---------- CLI ----------
function parseArgs() {
  const args = process.argv.slice(2);
  const cfg = { profile: 'full' }; // reserved for future, currently always writes both bundles
  for (const a of args) if (a.startsWith('--profile=')) cfg.profile = a.split('=')[1];
  return cfg;
}

// ---------- SEO extractors (top-level) ----------
function extractHeadMeta(indexHtml) {
  const lines = indexHtml.split('\n');
  const start = lines.findIndex(l => /<head/i.test(l));
  const end   = lines.findIndex((l, i) => i > start && /<\/head/i.test(l));
  const head  = (start >= 0 && end > start)
    ? lines.slice(start, end + 1).join('\n')
    : indexHtml;

  // collect ids from meta/link/title tags
  const metaIds   = [...head.matchAll(/<meta[^>]+id="([^"]+)"/gi)].map(m => m[1]);
  const linkIds   = [...head.matchAll(/<link[^>]+id="([^"]+)"/gi)].map(m => m[1]);
  const titleIds  = [...head.matchAll(/<title[^>]+id="([^"]+)"/gi)].map(m => m[1]);

  return { head, ids: [...metaIds, ...linkIds, ...titleIds] };
}


function listMetaPlaceholders(ids) {
  const wanted = {
    'meta-title': ['meta-title', 'meta-title-tag'],
    'meta-desc': ['meta-desc'],
    'meta-keywords': ['meta-keywords'],
    'og-title': ['og-title'],
    'og-desc': ['og-desc'],
    'og-image': ['og-image'],
    'tw-title': ['tw-title'],
    'tw-desc': ['tw-desc'],
    'tw-image': ['tw-image'],
    'canonical-link': ['canonical-link']
  };

  const have = new Set(ids || []);
  const rows = Object.entries(wanted)
    .map(([label, options]) => {
      const found = options.some(opt => have.has(opt));
      return `- ${label}: ${found ? 'FOUND' : 'MISSING'}`;
    })
    .join('\n');

  return `META/OG/TWITTER PLACEHOLDERS\n${'='.repeat(40)}\n\n${rows}\n`;
}


function findFAQComponents(files){
  const hits = files.filter(f => /faq/i.test(f.path) || /faq/i.test(f.content));
  let out = 'FAQ-RELATED FILES\n' + '='.repeat(40) + '\n\n';
  if (!hits.length) return out + 'No FAQ files detected.\n';
  hits.slice(0, 8).forEach(f=>{
    out += `FILE: ${f.path}\n` + '-'.repeat(30) + '\n' + trim(f.content, 80) + '\n\n';
  });
  return out;
}

function detectRoutesOverview(files){
  const routerFiles = files.filter(f => /router|routes|app\.tsx|main\.tsx/i.test(f.path));
  let out = 'ROUTING OVERVIEW\n' + '='.repeat(40) + '\n\n';
  if (!routerFiles.length) return out + 'No router files detected.\n';
  routerFiles.slice(0,3).forEach(f=>{
    out += `FILE: ${f.path}\n` + '-'.repeat(30) + '\n' + trim(f.content, 120) + '\n\n';
  });
  return out;
}

// ---------- replace your collectAreaURLs() with this ----------
function collectAreaURLs() {
  const out = [];
  const base = path.join(ROOT, 'frontend', 'src', 'data', 'areas');
  if (!fs.existsSync(base)) return out;

  // simple DFS to recurse subfolders (e.g., /areas/az/*.json, /areas/nv/*.json)
  const stack = [base];
  while (stack.length) {
    const dir = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const e of entries) {
      if (e.isDirectory()) {
        stack.push(path.join(dir, e.name));
        continue;
      }
      if (!/\.json$/i.test(e.name)) continue;

      const full = path.join(dir, e.name);
      try {
        const json = JSON.parse(fs.readFileSync(full, 'utf8'));
        let url = json.urlPath || deriveUrlFromJson(json);
        url = normalizeUrl(url);

        const relFile = path
          .relative(base, full)
          .split(path.sep)
          .join('/');

        out.push({ file: relFile, url });
      } catch {
        // ignore bad/malformed JSON
      }
    }
  }

  // de-dupe by url and sort for stable output
  const seen = new Set();
  const deduped = out.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  return deduped.sort((a, b) => a.url.localeCompare(b.url));

  // ---- helpers ----
  function deriveUrlFromJson(j) {
    // Prefer explicit stateCode + city
    let state = (j.stateCode || '').toLowerCase();
    let city = (j.city || '').toLowerCase();

    if (!state || !city) {
      // Fallback: try to parse from slug like "az-bullhead-city"
      const slug = (j.slug || '').toLowerCase();
      if (slug) {
        const parts = slug.split('-');
        if (parts.length >= 2) {
          state = state || parts[0];
          city = city || parts.slice(1).join('-');
        }
      }
    }

    // Final fallback guard
    if (!state || !city) return '/';

    // Your project uses /{state}/{city}/ style (adjust if needed)
    return `/${state}/${city}/`;
  }

  function normalizeUrl(u) {
    if (!u) return '/';
    // ensure leading slash
    if (!u.startsWith('http') && !u.startsWith('/')) u = '/' + u;
    // ensure trailing slash (for consistency in sitemap)
    if (!u.endsWith('/')) u += '/';
    return u;
  }
}


function generateSitemapSample(urls){
  const base = 'https://www.mobiledetailhub.com';
  const list = urls.map(u=>`  <url>\n    <loc>${base}${u.url}</loc>\n  </url>`).join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url>\n    <loc>${base}/</loc>\n  </url>`,
    list,
    '</urlset>'
  ].flat().join('\n');
}

function generateRobotsSample(){
  const base = 'https://www.mobiledetailhub.com/sitemap.xml';
  return `User-agent: *\nAllow: /\nSitemap: ${base}\n`;
}

// ---------- Main ----------
async function main() {
  const cfg = parseArgs();
  console.log(head('Starting project overview generation...'));
  console.log(`Profile: ${cfg.profile}\n`);

  ensureDirs();

  // Build the master overview (used by both profiles)
  const overview = generateOverviewJson();

  // ========== FULL PROFILE (10 files) ==========
  const fullCount = { count: 0 };
  writeTextTo(FULL_DIR, 'backend.txt',            generateBackendTxt(), fullCount);
  writeTextTo(FULL_DIR, 'frontend.txt',           generateFrontendTxt(), fullCount);

  const devContext = (() => {
    const fCat = categorizeFrontend(overview.structure.frontend.files);
    const bCat = categorizeBackend(overview.structure.backend.files);
    let md = `# Mobile Detail Hub - Development Context\n\nGenerated: ${new Date().toISOString()}\n\n`;
    md += '## Project Overview\n\n';
    md += `- **Name**: ${overview.project.name}\n- **Version**: ${overview.project.version}\n- **Description**: ${overview.project.description}\n\n`;
    md += '## File Structure Summary\n\n';
    md += `- **Total Files**: ${overview.summary.totalFiles}\n- **Frontend Files**: ${overview.summary.frontendFiles}\n- **Backend Files**: ${overview.summary.backendFiles}\n- **Root Files**: ${overview.summary.rootFiles}\n- **Total Directories**: ${overview.summary.totalDirectories}\n\n`;
    md += '## Frontend Structure\n\n';
    md += `- **Pages**: ${fCat.pages.length}\n- **Components**: ${fCat.components.length}\n- **Hooks**: ${fCat.hooks.length}\n- **Contexts**: ${fCat.contexts.length}\n- **Utils**: ${fCat.utils.length}\n- **Config**: ${fCat.config.length}\n- **Types**: ${fCat.types.length}\n- **Data**: ${fCat.data.length}\n- **Styles**: ${fCat.styles.length}\n\n`;
    md += '## Backend Structure\n\n';
    md += `- **Routes**: ${bCat.routes.length}\n- **Middleware**: ${bCat.middleware.length}\n- **Utils**: ${bCat.utils.length}\n- **Controllers**: ${bCat.controllers.length}\n- **Models**: ${bCat.models.length}\n- **Services**: ${bCat.services.length}\n- **Database**: ${bCat.database.length}\n- **Documentation**: ${bCat.docs.length}\n- **Tests**: ${bCat.tests.length}\n- **Scripts**: ${bCat.scripts.length}\n\n`;
    md += '## Deployment & Infrastructure\n\n';
    const d = overview.development.deployment;
    md += `- **Hosting Platform**: ${d.hosting}\n- **Config Files**: ${d.configFiles.join(', ') || 'None detected'}\n- **Platforms Detected**: ${d.platforms.join(', ') || 'None detected'}\n\n`;
    if (Object.keys(d.buildSettings).length) {
      md += '### Build Settings\n\n';
      for (const [scope, scripts] of Object.entries(d.buildSettings)) {
        md += `#### ${scope.toUpperCase()}\n`;
        for (const [n,cmd] of Object.entries(scripts)) md += `- **${n}**: \`${cmd}\`\n`;
        md += '\n';
      }
    }
    return md;
  })();

  writeTextTo(FULL_DIR, 'development_context.md', devContext, fullCount);
  writeTextTo(FULL_DIR, 'deployment_config.txt',  generateDeploymentConfigTxt(), fullCount);

  const coreApp = 'CORE APPLICATION FILES\n' + '='.repeat(50) + '\n\n' +
                  generateCoreAppFilesTxt()   + '\n\n' +
                  'ENVIRONMENT CONFIGURATION\n' + '='.repeat(50) + '\n\n' +
                  generateEnvExampleTxt()      + '\n\n' +
                  'API CONTRACT\n' + '='.repeat(50) + '\n\n' +
                  generateAPIContractTxt()     + '\n\n' +
                  'BUILD & ASSET CONFIGURATION\n' + '='.repeat(50) + '\n\n' +
                  generateBuildAssetsTxt();

  writeTextTo(FULL_DIR, 'core_app_and_config.txt', coreApp, fullCount);
  writeTextTo(FULL_DIR, 'source_code_dump.txt',    generateSourceDumpTxt(), fullCount);

  // JSON artifacts (3) → fills the classic 10
  const overviewJson = JSON.stringify(overview, null, 2);
  writeTextTo(FULL_DIR, 'codebase_overview.json', overviewJson, fullCount);

  const filestructureJson = JSON.stringify(generateFileStructureJson(overview), null, 2);
  writeTextTo(FULL_DIR, 'filestructure.json', filestructureJson, fullCount);

  const checksumsJson = JSON.stringify(generateChecksumsJson(overview), null, 2);
  writeTextTo(FULL_DIR, 'checksums.json', checksumsJson, fullCount);

  // Self copy (if cap not reached)
  try {
    const self = path.join(__dirname, 'project-overview.js');
    const to = path.join(FULL_DIR, 'project-overview.js');
    if (fullCount.count < MAX_OUT_FILES_PER_DIR) {
      fs.copyFileSync(self, to);
      fullCount.count++;
      console.log(ok(`PASS: ${path.relative(ROOT, to)}`));
    }
  } catch (e) {
    console.log(err(`SKIP: self copy failed (${e.message})`));
  }

  // ========== SEO PROFILE (≤10 files) ==========
  const seoCount = { count: 0 };

  // Gather things we’ll analyze
  const idxPath = path.join(ROOT, 'frontend', 'index.html');
  const idxHtml = fs.existsSync(idxPath) ? readText(idxPath) : '<!-- index.html not found -->';
  const allFE   = getFrontendAll();

  // 1) Readme (explains bundle)
  const seoReadme =
`# SEO Bundle
Files here focus ONLY on SEO auditing:
- meta/OG/Twitter placeholders
- JSON-LD placeholders
- routing & areas → sitemap sample
- FAQ component snippets
- robots.txt + sitemap.xml samples

Total source files scanned:
- Frontend: ${overview.summary.frontendFiles}
- Backend:  ${overview.summary.backendFiles}
Generated: ${new Date().toISOString()}
`;
  writeTextTo(SEO_DIR, 'seo_readme.md', seoReadme, seoCount);

  // 2) index.html <head> extract
  const { head: headHtml, ids, links } = extractHeadMeta(idxHtml);
  writeTextTo(SEO_DIR, 'seo_index_head.html', headHtml, seoCount);

  // 3) meta placeholders checklist
  writeTextTo(SEO_DIR, 'seo_meta_placeholders.txt', listMetaPlaceholders(ids, links), seoCount);

  // 4) JSON-LD placeholders (raw extract from head)
  const jsonld = (headHtml.match(/<script[^>]*application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi) || []).join('\n\n');
  writeTextTo(SEO_DIR, 'seo_jsonld_placeholders.txt', jsonld || 'No JSON-LD <script> tags detected.\n', seoCount);

  // 5) Routing overview (router/app files)
  writeTextTo(SEO_DIR, 'seo_routing_overview.txt', detectRoutesOverview(allFE), seoCount);

  // 6) FAQ component snippets (used to verify FAQPage potential)
  writeTextTo(SEO_DIR, 'seo_faq_components.txt', findFAQComponents(allFE), seoCount);

  // 7) Area URLs → sitemap sample
  const areaUrls = collectAreaURLs();
  const areaList = areaUrls.length
    ? areaUrls.map(u => `- ${u.file} → ${u.url}`).join('\n')
    : 'No /frontend/src/data/areas/*.json detected.\n';
  writeTextTo(SEO_DIR, 'seo_area_urls.txt', 'AREA URLS\n' + '='.repeat(20) + '\n\n' + areaList + '\n', seoCount);

  // 8) sitemap.xml sample
  writeTextTo(SEO_DIR, 'sitemap.sample.xml', generateSitemapSample(areaUrls), seoCount);

  // 9) robots.txt sample
  writeTextTo(SEO_DIR, 'robots.sample.txt', generateRobotsSample(), seoCount);

  // 10) Deployment SEO notes (SSR/prerender cues)
  const deployNotes =
`DEPLOYMENT SEO NOTES
====================
- CSR SPA detected unless SSR/SSG configured in build.
- Prefer prerender or SSG so meta/JSON-LD render in initial HTML.
- Ensure sitemap.xml is hosted at /sitemap.xml and referenced in robots.txt.
- Canonical tags must update per route; verify via meta placeholders.

Host: ${overview.development.deployment.hosting}
Config files: ${overview.development.deployment.configFiles.join(', ') || 'None'}
`;
  writeTextTo(SEO_DIR, 'seo_deploy_notes.txt', deployNotes, seoCount);

  console.log(ok('\nPASS: All files generated in /chatgpt/full and /chatgpt/seo\n'));
}

// ---------- Runner ----------
if (require.main === module) {
  main().catch(e => { console.error(err('FAIL: ' + e.message)); process.exit(1); });
}

module.exports = {};
