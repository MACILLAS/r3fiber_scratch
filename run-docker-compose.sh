#!/bin/bash

# Script to run docker-compose with dev configuration
echo "🚀 Starting Docker Compose..."
docker-compose -f docker-compose.yml up -d

if [ $? -eq 0 ]; then
    echo "✅ Docker Compose started successfully"
else
    echo "❌ Docker Compose failed to start"
    echo "Please check the logs above for details"
    exit 1
fi

echo "🌐 Open http://localhost in your browser to view the app"
