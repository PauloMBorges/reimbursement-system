import { z } from 'zod';

export const categoryFormSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;