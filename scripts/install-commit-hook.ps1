#!/usr/bin/env pwsh
# install-commit-hook.ps1
# Installs a post-commit hook that automatically generates changelogs

$hookFile = ".git/hooks/post-commit"
$hookContent = @'
#!/bin/sh
# Auto-generate changelog on every commit

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
CHANGELOG_FILE="chatgpt/gitlogs/CHANGES_$TIMESTAMP.md"

# Create gitlogs directory if it doesn't exist
mkdir -p chatgpt/gitlogs

# Get the last commit info
COMMIT_HASH=$(git rev-parse HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=%B)
COMMIT_AUTHOR=$(git log -1 --pretty=format:'%an <%ae>')
COMMIT_DATE=$(git log -1 --pretty=format:'%ad')

# Get changed files in this commit
CHANGED_FILES=$(git diff-tree --no-commit-id --name-status -r $COMMIT_HASH)

# Create the changelog
cat > "$CHANGELOG_FILE" << EOF
# Changelog - $TIMESTAMP

## Commit Information
- **Hash**: $COMMIT_HASH
- **Author**: $COMMIT_AUTHOR
- **Date**: $COMMIT_DATE

## Commit Message
$COMMIT_MESSAGE

## Changed Files
\`\`\`
$CHANGED_FILES
\`\`\`

## Detailed Changes

EOF

# Append the full diff
git show $COMMIT_HASH >> "$CHANGELOG_FILE"

echo "📝 Changelog generated: $CHANGELOG_FILE"
'@

# Check if .git directory exists
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not a git repository" -ForegroundColor Red
    exit 1
}

# Create hooks directory if it doesn't exist
if (-not (Test-Path ".git/hooks")) {
    New-Item -ItemType Directory -Path ".git/hooks" | Out-Null
}

# Write the hook file
$hookContent | Out-File -FilePath $hookFile -Encoding ASCII -NoNewline

Write-Host "✅ Post-commit hook installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Now every time you commit, a changelog will be auto-generated in chatgpt/gitlogs/" -ForegroundColor Cyan
Write-Host ""
Write-Host "To use:" -ForegroundColor Yellow
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m 'Your message'" -ForegroundColor White
Write-Host "  git push" -ForegroundColor White

