// app/login/page.tsx
"use client";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  useEffect(() => {
    setIsClient(true);
    const token = Cookies.get('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  useEffect(() => {
    if (isClient && isAuthenticated) {
      router.push('/user/profile');
    }
  }, [isClient, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.statusText}`);
      }
      const data = await response.json();
      Cookies.set('access_token', data.access_token);
      Cookies.set('refresh_token', data.refresh_token);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      router.push('/user/profile');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}