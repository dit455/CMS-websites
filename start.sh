#!/bin/bash

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  Starting DIT Portal..."
echo "  Backend  →  http://localhost:8000"
echo "  Frontend →  http://localhost:5173"
echo "  Admin    →  http://localhost:8000/admin"
echo ""
echo "  Press Ctrl+C to stop both servers."
echo ""

# Start Django backend
cd "$ROOT/cms/dit_backend"
python manage.py runserver &
BACKEND_PID=$!

# Start React frontend
cd "$ROOT/react"
npm run dev &
FRONTEND_PID=$!

# Kill both on Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
