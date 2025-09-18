# Firebase App Distribution Setup Guide

This guide will help you set up Firebase App Distribution for your Capacitor Android app.

## Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created
- Android app registered in Firebase project

## Setup Steps

### 1. Firebase Authentication

```bash
# Login to Firebase
firebase login

# Initialize Firebase App Distribution
firebase init appdistribution
```

### 2. Configure Firebase Project

1. **Update `.firebaserc`**:
   ```json
   {
     "projects": {
       "default": "your-actual-firebase-project-id"
     }
   }
   ```

2. **Update `firebase.json`**:
   ```json
   {
     "appdistribution": {
       "app": "your-firebase-app-id",
       "groups": {
         "testers": ["tester1@example.com", "tester2@example.com"],
         "internal": ["internal@yourcompany.com"]
       },
       "releaseNotes": {
         "default": "New build available for testing"
       }
     }
   }
   ```

3. **Add `google-services.json`**:
   - Download from Firebase Console → Project Settings → Your Android App
   - Place in `android/app/google-services.json`

### 3. Get Firebase App ID

1. Go to Firebase Console → Project Settings
2. Select your Android app
3. Copy the "App ID" (format: `1:123456789:android:abcdef1234567890abcdef`)

## Usage

### Option 1: Using npm Scripts

```bash
# Build and distribute (Unix/Linux/Mac)
npm run distribute:android

# Build and distribute (Windows)
npm run distribute:android:win

# Using fastlane
npm run distribute:fastlane
```

### Option 2: Using Fastlane

```bash
# Basic distribution
fastlane android distribute

# Distribute to specific testers
fastlane android distribute_to_testers testers:"tester1@example.com,tester2@example.com" release_notes:"Bug fixes and improvements"
```

### Option 3: Manual Firebase CLI

```bash
# Build the app first
npm run build:android

# Distribute manually
firebase appdistribution:distribute android/app/build/outputs/apk/debug/app-debug.apk \
  --app "your-firebase-app-id" \
  --release-notes "Your release notes" \
  --testers "tester1@example.com,tester2@example.com"
```

## Environment Variables

You can set environment variables for automated distribution:

```bash
export RELEASE_NOTES="Automated build from CI/CD"
export TESTERS="tester1@example.com,tester2@example.com"
npm run distribute:fastlane
```

## CI/CD Integration

### GitLab CI Example

```yaml
distribute:
  stage: distribute
  script:
    - npm run build
    - npx cap sync android
    - cd android && ./gradlew assembleDebug
    - firebase appdistribution:distribute app/build/outputs/apk/debug/app-debug.apk
      --app "$FIREBASE_APP_ID"
      --release-notes "$CI_COMMIT_MESSAGE"
      --testers "$TESTER_EMAILS"
  only:
    - develop
    - main
```

### GitHub Actions Example

```yaml
- name: Distribute to Firebase App Distribution
  run: |
    npm run build
    npx cap sync android
    cd android && ./gradlew assembleDebug
    firebase appdistribution:distribute app/build/outputs/apk/debug/app-debug.apk
      --app ${{ secrets.FIREBASE_APP_ID }}
      --release-notes "${{ github.event.head_commit.message }}"
      --testers ${{ secrets.TESTER_EMAILS }}
```

## Tester Management

### Adding Testers

1. **Via Firebase Console**:
   - Go to App Distribution → Testers & Groups
   - Add individual testers or create groups

2. **Via CLI**:
   ```bash
   firebase appdistribution:testers:add tester@example.com
   ```

### Tester Groups

Create groups for different testing phases:

```bash
firebase appdistribution:testers:add tester@example.com --group "beta-testers"
firebase appdistribution:testers:add internal@company.com --group "internal"
```

## Troubleshooting

### Common Issues

1. **"App not found" error**:
   - Verify your Firebase App ID in `firebase.json`
   - Ensure `google-services.json` is in the correct location

2. **"Not authenticated" error**:
   - Run `firebase login` to authenticate
   - Check your Firebase project permissions

3. **"APK not found" error**:
   - Ensure the Android build completed successfully
   - Check the APK path in the script

### Debug Commands

```bash
# Check Firebase authentication
firebase projects:list

# Check Firebase App Distribution setup
firebase appdistribution:testers:list

# Verify app configuration
firebase apps:list
```

## Security Notes

- Never commit `google-services.json` to public repositories
- Use environment variables for sensitive data in CI/CD
- Regularly rotate Firebase service account keys
- Limit tester access to necessary groups only

## Next Steps

1. Set up your Firebase project and get the App ID
2. Configure the `firebase.json` and `.firebaserc` files
3. Add your `google-services.json` file
4. Test the distribution with a small group of testers
5. Integrate with your CI/CD pipeline for automated distribution
