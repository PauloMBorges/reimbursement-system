import {
  CheckCircle2,
  Circle,
  CircleDashed,
  CreditCard,
  Edit,
  FilePlus,
  Send,
  XCircle,
} from 'lucide-react';
import type { AcaoHistorico, HistoricoEntry } from '@/types';
import { formatDateTime } from '@/lib/format';

interface TimelineProps {
  entries: HistoricoEntry[];
}

// Mapeamento de ação → ícone + descrição 
// Centraliza a 'tradução' de eventos técnicos para texto humano
const ACTION_CONFIG: Record<
  AcaoHistorico,
  { icon: typeof Circle; label: string; color: string }
> = {
  CREATED: { icon: FilePlus, label: 'criou a solicitação', color: 'text-slate-600' },
  UPDATED: { icon: Edit, label: 'editou a solicitação', color: 'text-slate-600' },
  SUBMITTED: { icon: Send, label: 'enviou para aprovação', color: 'text-blue-600' },
  APPROVED: { icon: CheckCircle2, label: 'aprovou a solicitação', color: 'text-green-600' },
  REJECTED: { icon: XCircle, label: 'rejeitou a solicitação', color: 'text-red-600' },
  PAID: { icon: CreditCard, label: 'registrou o pagamento', color: 'text-emerald-600' },
  CANCELED: { icon: CircleDashed, label: 'cancelou a solicitação', color: 'text-gray-500' },
};

export function Timeline({ entries }: TimelineProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Nenhum evento registrado ainda.
      </p>
    );
  }

  // Ordena do mais recente pro mais antigo 
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
  );

  return (
    <ol className="space-y-4">
      {sortedEntries.map((entry, index) => {
        const config = ACTION_CONFIG[entry.acao];
        const Icon = config.icon;
        const isLast = index === sortedEntries.length - 1;

        return (
          <li key={entry.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`rounded-full bg-muted p-1.5 ${config.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm">
                <span className="font-medium">{entry.usuario.nome}</span>{' '}
                <span className="text-muted-foreground">{config.label}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDateTime(entry.criadoEm)}
              </p>
              {entry.observacao && (
                <p className="text-sm mt-2 p-3 rounded-md bg-muted/50 border">
                  {entry.observacao}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}