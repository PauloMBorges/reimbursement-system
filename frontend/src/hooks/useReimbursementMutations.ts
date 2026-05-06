import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  reimbursementsApi,
  type CreateReimbursementPayload,
  type RejectPayload,
  type UpdateReimbursementPayload,
} from '@/api/reimbursements.api';
import { REIMBURSEMENTS_QUERY_KEY, reimbursementQueryKey } from './useReimbursements';

// Hook que expõe todas mutations de um reembolso
// Cada mutation invalida as queries relacionadas para forçar refetch

// Uso:
//
// const { create, update, submit, approve, reject, pay, cancel } = useReimbursementMutations();
// await submit.mutateAsync(reimbursement.id)

export function useReimbursementMutations() {
  const queryClient = useQueryClient();

  // força refetch de todas as queries afetadas
  // mais agressivo que invalidate (garante que dados sejam re-buscasdos imediatamente)
  async function refetchRelated(id?: string) {
    await queryClient.refetchQueries({ queryKey: REIMBURSEMENTS_QUERY_KEY });
    if (id) {
      await queryClient.refetchQueries({ queryKey: reimbursementQueryKey(id) });
    }
  }

  const create = useMutation({
    mutationFn: (payload: CreateReimbursementPayload) => reimbursementsApi.create(payload),
    onSuccess: (data) => refetchRelated(data.id),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReimbursementPayload }) =>
      reimbursementsApi.update(id, payload),
    onSuccess: (data) => refetchRelated(data.id),
  });

  const submit = useMutation({
    mutationFn: (id: string) => reimbursementsApi.submit(id),
    onSuccess: (data) => refetchRelated(data.id),
  });

  const approve = useMutation({
    mutationFn: (id: string) => reimbursementsApi.approve(id),
    onSuccess: (data) => refetchRelated(data.id),
  });

  const reject = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectPayload }) =>
      reimbursementsApi.reject(id, payload),
    onSuccess: (data) => refetchRelated(data.id),
  });

  const pay = useMutation({
    mutationFn: (id: string) => reimbursementsApi.pay(id),
    onSuccess: (data) => refetchRelated(data.id),
  });

  const cancel = useMutation({
    mutationFn: (id: string) => reimbursementsApi.cancel(id),
    onSuccess: (data) => refetchRelated(data.id),
  });

  return { create, update, submit, approve, reject, pay, cancel };
}
