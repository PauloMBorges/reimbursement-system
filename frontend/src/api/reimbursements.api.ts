import { http } from './http';
import type { Reimbursement } from '@/types';

export interface CreateReimbursementPayload {
    categoriaId: string;
    descricao: string;
    valor: number;
    dataDespesa: string;
}

export type UpdateReimbursementPayload = Partial<CreateReimbursementPayload>;

export interface RejectPayload {
    justificativa: string;
}

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

  async create(payload: CreateReimbursementPayload): Promise<Reimbursement> {
    const { data } = await http.post<Reimbursement>('/reimbursements', payload);
    return data;
  },

  async update(id: string, payload: UpdateReimbursementPayload): Promise<Reimbursement> {
    const { data } = await http.put<Reimbursement>(`/reimbursements/${id}`, payload);
    return data;
  },

  async submit(id: string): Promise<Reimbursement> {
    const { data } = await http.post<Reimbursement>(`/reimbursements/${id}/submit`);
    return data;
  },

  async approve(id: string): Promise<Reimbursement> {
    const { data } = await http.post<Reimbursement>(`/reimbursements/${id}/approve`);
    return data;
  },

  async reject(id: string, payload: RejectPayload): Promise<Reimbursement> {
    const { data } = await http.post<Reimbursement>(`/reimbursements/${id}/reject`, payload);
    return data;
  },

  async pay(id: string): Promise<Reimbursement> {
    const { data } = await http.post<Reimbursement>(`/reimbursements/${id}/pay`);
    return data;
  },

  async cancel(id: string): Promise<Reimbursement> {
    const { data } = await http.post<Reimbursement>(`/reimbursements/${id}/cancel`);
    return data;
  },
};