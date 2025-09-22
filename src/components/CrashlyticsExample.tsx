import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCrashlytics } from '@/hooks/use-crashlytics';

const CrashlyticsExample: React.FC = () => {
  const crashlytics = useCrashlytics();

  const handleLogEvent = () => {
    crashlytics.log('User clicked log event button');
  };

  const handleRecordError = () => {
    const error = new Error('Test error for Crashlytics');
    crashlytics.recordError(error);
  };

  const handleSetUserId = () => {
    crashlytics.setUserId('user-123');
  };

  const handleSetAttribute = () => {
    crashlytics.setAttribute('user_type', 'premium');
  };

  const handleTestCrash = () => {
    crashlytics.testCrash();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Crashlytics Test</CardTitle>
        <CardDescription>
          Test Firebase Crashlytics functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleLogEvent} className="w-full">
          Log Event
        </Button>
        <Button onClick={handleRecordError} variant="outline" className="w-full">
          Record Error
        </Button>
        <Button onClick={handleSetUserId} variant="outline" className="w-full">
          Set User ID
        </Button>
        <Button onClick={handleSetAttribute} variant="outline" className="w-full">
          Set Attribute
        </Button>
        <Button onClick={handleTestCrash} variant="destructive" className="w-full">
          Test Crash (Dev Only)
        </Button>
      </CardContent>
    </Card>
  );
};

export default CrashlyticsExample;



