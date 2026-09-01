@echo off
REM Premier envoi vers GitHub (DevKognitiv/Claude-SafeR_Website_v2) puis envois suivants
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git add -A
git commit -m "SafeR Website v2 - mise a jour" 
git push -u origin main
pause
