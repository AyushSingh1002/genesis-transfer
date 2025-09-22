import React from 'react';
import { useCrashlytics } from '@/hooks/use-crashlytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info, Bug } from 'lucide-react';

const CrashlyticsTest: React.FC = () => {
  const crashlytics = useCrashlytics();

  const handleLogEvent = () => {
    crashlytics.log('Test event logged from CrashlyticsTest page');
  };

  const handleRecordError = () => {
    const error = new Error('Test error for Crashlytics - this is intentional');
    crashlytics.recordError(error);
  };

  const handleSetUserId = () => {
    crashlytics.setUserId('test-user-123');
  };

  const handleSetAttribute = () => {
    crashlytics.setAttribute('test_attribute', 'test_value');
  };

  const handleTestCrash = () => {
    crashlytics.testCrash();
  };

  const handleTriggerError = () => {
    // This will trigger the Error Boundary
    throw new Error('Intentional error to test Error Boundary');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Crashlytics Test Page</h1>
          <p className="text-muted-foreground">
            Test Firebase Crashlytics functionality
          </p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This page allows you to test Crashlytics functionality. Check your browser console for logs.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Logging */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Basic Logging
              </CardTitle>
              <CardDescription>
                Test basic event logging functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleLogEvent} className="w-full">
                Log Test Event
              </Button>
              <Badge variant="outline">Check console for logs</Badge>
            </CardContent>
          </Card>

          {/* Error Recording */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Error Recording
              </CardTitle>
              <CardDescription>
                Test error recording and reporting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleRecordError} variant="outline" className="w-full">
                Record Test Error
              </Button>
              <Badge variant="outline">Error will be logged to console</Badge>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                User Management
              </CardTitle>
              <CardDescription>
                Test user ID and attribute setting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleSetUserId} variant="outline" className="w-full">
                Set User ID
              </Button>
              <Button onClick={handleSetAttribute} variant="outline" className="w-full">
                Set Attribute
              </Button>
              <Badge variant="outline">User data will be logged</Badge>
            </CardContent>
          </Card>

          {/* Test Functions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-red-500" />
                Test Functions
              </CardTitle>
              <CardDescription>
                Test crash functionality and error boundaries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleTestCrash} variant="outline" className="w-full">
                Test Crash Function
              </Button>
              <Button onClick={handleTriggerError} variant="destructive" className="w-full">
                Trigger Error Boundary
              </Button>
              <Badge variant="destructive">Use with caution</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Status Information */}
        <Card>
          <CardHeader>
            <CardTitle>Crashlytics Status</CardTitle>
            <CardDescription>
              Current status and configuration information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Web Mode</Badge>
                <span className="text-sm text-muted-foreground">
                  Crashlytics is running in web mode (console logging)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Mobile Ready</Badge>
                <span className="text-sm text-muted-foreground">
                  Will connect to Firebase when built for mobile
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Error Boundary</Badge>
                <span className="text-sm text-muted-foreground">
                  React errors are automatically captured
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrashlyticsTest;



