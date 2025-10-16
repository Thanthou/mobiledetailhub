@echo off
echo 🧹 Cleaning up old Node.js processes...
taskkill /F /IM node.exe /T >nul 2>&1
echo ✅ Ports cleared
echo 🚀 Starting development servers...
cd /d "%~dp0.."
npm run dev:all
