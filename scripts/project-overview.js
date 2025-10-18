// project-overview.js
// Comprehensive auto-diagnostic mode — file output only, no console logs
// Generates: ALL_part*.txt + SEO.md + DATABASE.md + CURSORRULES.md + ROUTER_REPORT.md + SERVER_REPORT.md + DB_REPORT.md + ENV_REPORT.md

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*─────────────────────────────────────────────*
 * CONFIG
 *─────────────────────────────────────────────*/
const OUTPUT_DIR_NAME = "chatgpt";
const MAX_BUNDLE_BYTES = 5 * 1024 * 1024;
const MAX_OUTPUT_FILES = 10;
const ROOT_TREE_DEPTH = 3;

const ALLOWED_EXT = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
  ".json", ".md", ".txt",
  ".css", ".scss", ".sass",
  ".html", ".xml",
  ".sql", ".sh", ".bat", ".ps1",
  ".yml", ".yaml", ".toml", ".ini", ".cfg", ".conf",
  ".py", ".go", ".rb", ".rs", ".java", ".kt",
  ".c", ".h", ".cpp", ".hpp",
  ".dockerfile", ".env.example"
]);

const IGNORE_DIRS = new Set([
  "node_modules","dist","build",".next",".nuxt","out",
  ".cache",".parcel-cache","coverage",
  ".git",".github",".vscode",".idea",".vite",
  "assets","images","videos","media","uploads","public"
]);
const IGNORE_FILES = new Set([
  ".DS_Store","Thumbs.db","package-lock.json","yarn.lock","pnpm-lock.yaml"
]);

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
}
function clearDir(dir) { fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir,{recursive:true}); }
function isBinary(buf){ return buf.includes(0); }
function safeRead(file){ try{const b=fs.readFileSync(file); if(isBinary(b))return null; return b.toString("utf8");}catch{return null;} }
function shouldSkipFile(name){ if(IGNORE_FILES.has(name))return true; if(name==="Dockerfile"||name==="Makefile")return false; const ext=path.extname(name).toLowerCase(); return !ALLOWED_EXT.has(ext); }
function findProjectRoot(start){
  let dir=path.resolve(start);
  for(let i=0;i<12;i++){
    const hasPkg=fs.existsSync(path.join(dir,"package.json"));
    const hasGit=fs.existsSync(path.join(dir,".git"));
    const hasFrontend=fs.existsSync(path.join(dir,"frontend"));
    const hasChatgpt=fs.existsSync(path.join(dir,"chatgpt"));
    const signals=[hasPkg,hasGit,hasFrontend,hasChatgpt].filter(Boolean).length;
    if(signals>=2) return dir;
    if(hasPkg) return dir;
    const parent=path.dirname(dir);
    if(parent===dir) break;
    dir=parent;
  }
  return path.resolve(start);
}
function walkDir(dir,{allowAll=false}={}) {
  const out=[], stack=[dir];
  while(stack.length){
    const d=stack.pop();
    let entries=[];
    try{entries=fs.readdirSync(d,{withFileTypes:true});}catch{continue;}
    for(const e of entries){
      if(e.name.startsWith("."))continue;
      const full=path.join(d,e.name);
      if(e.isSymbolicLink())continue;
      if(e.isDirectory()){ if(!IGNORE_DIRS.has(e.name))stack.push(full); }
      else{ if(!allowAll&&shouldSkipFile(e.name))continue; out.push({full,rel:path.relative(dir,full),name:e.name}); }
    }
  }
  return out.sort((a,b)=>a.rel.localeCompare(b.rel));
}
function walkDirLimitedDepth(dir,maxDepth,depth=0){
  let tree=""; if(depth===0)tree+=`${path.basename(dir)}/\n`;
  let entries=[]; try{entries=fs.readdirSync(dir,{withFileTypes:true});}catch{return tree;}
  entries=entries.filter(e=>!e.name.startsWith(".")&&!IGNORE_DIRS.has(e.name)).sort((a,b)=>a.name.localeCompare(b.name));
  for(const e of entries){
    const full=path.join(dir,e.name);
    const indent="  ".repeat(depth+1);
    tree+=`${indent}${e.name}${e.isDirectory()?"/":""}\n`;
    if(e.isDirectory()&&depth+1<maxDepth)tree+=walkDirLimitedDepth(full,maxDepth,depth+1);
  }
  return tree;
}

