// app/client-provider.tsx

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { registerServiceWorker } from '../utils/registerServiceWorker';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    if (isAuthenticated) {
      registerServiceWorker();
    }
  }, [isAuthenticated]);

  return <>{children}</>;
}
