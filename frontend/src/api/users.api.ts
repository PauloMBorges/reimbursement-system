import { http } from './http';
import type { PerfilUsuario, Usuario } from '@/types';

export interface CreateUserPayload {
    nome: string;
    email: string;
    senha: string;
    perfil: PerfilUsuario;
}

export const usersApi = {
    async list(): Promise<Usuario[]> {
        const {data} = await http.get<Usuario[]>('/users');
        return data;
    },

    async create(payload: CreateUserPayload): Promise<Usuario> {
        const {data} = await http.post<Usuario>('/users', payload);
        return data;
    }
}