#!/usr/bin/env node
/**
 * chatgpt-snapshot.js v2
 * --------------------------------------------------------------
 * 📦 Prepares a full codebase snapshot for ChatGPT analysis.
 * Creates ./docs/chatgpt with:
 *  - cursorrules (copied)
 *  - filetree.txt (filtered to relevant extensions)
 *  - codedump-*.txt (all text/code files, 500 MB per file)
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
  ".config", ".lock"
];

//──────────────────────────────────────────────
// 🧹 Reset ./docs/chatgpt
//──────────────────────────────────────────────
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}
fs.mkdirSync(docsDir, { recursive: true });
console.log("📁 Cleaned and created docs/chatgpt");

//──────────────────────────────────────────────
// 📄 Copy cursorrules
//──────────────────────────────────────────────
if (fs.existsSync(cursorrules)) {
  fs.copyFileSync(cursorrules, path.join(docsDir, "cursorrules"));
  console.log("✅ Copied cursorrules");
} else {
  console.warn("⚠️ No .cursorrules found");
}

//──────────────────────────────────────────────
// 🌳 Build filtered filetree
//──────────────────────────────────────────────
function buildTree(dir, depth = 0, prefix = "") {
  if (!fs.existsSync(dir)) return "";
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const lines = [];

  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      lines.push(`${prefix}📁 ${entry.name}/`);
      lines.push(buildTree(full, depth + 1, prefix + "   "));
    } else if (ALLOWED_EXTS.includes(path.extname(entry.name))) {
      lines.push(`${prefix}📄 ${entry.name}`);
    }
  }
  return lines.join(os.EOL);
}

fs.writeFileSync(path.join(docsDir, "filetree.txt"), buildTree(root));
console.log("✅ Wrote filetree.txt");

//──────────────────────────────────────────────
// 🧮 Utility helpers
//──────────────────────────────────────────────
function isTextFile(filePath) {
  const ext = path.extname(filePath);
  if (!ALLOWED_EXTS.includes(ext)) return false;
  try {
    const fd = fs.openSync(filePath, "r");
    const buffer = Buffer.alloc(8000);
    const bytes = fs.readSync(fd, buffer, 0, 8000, 0);
    fs.closeSync(fd);
    for (let i = 0; i < bytes; i++) {
      const byte = buffer[i];
      if (byte === 0) return false; // binary null byte
    }
    return true;
  } catch {
    return false;
  }
}

//──────────────────────────────────────────────
// 📦 Recursive file collector
//──────────────────────────────────────────────
function collectFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (isTextFile(full)) {
      results.push(full);
    }
  }
  return results;
}

//──────────────────────────────────────────────
// 💾 Write dumps in 500 MB increments
//──────────────────────────────────────────────
function dumpAllFiles() {
  const files = collectFiles(root);
  if (!files.length) {
    console.log("⚠️ No files to dump.");
    return;
  }

  let dumpIndex = 1;
  let currentSizeMB = 0;
  let currentBuffer = "";

  const flushDump = () => {
    if (!currentBuffer.trim()) return;
    const dest = path.join(docsDir, `codedump-${dumpIndex}.txt`);
    fs.writeFileSync(dest, currentBuffer);
    console.log(`✅ Wrote ${path.basename(dest)} (${currentSizeMB.toFixed(1)} MB)`);
    dumpIndex++;
    currentBuffer = "";
    currentSizeMB = 0;
  };

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const sizeMB = Buffer.byteLength(content) / (1024 * 1024);
    if (currentSizeMB + sizeMB > MAX_FILE_SIZE_MB * 0.95) flushDump();
    currentBuffer += `\n\n/*──────────────── ${path.relative(root, file)} ────────────────*/\n\n${content}`;
    currentSizeMB += sizeMB;
  }
  flushDump();
}

dumpAllFiles();

//──────────────────────────────────────────────
// 💬 Write ChatGPT prompt
//──────────────────────────────────────────────
const prompt = `
# 🧭 ChatGPT Project Analysis Prompt

You are ChatGPT, analyzing the contents of this folder (**docs/chatgpt**).

## 📦 Context to Read
- **cursorrules** → architecture, business goals, conventions
- **filetree.txt** → filtered directory structure (source of truth for what exists)
- **codedump-*.txt** → complete text/code source of the project

---

### 🧩 OUTPUT: Top 5 Focus Analysis (Markdown)
Produce a **Markdown-formatted** report with the **five most impactful priorities** for development. For each item include:
1) **Title** (concise)
2) **Type** — 🐞 *Bug/Code Smell*, ⚙️ *Refactor/Optimization*, 🚀 *Feature/Enhancement*
3) **Problem** — what’s missing or suboptimal (1–2 short paragraphs)
4) **Solution** — a Cursor-ready plan:
   - Mention affected files/directories (**must exist in \`filetree.txt\`**)
   - Clear step-by-step tasks
   - Minimal code/pseudocode where helpful
   - Enough specificity for Cursor to begin implementation

At the very end of Output append this block exactly:

💡 **Cursor Prompt:**  
Here are 5 high-impact improvements we should work on.  
Let’s tackle them **one at a time**, starting with #1.


---
`;

fs.writeFileSync(path.join(docsDir, "prompt.txt"), prompt.trim());
console.log("✅ Wrote ChatGPT prompt → prompt.txt");
console.log("\n🎯 Snapshot ready in ./docs/chatgpt\n");
