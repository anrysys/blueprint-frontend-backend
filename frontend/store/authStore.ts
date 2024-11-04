// store/authStore.ts
import Cookies from 'js-cookie';
import { create } from 'zustand';

export interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
  checkAuth: () => void;
  token: string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  logout: () => {
    set({ isAuthenticated: false, token: null });
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  },
  checkAuth: () => {
    const token = Cookies.get('access_token');
    set({ isAuthenticated: !!token, token });
  },
}));