import {
  PerfilUsuario,
  Prisma,
  StatusSolicitacao,
  AcaoHistorico,
} from '@prisma/client';
import { prisma } from '@/config/prisma';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '@/shared/errors';
import { reimbursementsRepository } from './reimbursements.repository';
import {
  CreateReimbursementInput,
  UpdateReimbursementInput,
} from './reimbursements.schemas';
import { ReimbursementAction, transitions } from './reimbursements.state';
import { Decimal } from '@prisma/client/runtime/library';

// Identidade do usuário autenticado (extraída do JWT pelo authMiddleware)
// Usada em todos métodos que precisam saber quem está agindo
interface ActingUser {
  id: string;
  perfil: PerfilUsuario;
}

// Registra um evento no histórico de uma solicitação
// Recebe um 'tx' (transaction client) em vez do prisma global para garantir atomicidade
// Isso permite que essa função participe de uma transação maior,
// onde update do reembolso + insert no histórico acontecem juntos
async function logHistory(
  tx: Prisma.TransactionClient,
  data: {
    solicitacaoId: string;
    usuarioId: string;
    acao: AcaoHistorico;
    observacao?: string;
  },
) {
  return tx.historicoSolicitacao.create({
    data: {
      solicitacaoId: data.solicitacaoId,
      usuarioId: data.usuarioId,
      acao: data.acao,
      observacao: data.observacao,
    },
  });
}

// Valida categoria e limite de valor
// Centraliza 3 regras: categoria existe, está ativa e valor não excede limite
// Se a categoria nao tem valorMaximo definido, pula a validação de limite
async function assertCategoryAndLimit(
  categoriaId: string,
  valor: number | Prisma.Decimal,
) {
  const categoria = await prisma.categoria.findUnique({
    where: { id: categoriaId },
  });

  if (!categoria) {
    throw new BadRequestError('Categoria não encontrada');
  }
  if (!categoria.ativo) {
    throw new BadRequestError(
      'Categoria está inativa e não pode ser usada em novas solicitações',
    );
  }

  if (categoria.valorMaximo !== null) {
    const valorSolicitado = new Decimal(valor.toString());
    if (valorSolicitado.greaterThan(categoria.valorMaximo)) {
      const limiteFmt = categoria.valorMaximo.toFixed(2).replace('.', ',');
      throw new BadRequestError(
        `Valor excede o limite da categoria "${categoria.nome}" (R$ ${limiteFmt})`,
      );
    }
  }

  return categoria;
}

// Determina quais status um perfil pode visualizar na listagem
// Centralizar isso evita 'if (perfil === ...)' no Service
function buildVisibilityFilter(user: ActingUser): {
  solicitanteId?: string;
  statuses?: StatusSolicitacao[];
} {
  switch (user.perfil) {
    case 'COLABORADOR':
      return { solicitanteId: user.id };
    case 'GESTOR':
      return {
        statuses: ['ENVIADO', 'APROVADO', 'REJEITADO', 'PAGO', 'CANCELADO'],
      };
    case 'FINANCEIRO':
      return {
        statuses: ['APROVADO', 'PAGO'],
      };
    case 'ADMIN':
    default:
      return {};
  }
}

// Verifica se um usuário pode visualizar uma solicitação específica
// Lança ForbiddenError se não puder
function assertCanView(
  user: ActingUser,
  reimbursement: { solicitanteId: string; status: StatusSolicitacao },
): void {
  if (user.perfil === 'ADMIN') return;

  if (user.perfil === 'COLABORADOR') {
    if (reimbursement.solicitanteId !== user.id) {
      throw new ForbiddenError(
        'Você só pode visualizar suas próprias solicitações.',
      );
    }
    return;
  }

  if (user.perfil === 'GESTOR') {
    if (reimbursement.status === 'RASCUNHO') {
      throw new ForbiddenError(
        'Solicitações em rascunho são visíveis apenas ao solicitante',
      );
    }
    return;
  }

  if (user.perfil === 'FINANCEIRO') {
    if (
      reimbursement.status !== 'APROVADO' &&
      reimbursement.status !== 'PAGO'
    ) {
      throw new ForbiddenError(
        'Financeiro só pode visualizar solicitações aprovadas ou pagas',
      );
    }
    return;
  }
}

