# Simple hook auto-fix
Write-Host "Git Hook Auto-Fix" -ForegroundColor Cyan
Write-Host ("=" * 60)

# 1. Fix line endings
if (Test-Path ".git/hooks/post-commit") {
    Write-Host "`nFixing line endings..." -ForegroundColor Yellow
    $content = Get-Content ".git/hooks/post-commit" -Raw
    $fixed = $content -replace "`r`n", "`n"
    [System.IO.File]::WriteAllText("$PWD\.git\hooks\post-commit", $fixed, [System.Text.UTF8Encoding]::new($false))
    Write-Host "[OK] Line endings fixed" -ForegroundColor Green
}

# 2. Create batch wrapper
Write-Host "`nCreating batch wrapper..." -ForegroundColor Yellow
$batchContent = @"
@echo off
pwsh -NoProfile -ExecutionPolicy Bypass -File "%~dp0post-commit-script.ps1"
if errorlevel 1 (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0post-commit-script.ps1"
)
"@

$batchContent | Out-File -FilePath ".git/hooks/post-commit.bat" -Encoding ASCII -NoNewline
Write-Host "[OK] Created post-commit.bat" -ForegroundColor Green

# 3. Set executable via Git Bash if available
$gitBash = "C:\Program Files\Git\bin\bash.exe"
if (Test-Path $gitBash) {
    Write-Host "`nSetting permissions..." -ForegroundColor Yellow
    & $gitBash -c "cd '$PWD' && chmod +x .git/hooks/post-commit" 2>&1 | Out-Null
    Write-Host "[OK] Permissions set" -ForegroundColor Green
}

Write-Host "`n" + ("=" * 60)
Write-Host "Auto-fix complete!" -ForegroundColor Cyan
Write-Host "`nTest with:" -ForegroundColor Yellow
Write-Host "  git commit --allow-empty -m 'Test hook'" -ForegroundColor White
Write-Host ""

