import { Prisma, StatusSolicitacao } from '@prisma/client';
import { prisma } from '@/config/prisma';

// Inclusão padrão de relações que retornamos ao cliente
// Evita repetição nas queries

const defaultInclude = {
  categoria: { select: { id: true, nome: true, ativo: true } },
  solicitante: { select: { id: true, nome: true, email: true, perfil: true } },
} satisfies Prisma.SolicitacaoReembolsoInclude;

export const reimbursementRepository = {
  // Busca uma linha específica pela chave primária (ID)
  async findById(id: string) {
    return prisma.solicitacaoReembolso.findUnique({
      where: { id },
      include: defaultInclude,
    });
  },

  // Busca uma lista de reembolsos aplicando filtros opcionais
  // Se solicitanteId for passado, retorna apenas as do colaborador (auto-listagem)
  // Se statuses for passado, restringe aos status indicados (visão por perfil)
  // Se nenhum filtro vier, retorna todas (uso administrativo)
  async findMany(filters: {
    solicitanteId?: string;
    statuses?: StatusSolicitacao[];
  }) {
    return prisma.solicitacaoReembolso.findMany({
      where: {
        ...(filters.solicitanteId && { solicitanteId: filters.solicitanteId }),
        ...(filters.statuses &&
          filters.statuses.length > 0 && {
            status: { in: filters.statuses },
          }),
      },
      include: defaultInclude,
      orderBy: { criadoEm: 'desc' },
    });
  },

  // Efetua INSERT de novo reembolso
  async create(data: {
    solicitanteId: string;
    categoriaId: string;
    descricao: string;
    valor: number;
    dataDespesa: Date;
  }) {
    return prisma.solicitacaoReembolso.create({
      data,
      include: defaultInclude,
    });
  },

  // Executa UPDATE em reembolso existente
  async update(id: string, data: Prisma.SolicitacaoReembolsoUpdateInput) {
    return prisma.solicitacaoReembolso.update({
      where: { id },
      data,
      include: defaultInclude,
    });
  },
};
