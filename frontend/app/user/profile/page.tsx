// src/app/user/profile/page.tsx

'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';

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

      // Проверка соответствия токена и данных пользователя после обновления токена
      const newToken = Cookies.get('access_token');
      if (newToken) {
        const decodedToken: DecodedToken = jwtDecode(newToken);
        if (decodedToken.sub === data.id) {
          await fetchProfile(); // Fetch profile again after refreshing tokens
        } else {
          throw new Error('Token mismatch after refresh');
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
      router.push('/login');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
    try {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      toast.success('You have successfully logged out!');
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
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