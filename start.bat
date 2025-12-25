@echo off
echo Starting Gobang Game...
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak > nul
echo.
echo Starting Proxy Server...
start "Proxy Server" cmd /k "npm start"
echo.
echo Servers are starting up...
echo Backend: http://localhost:3001
echo Proxy: http://localhost:8080
echo.
pause