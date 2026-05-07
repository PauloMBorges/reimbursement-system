import type { StatusSolicitacao } from '@/types';

interface StatusBadgeProps {
  status: StatusSolicitacao;
}

// Mapa de cores por status
// Usar Record<...> garante que todos status estejam mapeados
const STATUS_STYLES: Record<StatusSolicitacao, { label: string; className: string }> = {
  RASCUNHO: {
    label: 'Rascunho',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  ENVIADO: {
    label: 'Enviado',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  APROVADO: {
    label: 'Aprovado',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  REJEITADO: {
    label: 'Rejeitado',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  PAGO: {
    label: 'Pago',
    className: 'bg-pitang-red/10 text-pitang-red border-pitang-red/20',
  },
  CANCELADO: {
    label: 'Cancelado',
    className: 'bg-gray-100 text-gray-500 border-gray-200',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
    >
      {label}
    </span>
  );
}