import api from '@/lib/api';
import { User, LoginInput, RegisterInput } from '@/types';

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterInput): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const getProfile = async (): Promise<{ user: User }> => {
  const response = await api.get('/auth/profile');
  return response.data;
};