/*─────────────────────────────────────────────*
 * CONTEXT + BUILD HELPERS
 *─────────────────────────────────────────────*/
function collectContextFiles(root){
  const core=["package.json","frontend/package.json","tsconfig.json","frontend/tsconfig.json","vite.config.ts","vite.config.js","frontend/vite.config.ts","frontend/vite.config.js",".cursorrules"];
  return core.map(f=>path.join(root,f)).filter(f=>fs.existsSync(f)).map(f=>({full:f,rel:path.relative(root,f),name:path.basename(f)}));
}
function makeBanner(title,rel){return`\n*** ${title}: ${rel} ***\n`;}
function makeEndBanner(){return`\n*** END FILE ***\n`;}
function buildChunks(files,base){const chunks=[]; for(const f of files){const c=safeRead(f.full); if(!c)continue; const rel=path.relative(base,f.full); const text=`${makeBanner("FILE",rel)}${c}\n${makeEndBanner()}`; chunks.push({rel,bytes:Buffer.byteLength(text),text});} return chunks;}
function packBySize(chunks,out,prefix,maxB,maxF){const written=[];let part=1,current="",bytes=0;
  const flush=()=>{if(!current)return;const n=`${prefix}_part${String(part).padStart(2,"0")}.txt`;fs.writeFileSync(path.join(out,n),current);written.push(n);part++;current="";bytes=0;};
  for(const ch of chunks){if(bytes+ch.bytes>maxB&&current)flush();current+=ch.text;bytes+=ch.bytes;}
  if(current)flush();
  while(written.length>maxF){const keep=written[written.length-2],absorb=written[written.length-1];
    fs.appendFileSync(path.join(out,keep),"\n"+fs.readFileSync(path.join(out,absorb),"utf8")); fs.rmSync(path.join(out,absorb)); written.pop();}
  return written;
}

/*─────────────────────────────────────────────*
 * DIAGNOSTIC HELPERS
 *─────────────────────────────────────────────*/
function detectRouters(root){
  const files=walkDir(path.join(root,"frontend"));
  const rels=files.map(f=>f.rel);
  const multiRouter=rels.filter(r=>/Router/i.test(r)).length>1;
  return {
    routerFiles: rels.filter(r=>/Router/i.test(r)),
    hasReactRouterDom: fs.existsSync(path.join(root,"frontend","package.json")) &&
      /react-router-dom/.test(safeRead(path.join(root,"frontend","package.json"))||""),
    multiRouterWarning: multiRouter
  };
}
function detectServer(root){
  const bdir=path.join(root,"backend");
  const exists=fs.existsSync(bdir);
  let serverPath=null;
  if(exists){const files=fs.readdirSync(bdir); const js=files.find(f=>/^server(\.m?js|\.ts)?$/.test(f)); if(js)serverPath=path.join(bdir,js);}
  return {exists,serverPath};
}
function detectDB(root){
  const p=path.join(root,"backend","database","pool.js");
  const content=safeRead(p)||"";
  return {exists:fs.existsSync(p),imports:/pg|postgres/i.test(content),lazy:/function getPool|let pool/.test(content)};
}
function detectEnv(root){
  const p=path.join(root,"backend","config","env.js");
  const c=safeRead(p)||"";
  return {
    exists:fs.existsSync(p),
    zod:/zod/i.test(c),
    asyncSafe:/async|Promise/i.test(c),
    exports:/(export\s+const|export\s+default)/.test(c)
  };
}

/*─────────────────────────────────────────────*
 * REPORT GENERATORS
 *─────────────────────────────────────────────*/
