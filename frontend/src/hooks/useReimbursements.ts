import { useQuery } from '@tanstack/react-query';
import { reimbursementsApi } from '@/api/reimbursements.api';

// Chave de query usada pelo TanStack Query 
// para identificar essa fonte de dados no cache
// Exportada para poder invalidar a query depois 
// de mutações (criação, transições...)

export const REIMBURSEMENTS_QUERY_KEY = ['reimbursements'] as const;

export function useReimbursements() {
    return useQuery({
        queryKey: REIMBURSEMENTS_QUERY_KEY,
        queryFn: () => reimbursementsApi.list(),
    });
}