import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Reimbursement } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';
import { StatusBadge } from './StatusBadge';

interface ReimbursementsTableProps {
  reimbursements: Reimbursement[];
}

export function ReimbursementsTable({ reimbursements }: ReimbursementsTableProps) {
  if (reimbursements.length === 0) {
    return (
      <div className="rounded-md border bg-card p-8 text-center">
        <p className="text-muted-foreground">Nenhuma solicitação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50 border-b">
          <tr className="text-left text-sm text-muted-foreground">
            <th className="px-4 py-3 font-medium">Solicitante</th>
            <th className="px-4 py-3 font-medium">Categoria</th>
            <th className="px-4 py-3 font-medium">Descrição</th>
            <th className="px-4 py-3 font-medium">Valor</th>
            <th className="px-4 py-3 font-medium">Data</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody>
          {reimbursements.map((r) => (
            <tr key={r.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 text-sm">{r.solicitante.nome}</td>
              <td className="px-4 py-3 text-sm">{r.categoria.nome}</td>
              <td className="px-4 py-3 text-sm max-w-xs truncate" title={r.descricao}>
                {r.descricao}
              </td>
              <td className="px-4 py-3 text-sm font-medium">{formatCurrency(r.valor)}</td>
              <td className="px-4 py-3 text-sm">{formatDate(r.dataDespesa)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-3">
                <Link
                  to={`/reimbursements/${r.id}`}
                  className="inline-flex items-center text-muted-foreground hover:text-foreground"
                  aria-label="Ver detalhes"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
