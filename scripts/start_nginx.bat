@echo off
cd /d "D:\nginx-1.29.3\nginx-1.29.3"
tasklist /FI "IMAGENAME eq nginx.exe" | find /I "nginx.exe" >nul
if errorlevel 1 (
    start "nginx" nginx.exe
)
