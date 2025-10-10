/**
 * CLI Utilities for Error Monitor
 * Shared between backend and frontend monitors
 */

export function parseArgs(argv = process.argv.slice(2)) {
  const flags = new Set();
  const options = new Map();
  const positional = [];
  
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    
    if (arg.startsWith('--')) {
      const flagName = arg.slice(2);
      const equalIndex = flagName.indexOf('=');
      
      if (equalIndex > -1) {
        const key = flagName.slice(0, equalIndex);
        const value = flagName.slice(equalIndex + 1);
        options.set(key, value);
      } else if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
        options.set(flagName, argv[i + 1]);
        i++;
      } else {
        flags.add(flagName);
      }
    } else if (arg.startsWith('-')) {
      flags.add(arg.slice(1));
    } else {
      positional.push(arg);
    }
  }
  
  return { flags, options, positional };
}

export function printHelp(name, description, usage) {
  console.log(`
${name}
${description}

Usage:
${usage.map(u => `  ${u}`).join('\n')}

Options:
  --target=<target>  Specify target (backend, frontend, all)
  --help, -h         Show this help
`);
}

