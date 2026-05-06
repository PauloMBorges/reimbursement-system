import { http } from './http';
import type { Usuario } from '@/types';

interface LoginPayload {
  email: string;
  senha: string;
}

interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>('/auth/login', payload);
    return data;
  },
};
