import axios from '../utils/axios';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post('/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post('/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post('/logout');
  },

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await axios.get('/user');
    return response.data;
  },
}; 