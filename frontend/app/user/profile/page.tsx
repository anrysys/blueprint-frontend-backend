// app/user/profile/page.tsx
"use client";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../../store/authStore';

export default function Profile() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    setIsClient(true);
    const token = Cookies.get('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push('/login');
    }
  }, [isClient, isAuthenticated, router]);

  if (!isClient || !isAuthenticated) {
    return null; // Или можно показать загрузочный экран
  }

  const handleLogout = () => {
    logout();
    toast.success('You have successfully logged out!');
    router.push('/login');
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome to your profile!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}