#!/bin/bash

echo "🚀 NexusChat Firebase Deployment Script"
echo "========================================"
echo ""

# Check if firebase-tools is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if .firebaserc is configured
if grep -q "your-project-id" .firebaserc; then
    echo "⚠️  Please configure your Firebase project ID in .firebaserc"
    echo "   Edit .firebaserc and replace 'your-project-id' with your actual project ID"
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Check if user is logged in
echo "🔐 Checking Firebase authentication..."
firebase projects:list &> /dev/null

if [ $? -ne 0 ]; then
    echo "Please login to Firebase:"
    firebase login
fi

# Deploy
echo ""
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live!"
else
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi
