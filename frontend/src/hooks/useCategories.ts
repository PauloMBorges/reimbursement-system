import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories.api';

export const CATEGORIES_QUERY_KEY = ['categories'] as const;

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => categoriesApi.list(),
    staleTime: 30 * 1000, // 5 minutos
  });
}
