#!/usr/bin/env node
/**
 * 🧱 Folder Dump Utility
 * Usage:
 *   node scripts/project/folder-dump.js --scripts
 *
 * Features:
 *  - Recursively dumps all text-based files in ./scripts
 *  - Skips binary / irrelevant files
 *  - Creates a JSON file tree
 *  - Splits dumps into 512MB chunks
 *  - Cleans output folder before writing
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// -----------------------------
// 🧭 Setup
// -----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
// -----------------------------
// 🧭 Resolve target path
// -----------------------------
const ROOT_DIR = path.resolve(__dirname, "../../");

// Grab the first argument that starts with "--"
const arg = args.find(a => a.startsWith("--"));
if (!arg) {
  console.error("❌ Missing argument. Example: node folder-dump.js --scripts or --frontend/src/features");
  process.exit(1);
}

// Clean argument (remove leading dashes)
const targetArg = arg.replace(/^--/, "").trim();

// Resolve full absolute path
const TARGET_DIR = path.resolve(ROOT_DIR, targetArg);

// Validate target folder
if (!fs.existsSync(TARGET_DIR)) {
  console.error(`❌ Target folder not found: ${TARGET_DIR}`);
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, "folder-dump");

// Configurable limits
const MAX_SIZE_MB = 512;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// -----------------------------
// 🧹 Prepare Output Folder
// -----------------------------
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// -----------------------------
// ⚙️ Helpers
// -----------------------------
const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  ".cache",
]);

const EXCLUDED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".ico",
  ".svg",
  ".map",
  ".lock",
  ".zip",
  ".tar",
  ".gz",
  ".env",
  ".db",
  ".sqlite",
]);

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (EXCLUDED_EXTENSIONS.has(ext)) return false;

  try {
    const buffer = Buffer.alloc(512);
    const fd = fs.openSync(filePath, "r");
    const bytesRead = fs.readSync(fd, buffer, 0, 512, 0);
    fs.closeSync(fd);
    const content = buffer.toString("utf8", 0, bytesRead);
    return /^[\x00-\x7F\u00A0-\uFFFF]*$/.test(content);
  } catch {
    return false;
  }
}

function buildFileTree(dir, base = "./scripts") {
  const result = { path: dir, files: [], subdirs: [] };
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relPath = path.relative(ROOT_DIR, fullPath);

    if (item.isDirectory()) {
      if (!EXCLUDED_DIRS.has(item.name)) {
        result.subdirs.push(buildFileTree(fullPath, base));
      }
    } else {
      result.files.push({
        name: item.name,
        path: relPath.replace(/\\/g, "/"),
      });
    }
  }

  return result;
}

// -----------------------------
// 🧩 Dump Files
// -----------------------------
let currentPart = 1;
let currentSize = 0;
let included = 0;
let skipped = 0;

const currentOutputPath = () =>
  path.join(OUTPUT_DIR, `SCRIPTS_PART${String(currentPart).padStart(2, "0")}.txt`);
let outputStream = fs.createWriteStream(currentOutputPath(), { flags: "a" });

function writeToDump(content) {
  const buffer = Buffer.from(content, "utf8");
  if (currentSize + buffer.length > MAX_SIZE_BYTES) {
    outputStream.end();
    currentPart++;
    currentSize = 0;
    outputStream = fs.createWriteStream(currentOutputPath(), { flags: "a" });
  }
  outputStream.write(buffer);
  currentSize += buffer.length;
}

function processDirectory(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (!EXCLUDED_DIRS.has(item.name)) processDirectory(fullPath);
      continue;
    }

    const ext = path.extname(item.name).toLowerCase();
    if (EXCLUDED_EXTENSIONS.has(ext)) {
      skipped++;
      continue;
    }

    if (!isTextFile(fullPath)) {
      skipped++;
      continue;
    }

    try {
      const data = fs.readFileSync(fullPath, "utf8");
      writeToDump(
        `\n============================\nFILE: ${path.relative(ROOT_DIR, fullPath)}\n============================\n${data}\n`
      );
      included++;
    } catch {
      skipped++;
    }
  }
}

// -----------------------------
// 🚀 Run
// -----------------------------
console.log(`🔍 Starting folder dump for: ${TARGET_DIR}`);
const fileTree = buildFileTree(TARGET_DIR);
fs.writeFileSync(
  path.join(OUTPUT_DIR, "SCRIPTS_FILE_TREE.json"),
  JSON.stringify(fileTree, null, 2),
  "utf8"
);

processDirectory(TARGET_DIR);

outputStream.end();

const partCount = currentPart;
console.log("\n✅ Folder dump complete.");
console.log(`📂 Directory: ${TARGET_DIR}`);
console.log(`🧩 Files included: ${included}`);
console.log(`🚫 Files skipped: ${skipped}`);
console.log(`📄 Output parts: ${partCount}`);
console.log(`📁 Saved to: ${OUTPUT_DIR}`);
