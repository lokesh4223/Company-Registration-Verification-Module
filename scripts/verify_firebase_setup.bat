@echo off
echo === Firebase Setup Verification ===
echo.
echo Running Firebase verification script from backend directory...
echo.

cd ..\backend
node ../scripts/verify_firebase_setup.js

echo.
echo === Script Execution Complete ===
pause