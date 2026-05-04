import { prisma } from '@/config/prisma';

// Limpa o banco antes de cada teste
// Ordem importa por causa das chaves estrangeiras:
// - Histórico e Anexo referenciam Solicitações
// - Solicitações referenciam Usuários e Categorias

beforeEach(async () => {
  await prisma.historicoSolicitacao.deleteMany();
  await prisma.anexo.deleteMany();
  await prisma.solicitacaoReembolso.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();
});

// Fecha conexão do Prisma ao final
afterAll(async () => {
  await prisma.$disconnect();
});
