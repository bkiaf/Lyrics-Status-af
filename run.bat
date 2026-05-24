@echo off
title AF - Lyrics Status v7
color 0E
chcp 65001 >nul
echo.
echo   ░▒▓██████▓▒░░▒▓████████▓▒░
echo   ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░░░░░░░
echo   ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░░░░░░░
echo   ░▒▓████████▓▒░▒▓██████▓▒░░░
echo   ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░░░░░░░
echo   ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░░░░░░░
echo   ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░░░░░░░
echo.
echo  ================================
echo    Lyrics Status v7 - Running
echo  ================================
echo.

node --version >nul 2>nul
if not %errorlevel% == 0 (
    echo  [ERROR] Node.js not found.
    echo  Run install.bat first.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo  [ERROR] Dependencies not installed.
    echo  Run install.bat first.
    echo.
    pause
    exit /b 1
)

echo  [OK] Opening: http://localhost:8999
echo  [  ] Press Ctrl+C to stop the app.
echo.
echo  ================================
echo.

timeout /t 2 /nobreak >nul
start "" "http://localhost:8999"

npm run start

echo.
echo  [--] App stopped.
pause
