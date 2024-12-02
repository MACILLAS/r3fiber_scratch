#!/bin/bash

# Set image name as a variable
IMAGE_NAME="r3fiber-scratch"

# Start building Docker image
echo "🏗️ Starting Docker image build..."
docker build -t $IMAGE_NAME -f Dockerfile .

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Docker image build successful"
    echo "Image name: $IMAGE_NAME"
else
    echo "❌ Docker image build failed"
    echo "Please check the build logs above for more details"
    exit 1
fi
