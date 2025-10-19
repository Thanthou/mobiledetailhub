#!/usr/bin/env node
/**
 * chatgpt-snapshot.js
 * --------------------------------------------------------------
 * 📦 Prepares a full codebase snapshot for ChatGPT analysis.
 * Creates ./docs/chatgpt with:
 *  - cursorrules (copied)
 *  - filetree.txt (filtered)
 *  - up to 9 codedump files
 *  - prompt.txt → tells ChatGPT exactly what to do next
 * --------------------------------------------------------------
 */

import fs from "fs";
import path from "path";
import os from "os";

const root = process.cwd();
const docsDir = path.join(root, "docs", "chatgpt");
const cursorrules = path.join(root, ".cursorrules");
const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 500;
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
// 🧹 Reset ./docs/chatgpt (preserve requested-files.txt)
//──────────────────────────────────────────────
if (fs.existsSync(docsDir)) {
    const preserve = path.join(docsDir, "requested-files.txt");
    let preserveData = null;
  
    // Read the old requested-files.txt if it exists
    if (fs.existsSync(preserve)) {
      preserveData = fs.readFileSync(preserve, "utf8");
      console.log("💾 Preserving requested-files.txt");
    }
  
    // Remove everything else
    fs.rmSync(docsDir, { recursive: true, force: true });
    fs.mkdirSync(docsDir, { recursive: true });
  
    // Restore requested-files.txt
    if (preserveData) {
      fs.writeFileSync(preserve, preserveData);
      console.log("✅ Restored requested-files.txt");
    }
  } else {
    fs.mkdirSync(docsDir, { recursive: true });
    console.log("📁 Created docs/chatgpt directory");
  }
  

//──────────────────────────────────────────────
// 📄 Copy cursorrules first
//──────────────────────────────────────────────
if (fs.existsSync(cursorrules)) {
  const dest = path.join(docsDir, "cursorrules");
  fs.copyFileSync(cursorrules, dest);
  console.log("✅ Copied cursorrules");
} else {
  console.warn("⚠️ No cursorrules file found.");
}

//──────────────────────────────────────────────
// 🌳 Generate filtered file tree
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
    } else {
      lines.push(`${prefix}📄 ${entry.name}`);
    }
  }
  return lines.join(os.EOL);
}

fs.writeFileSync(path.join(docsDir, "filetree.txt"), buildTree(root));
console.log("✅ Wrote filetree");

