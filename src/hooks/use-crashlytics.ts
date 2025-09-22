import { useEffect } from 'react';
import { crashlyticsService } from '../integrations/firebase/crashlytics';

export const useCrashlytics = () => {
  // Initialize Crashlytics when the hook is used
  useEffect(() => {
    crashlyticsService.log('Crashlytics initialized');
  }, []);

  return {
    log: crashlyticsService.log,
    setUserId: crashlyticsService.setUserId,
    setAttribute: crashlyticsService.setAttribute,
    recordError: crashlyticsService.recordError,
    testCrash: crashlyticsService.testCrash,
  };
};

export default useCrashlytics;



