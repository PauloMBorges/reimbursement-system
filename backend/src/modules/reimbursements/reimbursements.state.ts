import {
  StatusSolicitacao,
  PerfilUsuario,
  AcaoHistorico,
} from '@prisma/client';

// Tipos de ações que provocam transição de status
// Cad ação corresponde a um endpoint específico

export type ReimbursementAction =
  | 'SUBMIT'
  | 'APPROVE'
  | 'REJECT'
  | 'PAY'
  | 'CANCEL';

// Regras de transição: a partir de quais status a ação é permitida,
// qual o status de destino, qual perfil pode executar e se exige
// ser o dono da solicitaçáo

// CANCEL aceita dois 'from' (RASCUNHO e ENVIADO), único caso de
// múltiplos estados de origem

interface TransitionRule {
  from: StatusSolicitacao[];
  to: StatusSolicitacao;
  allowedRoles: PerfilUsuario[];
  ownerOnly: boolean;
  historyAction: AcaoHistorico;
}

// Mapa de transições válidas

// Dicionário que o Service vai consultar toda vez que alguém fazer uma ação

export const transitions: Record<ReimbursementAction, TransitionRule> = {
  SUBMIT: {
    from: ['RASCUNHO'],
    to: 'ENVIADO',
    allowedRoles: ['COLABORADOR'],
    ownerOnly: true,
    historyAction: 'SUBMITTED',
  },
  APPROVE: {
    from: ['ENVIADO'],
    to: 'APROVADO',
    allowedRoles: ['GESTOR'],
    ownerOnly: false,
    historyAction: 'APPROVED',
  },
  REJECT: {
    from: ['ENVIADO'],
    to: 'REJEITADO',
    allowedRoles: ['GESTOR'],
    ownerOnly: false,
    historyAction: 'REJECTED',
  },
  PAY: {
    from: ['APROVADO'],
    to: 'PAGO',
    allowedRoles: ['FINANCEIRO'],
    ownerOnly: false,
    historyAction: 'PAID',
  },
  CANCEL: {
    from: ['RASCUNHO', 'ENVIADO'],
    to: 'CANCELADO',
    allowedRoles: ['COLABORADOR'],
    ownerOnly: true,
    historyAction: 'CANCELED',
  },
};
