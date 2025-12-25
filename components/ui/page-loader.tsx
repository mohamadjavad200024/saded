"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export function PageLoader({ message = "در حال بارگذاری...", fullScreen = true }: PageLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-primary" />
      <p className="text-sm sm:text-base text-muted-foreground">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {content}
      </CardContent>
    </Card>
  );
}

