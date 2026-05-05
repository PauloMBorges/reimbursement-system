import { http } from './http';
import type { Reimbursement } from '@/types';

export const reimbursementsApi = {
  // Lista reembolsos
  // Backend já filtra automaticamente por perfil:
  // - COLABORADOR: só os próprios
  // - GESTOR: tudo que saiu de RASCUNHO
  // - FINANCEIRO: APROVADO e PAGO
  // - ADMIN: tudo
  async list(): Promise<Reimbursement[]> {
    const { data } = await http.get<Reimbursement[]>('/reimbursements');
    return data;
  },

  async getById(id: string): Promise<Reimbursement> {
    const { data } = await http.get<Reimbursement>(`/reimbursements/${id}`);
    return data;
  },
};