//──────────────────────────────────────────────
// 📚 Collect key files (limited to 9 dumps)
//──────────────────────────────────────────────
//──────────────────────────────────────────────
// 📚 Collect key files dynamically
//──────────────────────────────────────────────
function collectInterestingFiles() {
    const interesting = [];
    const pushIfExists = rel => {
      const full = path.join(root, rel);
      if (fs.existsSync(full)) interesting.push(full);
    };
  
    // Base priority set (always included)
    pushIfExists("package.json");
    pushIfExists("frontend/src/main.tsx");
    pushIfExists("frontend/src/App.tsx");
    pushIfExists("frontend/src/index.tsx");
    pushIfExists("frontend/src/shared/");
    pushIfExists("backend/app.js");
    pushIfExists("backend/routes/");
    pushIfExists("backend/controllers/");
    pushIfExists("scripts/audits/audit-seo.js");
    pushIfExists("tsconfig.json");
    pushIfExists("vite.config.ts");
  
    //──────────────────────────────────────────────
    // 🧠 Import dynamically requested files
    //──────────────────────────────────────────────
    const reqFile = path.join(docsDir, "requested-files.txt");
    if (fs.existsSync(reqFile)) {
      const content = fs.readFileSync(reqFile, "utf8");
      const matches = [...content.matchAll(/pushIfExists\(["'`](.+?)["'`]\)/g)];
      for (const [, rel] of matches) {
        const full = path.join(root, rel);
        if (fs.existsSync(full)) {
          interesting.push(full);
          console.log(`🧩 Included from requested-files.txt → ${rel}`);
        } else {
          console.warn(`⚠️  Requested file not found: ${rel}`);
        }
      }
    }
  
    return interesting.filter(f => fs.existsSync(f));
  }

//──────────────────────────────────────────────
// 📦 Smart file packer — maximize 500 MB capacity per dump
//──────────────────────────────────────────────
function dumpFiles() {
    const files = collectInterestingFiles();
    if (!files.length) {
      console.log("⚠️ No files found to dump.");
      return;
    }
  
    let dumpIndex = 1;
    let currentSizeMB = 0;
    let currentBuffer = "";
    const flushDump = () => {
      if (currentBuffer.trim().length === 0) return;
      const dest = path.join(docsDir, `codedump-${dumpIndex}.txt`);
      fs.writeFileSync(dest, currentBuffer);
      console.log(`✅ Wrote ${path.basename(dest)} (${currentSizeMB.toFixed(2)} MB)`);
      dumpIndex++;
      currentBuffer = "";
      currentSizeMB = 0;
    };
  
    for (const file of files) {
      const stats = fs.statSync(file);
      if (stats.isDirectory()) {
        const subFiles = fs.readdirSync(file);
        for (const sf of subFiles) {
          const sfPath = path.join(file, sf);
          if (fs.statSync(sfPath).isFile()) {
            const content = fs.readFileSync(sfPath, "utf8");
            const sizeMB = Buffer.byteLength(content) / (1024 * 1024);
            if (currentSizeMB + sizeMB > MAX_FILE_SIZE_MB * 0.9 || dumpIndex > MAX_FILES) {
              flushDump();
              if (dumpIndex > MAX_FILES) {
                console.warn(`⚠️ Reached max codedump files (${MAX_FILES}). Skipping remainder.`);
                return;
              }
            }
            currentBuffer += `\n\n/*──────────────── ${path.relative(root, sfPath)} ────────────────*/\n\n${content}`;
            currentSizeMB += sizeMB;
          }
        }
      } else {
        const content = fs.readFileSync(file, "utf8");
        const sizeMB = Buffer.byteLength(content) / (1024 * 1024);
        if (currentSizeMB + sizeMB > MAX_FILE_SIZE_MB * 0.9 || dumpIndex > MAX_FILES) {
          flushDump();
          if (dumpIndex > MAX_FILES) {
            console.warn(`⚠️ Reached max codedump files (${MAX_FILES}). Skipping remainder.`);
            return;
          }
        }
        currentBuffer += `\n\n/*──────────────── ${path.relative(root, file)} ────────────────*/\n\n${content}`;
        currentSizeMB += sizeMB;
      }
    }
  
    flushDump();
  }
  

//──────────────────────────────────────────────
// 💬 Write ChatGPT prompt for analysis
//──────────────────────────────────────────────
const prompt = `
# 🧭 ChatGPT Project Analysis Prompt

You are ChatGPT, analyzing the contents of this folder (**docs/chatgpt**).

## 🎯 Your Mission
Review the following files to understand the current state of the project:
- **cursorrules** → explains architecture, business goals, and code conventions  
- **filetree.txt** → provides full directory structure  
- **codedump-*.txt** → contains selected source code excerpts  

Based on this context, produce **two separate outputs** in two chat messages:

---

### 🧩 OUTPUT 1 — Top 5 Focus Analysis (Markdown)
Create a detailed **Markdown-formatted** report listing the **five most impactful priorities** for development.

For each:
1. **Title** — concise and descriptive  
2. **Type** — 🐞 Bug / ⚙️ Refactor / 🚀 Feature  
3. **Problem** — what’s missing or suboptimal  
4. **Solution** — Cursor-friendly, actionable implementation plan (with enough context for Cursor to begin work)

At the very end, close with:

\`\`\`md
💡 **Cursor Prompt:**  
Here are 5 high-impact improvements we should work on.  
Let’s tackle them **one at a time**, starting with #1.
\`\`\`

---

### 🧩 OUTPUT 2 — Requested Files for Next Snapshot
After sending the Markdown report, send a **second message** with only this JavaScript code block:

\`\`\`js
// priority
pushIfExists("...");
pushIfExists("...");
\`\`\`

These paths should represent files or directories you want to see next time to deepen your understanding of the codebase.

---

## ✅ Output Only
Do **not** create new files.  
Output both responses (1️⃣ Markdown report, 2️⃣ JS block) directly to the console.
`;

dumpFiles();
fs.writeFileSync(path.join(docsDir, "prompt.txt"), prompt.trim());
console.log("✅ Wrote ChatGPT prompt → prompt.txt");

//──────────────────────────────────────────────
// 🧩 Prepare Requested Files Tracker
//──────────────────────────────────────────────
const requestedFileList = path.join(docsDir, "requested-files.txt");
if (!fs.existsSync(requestedFileList)) {
  const starterText = [
    "# Requested Files from ChatGPT",
    "",
    "Each time you upload this folder to ChatGPT, it may recommend additional files to include in future snapshots.",
    "Paste them here under the comment section below.",
    "",
    "```js",
    "// priority",
    "// (ChatGPT suggestions will go here)",
    "```",
    ""
  ].join("\n");
  fs.writeFileSync(requestedFileList, starterText);
  console.log("✅ Initialized requested-files.txt");
} else {
  console.log("✅ Existing requested-files.txt preserved");
}

console.log("\n🎯 ChatGPT snapshot ready in ./docs/chatgpt\n");

