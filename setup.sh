#!/bin/bash

# Backend and Frontend Quick Start Script

echo "================================"
echo "IPT Final Project - Quick Start"
echo "================================"
echo ""

# Check if in project root
if [ ! -d "back-end" ] || [ ! -d "front-end" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

echo "Setting up Backend..."
echo "-------------------"
cd back-end

# Check if vendor folder exists
if [ ! -d "vendor" ]; then
    echo "Installing Composer dependencies..."
    composer install
else
    echo "Composer dependencies already installed"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# Generate app key if not set
if grep -q "APP_KEY=$" .env; then
    echo "Generating application key..."
    php artisan key:generate
fi

# Create database
echo "Setting up database..."
touch database/database.sqlite 2>/dev/null || true

# Run migrations
echo "Running migrations..."
php artisan migrate:fresh --seed

echo ""
echo "Setting up Frontend..."
echo "--------------------"
cd ../front-end

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
else
    echo "npm dependencies already installed"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000/api
EOF
fi

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "To start the development servers, open two terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd back-end"
echo "  php artisan serve"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd front-end"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
