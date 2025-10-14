# Simple hook diagnostic
Write-Host "Git Hook Diagnostic" -ForegroundColor Cyan
Write-Host ("=" * 60)

Write-Host "`nChecking hook setup..." -ForegroundColor Yellow

# 1. Check if post-commit exists
if (Test-Path ".git/hooks/post-commit") {
    Write-Host "[OK] post-commit file exists" -ForegroundColor Green
} else {
    Write-Host "[FAIL] post-commit file missing" -ForegroundColor Red
    exit
}

# 2. Check PowerShell script exists
if (Test-Path ".git/hooks/post-commit-script.ps1") {
    Write-Host "[OK] post-commit-script.ps1 exists" -ForegroundColor Green
} else {
    Write-Host "[FAIL] post-commit-script.ps1 missing" -ForegroundColor Red
}

# 3. Check line endings
$bytes = [System.IO.File]::ReadAllBytes(".git/hooks/post-commit")
$hasCRLF = ($bytes -contains 13)
if (-not $hasCRLF) {
    Write-Host "[OK] Line endings are correct (LF)" -ForegroundColor Green
} else {
    Write-Host "[WARN] Line endings are CRLF - may cause issues" -ForegroundColor Yellow
    Write-Host "  Fix with: .\scripts\fix-hook-simple.ps1" -ForegroundColor Gray
}

# 4. Test manual execution
Write-Host "`nTesting manual execution..." -ForegroundColor Yellow
try {
    & powershell -NoProfile -ExecutionPolicy Bypass -File ".git/hooks/post-commit-script.ps1" 2>&1 | Out-Null
    if (Test-Path "chatgpt/gitlogs") {
        $files = Get-ChildItem "chatgpt/gitlogs" -ErrorAction SilentlyContinue
        Write-Host "[OK] PowerShell script works (found $($files.Count) gitlogs)" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Script runs but no gitlogs created yet" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[FAIL] PowerShell script error: $_" -ForegroundColor Red
}

# 5. Check Git config
$hooksPath = git config core.hooksPath 2>$null
if ([string]::IsNullOrEmpty($hooksPath)) {
    Write-Host "[OK] Using default hooks path" -ForegroundColor Green
} else {
    Write-Host "[WARN] Custom hooks path: $hooksPath" -ForegroundColor Yellow
}

Write-Host "`n" + ("=" * 60)
Write-Host "Next step: Test with a real commit" -ForegroundColor Cyan
Write-Host "  git commit --allow-empty -m 'Test hook'" -ForegroundColor White
Write-Host ""

