// Espelhamento dos tipos da API
// Centraliza todo vocabulário do sistema 
// Quando o backend mudar, atualizamos só aqui

export type PerfilUsuario = 'COLABORADOR' | 'GESTOR' | 'FINANCEIRO' | 'ADMIN';

export type StatusSolicitacao =
  | 'RASCUNHO'
  | 'ENVIADO'
  | 'APROVADO'
  | 'REJEITADO'
  | 'PAGO'
  | 'CANCELADO';

  export type AcaoHistorico =
  | 'CREATED'
  | 'UPDATED'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAID'
  | 'CANCELED';

  export type TipoArquivo = 'PDF' | 'JPG' | 'PNG';

  export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface Categoria {
  id: string;
  nome: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Reimbursement {
  id: string;
  solicitanteId: string;
  categoriaId: string;
  descricao: string;
  valor: string; // Decimal vem como string da API
  dataDespesa: string;
  status: StatusSolicitacao;
  justificativaRejeicao: string | null;
  criadoEm: string;
  atualizadoEm: string;
  categoria: Pick<Categoria, 'id' | 'nome' | 'ativo'>;
  solicitante: Pick<Usuario, 'id' | 'nome' | 'email' | 'perfil'>;
}

export interface HistoricoEntry {
  id: string;
  solicitacaoId: string;
  usuarioId: string;
  acao: AcaoHistorico;
  observacao: string | null;
  criadoEm: string;
  usuario: Pick<Usuario, 'id' | 'nome' | 'email' | 'perfil'>;
}

export interface Anexo {
  id: string;
  solicitacaoId: string;
  nomeArquivo: string;
  urlArquivo: string;
  tipoArquivo: TipoArquivo;
  criadoEm: string;
}

// Resposta padronizada de erro do nosso backend
export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
  issues?: Record<string, string[]>;
  formErrors?: string[];
}