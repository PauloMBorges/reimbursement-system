import { PrismaClient } from '@prisma/client';
import { env } from './env';

// Singleton do PrismaClient
// Cada 'new PrismaClient' abre seu próprio pool de conexões com o banco
// Em desenvolvimento, com o hot-reload do tsx watch, isso pode esgotar o limite de conexões do Postgres
// O 'globalThis' mantém a mesma instância do cliente entre os hot-reloads

const globalForPrisma = globalThis as unknown as {
  // Type assertion necessária para acessar 'prisma' em 'globalThis' (que é do tipo 'any')
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? // Se já existir, usa a instância existente, senão cria uma nova
  new PrismaClient({
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'], // Em prod só loga erros (economiza recursos)
  });

// No desenvolvimento, mantém a instância global para evitar esgotar conexões com o banco
if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
