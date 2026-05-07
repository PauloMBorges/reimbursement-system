import { useQuery } from '@tanstack/react-query';
import { reimbursementsApi } from '@/api/reimbursements.api';

// Use Query para buscar as estatísticas
export const STATS_QUERY_KEY = ['reimbursements', 'stats'] as const;

export function useStats() {
  return useQuery({
    queryKey: STATS_QUERY_KEY,
    queryFn: () => reimbursementsApi.getStats(),
    staleTime: 30 * 1000, // 30 segundos
  });
}