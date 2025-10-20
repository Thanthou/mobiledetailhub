#!/usr/bin/env node
/**
 * audit-dependencies.js — Dependency & Port Audit
 * --------------------------------------------------------------
 * ✅ Summarizes only problems or missing links.
 * ✅ Adds port availability checks via .port-registry.json
 * 📄 Saves full details → docs/audits/DEPENDENCY_AUDIT.md
 */
import depcheck from "depcheck";
import fs from "fs";
import madgePkg from "madge";
import net from "net";
import { execSync } from "child_process";
import os from "os";
import path from "path";

const root = process.cwd();
const docsDir = path.join(root, "docs", "audits");
const outputFile = path.join(docsDir, "DEPENDENCY_AUDIT.md");

//──────────────────────────────
// 🎨 Color utils
//──────────────────────────────
const color = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

//──────────────────────────────
// 🧾 Containers
//──────────────────────────────
let warnings = [];
let errors = [];

//──────────────────────────────
// 📁 FILE DEPENDENCIES
//──────────────────────────────
const filesToCheck = [".port-registry.json", ".env"];
for (const f of filesToCheck) {
  if (!fs.existsSync(path.join(root, f))) {
    warnings.push(`${f} missing — required by startup scripts`);
  }
}

//──────────────────────────────
// 📦 CODE DEPENDENCIES — Detailed View
//──────────────────────────────
try {
    const result = await depcheck(process.cwd(), {});
    const missing = result.missing || {};
  
    for (const [pkg, locations] of Object.entries(missing)) {
      const shortList = locations.slice(0, 5).map((p) => "  • " + path.relative(root, p));
      const extra = locations.length > 5 ? `  • (+${locations.length - 5} more)` : "";
      warnings.push(`- ${pkg} not installed\n${shortList.join("\n")}${extra}`);
    }
  
  } catch (e) {
    warnings.push("Depcheck API failed — check module compatibility");
  }
  
//──────────────────────────────
// 🕸️ IMPORT GRAPH AUDIT (Madge)
//──────────────────────────────
const madge = madgePkg.default || madgePkg;

try {
  console.log(color.cyan("\n🕸️ Checking Import Graph (Madge)...\n"));

  let res;
  try {
    // Analyze from the frontend root to capture all apps
    res = await madge(path.resolve(root, "frontend/apps"), {
        fileExtensions: ["ts", "tsx", "js", "jsx"],
        excludeRegExp: [
          /node_modules/,
          /dist/,
          /\.test\./,
          /\.spec\./,
          /\.(css|scss|svg|png|jpg|jpeg|json)$/,
        ],
        tsConfig: path.resolve(root, "frontend/tsconfig.app.json"),
        webpackConfig: undefined,
        includeNpm: false,
      });
      
  } catch (innerErr) {
    console.log(color.yellow("⚠️  Madge produced partial results."));
    console.log(color.yellow(innerErr.message));
  }

  if (!res) {
    warnings.push("Madge could not produce a valid graph (no results)");
  } else {
    const obj = (typeof res.obj === "function" ? res.obj() : res);
    const totalFiles = Object.keys(obj || {}).length;
    const circular = typeof res.circular === "function" ? res.circular() : [];
    
    if (totalFiles === 0) {
      warnings.push("Madge found 0 files (check tsconfig or file paths)");
    } else {
      if (circular.length) {
        warnings.push(`Circular dependencies detected (${circular.length} chains)`);
        circular.forEach((chain, i) =>
          warnings.push(`  • [${i + 1}] ${chain.join(" → ")}`)
        );
      }

      console.log(color.green(`✅ Madge analyzed ${totalFiles} files`));
      if (circular.length === 0) {
        console.log(color.green("✅ No circular dependencies detected\n"));
      }
    }
  }
} catch (e) {
  console.log(color.red("❌ Madge threw an error:"));
  console.error(e);
  warnings.push(
    "Madge import analysis failed (see console for details)"
  );
}

  



  


//──────────────────────────────
// ⚙️ SYSTEM DEPENDENCIES
//──────────────────────────────
try {
  const hostsPath = os.platform() === "win32"
    ? "C:\\Windows\\System32\\drivers\\etc\\hosts"
    : "/etc/hosts";
  const hosts = fs.readFileSync(hostsPath, "utf8");
  if (!hosts.includes("tenant.localhost")) {
    warnings.push("Hosts file missing `tenant.localhost` entry");
  }
} catch {
  errors.push("Unable to read hosts file");
}

//──────────────────────────────
// 🧱 PORT REGISTRY VALIDATION
//──────────────────────────────
const portRegistryPath = path.join(root, ".port-registry.json");
if (fs.existsSync(portRegistryPath)) {
  const registry = JSON.parse(fs.readFileSync(portRegistryPath, "utf8"));

  const checkPort = (port) =>
    new Promise((resolve) => {
      const tester = net
        .createServer()
        .once("error", () => resolve(false))
        .once("listening", () => tester.close(() => resolve(true)))
        .listen(port);
    });

  // sequential check to avoid race conditions
  const entries = Object.entries(registry);
  for (const [app, { port }] of entries) {
    const isFree = await checkPort(port);
    if (!isFree) {
      warnings.push(`Port ${port} for "${app}" is already in use`);
    }
  }
} else {
  warnings.push(".port-registry.json not found — cannot validate ports");
}

//──────────────────────────────
// 📊 SUMMARY
//──────────────────────────────
console.log(color.cyan("\n📊 DEPENDENCY AUDIT RESULTS\n"));
if (warnings.length === 0 && errors.length === 0) {
  console.log(color.green("✅ No dependency or port issues detected.\n"));
} else {
  if (warnings.length) {
    console.log(color.yellow("⚠️ Warnings:"));
    warnings.forEach((w) => console.log(" -", w));
  }
  if (errors.length) {
    console.log(color.red("\n❌ Errors:"));
    errors.forEach((e) => console.log(" -", e));
  }
  console.log(color.cyan(`\n🔍 See full report: ${outputFile}\n`));
}

//──────────────────────────────
// 🧾 Markdown Output
//──────────────────────────────
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

const markdown = `# 🧩 Dependency Audit
**Date:** ${new Date().toLocaleString()}

---

## ⚠️ Warnings
${warnings.length ? warnings.map((w) => `- ${w}`).join("\n") : "_None_"}

## ❌ Errors
${errors.length ? errors.map((e) => `- ${e}`).join("\n") : "_None_"}

---

**Generated by:** scripts/audits/audit-dependencies.js
`;

fs.writeFileSync(outputFile, markdown, "utf8");
