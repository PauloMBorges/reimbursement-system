import { TipoArquivo } from '@prisma/client';
import { prisma } from '@/config/prisma';

// Sem findById e delete (anexos só são criados e listados em conjunto)

export const attachmentsRepository = {
  async findByReimbursementId(reimbursementId: string) {
    return prisma.anexo.findMany({
      where: { solicitacaoId: reimbursementId },
      orderBy: { criadoEm: 'asc' },
    });
  },

  async create(data: {
    solicitacaoId: string;
    nomeArquivo: string;
    urlArquivo: string;
    tipoArquivo: TipoArquivo;
  }) {
    return prisma.anexo.create({
      data,
    });
  },
};
