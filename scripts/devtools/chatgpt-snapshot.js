#!/usr/bin/env node
/**
 * chatgpt-snapshot.js v3 — Smart Snapshot
 * --------------------------------------------------------------
 * 📦 Prepares a full codebase snapshot for ChatGPT analysis.
 * Creates ./docs/chatgpt with:
 *  - cursorrules (copied)
 *  - filetree.txt (filtered to relevant extensions)
 *  - codedump-*.txt (all text/code files, 500 MB per file)
 *  - checks.json + CHECKS_REPORT.md (auto PASS/FAIL)
 *  - KEYFILES.md (critical paths)
 *  - prompt.txt → instructions for ChatGPT
 * --------------------------------------------------------------
 */

import fs from "fs";
import path from "path";
import os from "os";

const root = process.cwd();
const docsDir = path.join(root, "docs", "chatgpt");
const cursorrules = path.join(root, ".cursorrules");
const MAX_FILE_SIZE_MB = 500;

//──────────────────────────────────────────────
// 🚫 Directories to ignore
//──────────────────────────────────────────────
const IGNORE_DIRS = [
  "node_modules",
  "dist",
  "build",
  ".git",
  ".cache",
  "logs",
  "coverage",
  "tmp",
  ".next",
  ".turbo",
  ".vercel"
];

//──────────────────────────────────────────────
// 📄 Allowed text/code extensions
//──────────────────────────────────────────────
const ALLOWED_EXTS = [
  ".js", ".ts", ".jsx", ".tsx",
  ".json", ".yml", ".yaml", ".env",
  ".html", ".css", ".scss",
  ".md", ".txt",
  ".mjs", ".cjs",
  ".config", ".lock",
  ".sql", ".sh", ".ps1", ".dockerignore", ".env.example"
];

//──────────────────────────────────────────────
// 📌 Always-include key files
//──────────────────────────────────────────────
const ALWAYS_INCLUDE = [
  "backend/middleware/requestLogger.js",
  "backend/config/logger.js",
  "backend/controllers/authController.js",
  "backend/services/authService.js",
  "backend/config/auth.js",
  "backend/config/env.async.js",
  "backend/controllers/domainController.js",
  "backend/services/domainService.js",
  "backend/controllers/tenantDashboardController.js",
  ".port-registry.json",
  "devtools/dev-hub.js",
  "docs/frontend/DEV_SETUP.md"
];

//──────────────────────────────────────────────
// 🧹 Reset ./docs/chatgpt
//──────────────────────────────────────────────
if (fs.existsSync(docsDir)) fs.rmSync(docsDir, { recursive: true, force: true });
fs.mkdirSync(docsDir, { recursive: true });
console.log("📁 Cleaned and created docs/chatgpt");

//──────────────────────────────────────────────
// 📄 Copy cursorrules
//──────────────────────────────────────────────
if (fs.existsSync(cursorrules)) {
  fs.copyFileSync(cursorrules, path.join(docsDir, "cursorrules"));
  console.log("✅ Copied cursorrules");
} else console.warn("⚠️ No .cursorrules found");

//──────────────────────────────────────────────
// 🌳 Build filtered filetree
//──────────────────────────────────────────────
function buildTree(dir, prefix = "") {
  if (!fs.existsSync(dir)) return "";
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const lines = [];
  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      lines.push(`${prefix}📁 ${entry.name}/`);
      lines.push(buildTree(full, prefix + "   "));
    } else if (ALLOWED_EXTS.includes(path.extname(entry.name))) {
      lines.push(`${prefix}📄 ${entry.name}`);
    }
  }
  return lines.join(os.EOL);
}

fs.writeFileSync(path.join(docsDir, "filetree.txt"), buildTree(root));
console.log("✅ Wrote filetree.txt");

//──────────────────────────────────────────────
// 🧮 Helpers
//──────────────────────────────────────────────
function isTextFile(filePath) {
  const ext = path.extname(filePath);
  if (!ALLOWED_EXTS.includes(ext)) return false;
  try {
    const fd = fs.openSync(filePath, "r");
    const buffer = Buffer.alloc(8000);
    const bytes = fs.readSync(fd, buffer, 0, 8000, 0);
    fs.closeSync(fd);
    for (let i = 0; i < bytes; i++) if (buffer[i] === 0) return false;
    return true;
  } catch { return false; }
}

function collectFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...collectFiles(full));
    else if (isTextFile(full)) results.push(full);
  }
  return results;
}

