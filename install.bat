@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"
title AF - Lyrics Status v7.0.3 - Installer
color 0D

call :hero "INSTALLER" "Premium setup for Lyrics Status"
call :bar "Booting AF installer"

call :section "SYSTEM CHECK"
node --version >nul 2>nul
if errorlevel 1 (
    call :error "Node.js is not installed."
    echo.
    echo   Download Node.js from: https://nodejs.org/en
    echo.
    pause
    exit /b 1
)

for /f "tokens=* delims=" %%v in ('node --version 2^>nul') do set "NODE_VERSION=%%v"
call :ok "Node.js detected: !NODE_VERSION!"
call :bar "Scanning project files"

call :section "DEPENDENCIES"
echo   Installing project packages...
echo   This may take a minute depending on your connection.
echo.
call :bar "Preparing npm install"

call npm install
if errorlevel 1 (
    echo.
    call :error "Installation failed."
    echo.
    echo   Try running this file as Administrator, then run it again.
    echo.
    pause
    exit /b 1
)

call :bar "Final polish"
call :success "Installation complete" "Run run.bat to start Lyrics Status."
pause
exit /b 0

:hero
cls
echo.
if /I "%~1"=="INSTALLER" goto hero_installer
goto hero_launcher

:hero_installer
echo      ╔══════════════════════════════════════════════════════════════╗
echo      ║                                                              ║
echo      ║        █████╗  ███████╗                                      ║
echo      ║       ██╔══██╗ ██╔════╝                                      ║
echo      ║       ███████║ █████╗        LYRICS STATUS                   ║
echo      ║       ██╔══██║ ██╔══╝        v7.0.3                          ║
echo      ║       ██║  ██║ ██║           INSTALLER                       ║
echo      ║       ╚═╝  ╚═╝ ╚═╝                                           ║
echo      ║                                                              ║
echo      ║               Premium setup for Lyrics Status                ║
echo      ║      GitHub:  https://github.com/bkiaf/Lyrics-Status-af      ║
echo      ║            Profile: https://guns.lol/boykisseraf             ║
echo      ║                                                              ║
echo      ╚══════════════════════════════════════════════════════════════╝
echo.
exit /b

:hero_launcher
echo      ╔══════════════════════════════════════════════════════════════╗
echo      ║                                                              ║
echo      ║        █████╗  ███████╗                                      ║
echo      ║       ██╔══██╗ ██╔════╝                                      ║
echo      ║       ███████║ █████╗        LYRICS STATUS                   ║
echo      ║       ██╔══██║ ██╔══╝        v7.0.3                          ║
echo      ║       ██║  ██║ ██║           LAUNCHER                        ║
echo      ║       ╚═╝  ╚═╝ ╚═╝                                           ║
echo      ║                                                              ║
echo      ║                    Smooth startup console                    ║
echo      ║      GitHub:  https://github.com/bkiaf/Lyrics-Status-af      ║
echo      ║            Profile: https://guns.lol/boykisseraf             ║
echo      ║                                                              ║
echo      ╚══════════════════════════════════════════════════════════════╝
echo.
exit /b

:section
echo.
echo      ── %~1 ─────────────────────────────────────────────
echo.
exit /b

:ok
echo      [ OK ] %~1
exit /b

:error
echo      [ !! ] %~1
exit /b

:success
echo.
echo      ╔══════════════════════════════════════════════════════════════╗
echo      ║  ✓ %~1
echo      ║  %~2
echo      ╚══════════════════════════════════════════════════════════════╝
echo.
exit /b

:bar
set "AF_BAR_LABEL=%~1"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$label=$env:AF_BAR_LABEL; $w=28; Write-Host ('     ' + $label + '  ') -NoNewline -ForegroundColor Gray; Write-Host '[' -NoNewline -ForegroundColor DarkGray; for($i=1;$i -le $w;$i++){ Write-Host '█' -NoNewline -ForegroundColor Magenta; Start-Sleep -Milliseconds 18 }; Write-Host '] 100%%' -ForegroundColor Cyan" 2>nul
if errorlevel 1 echo      %~1  [████████████████████████████] 100%%
set "AF_BAR_LABEL="
exit /b
