import { z } from 'zod';

export const userFormSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  senha: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(100, 'Senha muito longa'),
  perfil: z.enum(['COLABORADOR', 'GESTOR', 'FINANCEIRO', 'ADMIN'], {
    message: 'Selecione um perfil',
  }),
});

export type UserFormInput = z.infer<typeof userFormSchema>;