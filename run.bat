@echo off
title UniVerse GEU
color 0A

echo.
echo  =====================================================
echo   UniVerse GEU - Campus Event Management System
echo   Team ByteForge - FS-VI-T154 - Graphic Era Uni
echo  =====================================================
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not installed!
    echo  Download from https://nodejs.org and re-run.
    pause & exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do echo  [OK] Node.js %%v

:: Install server packages
if not exist "%~dp0server\node_modules" (
    echo.
    echo  Installing server packages...
    cd /d "%~dp0server"
    npm install
    if %errorlevel% neq 0 ( echo  [ERROR] Server install failed & pause & exit /b 1 )
    echo  [OK] Server packages installed
)

:: Install client packages
if not exist "%~dp0client\node_modules" (
    echo.
    echo  Installing client packages (this takes ~2 min first time)...
    cd /d "%~dp0client"
    npm install
    if %errorlevel% neq 0 ( echo  [ERROR] Client install failed & pause & exit /b 1 )
    echo  [OK] Client packages installed
)

:: Copy .env if missing
if not exist "%~dp0server\.env" (
    copy "%~dp0server\.env.example" "%~dp0server\.env" >nul
    echo  [OK] .env created from template
)

:: Seed DB on first run
if not exist "%~dp0server\.seeded" (
    echo.
    echo  Seeding database with sample GEU data...
    cd /d "%~dp0server"
    npm run seed
    echo. > "%~dp0server\.seeded"
    echo  [OK] Database seeded
)

:: Start backend
echo.
echo  Starting backend...
start cmd /k "title UniVerse Backend && color 0B && cd /d %~dp0server && npm run dev"

:: Wait for backend
timeout /t 5 /nobreak >nul

:: Start frontend
echo  Starting frontend...
start cmd /k "title UniVerse Frontend && color 0E && cd /d %~dp0client && npm start"

echo.
echo  =====================================================
echo   Both servers are starting up!
echo.
echo   Frontend  ->  http://localhost:3000
echo   Backend   ->  http://localhost:5000/api/health
echo.
echo   Demo credentials:
echo   Student   : dhruv@geu.ac.in    / student123
echo   Organizer : sharma@geu.ac.in   / organizer123
echo   Admin     : admin@geu.ac.in    / admin123
echo  =====================================================
echo.
echo  To re-seed the DB: delete server\.seeded then run again
echo.
pause
