// src/app/user/profile/page.tsx

'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from '../../../store/authStore';

export default function Profile() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [userData, setUserData] = useState({ username: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchUserData = useCallback(async (token: string) => {
    try {
      console.log('Fetching user data with token:', token); // Логирование токена
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Response status:', response.status); // Логирование статуса ответа
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh it
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: Cookies.get('refresh_token') }),
          });
          console.log('Refresh response status:', refreshResponse.status); // Логирование статуса ответа обновления
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            console.log('Refresh data:', refreshData); // Логирование данных обновления
            Cookies.set('access_token', refreshData.accessToken);
            Cookies.set('refresh_token', refreshData.refreshToken);
            fetchUserData(refreshData.accessToken);
            return;
          } else {
            throw new Error('Failed to refresh token');
          }
        } else {
          throw new Error('Failed to fetch user data');
        }
      }
      const data = await response.json();
      console.log('Fetched user data:', data); // Логирование данных пользователя
      if (data) {
        console.log('Setting user data:', data); // Логирование данных перед установкой
        setUserData({
          username: data.username ?? '', // Установка значения по умолчанию для username
          email: data.email ?? '',
        });
        console.log('Updated userData state:', {
          username: data.username ?? '',
          email: data.email ?? '',
        }); // Логирование состояния userData после установки
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data.');
    } finally {
      console.log('Setting isLoading to false'); // Логирование изменения состояния isLoading
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (isClient && token && !isAuthenticated) {
      setIsAuthenticated(true);
      fetchUserData(token);
    }
  }, [isClient, isAuthenticated, setIsAuthenticated, fetchUserData]);

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push('/login');
    }
  }, [isClient, isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = Cookies.get('access_token');
      console.log('Submitting user data:', userData); // Логирование отправляемых данных
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      console.log('Response status:', response.status); // Логирование статуса ответа
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    }
  };

  if (!isClient || !isAuthenticated || isLoading) {
    console.log('Loading...'); // Логирование состояния загрузки
    return <div>Loading...</div>; // Показать загрузочный экран
  }

  console.log('Rendering Profile component with userData:', userData); // Логирование состояния userData при рендере

  const handleLogout = () => {
    logout();
    toast.success('You have successfully logged out!');
    router.push('/login');
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome to your profile!</p>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email || ''}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}