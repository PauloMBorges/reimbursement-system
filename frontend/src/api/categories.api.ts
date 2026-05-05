import { http } from './http';
import type { Categoria } from '@/types';

export const categoriesApi = {
  async list(): Promise<Categoria[]> {
    const { data } = await http.get<Categoria[]>('/categories');
    return data;
  },
};