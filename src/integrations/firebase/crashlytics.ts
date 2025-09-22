import { getApps } from "firebase/app";
import { app } from "./client";

// Note: Firebase Crashlytics is not available for web
// This service provides a web-compatible interface that will work
// when the app is built for mobile platforms via Capacitor

// Helper functions for common Crashlytics operations
export const crashlyticsService = {
  // Log custom events
  log: (message: string) => {
    if (typeof window !== 'undefined') {
      console.log(`[Crashlytics] ${message}`);
      // In a mobile build, this would connect to the native Crashlytics SDK
    }
  },

  // Set user identifier
  setUserId: (userId: string) => {
    if (typeof window !== 'undefined') {
      console.log(`[Crashlytics] User ID set: ${userId}`);
      // In a mobile build, this would set the user ID in Crashlytics
    }
  },

  // Set custom attributes
  setAttribute: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      console.log(`[Crashlytics] Attribute set: ${key} = ${value}`);
      // In a mobile build, this would set custom attributes in Crashlytics
    }
  },

  // Record errors
  recordError: (error: Error) => {
    if (typeof window !== 'undefined') {
      console.error(`[Crashlytics] Error recorded:`, error);
      // In a mobile build, this would send the error to Crashlytics
    }
  },

  // Test crash (for testing purposes only)
  testCrash: () => {
    if (typeof window !== 'undefined') {
      console.warn('[Crashlytics] Test crash triggered - this should only be used in development');
      // In a mobile build, this would trigger a test crash
    }
  }
};

export default crashlyticsService;
