#!/bin/bash

# Q-SYS WebSocket Bridge - Phase 3 Setup Script

echo "🎚️  Q-SYS WebSocket Bridge - Phase 3 Setup"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from Server/node/client/"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Standard install failed. Trying with --legacy-peer-deps..."
    npm install --legacy-peer-deps
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 Starting development server..."
echo ""
echo "Frontend will be available at: http://localhost:5173"
echo "Make sure backend (index-v2.js) is running on port 3000"
echo ""
echo "Default credentials:"
echo "  Username: admin"
echo "  Password: admin"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