function generateRouterReport(root){
  const d=detectRouters(root);
  return `# ROUTER_REPORT
Generated: ${new Date().toISOString()}

- React Router DOM installed: ${d.hasReactRouterDom ? "✅ yes" : "❌ no"}
- Router files found: ${d.routerFiles.length}
${d.routerFiles.map(r=>"  - "+r).join("\n")}
- Multiple routers detected: ${d.multiRouterWarning ? "⚠️ possible <Router> nesting issue" : "✅ single root router"}
`;
}
function generateServerReport(root){
  const d=detectServer(root);
  return `# SERVER_REPORT
Generated: ${new Date().toISOString()}

- Backend folder exists: ${d.exists ? "✅" : "❌"}
- Server entry path: ${d.serverPath || "❌ not found"}
- Expected listener: app.listen(PORT)
- Health endpoint: /api/health

Recommendation:
Ensure server starts listening before async init and binds to process.env.PORT.
`;
}
function generateDBReport(root){
  const d=detectDB(root);
  return `# DB_REPORT
Generated: ${new Date().toISOString()}

- pool.js present: ${d.exists ? "✅" : "❌"}
- PG/Postgres imported: ${d.imports ? "✅" : "❌"}
- Lazy initialization detected: ${d.lazy ? "✅" : "❌"}
`;
}
function generateEnvReport(root){
  const d=detectEnv(root);
  return `# ENV_REPORT
Generated: ${new Date().toISOString()}

- env.js exists: ${d.exists ? "✅" : "❌"}
- Uses zod validation: ${d.zod ? "✅" : "❌"}
- Async/Promise safe: ${d.asyncSafe ? "✅" : "❌"}
- Exports present: ${d.exports ? "✅" : "❌"}
`;
}

/*─────────────────────────────────────────────*
 * MAIN EXECUTION
 *─────────────────────────────────────────────*/
(async function main(){
  const PROJECT_ROOT=findProjectRoot(__dirname);
  const OUT_DIR=path.join(PROJECT_ROOT,OUTPUT_DIR_NAME);
  clearDir(OUT_DIR);

  const context=collectContextFiles(PROJECT_ROOT);
  const all=walkDir(PROJECT_ROOT);
  const chunks=buildChunks(all,PROJECT_ROOT);
  const written=packBySize(chunks,OUT_DIR,"ALL",MAX_BUNDLE_BYTES,MAX_OUTPUT_FILES);

  const stats={
    generated:new Date().toISOString(),
    totalFiles:all.length,
    byExt:all.reduce((a,f)=>{const e=path.extname(f.name)||"(noext)";a[e]=(a[e]||0)+1;return a;},{}),
    bundles:written
  };

  // Tree snapshot
  const treeRoot=walkDirLimitedDepth(PROJECT_ROOT,ROOT_TREE_DEPTH);
  const treeText=`# PROJECT_STRUCTURE\n\`\`\`\n${treeRoot}\n\`\`\``;
  writeText(path.join(OUT_DIR,"STRUCTURE.md"),treeText);

  /*──────────── Diagnostics ────────────*/
  const ROUTER=generateRouterReport(PROJECT_ROOT);
  const SERVER=generateServerReport(PROJECT_ROOT);
  const DB=generateDBReport(PROJECT_ROOT);
  const ENV=generateEnvReport(PROJECT_ROOT);

  writeText(path.join(OUT_DIR,"ROUTER_REPORT.md"),ROUTER);
  writeText(path.join(OUT_DIR,"SERVER_REPORT.md"),SERVER);
  writeText(path.join(OUT_DIR,"DB_REPORT.md"),DB);
  writeText(path.join(OUT_DIR,"ENV_REPORT.md"),ENV);

  // Aggregate summary
  const SUMMARY=[
    "# PROJECT_DIAGNOSTICS",
    "Generated: "+new Date().toISOString(),
    "",
    "## Router",
    ROUTER,
    "## Server",
    SERVER,
    "## Database",
    DB,
    "## Environment",
    ENV
  ].join("\n");

  if(written.length>0){
    const first=path.join(OUT_DIR,written[0]);
    fs.appendFileSync(first,"\n\n"+SUMMARY);
  }

  // silent exit
})();
