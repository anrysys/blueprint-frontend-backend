import Cookies from 'js-cookie';

export async function refreshTokens() {
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
    Cookies.set('access_token', data.access_token);
    Cookies.set('refresh_token', data.refresh_token);
    return data;
  } catch (error) {
    console.error('Failed to refresh tokens:', error);
    throw error;
  }
}