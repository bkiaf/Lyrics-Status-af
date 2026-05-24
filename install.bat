@echo off
title AF - Lyrics Status v7 - Installer
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
echo    Lyrics Status v7 - Installer
echo  ================================
echo.

node --version >nul 2>nul
if not %errorlevel% == 0 (
    echo  [ERROR] Node.js is not installed.
    echo  Download it from: https://nodejs.org/en
    echo.
    pause
    exit /b 1
)

echo  [OK] Node.js found
echo  [..] Installing dependencies...
echo.

call npm install

if not %errorlevel% == 0 (
    echo.
    echo  [ERROR] Installation failed.
    echo  Try running this file as Administrator.
    echo.
    pause
    exit /b 1
)

echo.
echo  ================================
echo  [OK] Installation complete!
echo       Run run.bat to start.
echo  ================================
echo.
pause
