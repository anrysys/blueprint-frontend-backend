// src/app/user/profile/page.tsx

'use client';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from '../../../store/authStore';

interface DecodedToken {
  sub: number;
  username: string;
  email: string;
}

export default function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isFetching = useRef(false);
  const { isAuthenticated, checkAuth, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Восстанавливаем данные пользователя из localStorage при загрузке компонента
    setUsername(localStorage.getItem('username') || '');
    setEmail(localStorage.getItem('email') || '');
    fetchProfile();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const token = Cookies.get('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        await refreshTokens();
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      const decodedToken: DecodedToken = jwtDecode(token);
      if (decodedToken.sub === data.id) { // Проверка, что ID пользователя совпадает
        setUsername(data.username || '');
        setEmail(data.email || '');

        // Сохраняем текущие данные пользователя в localStorage
        localStorage.setItem('username', data.username || '');
        localStorage.setItem('email', data.email || '');
        localStorage.setItem('userId', data.id.toString());
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  const refreshTokens = async () => {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh tokens');
      }

      const data = await response.json();
      Cookies.set('access_token', data.accessToken);
      Cookies.set('refresh_token', data.refreshToken);

      // Восстанавливаем данные пользователя из localStorage после обновления токенов
      setUsername(localStorage.getItem('username') || '');
      setEmail(localStorage.getItem('email') || '');

      await fetchProfile(); // Fetch profile again after refreshing tokens
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
      router.push('/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      });

      if (response.status === 401) {
        await refreshTokens();
        return handleSubmit(e);
      }

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setIsAuthenticated(false);
    toast.success('Successful logout!');
    router.push('/login');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}