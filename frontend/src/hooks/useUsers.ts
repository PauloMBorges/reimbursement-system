import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi, type CreateUserPayload } from '@/api/users.api';

export const USERS_QUERY_KEY = ['users'] as const;

export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => usersApi.list(),
  });
}

export function useUserMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: USERS_QUERY_KEY });
    },
  });

  return { create };
}