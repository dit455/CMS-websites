@echo off
setlocal enabledelayedexpansion

echo.
echo   Stopping any existing servers...

rem ── Kill backend ──────────────────────────────────────────────────────────
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":8000 " ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

rem ── Kill every frontend port listed in sites.conf ─────────────────────────
for /f "usebackq tokens=1* delims=:" %%A in (`findstr /r /v "^#" "%~dp0sites.conf"`) do (
    if not "%%A"=="" (
        for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr ":%%A " ^| findstr "LISTENING"') do taskkill /F /PID %%p >nul 2>&1
    )
)

rem ── Detect this machine's LAN IP dynamically (no hardcoded IP) ────────────
for /f "delims=" %%I in ('%~dp0.venv\Scripts\python.exe "%~dp0scripts\get_local_ip.py" 2^>nul') do set LOCAL_IP=%%I
if "%LOCAL_IP%"=="" set LOCAL_IP=127.0.0.1

rem ── Start Django backend — binds to all interfaces (localhost + LAN IP) ──
start "DIT Backend" cmd /k "cd /d %~dp0cms\dit_backend && %~dp0.venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000"

rem ── Start every frontend listed in sites.conf ─────────────────────────────
for /f "usebackq tokens=1* delims=:" %%A in (`findstr /r /v "^#" "%~dp0sites.conf"`) do (
    if not "%%A"=="" (
        if "%%B"=="" (
            start "Site %%A" cmd /k "cd /d %~dp0template-one && npm run dev -- --port %%A"
        ) else (
            start "Site %%A" cmd /k "cd /d %~dp0%%B && npm run dev -- --port %%A"
        )
    )
)

rem ── Wait for servers to be ready then show all site URLs ──────────────────
echo.
echo   Starting servers, please wait...
ping -n 6 127.0.0.1 >nul

echo.
echo   ============================================================
echo   ADMIN PANEL  -^>  http://%LOCAL_IP%:8000/admin
echo   ============================================================
echo.
echo   YOUR SITES:
echo.

rem Show site list from Django
"%~dp0.venv\Scripts\python.exe" "%~dp0scripts\show_site_urls.py"

echo.
echo   ============================================================
echo   Add new sites at: http://%LOCAL_IP%:8000/admin
echo   Close this window to keep servers running in background.
echo   ============================================================
echo.
pause
