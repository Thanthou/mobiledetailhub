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
    const filetreePath = path.join(docsDir, "filetree.txt");
    const filetreeContent = fs.existsSync(filetreePath)
      ? fs.readFileSync(filetreePath, "utf8")
      : "";

    const seen = new Set();

    for (const [, rel] of matches) {
      const full = path.join(root, rel);
      const filename = path.basename(rel);

      if (seen.has(full)) continue;
      seen.add(full);

      if (fs.existsSync(full)) {
        interesting.push(full);
        console.log(`🧩 Included from requested-files.txt → ${rel}`);
      } else if (filetreeContent.toLowerCase().includes(filename.toLowerCase())) {
        console.warn(`⚠️  File appears in filetree but path mismatch (check casing or folder): ${rel}`);
      } else {
        console.warn(`⚠️  Requested file not found (not in filetree): ${rel}`);
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

## 📦 Context to Read
- **cursorrules** → architecture, business goals, conventions
- **filetree.txt** → full directory structure (source of truth for what exists)
- **codedump-*.txt** → selected source excerpts
- **requested-files.txt** → ALREADY-REQUESTED paths (must be excluded from new requests)

---

## 🔀 Required Response Format (Two Separate Chat Messages)

### 🧩 OUTPUT 1 — Top 5 Focus Analysis (Markdown)
Send this as the **first message only**. Produce a **Markdown-formatted** report with the **five most impactful priorities** for development. For each item include:
1) **Title** (concise)  
2) **Type** — 🐞 *Bug/Code Smell*, ⚙️ *Refactor/Optimization*, 🚀 *Feature/Enhancement*  
3) **Problem** — what’s missing or suboptimal (1–2 short paragraphs)  
4) **Solution** — a Cursor-ready plan:
   - Mention affected files/directories (**must exist in \`filetree.txt\`**)
   - Clear step-by-step tasks
   - Minimal code/pseudocode where helpful
   - Enough specificity for Cursor to begin implementation

At the very end of Output 1, append this block exactly:

\`\`\`md
💡 **Cursor Prompt:**  
Here are 5 high-impact improvements we should work on.  
Let’s tackle them **one at a time**, starting with #1.
\`\`\`

> You may propose **brand-new files** (that do not yet exist) **inside Output 1 only** as ideas. Do **not** include non-existent paths in Output 2.

---

### 🧩 OUTPUT 2 — Requested Files for Next Snapshot (JavaScript Only)
Send this as a **second, separate message** after Output 1. Output **only** a JavaScript code block with paths that:
- ✅ **already exist in \`filetree.txt\`**, and
- ✅ are **NOT already listed** in \`requested-files.txt\` (compute the set difference), and
- ✅ you believe will materially improve the next snapshot.

Format **exactly** like this:
\`\`\`js
// priority
pushIfExists("path/that/exists.ext");
pushIfExists("another/existing/path/");
\`\`\`

**Strict rules for Output 2:**
- Do **not** repeat anything that already appears in \`requested-files.txt\`.
- Do **not** include speculative/new files here (keep those as ideas in Output 1).
- If there are **no new** existing paths to recommend, output:
\`\`\`js
// priority
// no new files for next snapshot
\`\`\`

---

## ✅ Output Only
- Do **not** create files.  
- Send **two messages**: (1) Markdown analysis, (2) JS block for **new** requested files that already exist.
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

