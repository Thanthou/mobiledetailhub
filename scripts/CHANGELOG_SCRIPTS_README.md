# Commit with Changelog Scripts

These scripts automatically generate a changelog file documenting all changes whenever you commit and push to git.

## Features

- 📝 Captures all file changes and diffs
- 🕐 Timestamps each changelog
- 💾 Auto-stages, commits, and pushes
- 📁 Organizes changelogs in `gitlogs/` directory

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

Each run creates a file like `gitlogs/CHANGES_2025-10-14_15-30-45.md` containing:

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

## Notes

- The `gitlogs/` directory is git-ignored by default
- If you want to commit changelogs, remove `gitlogs/` from `.gitignore`
- Scripts will auto-stage all changes before committing