export const reimbursementsService = {
  // CRUD

  async create(user: ActingUser, input: CreateReimbursementInput) {
    // Apenas COLABORADOR cria solicitações
    // Middleware requireRole garante isso (checagem aqui mantém a
    // regra consistente caso o service seja usado fora do HTTP)

    if (user.perfil !== 'COLABORADOR') {
      throw new ForbiddenError('Apenas colaboradores podem criar solicitações');
    }

    // Valida a categoria
    await assertCategoryAndLimit(input.categoriaId, input.valor);

    // Cria a solicitacão + histórico CREATED dentro de uma transação
    return prisma.$transaction(async (tx) => {
      const created = await tx.solicitacaoReembolso.create({
        data: {
          solicitanteId: user.id,
          categoriaId: input.categoriaId,
          descricao: input.descricao,
          valor: input.valor,
          dataDespesa: input.dataDespesa,
        },
        include: {
          categoria: { select: { id: true, nome: true, ativo: true } },
          solicitante: {
            select: { id: true, nome: true, email: true, perfil: true },
          },
        },
      });

      await logHistory(tx, {
        solicitacaoId: created.id,
        usuarioId: user.id,
        acao: 'CREATED',
        observacao: 'Solicitação criada em rascunho',
      });

      return created;
    });
  },

  // Busca reembolsos conforme permissão do perfil
  async findMany(user: ActingUser) {
    const filters = buildVisibilityFilter(user);
    return reimbursementsRepository.findMany(filters);
  },

  async findById(user: ActingUser, id: string) {
    const found = await reimbursementsRepository.findById(id);
    if (!found) {
      throw new NotFoundError('Solicitação não encontrada');
    }
    assertCanView(user, found);
    return found;
  },

  // Permite que o colaborador edite os dados do reembolso (valor, descrição, data) antes de enviar
  async update(user: ActingUser, id: string, input: UpdateReimbursementInput) {
    const found = await reimbursementsRepository.findById(id);
    if (!found) {
      throw new NotFoundError('Solicitação não encontrada');
    }

    // Apenas o dono pode editar
    if (found.solicitanteId !== user.id) {
      throw new ForbiddenError(
        'Você só pode editar suas próprias solicitações',
      );
    }

    // Apenas em RASCUNHOp ermite edição
    if (found.status !== 'RASCUNHO') {
      throw new BadRequestError(
        'Apenas solicitações em rascunho podem ser editadas',
      );
    }

    // Se a categoria ou valor está sendo alterada, revalida o limite
    if (input.categoriaId !== undefined || input.valor !== undefined) {
      const categoriaId = input.categoriaId ?? found.categoriaId;
      const valor = input.valor ?? found.valor;
      await assertCategoryAndLimit(categoriaId, valor);
    }

    // Atualiza dados da solicitação
    return prisma.$transaction(async (tx) => {
      const updated = await tx.solicitacaoReembolso.update({
        where: { id },
        data: input,
        include: {
          categoria: { select: { id: true, nome: true, ativo: true } },
          solicitante: {
            select: { id: true, nome: true, email: true, perfil: true },
          },
        },
      });

      await logHistory(tx, {
        solicitacaoId: id,
        usuarioId: user.id,
        acao: 'UPDATED',
        observacao: 'Solicitação atualizada',
      });
      return updated;
    });
  },

  // Função genérica para executar transições de estado
  // Recebe a ação (SUBTMIT/APPROVE/...) e econsulta o mapa
  // em reimbursements.state para validar:
  // 1. Se o estado atual permite essa ação
  // 2. Se o perfil do usuário pode executar
  // 3. Se exige ser dono, se ele é

  // Passando, executa em transação:
  // - Atualiza status (e justificativa caso REJECT)
  // - Insere registro no histórico
  async executeTransition(
    user: ActingUser,
    id: string,
    action: ReimbursementAction,
    options?: { justificativa?: string },
  ) {
    // Tenta buscar a regra de transição para essa ação
    const rule = transitions[action];

    const found = await reimbursementsRepository.findById(id);
    if (!found) {
      throw new NotFoundError('Solicitação não encontrada');
    }

    // 1. Perfil tem permissão?
    if (!rule.allowedRoles.includes(user.perfil)) {
      throw new ForbiddenError(
        `Apenas os perfis ${rule.allowedRoles.join(', ')} podem executar esta ação`,
      );
    }

    // 2. É o dono da solicitação (se exige)?
    if (rule.ownerOnly && found.solicitanteId !== user.id) {
      throw new ForbiddenError(
        'Apenas o solicitante pode executar esta ação na própria solicitação',
      );
    }

    // 3. Status atual permite a transição?
    if (!rule.from.includes(found.status)) {
      throw new BadRequestError(
        `Transição inválida: solicitação está em ${found.status} e a ação ${action} ` +
          `só pode ser executada a partir de ${rule.from.join(' ou ')}`,
      );
    }

    // 4. REJECT exige justificativa?
    if (action === 'REJECT' && !options?.justificativa) {
      throw new BadRequestError('Justificativa é obrigatória ao rejeitar');
    }

    // Executa update + histórico em transação
    return prisma.$transaction(async (tx) => {
      const updateData: Prisma.SolicitacaoReembolsoUpdateInput = {
        status: rule.to,
      };
      if (action === 'REJECT' && options?.justificativa) {
        updateData.justificativaRejeicao = options.justificativa;
      }

      const updated = await tx.solicitacaoReembolso.update({
        where: { id },
        data: updateData,
        include: {
          categoria: { select: { id: true, nome: true, ativo: true } },
          solicitante: {
            select: { id: true, nome: true, email: true, perfil: true },
          },
        },
      });

      // Observação para o histórico
      const observacoes: Record<ReimbursementAction, string> = {
        SUBMIT: 'Solicitação enviada para análise',
        APPROVE: 'Solicitação aprovada pelo gestor',
        REJECT: `Solicitação rejeitada: ${options?.justificativa ?? ''}`,
        PAY: 'Pagamento realizado pelo financeiro',
        CANCEL: 'Solicitação cancelada pelo solicitante',
      };

      await logHistory(tx, {
        solicitacaoId: id,
        usuarioId: user.id,
        acao: rule.historyAction,
        observacao: observacoes[action],
      });

      return updated;
    });
  },
};
