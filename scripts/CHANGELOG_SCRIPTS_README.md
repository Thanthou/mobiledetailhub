# Commit with Changelog Scripts

These scripts automatically generate a changelog file documenting all changes whenever you commit and push to git.

## Features

- 📝 Captures all file changes and diffs
- 🕐 Timestamps each changelog
- 💾 Auto-stages, commits, and pushes
- 📁 Organizes changelogs in `chatgpt/gitlogs/` directory
- 🔍 Diagnostic tools for debugging hooks on Windows
- 🔧 Auto-fix common Windows hook issues

## Usage

### Windows (PowerShell)

```powershell
.\scripts\commit-with-changelog.ps1 "Your commit message here"
```

### Mac/Linux or Git Bash (Bash)

First, make the script executable:
```bash
chmod +x scripts/commit-with-changelog.sh
```

Then run:
```bash
./scripts/commit-with-changelog.sh "Your commit message here"
```

## What Gets Generated?

Each run creates a file like `chatgpt/gitlogs/CHANGES_2025-10-14_15-30-45.md` containing:

1. **Timestamp** - When the commit was made
2. **Commit Message** - Your provided message
3. **Changed Files List** - All files that were modified/added/deleted
4. **Detailed Diffs** - Line-by-line changes for each file

## Example Output

```markdown
# Changelog - 2025-10-14_15-30-45

## Commit Message
Add new feature for user authentication

## Changed Files
```
M       frontend/src/features/auth/components/LoginForm.tsx
A       frontend/src/features/auth/hooks/useAuth.ts
D       frontend/src/features/auth/old-auth.tsx
```

## Detailed Changes

[Full git diff output here...]
```

## Customization

You can modify the scripts to:
- Change the changelog format (JSON, TXT, etc.)
- Filter which files to include
- Add git statistics
- Include branch information
- Skip the automatic push

## How It Works

This project uses **Husky** for git hooks management. The automatic gitlog generation is triggered via:
- **`.husky/post-commit`** - Husky hook file (calls PowerShell script)
- **`.git/hooks/post-commit-script.ps1`** - PowerShell script that generates gitlogs

### Quick Test

To verify the hook is working:
```bash
git commit --allow-empty -m "Test gitlog"
```

Then check:
```bash
Get-ChildItem chatgpt\gitlogs\
```

You should see a new `CHANGES_*.md` file.

## Troubleshooting

### Hook Not Running?

**1. Check if Husky is installed:**
```bash
git config core.hooksPath
```
Should return: `.husky/_`

**2. Verify the post-commit hook exists:**
```bash
Test-Path .husky/_/post-commit
```
Should return: `True`

**3. Run diagnostic:**
```powershell
.\scripts\test-hook-simple.ps1
```

**4. Auto-fix common issues:**
```powershell
.\scripts\fix-hook-simple.ps1
```

### Manual Verification

Test the PowerShell script directly:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .git/hooks/post-commit-script.ps1
```

If this creates a gitlog, the script works and the issue is with hook execution.

## Notes

- The `chatgpt/gitlogs/` directory is git-ignored by default
- If you want to commit changelogs, remove `chatgpt/gitlogs/` from `.gitignore`
- Scripts will auto-stage all changes before committing
- On Windows, the batch wrapper (`.bat`) is the most reliable method

