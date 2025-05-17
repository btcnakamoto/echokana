import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  resetError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          // 此处应该有API调用，但暂时模拟成功登录
          setTimeout(() => {
            set({
              token: "fake_token",
              user: {
                id: 1,
                name: "测试用户",
                email
              },
              isAuthenticated: true,
              isLoading: false,
            });
          }, 1000);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || '登录失败，请检查您的凭据'
          });
          throw error;
        }
      },
      
      register: async (name: string, email: string, password: string, password_confirmation: string) => {
        try {
          set({ isLoading: true, error: null });
          // 此处应该有API调用，但暂时模拟成功注册
          setTimeout(() => {
            set({
              token: "fake_token",
              user: {
                id: 1,
                name,
                email
              },
              isAuthenticated: true,
              isLoading: false,
            });
          }, 1000);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || '注册失败，请稍后再试'
          });
          throw error;
        }
      },
      
      logout: async () => {
        try {
          set({ isLoading: true });
          // 此处应该有API调用，但暂时直接清理状态
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || '注销失败，请稍后再试'
          });
          
          // 即使API调用失败，我们也清除本地状态
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });
        }
      },
      
      resetError: () => set({ error: null }),
    }),
    {
      name: 'echokana-auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
); 