//──────────────────────────────────────────────
// 💾 Write dumps in 500 MB increments
//──────────────────────────────────────────────
function dumpAllFiles() {
  const files = collectFiles(root);
  if (!files.length) return console.log("⚠️ No files to dump.");
  let dumpIndex = 1, currentSizeMB = 0, buffer = "";
  const flush = () => {
    if (!buffer.trim()) return;
    const dest = path.join(docsDir, `codedump-${dumpIndex}.txt`);
    fs.writeFileSync(dest, buffer);
    console.log(`✅ Wrote ${path.basename(dest)} (${currentSizeMB.toFixed(1)} MB)`);
    dumpIndex++; buffer = ""; currentSizeMB = 0;
  };
  for (const f of files) {
    const content = fs.readFileSync(f, "utf8");
    const sizeMB = Buffer.byteLength(content) / (1024 * 1024);
    if (currentSizeMB + sizeMB > MAX_FILE_SIZE_MB * 0.95) flush();
    buffer += `\n\n/*──────────────── ${path.relative(root, f)} ────────────────*/\n\n${content}`;
    currentSizeMB += sizeMB;
  }
  flush();
}

dumpAllFiles();

//──────────────────────────────────────────────
// 🔍 Build file index for smart checks
//──────────────────────────────────────────────
function readFileIndex() {
  const files = collectFiles(root);
  const index = new Map();
  for (const f of files) {
    const rel = path.relative(root, f).replaceAll("\\", "/");
    try { index.set(rel, fs.readFileSync(f, "utf8")); } catch {}
  }
  for (const rel of ALWAYS_INCLUDE) {
    const abs = path.join(root, rel);
    if (fs.existsSync(abs) && !index.has(rel))
      index.set(rel, fs.readFileSync(abs, "utf8"));
  }
  return index;
}

function hasFile(i, p) { return i.has(p); }
function grep(i, p, re) { const s = i.get(p); return s ? re.test(s) : false; }
function grepAny(i, re) { for (const [_p, s] of i) if (re.test(s)) return true; return false; }

