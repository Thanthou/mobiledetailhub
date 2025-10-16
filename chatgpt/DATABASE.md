# Database Overview

❌ Error running db-overview.js:
```
Command failed: node "C:\Users\colem\OneDrive\Desktop\mdh\backend\scripts\db-overview.js" 3
file:///C:/Users/colem/OneDrive/Desktop/mdh/backend/scripts/db-overview.js:3
const { Pool } = require('pg');
                 ^

ReferenceError: require is not defined in ES module scope, you can use import instead
This file is being treated as an ES module because it has a '.js' file extension and 'C:\Users\colem\OneDrive\Desktop\mdh\backend\package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
    at file:///C:/Users/colem/OneDrive/Desktop/mdh/backend/scripts/db-overview.js:3:18
    at ModuleJob.run (node:internal/modules/esm/module_job:365:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:665:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:99:5)

Node.js v24.3.0

```

Note: Make sure your database is running and .env is configured.
