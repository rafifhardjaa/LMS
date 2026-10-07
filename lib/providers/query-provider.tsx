"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create a stable QueryClient per component mount (avoids shared state in SSR)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Re-fetch on window focus when token exists
            refetchOnWindowFocus: true,
            // Show stale data for 30 seconds before re-fetching
            staleTime: 1000 * 30,
            // Keep unused data in cache for 5 minutes
            gcTime: 1000 * 60 * 5,
            // Retry once on failure (network errors, etc.)
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
