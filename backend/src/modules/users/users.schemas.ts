import { z } from 'zod';
import { PerfilUsuario } from '@prisma/client';

export const createUserSchema = z.object({
  nome: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .toLowerCase(),
  senha: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(72, 'Senha deve ter no máximo 72 caracterres'),
  perfil: z.nativeEnum(PerfilUsuario),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
