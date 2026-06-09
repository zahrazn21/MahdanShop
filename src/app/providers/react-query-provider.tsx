// app/providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 60 * 1000, // 10 دقیقه (قبلاً 1 دقیقه بود)
            gcTime: 30 * 60 * 1000, // 30 دقیقه (قبلاً 10 دقیقه بود)
            retry: 2, // 2 بار تلاش مجدد
            retryDelay: 1000, // 1 ثانیه بین تلاش‌ها
            refetchOnWindowFocus: false, // عدم رفرش با فوکوس پنجره
            refetchOnMount: false, // عدم رفرش با mount مجدد
            refetchOnReconnect: false, // عدم رفرش با reconnect
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}