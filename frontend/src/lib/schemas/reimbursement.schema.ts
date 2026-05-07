import { z } from 'zod';

// Schema de validação para criação e edição de reembolsos
// Espelha as validações do backend (Zod do lado do servidor)
// Mas com mensagens em portugues para o usuário final

export const reimbursementFormSchema = z.object({
  categoriaId: z.string().min(1, 'Selecione uma categoria'),
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  valor: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Valor deve ser maior que zero')
    .refine((val) => {
      // Aceita até 2 casas decimais (centavos)
      return /^\d+(\.\d{1,2})?$/.test(val);
    }, 'Valor deve ter no máximo 2 casas decimais'),
  dataDespesa: z
  .string()
  .min(1, 'Data é obrigatória')
  // Diferencial - Adiciona bloqueio de datas futuras
  .refine(
    (date) => {
      const inputDate = new Date(`${date}T00:00:00.000Z`);
      const today = new Date();
      today.setUTCHours(23, 59, 59, 999);
      return inputDate <= today;
    },
    { message: 'Data da despesa não pode ser futura' },
  ),
});

export type ReimbursementFormInput = z.infer<typeof reimbursementFormSchema>;
