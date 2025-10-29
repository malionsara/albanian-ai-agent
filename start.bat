@echo off
echo ========================================
echo Albanian AI Voice Agent - Quick Start
echo ========================================
echo.

REM Check if API key is set
findstr /C:"YOUR_API_KEY_HERE" backend\.env >nul
if %errorlevel% equ 0 (
    echo [ERROR] Please set your Gemini API key first!
    echo.
    echo 1. Get your API key from: https://aistudio.google.com/app/apikey
    echo 2. Edit backend\.env and replace YOUR_API_KEY_HERE with your key
    echo.
    pause
    exit /b 1
)

echo Starting Backend Server...
start "Albanian Agent - Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Widget...
start "Albanian Agent - Widget" cmd /k "cd widget && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo.
echo Backend:  http://localhost:3001
echo Widget:   http://localhost:5173
echo.
echo Open http://localhost:5173 in your browser
echo ========================================
