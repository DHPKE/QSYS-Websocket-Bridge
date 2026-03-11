#!/bin/bash

# Q-SYS WebSocket Bridge - Complete Setup Script
# Runs both backend (Phase 2) and frontend (Phase 3)

set -e

echo "🎚️  Q-SYS WebSocket Bridge - Complete Setup"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "index-v2.js" ]; then
    echo "❌ Error: index-v2.js not found!"
    echo "Please run this script from Server/node/"
    exit 1
fi

# Backend setup
echo "📦 Setting up backend..."
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "✓ Backend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env and set a strong JWT_SECRET!"
fi

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd client

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Trying with --legacy-peer-deps..."
        npm install --legacy-peer-deps
    fi
else
    echo "✓ Frontend dependencies already installed"
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting servers..."
echo ""
echo "Backend will run on:  http://localhost:3000"
echo "Frontend will run on: http://localhost:5173"
echo ""
echo "Default credentials:"
echo "  Username: admin"
echo "  Password: admin"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start backend in background
node index-v2.js &
BACKEND_PID=$!

# Give backend time to start
sleep 2

# Start frontend in foreground
cd client
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT
