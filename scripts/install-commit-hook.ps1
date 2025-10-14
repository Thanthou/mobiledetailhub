#!/usr/bin/env pwsh
# install-commit-hook.ps1
# Installs a post-commit hook that automatically generates changelogs

Write-Host "Installing post-commit hook for automatic gitlog generation..." -ForegroundColor Cyan
Write-Host ""

# Check if .git directory exists
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not a git repository" -ForegroundColor Red
    exit 1
}

# 1. Install PowerShell script in .git/hooks
$psScriptPath = ".git/hooks/post-commit-script.ps1"
Write-Host "Creating PowerShell script at: $psScriptPath" -ForegroundColor Yellow

# Copy or verify the script exists (assuming it's already created)
if (-not (Test-Path $psScriptPath)) {
    Write-Host "❌ Error: post-commit-script.ps1 not found at $psScriptPath" -ForegroundColor Red
    Write-Host "   This should have been created already." -ForegroundColor Red
    exit 1
}

# 2. Install Husky hook
$huskyHook = ".husky/post-commit"
if (Test-Path ".husky") {
    Write-Host "Husky detected - creating hook at: $huskyHook" -ForegroundColor Yellow
    
    $hookContent = @"
# Auto-generate changelog after every commit
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".git/hooks/post-commit-script.ps1"
"@
    
    $hookContent | Out-File -FilePath $huskyHook -Encoding UTF8 -NoNewline
    Write-Host "✅ Husky post-commit hook created" -ForegroundColor Green
} else {
    Write-Host "⚠️  Husky not detected - installing direct git hook" -ForegroundColor Yellow
    
    $gitHook = ".git/hooks/post-commit"
    $hookContent = @"
#!/bin/sh
# Auto-generate changelog after every commit
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".git/hooks/post-commit-script.ps1"
"@
    
    $hookContent | Out-File -FilePath $gitHook -Encoding ASCII -NoNewline
    Write-Host "✅ Git post-commit hook created" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Post-commit hook installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Now every time you commit, a changelog will be auto-generated in chatgpt/gitlogs/" -ForegroundColor Cyan
Write-Host ""
Write-Host "To use:" -ForegroundColor Yellow
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m 'Your message'" -ForegroundColor White
Write-Host "  git push" -ForegroundColor White

