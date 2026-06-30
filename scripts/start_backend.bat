@echo off
set ROOT=D:\Static Sites\CMS-websites
cd /d "%ROOT%\cms\dit_backend"
set DJANGO_SETTINGS_MODULE=config.settings
set PYTHONPATH=%ROOT%\cms\dit_backend
start "DIT Backend (waitress)" "%ROOT%\.venv\Scripts\python.exe" -m waitress --host=0.0.0.0 --port=8000 --threads=8 config.wsgi:application
