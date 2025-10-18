# Scripts Directory Organization

## 📁 Directory Structure

```
scripts/
├── audits/
│   ├── frontend/
│   │   ├── audit-*.js
│   │   └── reports/          # ← Reports go here
│   ├── backend/
│   │   ├── audit-*.js
│   │   └── reports/          # ← Reports go here
│   └── seo/
│       ├── *.js
│       └── reports/          # ← Reports go here
├── project/
│   ├── project-*.js
│   └── reports/              # ← Reports go here
└── README.md
```

## 🎯 Report Organization Rules

### ✅ **Correct Pattern**
- **Location**: Reports go in `{script_parent_directory}/reports/`
- **Creation**: Scripts must create the `reports` directory if it doesn't exist
- **Path Resolution**: Use proper ES module path resolution

### ❌ **Avoid**
- Outputting to root-level directories like `chatgpt/` or `docs/`
- Hardcoding absolute paths
- Not creating the reports directory

## 🔧 **Implementation Template**

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create reports directory
const reportsDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Output report
const reportPath = path.join(reportsDir, 'REPORT_NAME.md');
fs.writeFileSync(reportPath, reportContent);
```

## 📋 **Available Scripts**

- `npm run overview` - Project overview (outputs to `scripts/project/reports/`)
- `npm run audit:performance` - Route performance audit (outputs to `scripts/audits/frontend/reports/`)
- `npm run audit:routing` - Routing validation audit
- `npm run audit:schema` - Schema switching audit

## 🎨 **Report Naming Convention**

Use descriptive, UPPERCASE names with underscores:
- `ROUTE_PERFORMANCE_AUDIT.md`
- `ARCHITECTURE_SCORECARD.md`
- `BACKEND_AUDIT.md`
- `FRONTEND_STRUCTURE_MAP.md`