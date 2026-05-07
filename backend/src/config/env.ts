// validação de variáveis com Zod
import 'dotenv/config';
import { z } from 'zod';

// Define o schema de validação (Zod) para as variáveis de ambiente
// Isso garante que se uma variável estiver faltando ou inválida, o app não sofra silent crash
const envSchema = z.object({
  // Banco de dados
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL válida'),

  // Servidor
  PORT: z.coerce.number().int().positive().default(3333),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  // JWT
  JWT_SECRET: z.string().min(16, 'JWT_SECRET deve ter no mínimo 16 caracteres'),
  JWT_EXPIRES_IN: z.string().default('1d'),

  // Bcrypt
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(15).default(10),

  // NTFY
  NTFY_TOPIC: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

// Tratamento de erro no caso de variáveis ausentes ou inválidas
if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1); // Fail fast (Se faltarem variáveis obrigatórias, não iniciamos o servidor)
}

// Exporta as variáveis de ambiente validadas
export const env = parsed.data;
