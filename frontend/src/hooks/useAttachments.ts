import { useQuery } from '@tanstack/react-query';
import { attachmentsApi } from '@/api/attachments.api';

export const attachmentsQueryKey = (reimbursementId: string) =>
  ['reimbursements', reimbursementId, 'attachments'] as const;

export function useAttachments(reimbursementId: string) {
  return useQuery({
    queryKey: attachmentsQueryKey(reimbursementId),
    queryFn: () => attachmentsApi.listByReimbursement(reimbursementId),
    enabled: !!reimbursementId,
  });
}