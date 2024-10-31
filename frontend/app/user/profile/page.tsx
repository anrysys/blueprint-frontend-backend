// src/app/user/profile/page.tsx

'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from '../../../store/authStore';

export default function Profile() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (isClient && token && !isAuthenticated) {
      setIsAuthenticated(true);
      fetchUserData(token);
    }
  }, [isClient, isAuthenticated, setIsAuthenticated]);

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push('/login');
    }
  }, [isClient, isAuthenticated, router]);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    }
  };

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