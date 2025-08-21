"use client";

import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  // mount-gate to avoid Hydrate setState during SSR
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
      })
  );

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
