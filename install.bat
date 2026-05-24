@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"
title AF - Lyrics Status v7.0.4 - Installer
color 09

call :setupColors
call :hero "INSTALLER" "Premium setup for Lyrics Status"
call :bar "Booting AF installer"

call :section "SYSTEM CHECK"
node --version >nul 2>nul
if errorlevel 1 (
    call :error "Node.js is not installed."
    echo.
    echo   !AF_DIM!Download Node.js from: https://nodejs.org/en!AF_RESET!
    echo.
    pause
    exit /b 1
)

for /f "tokens=* delims=" %%v in ('node --version 2^>nul') do set "NODE_VERSION=%%v"
call :ok "Node.js detected: !NODE_VERSION!"
call :bar "Scanning project files"

call :section "DEPENDENCIES"
echo   !AF_DIM!Installing project packages...!AF_RESET!
echo   !AF_DIM!This may take a minute depending on your connection.!AF_RESET!
echo.
call :bar "Preparing npm install"

call npm install
if errorlevel 1 (
    echo.
    call :error "Installation failed."
    echo.
    echo   !AF_DIM!Try running this file as Administrator, then run it again.!AF_RESET!
    echo.
    pause
    exit /b 1
)

call :bar "Final polish"
call :success "Installation complete" "Run run.bat to start Lyrics Status."
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
