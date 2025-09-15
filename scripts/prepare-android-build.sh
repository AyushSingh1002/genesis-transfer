#!/bin/bash
# Prepare Android build for CI/CD
# This script ensures Capacitor Android dependencies are properly set up

set -e

echo "🔧 Preparing Capacitor Android build..."

# Check if we're in the right directory
if [ ! -f "capacitor.config.ts" ]; then
    echo "❌ Error: capacitor.config.ts not found. Are you in the project root?"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm ci
fi

# Build the web app first
echo "🏗️ Building web application..."
npm run build

# Sync Capacitor (this ensures all native dependencies are up to date)
echo "🔄 Syncing Capacitor Android..."
npx cap sync android

# Update Capacitor (this regenerates any missing files)
echo "🔄 Updating Capacitor Android..."
npx cap update android

echo "✅ Android build preparation complete!"
echo "You can now run: cd android && ./gradlew assembleDebug"
