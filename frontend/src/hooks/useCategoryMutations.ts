import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  categoriesApi,
  type CreateCategoryPayload,
  type UpdateCategoryPayload,
} from '@/api/categories.api';
import { CATEGORIES_QUERY_KEY } from './useCategories';

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  // Força refetch imediato da lista de categorias.
  async function refetch() {
    await queryClient.refetchQueries({ queryKey: CATEGORIES_QUERY_KEY });
  }

  const create = useMutation({
    mutationFn: (payload: CreateCategoryPayload) => categoriesApi.create(payload),
    onSuccess: refetch,
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
      categoriesApi.update(id, payload),
    onSuccess: refetch,
  });

  return { create, update };
}