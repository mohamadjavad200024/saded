"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { GlobalChatPolling } from "@/components/chat/global-chat-polling";
import { NotificationCenter } from "@/components/notifications";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 60 * 1000, // 10 minutes - longer cache for better performance
            gcTime: 30 * 60 * 1000, // 30 minutes - keep data in cache longer
            refetchOnWindowFocus: false, // Don't refetch on window focus
            refetchOnMount: false, // Don't refetch on mount if data exists
            refetchOnReconnect: false, // Don't refetch on reconnect
            retry: 1, // Only retry once
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000), // Exponential backoff
            // Network mode: prefer cache over network
            networkMode: "online",
          },
          mutations: {
            retry: 0, // Don't retry mutations
            networkMode: "online",
          },
        },
      })
  );

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem={false}
      storageKey="saded-theme"
      disableTransitionOnChange={false}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <GlobalChatPolling />
        <NotificationCenter position="top-right" maxNotifications={5} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

