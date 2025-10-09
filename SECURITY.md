# Security Guide

## 🔐 Leaked API Key - Action Required

### Current Status
A Google API Key was detected in your repository's git history. Even though the file has been removed from tracking, the key still exists in previous commits.

### Immediate Actions Required:

#### 1. **Revoke the Leaked API Key** ⚠️
The exposed key from the alert:
```
AIzaSyANmQzVlUfIpXvqpuFKDwJUIAO31wbFBnI
```

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `cohub-help-desk-b2a66`
3. Navigate to **APIs & Services** → **Credentials**
4. Find and **DELETE** or **RESTRICT** the exposed API key
5. Generate a new API key with proper restrictions

#### 2. **Rotate Current API Key** (If it was committed)
If the current key in your local file was also committed at any point:
```
AIzaSyBxxn3DysMJJ49U-fPE6nrleoUmIhoAEac
```
You should also rotate this key following the same steps above.

#### 3. **Download Fresh google-services.json**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `cohub-help-desk-b2a66`
3. Go to **Project Settings** → **Your apps**
4. Download a fresh `google-services.json` file with the new API key
5. Replace your local `android/app/google-services.json` with this new file

#### 4. **Apply API Key Restrictions** 🔒
In Google Cloud Console, restrict your API keys:
- **Application restrictions**: Android apps
- **API restrictions**: Only enable APIs you actually use
- Add your app's package name: `com.coliv.manager`
- Add your app's SHA-1 certificate fingerprint

#### 5. **Remove from Git History** (Optional but Recommended)
To completely remove the sensitive data from git history:

```bash
# Using git filter-repo (recommended)
pip install git-filter-repo
git filter-repo --path android/app/google-services.json --invert-paths

# OR using BFG Repo-Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files google-services.json
```

⚠️ **Warning**: This rewrites git history. Coordinate with your team before doing this.

#### 6. **Force Push** (Only if you cleaned history)
```bash
git push --force --all
```

#### 7. **Close the GitHub Alert**
Once you've completed the above steps:
1. Go to your repository's Security tab
2. Find the secret scanning alert
3. Mark it as "Revoked" and close it

---

## 🛡️ Prevention Measures

### Files Already Protected (in .gitignore):
- `android/app/google-services.json`
- `ios/App/GoogleService-Info.plist`
- `.env` files

### Best Practices:
1. ✅ Never commit API keys or secrets to version control
2. ✅ Use environment variables for sensitive data
3. ✅ Review `.gitignore` before first commit
4. ✅ Use secret scanning tools (GitHub has this built-in)
5. ✅ Apply API restrictions in Google Cloud Console
6. ✅ Rotate keys regularly
7. ✅ Use separate Firebase projects for dev/staging/production

### Team Onboarding:
New team members should:
1. Request the `google-services.json` file from the team lead (via secure channel)
2. Place it in `android/app/google-services.json`
3. Never commit this file

---

## 📋 Checklist

- [ ] Revoked the leaked API key in Google Cloud Console
- [ ] Downloaded fresh `google-services.json` from Firebase Console
- [ ] Applied API restrictions in Google Cloud Console
- [ ] Verified `.gitignore` includes sensitive files
- [ ] Removed file from git tracking (`git rm --cached`)
- [ ] (Optional) Cleaned git history
- [ ] Closed GitHub security alert as "Revoked"
- [ ] Informed team members of the change

---

## 🚨 If You Suspect Unauthorized Access

1. Check Google Cloud Console audit logs
2. Review Firebase Authentication logs
3. Check for unusual Firebase usage/billing
4. Rotate ALL credentials immediately
5. Enable 2FA on all accounts
6. Consider creating a new Firebase project if breach is confirmed

---

## 📞 Resources

- [Google API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

