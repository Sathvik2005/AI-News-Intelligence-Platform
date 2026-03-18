@echo off
setlocal

set ROOT=%~dp0..
set BACKEND=%ROOT%\backend
set FRONTEND=%ROOT%\frontend

echo Starting backend on http://127.0.0.1:8000
start "AI News Backend" cmd /k "cd /d "%BACKEND%" && .venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

timeout /t 4 /nobreak > nul

echo Starting frontend on http://127.0.0.1:3000
start "AI News Frontend" cmd /k "cd /d "%FRONTEND%" && npm run dev"

timeout /t 4 /nobreak > nul

echo Triggering refresh...
curl -X POST http://127.0.0.1:8000/api/v1/news/refresh

echo.
echo Demo started.
echo Backend:  http://127.0.0.1:8000/docs
echo Frontend: http://127.0.0.1:3000
endlocal
