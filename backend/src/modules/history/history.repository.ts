import { prisma } from '@/config/prisma';

// Camada de acesso a dados do histórico
// Apenas leitura (registros são criados pelos services dentro de transações)

export const historyRepository = {
  async findByReimbursementId(reimbursementId: string) {
    return prisma.historicoSolicitacao.findMany({
      where: { solicitacaoId: reimbursementId },
      include: {
        usuario: {
          select: { id: true, nome: true, email: true, perfil: true },
        },
      },
      orderBy: { criadoEm: 'asc' },
    });
  },
};
