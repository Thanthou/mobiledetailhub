# GitHub Actions CI/CD

This directory contains GitHub Actions workflows for automated testing, linting, and deployment.

## Workflows

### 1. `code-quality.yml` - Main Quality Checks

**Runs on:** Push and Pull Requests to `main` and `develop`

**Jobs:**
- **lint-and-check** - Frontend linting, boundary checks, component size checks
- **backend-lint** - Backend and scripts linting
- **format-check** - Prettier formatting verification

**What it does:**
- ✅ Runs ESLint on frontend and backend
- ✅ Checks import boundaries (no cross-feature imports)
- ✅ Reports component sizes (warn-only)
- ✅ Hard fails if components exceed 800 lines
- ✅ Checks code formatting

### 2. `pr-checks.yml` - Pull Request Enhancements

**Runs on:** Pull Request events

**Jobs:**
- **size-report** - Posts component size report as PR comment
- **boundary-check** - Verifies import boundaries

**What it does:**
- 📊 Posts component size report directly in PR
- ⚠️ Shows which files are over 500 lines
- 🚫 Fails if cross-feature imports detected
- 💬 Updates comment on each push (no spam)

## Local Testing

Before pushing, run locally to catch issues:

```bash
# Frontend checks (from frontend/)
npm run lint              # ESLint + boundaries
npm run check:sizes       # Component size report
npm run test              # Unit tests

# Backend checks (from root)
npm run lint              # Backend ESLint
npm run format:check      # Prettier check

# Full check (from root)
npm run lint:all
```

## CI Commands

The CI uses these npm scripts:

### Frontend
```bash
npm run lint                    # ESLint + boundary check
npm run lint:boundaries         # Import boundaries only
npm run check:sizes:report      # Show top 15 largest files
npm run check:sizes:ci          # Hard fail at 800 lines
npm run test -- --run           # Run tests in CI mode
```

### Root
```bash
npm run lint                    # Backend + scripts ESLint
npm run format:check            # Prettier formatting
npm run lint:all                # Everything
```

## Customization

### Adjust Component Size Thresholds

Edit `frontend/package.json`:

```json
{
  "scripts": {
    "check:sizes:ci": "node scripts/check-component-sizes.js --ci --fail 600"
  }
}
```

### Disable PR Comments

Remove or comment out the "Comment on PR" step in `pr-checks.yml`.

### Add Additional Checks

Add new steps to `code-quality.yml`:

```yaml
- name: Custom Check
  run: npm run custom-check
```

## Required Secrets

No secrets required for basic CI. If you add deployment steps, you may need:

- `DEPLOY_TOKEN` - For deployment
- `SLACK_WEBHOOK` - For notifications
- etc.

## Status Badges

Add to your README.md:

```markdown
![Code Quality](https://github.com/yourusername/yourrepo/actions/workflows/code-quality.yml/badge.svg)
![PR Checks](https://github.com/yourusername/yourrepo/actions/workflows/pr-checks.yml/badge.svg)
```

## Troubleshooting

### "tsx not found" error

Make sure dependencies are installed:
```bash
cd frontend && npm ci
```

### Component size check fails

View details:
```bash
npm run check:sizes:report
```

Fix large components or adjust threshold in `check:sizes:ci`.

### Import boundary violations

View detailed report:
```bash
npm run lint:boundaries:verbose
```

Refactor to move shared code to `@/shared/**`.

