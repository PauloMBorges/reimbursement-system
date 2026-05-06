import { http } from './http';
import type { Categoria } from '@/types';

export interface CreateCategoryPayload {
  nome: string;
}

export interface UpdateCategoryPayload {
  nome?: string;
  ativo?: boolean;
}

export const categoriesApi = {
  async list(): Promise<Categoria[]> {
    const { data } = await http.get<Categoria[]>('/categories');
    return data;
  },

  async create(payload: CreateCategoryPayload): Promise<Categoria> {
    const { data } = await http.post<Categoria>('/categories', payload);
    return data;
  },

  async update(id: string, payload: UpdateCategoryPayload): Promise<Categoria> {
    const { data } = await http.put<Categoria>(`/categories/${id}`, payload);
    return data;
  }


};

