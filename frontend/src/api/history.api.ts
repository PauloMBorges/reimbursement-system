import { http } from './http';
import type { HistoricoEntry } from '@/types';

export const historyApi = {
  async listByReimbursement(reimbursementId: string): Promise<HistoricoEntry[]> {
    const { data } = await http.get<HistoricoEntry[]>(`/reimbursements/${reimbursementId}/history`);
    return data;
  },
};
