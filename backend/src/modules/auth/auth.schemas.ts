// Validação mínima no login (apenas presença e formato de email, senha)
// Sem validação do tamanho mínimo de senha (essa regra pertence ao cadastro)

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginInput = z.infer<typeof loginSchema>; // z.infer extrai o tipo TS do schema
