@echo off
echo Company Registration Project Startup Script
echo ========================================
echo.

echo Starting backend server...
cd backend
start "Backend Server" cmd /k "node server.js"
cd ..

timeout /t 5 /nobreak >nul

echo Starting frontend development server...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo Project startup initiated!
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:5002/api
echo Firebase Test Page: http://localhost:5173/firebase-test
echo.
echo Press any key to exit...
pause >nul