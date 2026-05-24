@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"
title AF - Lyrics Status v7.0.4
color 09

call :setupColors

:start
call :hero "LAUNCHER" "Smooth startup console"
call :bar "Waking up AF"

call :section "PRE-FLIGHT CHECK"
node --version >nul 2>nul
if errorlevel 1 (
    call :error "Node.js was not found."
    echo.
    echo   !AF_DIM!Run install.bat first, or install Node.js from: https://nodejs.org/en!AF_RESET!
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    call :error "Dependencies are missing."
    echo.
    echo   !AF_DIM!Run install.bat first.!AF_RESET!
    echo.
    pause
    exit /b 1
)

for /f "tokens=* delims=" %%v in ('node --version 2^>nul') do set "NODE_VERSION=%%v"
call :ok "Node.js ready: !NODE_VERSION!"
call :ok "Dependencies ready"
call :bar "Loading dashboard"

call :section "STARTUP"
echo      !AF_DIM!Local URL: http://localhost:8999!AF_RESET!
echo      !AF_DIM!Press Ctrl+C to stop the app.!AF_RESET!
echo.
call :bar "Opening browser"
start "" "http://localhost:8999"

echo.
echo      !AF_ACCENT!╔══════════════════════════════════════════════════════════════╗!AF_RESET!
echo      !AF_ACCENT!║  AF server is starting... keep this window open.             ║!AF_RESET!
echo      !AF_ACCENT!╚══════════════════════════════════════════════════════════════╝!AF_RESET!
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
echo      !AF_ACCENT!╔══════════════════════════════════════════════════════════════╗!AF_RESET!
echo      !AF_ACCENT!║  App stopped.                                                ║!AF_RESET!
echo      !AF_ACCENT!╚══════════════════════════════════════════════════════════════╝!AF_RESET!
echo.
pause
exit /b 0

:setupColors
for /f "delims=" %%a in ('powershell -NoProfile -Command "[char]27" 2^>nul') do set "ESC=%%a"
set "AF_ACCENT=!ESC![38;2;146;152;255m"
set "AF_DIM=!ESC![38;2;185;188;255m"
set "AF_SOFT=!ESC![38;2;120;126;220m"
set "AF_OK=!ESC![38;2;146;255;205m"
set "AF_ERR=!ESC![38;2;255;120;150m"
set "AF_RESET=!ESC![0m"
exit /b

:hero
cls
echo.
if /I "%~1"=="INSTALLER" goto hero_installer
goto hero_launcher

:hero_installer
echo      !AF_ACCENT!╔══════════════════════════════════════════════════════════════╗!AF_RESET!
echo      !AF_ACCENT!║                                                              ║!AF_RESET!
echo      !AF_ACCENT!║        █████╗  ███████╗                                      ║!AF_RESET!
echo      !AF_ACCENT!║       ██╔══██╗ ██╔════╝                                      ║!AF_RESET!
echo      !AF_ACCENT!║       ███████║ █████╗        LYRICS STATUS                   ║!AF_RESET!
echo      !AF_ACCENT!║       ██╔══██║ ██╔══╝        v7.0.4                          ║!AF_RESET!
echo      !AF_ACCENT!║       ██║  ██║ ██║           INSTALLER                       ║!AF_RESET!
echo      !AF_ACCENT!║       ╚═╝  ╚═╝ ╚═╝                                           ║!AF_RESET!
echo      !AF_ACCENT!║                                                              ║!AF_RESET!
echo      !AF_ACCENT!║               Premium setup for Lyrics Status                ║!AF_RESET!
echo      !AF_ACCENT!║      GitHub:  https://github.com/bkiaf/Lyrics-Status-af      ║!AF_RESET!
echo      !AF_ACCENT!║            Profile: https://guns.lol/boykisseraf             ║!AF_RESET!
echo      !AF_ACCENT!║                                                              ║!AF_RESET!
echo      !AF_ACCENT!╚══════════════════════════════════════════════════════════════╝!AF_RESET!
echo.
exit /b

:hero_launcher
echo      !AF_ACCENT!╔══════════════════════════════════════════════════════════════╗!AF_RESET!
echo      !AF_ACCENT!║                                                              ║!AF_RESET!
echo      !AF_ACCENT!║        █████╗  ███████╗                                      ║!AF_RESET!
echo      !AF_ACCENT!║       ██╔══██╗ ██╔════╝                                      ║!AF_RESET!
echo      !AF_ACCENT!║       ███████║ █████╗        LYRICS STATUS                   ║!AF_RESET!
echo      !AF_ACCENT!║       ██╔══██║ ██╔══╝        v7.0.4                          ║!AF_RESET!
echo      !AF_ACCENT!║       ██║  ██║ ██║           LAUNCHER                        ║!AF_RESET!
echo      !AF_ACCENT!║       ╚═╝  ╚═╝ ╚═╝                                           ║!AF_RESET!
echo      !AF_ACCENT!║                                                              ║!AF_RESET!
echo      !AF_ACCENT!║                    Smooth startup console                    ║!AF_RESET!
echo      !AF_ACCENT!║      GitHub:  https://github.com/bkiaf/Lyrics-Status-af      ║!AF_RESET!
echo      !AF_ACCENT!║            Profile: https://guns.lol/boykisseraf             ║!AF_RESET!
echo      !AF_ACCENT!║                                                              ║!AF_RESET!
echo      !AF_ACCENT!╚══════════════════════════════════════════════════════════════╝!AF_RESET!
echo.
exit /b

:section
echo.
echo      !AF_ACCENT!── %~1 ─────────────────────────────────────────────!AF_RESET!
echo.
exit /b

:ok
echo      !AF_OK![ OK ]!AF_RESET! !AF_DIM!%~1!AF_RESET!
exit /b

:error
echo      !AF_ERR![ !! ]!AF_RESET! !AF_DIM!%~1!AF_RESET!
exit /b

:success
echo.
echo      !AF_ACCENT!╔══════════════════════════════════════════════════════════════╗!AF_RESET!
echo      !AF_ACCENT!║  ✓ %~1!AF_RESET!
echo      !AF_ACCENT!║  %~2!AF_RESET!
echo      !AF_ACCENT!╚══════════════════════════════════════════════════════════════╝!AF_RESET!
echo.
exit /b

:bar
set "AF_BAR_LABEL=%~1"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$label=$env:AF_BAR_LABEL; $w=28; $esc=[char]27; $a=$esc+'[38;2;146;152;255m'; $d=$esc+'[38;2;120;126;220m'; $r=$esc+'[0m'; Write-Host ('     ' + $label + '  ') -NoNewline; Write-Host ($d+'['+$r) -NoNewline; for($i=1;$i -le $w;$i++){ Write-Host ($a+'█'+$r) -NoNewline; Start-Sleep -Milliseconds 18 }; Write-Host ($d+'] '+$a+'100%%'+$r)" 2>nul
if errorlevel 1 echo      !AF_DIM!%~1  [!AF_ACCENT!████████████████████████████!AF_DIM!] !AF_ACCENT!100%%!AF_RESET!
set "AF_BAR_LABEL="
exit /b
