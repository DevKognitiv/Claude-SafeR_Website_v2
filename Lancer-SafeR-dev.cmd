@echo off
REM SafeR Website v2 — lancement du site en local (double-cliquez sur ce fichier)
cd /d "%~dp0"
title SafeR Website v2 - serveur de developpement

if exist ".git\index.lock" del /f /q ".git\index.lock"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 22 est requis : https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules\next\package.json" (
  echo Installation des dependances (une seule fois, 1 a 3 minutes)...
  call npm install
  if errorlevel 1 ( echo Echec de npm install. & pause & exit /b 1 )
)

echo.
echo Site : http://localhost:3000  (Ctrl+C pour arreter)
start "" "http://localhost:3000"
call npm run dev
pause
