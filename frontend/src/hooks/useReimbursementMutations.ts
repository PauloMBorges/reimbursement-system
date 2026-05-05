import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  reimbursementsApi,
  type CreateReimbursementPayload,
  type RejectPayload,
  type UpdateReimbursementPayload,
} from '@/api/reimbursements.api';
import {
  REIMBURSEMENTS_QUERY_KEY,
  reimbursementQueryKey,
} from './useReimbursements';

// Hook que expõe todas mutations de um reembolso
// Cada mutation invalida as queries relacionadas para forçar refetch

// Uso: 
// 
// const { create, update, submit, approve, reject, pay, cancel } = useReimbursementMutations();
// await submit.mutateAsync(reimbursement.id)


export function useReimbursementMutations() {
  const queryClient = useQueryClient();

  // Função para invalidar caches relacionados
  // Chamada após cada mutation que muda o estado de um reembolso
  function invalidateRelated(id?: string) {
    queryClient.invalidateQueries({ queryKey: REIMBURSEMENTS_QUERY_KEY });
    if (id) {
      queryClient.invalidateQueries({ queryKey: reimbursementQueryKey(id) });
    }
  }

  const create = useMutation({
    mutationFn: (payload: CreateReimbursementPayload) =>
      reimbursementsApi.create(payload),
    onSuccess: (data) => invalidateRelated(data.id),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReimbursementPayload }) =>
      reimbursementsApi.update(id, payload),
    onSuccess: (data) => invalidateRelated(data.id),
  });

  const submit = useMutation({
    mutationFn: (id: string) => reimbursementsApi.submit(id),
    onSuccess: (data) => invalidateRelated(data.id),
  });

  const approve = useMutation({
    mutationFn: (id: string) => reimbursementsApi.approve(id),
    onSuccess: (data) => invalidateRelated(data.id),
  });

  const reject = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectPayload }) =>
      reimbursementsApi.reject(id, payload),
    onSuccess: (data) => invalidateRelated(data.id),
  });

  const pay = useMutation({
    mutationFn: (id: string) => reimbursementsApi.pay(id),
    onSuccess: (data) => invalidateRelated(data.id),
  });

  const cancel = useMutation({
    mutationFn: (id: string) => reimbursementsApi.cancel(id),
    onSuccess: (data) => invalidateRelated(data.id),
  });

  return { create, update, submit, approve, reject, pay, cancel };
}



  