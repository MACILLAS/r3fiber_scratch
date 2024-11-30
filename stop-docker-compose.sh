#!/bin/bash

# Script to stop docker-compose services
echo "🛑 Stopping Docker Compose services..."
docker-compose -f docker-compose.yml stop

if [ $? -eq 0 ]; then
    echo "✅ Docker Compose services stopped successfully"
else
    echo "❌ Failed to stop Docker Compose services"
    echo "Please check the logs above for details"
    exit 1
fi
