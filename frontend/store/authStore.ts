// store/authStore.ts
import Cookies from 'js-cookie';
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  logout: () => {
    set({ isAuthenticated: false });
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  },
  checkAuth: () => {
    const token = Cookies.get('access_token');
    set({ isAuthenticated: !!token });
  },
}));