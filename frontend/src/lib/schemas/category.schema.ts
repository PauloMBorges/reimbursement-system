import { z } from 'zod';

export const categoryFormSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  valorMaximo: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+([,.]\d{1,2})?$/.test(val),
      { message: 'Valor inválido (use formato 100,00)' },
    ),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;