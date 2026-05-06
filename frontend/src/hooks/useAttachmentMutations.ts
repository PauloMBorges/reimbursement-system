import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attachmentsApi, type CreateAttachmentPayload } from '@/api/attachments.api';
import { attachmentsQueryKey } from './useAttachments';

// Hook responsável pelas mutations de anexos
// Separado das mutações de reembolso para evitar que o envio de um
// arquivo invalide o cache do reembolso inteiro sem necessidade

export function useAttachmentMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: ({
      reimbursementId,
      payload,
    }: {
      reimbursementId: string;
      payload: CreateAttachmentPayload;
    }) => attachmentsApi.create(reimbursementId, payload),
    // O TanStack Query injeta o retorno da API em _data
    // e os parâmetros enviados em variables
    // Usa 'variables' pra garantir que está invalidando o
    // cache usando o ID do reembolso pai (e não o id do anexo recém criado)
    onSuccess: (_data, variables) => {
      queryClient.refetchQueries({
        queryKey: attachmentsQueryKey(variables.reimbursementId),
      });
    },
  });

  return { create };
}
