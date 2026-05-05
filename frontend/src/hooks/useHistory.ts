import { useQuery } from '@tanstack/react-query';
import { historyApi } from '@/api/history.api';

export const historyQueryKey = (reimbursementId: string) =>
  ['reimbursements', reimbursementId, 'history'] as const;

export function useHistory(reimbursementId: string) {
  return useQuery({
    queryKey: historyQueryKey(reimbursementId),
    queryFn: () => historyApi.listByReimbursement(reimbursementId),
    enabled: !!reimbursementId,
  });
}