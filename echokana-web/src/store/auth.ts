import { create } from 'zustand';
import { authService, type AuthResponse, type LoginData, type RegisterData } from '../services/auth';

interface AuthState {
  user: AuthResponse['user'] | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setAuth: (response: AuthResponse) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(data);
      get().setAuth(response);
    } catch (error: any) {
      set({ error: error.response?.data?.message || '登录失败' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.register(data);
      get().setAuth(response);
    } catch (error: any) {
      set({ error: error.response?.data?.message || '注册失败' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      get().clearAuth();
    }
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token) return;
    set({ loading: true });
    try {
      const user = await authService.getCurrentUser();
      set({ user });
    } catch (error) {
      get().clearAuth();
    } finally {
      set({ loading: false });
    }
  },

  setAuth: (response) => {
    set({ token: response.access_token, user: response.user });
    localStorage.setItem('token', response.access_token);
  },

  clearAuth: () => {
    set({ token: null, user: null });
    localStorage.removeItem('token');
  },
})); 