//──────────────────────────────────────────────
// ✅ Run smart repo checks
//──────────────────────────────────────────────
function runChecks(i) {
  const results = [];

  results.push({
    id: "dev_env_hosts_proxy",
    description: "Dev hub proxies by host; .port-registry.json present; hosts documented",
    pass: hasFile(i, ".port-registry.json") &&
      (hasFile(i, "devtools/dev-hub.js") || grepAny(i, /createProxyServer|http-proxy|vite\.proxy/)) &&
      (hasFile(i, "docs/frontend/DEV_SETUP.md") || grepAny(i, /admin\.localhost|tenant\.localhost/)),
    pointers: [".port-registry.json", "devtools/dev-hub.js", "docs/frontend/DEV_SETUP.md"]
  });

  results.push({
    id: "request_logger_correlation",
    description: "Request logger assigns correlation ID and logs via on-finished",
    pass: hasFile(i, "backend/middleware/requestLogger.js") &&
      grep(i, "backend/middleware/requestLogger.js", /on-?finished|require\(['"]on-finished['"]\)/i) &&
      grepAny(i, /correlationId|req\.id.*uuid|uuidv4/),
    pointers: ["backend/middleware/requestLogger.js"]
  });

  results.push({
    id: "auth_access_ttl",
    description: "Access token TTL ≤ 1h (ideally 15m)",
    pass: hasFile(i, "backend/config/auth.js") &&
      grep(i, "backend/config/auth.js", /ACCESS_EXPIRES_IN\s*:\s*['"](15m|10m|20m|30m|45m|1h)['"]/),
    pointers: ["backend/config/auth.js"],
    recommend: "Use 15m for ACCESS_EXPIRES_IN"
  });

  results.push({
    id: "auth_refresh_rotation",
    description: "Refresh flow invalidates old token and issues new one",
    pass: (hasFile(i, "backend/services/authService.js") &&
      (grep(i, "backend/services/authService.js", /rotate.*refresh|invalidate.*refresh|issue.*new.*refresh/i))) ||
      (hasFile(i, "backend/controllers/authController.js") &&
        grep(i, "backend/controllers/authController.js", /rotate.*refresh|invalidate.*refresh|issue.*new.*refresh/i)),
    pointers: ["backend/services/authService.js", "backend/controllers/authController.js"]
  });

  results.push({
    id: "auth_csrf_boundary",
    description: "Refresh endpoint has origin/CSRF/samesite guard",
    pass: grepAny(i, /(csrf|origin.*check|sameSite:\s*['"]strict['"]|sameSite:\s*['"]lax['"])/i)
      && grepAny(i, /\/refresh/i),
    pointers: ["backend/controllers/authController.js", "backend/config/auth.js"]
  });

  results.push({
    id: "env_fail_fast",
    description: "env.async.js throws in production if JWT secrets missing",
    pass: hasFile(i, "backend/config/env.async.js") &&
      grep(i, "backend/config/env.async.js", /(throw|process\.exit).*JWT/i) &&
      grep(i, "backend/config/env.async.js", /NODE_ENV.*production/i),
    pointers: ["backend/config/env.async.js"]
  });

  results.push({
    id: "domains_flow",
    description: "Domain availability/status endpoints present; verify TODO noted",
    pass: hasFile(i, "backend/controllers/domainController.js") &&
      grep(i, "backend/controllers/domainController.js", /available|availability|status/i),
    pointers: ["backend/controllers/domainController.js"]
  });

  results.push({
    id: "dashboard_filters_pagination",
    description: "getDateFilter + pagination + tenant guard",
    pass: hasFile(i, "backend/controllers/tenantDashboardController.js") &&
      grep(i, "backend/controllers/tenantDashboardController.js", /getDateFilter|case\s*['"]7d|hasMore/i) &&
      grepAny(i, /withTenant|NO_TENANT_CONTEXT/i),
    pointers: ["backend/controllers/tenantDashboardController.js", "backend/middleware/withTenant.js"]
  });

  return results;
}

//──────────────────────────────────────────────
// 📝 Emit checks artifacts
//──────────────────────────────────────────────
function writeChecksArtifacts(results) {
  fs.writeFileSync(path.join(docsDir, "checks.json"), JSON.stringify(results, null, 2));

  const ok = s => s ? "✅" : "❌";
  const report = [
    "# Repo Checks Report",
    "",
    ...results.map(r =>
      `- ${ok(r.pass)} **${r.id}** — ${r.description}\n  - Pointers: ${r.pointers.join(", ")}${r.recommend ? `\n  - Recommendation: ${r.recommend}` : ""}`)
  ].join("\n");

  fs.writeFileSync(path.join(docsDir, "CHECKS_REPORT.md"), report);

  const keyfiles = ALWAYS_INCLUDE
    .filter(p => fs.existsSync(path.join(root, p)))
    .map(p => `- ${p}`)
    .join("\n");
  fs.writeFileSync(path.join(docsDir, "KEYFILES.md"), `# Key Files\n\n${keyfiles}\n`);
  console.log("✅ Wrote CHECKS_REPORT.md, checks.json, KEYFILES.md");
}

// Run checks
const index = readFileIndex();
const results = runChecks(index);
writeChecksArtifacts(results);

//──────────────────────────────────────────────
// 💬 Write ChatGPT prompt
//──────────────────────────────────────────────
const prompt = `
# 🧭 ChatGPT Project Analysis Prompt

You are ChatGPT, analyzing the contents of this folder (**docs/chatgpt**).

## 📦 Context to Read
- **cursorrules** → architecture, business goals, conventions
- **filetree.txt** → filtered directory structure
- **codedump-*.txt** → full text/code source
- **CHECKS_REPORT.md** → PASS/FAIL snapshot of common pitfalls (trust this to skip non-issues)
- **checks.json** → machine-readable results
- **KEYFILES.md** → quick jump-list of critical files

---

### 🧩 OUTPUT: Top 5 Focus Analysis (Markdown)
Produce a **Markdown-formatted** report with the **five most impactful priorities** for development. For each:
1) **Title**
2) **Type** — 🐞 Bug/Code Smell, ⚙️ Refactor/Optimization, 🚀 Feature/Enhancement
3) **Problem** — short explanation
4) **Solution** — Cursor-ready steps (mention existing files from filetree)
5) Code/pseudocode where helpful

At the very end append:

💡 **Cursor Prompt:**  
Here are 5 high-impact improvements we should work on.  
Let’s tackle them **one at a time**, starting with #1.
`;

fs.writeFileSync(path.join(docsDir, "prompt.txt"), prompt.trim());
console.log("✅ Wrote ChatGPT prompt → prompt.txt");
console.log("\n🎯 Smart snapshot ready in ./docs/chatgpt\n");
