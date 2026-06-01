@echo off
echo.
echo   Stopping any existing servers...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":8000 " ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5173 " ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5174 " ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo   Starting DIT Portal...
echo   Backend  -^>  http://localhost:8000
echo   Frontend -^>  http://localhost:5173
echo   Admin    -^>  http://localhost:8000/admin
echo.
echo   Close the opened windows to stop the servers.
echo.

start "DIT Backend"  cmd /k "cd /d %~dp0cms\dit_backend && python manage.py runserver"
start "DIT Frontend" cmd /k "cd /d %~dp0react && npm run dev"
