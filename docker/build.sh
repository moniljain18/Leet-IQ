#!/bin/bash

echo "🐳 Building Docker images for LeetIQ Code Runner..."
echo ""

echo "📦 Building JavaScript image..."
docker build -f Dockerfile.javascript -t leetiq-javascript:latest .
echo "✅ JavaScript image built!"
echo ""

echo "📦 Building Python image..."
docker build -f Dockerfile.python -t leetiq-python:latest .
echo "✅ Python image built!"
echo ""

echo "📦 Building Java image..."
docker build -f Dockerfile.java -t leetiq-java:latest .
echo "✅ Java image built!"
echo ""

echo "🎉 All Docker images built successfully!"
echo ""
echo "Verify with: docker images | grep leetiq"