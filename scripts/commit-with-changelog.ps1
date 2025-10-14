#!/usr/bin/env pwsh
# commit-with-changelog.ps1
# Usage: .\scripts\commit-with-changelog.ps1 "Your commit message here"

param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$changelogFile = "gitlogs/CHANGES_$timestamp.md"

# Create gitlogs directory if it doesn't exist
if (-not (Test-Path "gitlogs")) {
    New-Item -ItemType Directory -Path "gitlogs" | Out-Null
}

Write-Host "📝 Generating changelog..." -ForegroundColor Cyan

# Get the list of changed files
$changedFiles = git diff --cached --name-status
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrEmpty($changedFiles)) {
    Write-Host "⚠️  No staged changes found. Staging all changes..." -ForegroundColor Yellow
    git add .
    $changedFiles = git diff --cached --name-status
}

# Create the changelog content
$changelogContent = @"
# Changelog - $timestamp

## Commit Message
$CommitMessage

## Changed Files
``````
$changedFiles
``````

## Detailed Changes

"@

# Get detailed diff for each file
$changelogContent += "`n"
$changelogContent += git diff --cached

# Write to file
$changelogContent | Out-File -FilePath $changelogFile -Encoding UTF8

Write-Host "✅ Changelog written to: $changelogFile" -ForegroundColor Green

# Perform git operations
Write-Host "`n🔄 Staging changes..." -ForegroundColor Cyan
git add .

Write-Host "💾 Committing..." -ForegroundColor Cyan
git commit -m $CommitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Committed successfully" -ForegroundColor Green
    
    Write-Host "`n🚀 Pushing to remote..." -ForegroundColor Cyan
    git push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Pushed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Push failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Commit failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 Summary:" -ForegroundColor Cyan
Write-Host "  - Changelog: $changelogFile" -ForegroundColor White
Write-Host "  - Commit: $CommitMessage" -ForegroundColor White

