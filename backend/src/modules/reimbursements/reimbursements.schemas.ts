import { z } from 'zod';

// Schema para criação de solicitação de reembolso

// valor: number positivo com até 2 casas decimais
// dataDespesa: aceita string e converte para Date. Permite tanto '2025-05-01' quanto '2025-05-01T00:00:00.000Z' (horário ignorado pelo @db.Date)
// categoriaId: UUID. A existência e estado ativo sao verificados pelo service contra o banco

export const createReimbursementSchema = z.object({
  categoriaId: z.string().uuid('ID de categoria inválido'),
  descricao: z
    .string()
    .min(3, 'Descrição deve ter no mínimo 3 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .trim(),
  valor: z
    .number()
    .positive('Valor deve ser maior que zero')
    .multipleOf(0.01, 'Valor deve ter no máximo 2 casas decimais'),
  dataDespesa: z.coerce
    .date({
      errorMap: () => ({ message: 'Data da despesa inválida' }),
    })
    // Diferencial - Adiciona bloqueio de datas futuras
    .refine(
      (date) => {
        const today = new Date();
        today.setUTCHours(23, 59, 59, 999);
        return date <= today;
      },
      { message: 'Data da despesa não pode ser futura' },
    ),
});

// Schema para edição da solicitação em RASCUNHO

// Todos campos opcionais (usuário pode editar qualquer um isoladamente)
// O .refine() garante que pelo menos um campo veio no body

export const updateReimbursementSchema = createReimbursementSchema
  .partial()
  .refine(
    (data) =>
      data.categoriaId !== undefined ||
      data.descricao !== undefined ||
      data.valor !== undefined ||
      data.dataDespesa !== undefined,
    {
      message: 'Informe ao menos um campo para atualizar',
    },
  );

// Schema para rejeição (justificativa obrigatória)

export const rejectReimbursementSchema = z.object({
  justificativa: z
    .string()
    .min(3, 'Justificativa deve ter pelo menos 3 caracteres')
    .max(500, 'Justificativa deve ter no máximo 500 caracteres')
    .trim(),
});

// Schema para validar o :id da URL como UUID

export const reimbursementIdParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

// Gera as tipagens para o código TS usar no Service e Controller

export type CreateReimbursementInput = z.infer<
  typeof createReimbursementSchema
>;
export type UpdateReimbursementInput = z.infer<
  typeof updateReimbursementSchema
>;
export type RejectReimbursementInput = z.infer<
  typeof rejectReimbursementSchema
>;
