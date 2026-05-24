@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"
title AF - Lyrics Status v7.0.3
color 0D

:start
call :hero "LAUNCHER" "Smooth startup console"
call :bar "Waking up AF"

call :section "PRE-FLIGHT CHECK"
node --version >nul 2>nul
if errorlevel 1 (
    call :error "Node.js was not found."
    echo.
    echo   Run install.bat first, or install Node.js from: https://nodejs.org/en
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    call :error "Dependencies are missing."
    echo.
    echo   Run install.bat first.
    echo.
    pause
    exit /b 1
)

for /f "tokens=* delims=" %%v in ('node --version 2^>nul') do set "NODE_VERSION=%%v"
call :ok "Node.js ready: !NODE_VERSION!"
call :ok "Dependencies ready"
call :bar "Loading dashboard"

call :section "STARTUP"
echo      Local URL: http://localhost:8999
echo      Press Ctrl+C to stop the app.
echo.
call :bar "Opening browser"
start "" "http://localhost:8999"

echo.
echo      ╔══════════════════════════════════════════════════════════════╗
echo      ║  AF server is starting... keep this window open.             ║
echo      ╚══════════════════════════════════════════════════════════════╝
echo.

npm run start
set "EXIT_CODE=%errorlevel%"

if "%EXIT_CODE%" == "2" (
    echo.
    call :success "Update applied" "Restarting Lyrics Status with the new files."
    call :bar "Restarting"
    goto start
)

echo.
echo      ╔══════════════════════════════════════════════════════════════╗
echo      ║  App stopped.                                                ║
echo      ╚══════════════════════════════════════════════════════════════╝
echo.
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
