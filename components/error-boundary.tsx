"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { logError } from "@/lib/api-error-handler";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, "ErrorBoundary");
    if (process.env.NODE_ENV === "development") {
      // Log additional error info in development
      logError(errorInfo, "ErrorBoundary - ErrorInfo");
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطایی رخ داد</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">
                متأسفانه خطایی در سیستم رخ داده است. لطفاً صفحه را رفرش کنید.
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium">
                    جزئیات خطا (فقط در حالت توسعه)
                  </summary>
                  <pre className="mt-2 text-xs overflow-auto bg-muted p-2 rounded">
                    {this.state.error.toString()}
                    {this.state.error.stack && (
                      <div className="mt-2">{this.state.error.stack}</div>
                    )}
                  </pre>
                </details>
              )}
              <Button
                onClick={this.handleReset}
                className="mt-4"
                variant="outline"
              >
                تلاش مجدد
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
