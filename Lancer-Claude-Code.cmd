@echo off
REM Ouvre Claude Code dans le dossier du site (le serveur de dev peut tourner dans une autre fenetre)
cd /d "%~dp0"
where claude >nul 2>nul
if errorlevel 1 (
  echo Claude Code n'est pas installe. Installation : npm install -g @anthropic-ai/claude-code
  echo Puis relancez ce fichier.
  pause
  exit /b 1
)
claude
