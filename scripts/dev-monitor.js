// scripts/dev-monitor.js
import { spawn } from "child_process";
import chalk from "chalk";

console.log(chalk.magenta("👀 Monitoring code quality and runtime errors..."));

const NPX = process.platform === "win32" ? "npx.cmd" : "npx";

function run(label, cmd, args, options = {}) {
  const useShell = process.platform === "win32"; // Fix for Windows spawn EINVAL
  const spawnOptions = { shell: useShell, ...options };
  const proc = spawn(cmd, args, spawnOptions);

  proc.stdout.on("data", (data) => {
    const text = data.toString();
    if (
      text.includes("error") ||
      text.includes("warning") ||
      text.includes("ERR!") ||
      text.includes("FAIL") ||
      text.includes("Exception") ||
      text.includes("Missing")
    ) {
      console.log(chalk.magenta(`[${label}] ${text.trim()}`));
    }
  });

  proc.stderr.on("data", (data) =>
    console.log(chalk.red(`[${label}] ${data.toString().trim()}`))
  );

  proc.on("close", (code) =>
    console.log(chalk.gray(`[${label}] exited (${code})`))
  );
}

// ESLint live cache mode (run separately for frontend and backend)
run("LINT-FRONTEND", NPX, ["eslint", ".", "--cache", "--format", "stylish"], { cwd: "frontend" });
run("LINT-BACKEND", NPX, ["eslint", "backend", "--cache", "--format", "stylish"]);

// TypeScript incremental build mode (run from frontend directory)
run("TYPE", NPX, ["tsc", "--noEmit", "--watch", "--preserveWatchOutput", "--pretty", "--project", "frontend"]);