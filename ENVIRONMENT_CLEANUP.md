# Frontend Environment Variables Cleanup

## 🧹 **Variables You Can Remove from .env**

Since all read/write operations now go through the backend API, you can remove these Firebase Admin SDK variables:

### ❌ **Remove These (No Longer Needed):**

```env
# Firebase Admin SDK variables (backend handles these)
FIREBASE_PROJECT_ID=cohub-help-desk-b2a66
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@cohub-help-desk-b2a66.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Any other Firebase Admin SDK variables
FIREBASE_DATABASE_URL=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_AUTH_DOMAIN=...
```

### ✅ **Keep These (Still Needed):**

```env
# REQUIRED - Backend API URL
VITE_API_URL=https://coliv-manager-backend-320654568265.asia-south1.run.app/api

# OPTIONAL - Firebase Client SDK (for authentication only)
VITE_FIREBASE_API_KEY=AIzaSyBxxn3DysMJJ49U-fPE6nrleoUmIhoAEac
VITE_FIREBASE_AUTH_DOMAIN=cohub-help-desk-b2a66.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cohub-help-desk-b2a66
VITE_FIREBASE_STORAGE_BUCKET=cohub-help-desk-b2a66.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=587592082463
VITE_FIREBASE_APP_ID=1:587592082463:android:f9c907b1a4b1710fb5e12a

# OPTIONAL - Payment Integration
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id

# OPTIONAL - AI Integration
VITE_GEMINI_API_KEY=your-gemini-api-key
```

---

## 📋 **What Changed:**

### **Before (Direct Firebase):**
- Frontend directly connected to Firebase
- Required Firebase Admin SDK credentials
- Data operations in frontend components

### **After (Backend API):**
- Frontend calls backend API
- Backend handles Firebase operations
- Frontend only needs API URL

---

## 🔧 **Updated .env File:**

Create a new `.env` file in `genesis-transfer/` with:

```env
# Backend API URL (MOST IMPORTANT)
VITE_API_URL=https://coliv-manager-backend-320654568265.asia-south1.run.app/api

# Firebase Client SDK (for authentication only)
VITE_FIREBASE_API_KEY=AIzaSyBxxn3DysMJJ49U-fPE6nrleoUmIhoAEac
VITE_FIREBASE_AUTH_DOMAIN=cohub-help-desk-b2a66.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cohub-help-desk-b2a66
VITE_FIREBASE_STORAGE_BUCKET=cohub-help-desk-b2a66.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=587592082463
VITE_FIREBASE_APP_ID=1:587592082463:android:f9c907b1a4b1710fb5e12a

# Optional integrations
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
VITE_GEMINI_API_KEY=your-gemini-api-key
```

---

## 🎯 **Key Points:**

1. **VITE_API_URL** is the most important variable - this points to your backend
2. **Firebase Client SDK** variables are kept for authentication
3. **Firebase Admin SDK** variables are removed (backend handles these)
4. **Payment/AI** variables are optional based on your features

---

## 🚀 **Next Steps:**

1. **Update your `.env` file** with the new variables
2. **Remove Firebase Admin SDK variables**
3. **Set VITE_API_URL to your Cloud Run URL**
4. **Test the frontend** - it should now use the backend API

---

## 🔍 **How to Verify:**

1. **Check Network Tab** - All API calls should go to your backend URL
2. **No Firebase Direct Calls** - Should only see backend API calls
3. **Authentication Works** - Login should still work via Firebase Auth
4. **Data Operations Work** - CRUD operations should work through backend

---

**Your frontend is now properly configured to use the backend API!** 🎉
