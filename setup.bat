@echo off
REM Backend and Frontend Quick Start Script for Windows

echo ================================
echo IPT Final Project - Quick Start
echo ================================
echo.

REM Check if in project root
if not exist "back-end" (
    echo Error: back-end folder not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "front-end" (
    echo Error: front-end folder not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

echo Setting up Backend...
echo -------------------
cd back-end

REM Check if vendor folder exists
if not exist "vendor" (
    echo Installing Composer dependencies...
    call composer install
) else (
    echo Composer dependencies already installed
)

REM Check if .env exists
if not exist ".env" (
    echo Creating .env from .env.example...
    copy .env.example .env
)

REM Generate app key
echo Generating application key...
call php artisan key:generate

REM Create database
echo Setting up database...
if not exist "database\database.sqlite" (
    type nul > database\database.sqlite
)

REM Run migrations
echo Running migrations...
call php artisan migrate:fresh --seed

echo.
echo Setting up Frontend...
echo --------------------
cd ..\front-end

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
) else (
    echo npm dependencies already installed
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo Creating .env.local...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ) > .env.local
)

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo To start the development servers, open two command prompts:
echo.
echo Command Prompt 1 (Backend):
echo   cd back-end
echo   php artisan serve
echo.
echo Command Prompt 2 (Frontend):
echo   cd front-end
echo   npm run dev
echo.
echo Then visit: http://localhost:3000
echo.
pause
