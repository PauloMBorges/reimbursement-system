import { Categoria, PerfilUsuario, Usuario } from '@prisma/client';
import { prisma } from '@/config/prisma';
import { hashPassword } from '@/shared/utils/hash';
import { signToken } from '@/shared/utils/jwt';

// Cria um usuário para uso em testes
export async function createUser(
  // Parâmetros parciais (só passo o que importa para um teste específico)
  overrides?: Partial<Pick<Usuario, 'nome' | 'email' | 'perfil'>>,
): Promise<Usuario> {
  const senha = await hashPassword('senha123');

  return prisma.usuario.create({
    data: {
      nome: overrides?.nome ?? 'Usuário Teste',
      // E-mail aleatório (email é @unique)
      email:
        overrides?.email ?? `teste-${Date.now()}-${Math.random()}@test.com`,
      senha,
      perfil: overrides?.perfil ?? 'COLABORADOR',
    },
  });
}

// Cria token JWT válido pra um usuario
// Atalho para evitar fazer login HTTP em todo teste
export function tokenFor(
  user: Pick<Usuario, 'id' | 'email' | 'perfil'>,
): string {
  return signToken({
    sub: user.id,
    email: user.email,
    perfil: user.perfil,
  });
}

// Cria uma categoria para uso em testes
export async function createCategoria(
  overrides?: Partial<Pick<Categoria, 'nome' | 'ativo'>>,
): Promise<Categoria> {
  return prisma.categoria.create({
    data: {
      nome: overrides?.nome ?? `Categoria ${Date.now()}-${Math.random()}`,
      ativo: overrides?.ativo ?? true,
    },
  });
}

// Cria conjunto completo de usuários (um por perfil)
// Útil para testes que precisam validar comportamento de cada perfil
export async function createAllRoles(): Promise<
  Record<PerfilUsuario, Usuario>
> {
  const [admin, colaborador, gestor, financeiro] = await Promise.all([
    createUser({ email: 'admin@test.com', perfil: 'ADMIN' }),
    createUser({ email: 'colaborador@test.com', perfil: 'COLABORADOR' }),
    createUser({ email: 'gestor@test.com', perfil: 'GESTOR' }),
    createUser({ email: 'financeiro@test.com', perfil: 'FINANCEIRO' }),
  ]);
  // Retorna dicionário indexado (uso: usuarios.GESTOR.id, usuarios.ADMIM.email, etc)
  return {
    ADMIN: admin,
    COLABORADOR: colaborador,
    GESTOR: gestor,
    FINANCEIRO: financeiro,
  };
}
