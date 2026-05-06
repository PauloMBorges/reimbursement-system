import { http } from './http';
import type { Anexo, TipoArquivo } from '@/types';

export interface CreateAttachmentPayload {
  nomeArquivo: string;
  urlArquivo: string;
  tipoArquivo: TipoArquivo;
}

export const attachmentsApi = {
  async listByReimbursement(reimbursementId: string): Promise<Anexo[]> {
    const { data } = await http.get<Anexo[]>(`/reimbursements/${reimbursementId}/attachments`);
    return data;
  },

  async create(reimbursementId: string, payload: CreateAttachmentPayload): Promise<Anexo> {
    const { data } = await http.post<Anexo>(
      `/reimbursements/${reimbursementId}/attachments`,
      payload,
    );
    return data;
  },
};
