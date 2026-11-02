'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OverlayProvider } from '@toss/use-overlay';
import { Provider as JotaiProvider } from 'jotai';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import GlobalStyle from '@/styles/GlobalStyle';

let mockingPromise: Promise<unknown> | null = null;

const enableMocking = () => {
  if (!mockingPromise) {
    mockingPromise = import('@/mocks/browser').then(({ worker }) =>
      worker.start({ onUnhandledRequest: 'bypass', quiet: true }),
    );
  }
  return mockingPromise;
};

const Providers = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  useEffect(() => {
    enableMocking().then(() => setIsReady(true));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <OverlayProvider>
          <GlobalStyle />
          {isReady && children}
        </OverlayProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
};

export default Providers;
