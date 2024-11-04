// app/client-provider.tsx

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { registerServiceWorker } from '../utils/registerServiceWorker';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAuth, token } = useAuthStore();

  useEffect(() => {
    checkAuth();
    if (isAuthenticated && token) {
      registerServiceWorker(token);
    }
  }, [isAuthenticated, token]);

  return <>{children}</>;
}
