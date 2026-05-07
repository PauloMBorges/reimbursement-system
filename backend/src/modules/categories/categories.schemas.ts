import { z } from 'zod';

// Schema para criação de categoria
// Apenas ADMIN tem permissão para essa ação

export const createCategorySchema = z.object({
  nome: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .trim(),
  valorMaximo: z
    .number()
    .positive('O valor máximo deve ser positivo')
    .nullable()
    .optional(),
});

// Schema para atualização de categoria
// Permite editar o nome e ativar/desativar a categoria

// Os dois campos são opcionais (.partial())
// mas exigimos ao menos um (não faz sentido PUT vazio)

export const updateCategorySchema = z
  .object({
    nome: z
      .string()
      .min(2, 'Nome deve ter no mínimo 2 caracteres')
      .max(50, 'Nome deve ter no máximo 50 caracteres')
      .trim()
      .optional(),
    ativo: z.boolean().optional(),
    valorMaximo: z
      .number()
      .positive('O valor máximo deve ser positivo')
      .nullable()
      .optional(),
  })
  .refine((data) => data.nome !== undefined || data.ativo !== undefined, {
    message: 'Informe ao menos um campo para atualizar (nome ou ativo)',
  });

// Schema para validar o parâmetro :id da URL
// UUIDs gerados pelo Prisma seguem o formato padrão

export const categoryIdParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
