import type { StatusSolicitacao } from '@/types';

interface StatusBadgeProps {
  status: StatusSolicitacao;
}

// Mapa de cores por status
// Usar Record<...> garante que todos status estejam mapeados
const STATUS_STYLES: Record<StatusSolicitacao, string> = {
  RASCUNHO: 'bg-slate-100 text-slate-700 border-slate-200',
  ENVIADO: 'bg-blue-100 text-blue-700 border-blue-200',
  APROVADO: 'bg-green-100 text-green-700 border-green-200',
  REJEITADO: 'bg-red-100 text-red-700 border-red-200',
  PAGO: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CANCELADO: 'bg-gray-100 text-gray-500 border-gray-200',
};

const STATUS_LABELS: Record<StatusSolicitacao, string> = {
  RASCUNHO: 'Rascunho',
  ENVIADO: 'Enviado',
  APROVADO: 'Aprovado',
  REJEITADO: 'Rejeitado',
  PAGO: 'Pago',
  CANCELADO: 'Cancelado',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
