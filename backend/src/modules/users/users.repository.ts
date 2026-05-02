import { prisma } from '@/config/prisma';
import { PerfilUsuario } from '@prisma/client';

// Camda de acesso a dados de usuários
// Toda interação com a tabela usuários passa aqui
// Isola Prisma do resto do código e faciltia testes (mockar o repository em vez do cliente prisma)

export const usersRepository = {
  async findByEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.usuario.findUnique({ where: { id } });
  },

  async create(data: {
    nome: string;
    email: string;
    senha: string;
    perfil: PerfilUsuario;
  }) {
    return prisma.usuario.create({
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        criadoEm: true,
        atualizadoEm: true,
      },
    });
  },

  async findAll() {
    return prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        criadoEm: true,
        atualizadoEm: true,
      },
      orderBy: { criadoEm: 'desc' },
    });
  },
};
