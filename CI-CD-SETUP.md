# CI/CD Android Build Setup Guide

This guide explains how to fix the Capacitor Android build issues in your CI/CD pipeline.

## Problem
The CI/CD build fails with: `No matching variant of project :capacitor-android was found`

## Root Cause
The CI/CD environment doesn't have the Capacitor Android project properly configured because it skips the necessary preparation steps (npm install, build, cap sync).

## Solutions (Choose One)

### Option 1: Add preparation step to CI/CD (Recommended)
Add this step **before** your gradlew command in your CI/CD pipeline:
```bash
./prepare-capacitor.sh
```
Then run your normal gradlew command:
```bash
./gradlew assembleDebug
```

### Option 2: Use the CI-specific wrapper
Replace your current gradlew command in CI/CD with:
```bash
./ci-gradlew assembleDebug
```

### Option 3: Use npm script
Replace your current build command with:
```bash
npm run build:android
```

### Option 4: Manual steps in CI/CD
Add these steps before running gradlew:
```bash
# Install dependencies
npm ci

# Build web application  
npm run build

# Sync Capacitor
npx cap sync android

# Update Capacitor
npx cap update android

# Now build Android
cd android && ./gradlew assembleDebug
```

### Option 5: Use the preparation script
Run the preparation script first:
```bash
./scripts/prepare-android-build.sh
cd android && ./gradlew assembleDebug
```

## Environment Requirements
Your CI/CD environment needs:
- Node.js and npm installed
- Java/JDK configured
- Android SDK (if not using a pre-configured image)

## Expected CI/CD Flow
1. ✅ Checkout code
2. ✅ Install Node.js dependencies (`npm ci`)
3. ✅ Build web application (`npm run build`)  
4. ✅ Sync Capacitor Android (`npx cap sync android`)
5. ✅ Update Capacitor Android (`npx cap update android`)
6. ✅ Build Android APK (`cd android && ./gradlew assembleDebug`)

## Verification
After implementing any solution, you should see in the CI/CD logs:
- "Syncing Capacitor Android..."
- "Updating Capacitor Android..."
- Gradle build proceeding past the dependency resolution phase

## Troubleshooting
If the build still fails:
1. Ensure `node_modules` directory is available in CI/CD
2. Check that `dist` directory is created after web build
3. Verify Capacitor CLI is installed (`@capacitor/cli` in package.json)
4. Ensure all files are committed to git (especially in `android/capacitor-cordova-android-plugins/`)

## Files Modified
- `gradlew` - Auto-detects CI/CD and runs preparation steps
- `gradlew.bat` - Windows version with same functionality  
- `ci-gradlew` - Dedicated CI/CD wrapper script
- `package.json` - Added convenience scripts
- `scripts/prepare-android-build.sh` - Standalone preparation script
- `android/.gitignore` - Includes essential Cordova files
