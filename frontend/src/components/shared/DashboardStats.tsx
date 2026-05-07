import { useAuth } from '@/contexts/useAuth';
import { useStats } from '@/hooks/useStats';
import { StatCard } from './StatCard';
import {
  CheckCircle2,
  Clock,
  CreditCard,
  FileEdit,
  Send,
  XCircle,
} from 'lucide-react';

export function DashboardStats() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useStats();

  if (!user || isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-[100px] rounded-xl bg-muted/40 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Renderização adaptativa por perfil
  switch (user.perfil) {
    case 'COLABORADOR':
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard
            label="Rascunhos"
            count={stats.rascunho?.count ?? 0}
            total={stats.rascunho?.total ?? '0'}
            icon={<FileEdit className="h-4 w-4" />}
            accentClassName="bg-slate-100 text-slate-600"
          />
          <StatCard
            label="Aguardando"
            count={stats.enviado?.count ?? 0}
            total={stats.enviado?.total ?? '0'}
            icon={<Send className="h-4 w-4" />}
            accentClassName="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Aprovados"
            count={stats.aprovado?.count ?? 0}
            total={stats.aprovado?.total ?? '0'}
            icon={<CheckCircle2 className="h-4 w-4" />}
            accentClassName="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            label="Rejeitados"
            count={stats.rejeitado?.count ?? 0}
            total={stats.rejeitado?.total ?? '0'}
            icon={<XCircle className="h-4 w-4" />}
            accentClassName="bg-red-50 text-red-600"
          />
          <StatCard
            label="Pagos"
            count={stats.pago?.count ?? 0}
            total={stats.pago?.total ?? '0'}
            icon={<CreditCard className="h-4 w-4" />}
            accentClassName="bg-pitang-red/10 text-pitang-red"
          />
        </div>
      );

    case 'GESTOR':
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Aguardando análise"
            count={stats.aguardandoAnalise?.count ?? 0}
            total={stats.aguardandoAnalise?.total ?? '0'}
            icon={<Clock className="h-4 w-4" />}
            accentClassName="bg-amber-50 text-amber-600"
          />
          <StatCard
            label="Aprovadas"
            count={stats.aprovadas?.count ?? 0}
            total={stats.aprovadas?.total ?? '0'}
            icon={<CheckCircle2 className="h-4 w-4" />}
            accentClassName="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            label="Rejeitadas"
            count={stats.rejeitadas?.count ?? 0}
            total={stats.rejeitadas?.total ?? '0'}
            icon={<XCircle className="h-4 w-4" />}
            accentClassName="bg-red-50 text-red-600"
          />
          <StatCard
            label="Pagas"
            count={stats.pagas?.count ?? 0}
            total={stats.pagas?.total ?? '0'}
            icon={<CreditCard className="h-4 w-4" />}
            accentClassName="bg-pitang-red/10 text-pitang-red"
          />
        </div>
      );

    case 'FINANCEIRO':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <StatCard
            label="Aguardando pagamento"
            count={stats.aguardandoPagamento?.count ?? 0}
            total={stats.aguardandoPagamento?.total ?? '0'}
            icon={<Clock className="h-4 w-4" />}
            accentClassName="bg-amber-50 text-amber-600"
          />
          <StatCard
            label="Pagas"
            count={stats.pagas?.count ?? 0}
            total={stats.pagas?.total ?? '0'}
            icon={<CreditCard className="h-4 w-4" />}
            accentClassName="bg-pitang-red/10 text-pitang-red"
          />
        </div>
      );

    case 'ADMIN':
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            label="Rascunhos"
            count={stats.rascunho?.count ?? 0}
            total={stats.rascunho?.total ?? '0'}
            icon={<FileEdit className="h-4 w-4" />}
            accentClassName="bg-slate-100 text-slate-600"
          />
          <StatCard
            label="Enviados"
            count={stats.enviado?.count ?? 0}
            total={stats.enviado?.total ?? '0'}
            icon={<Send className="h-4 w-4" />}
            accentClassName="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Aprovados"
            count={stats.aprovado?.count ?? 0}
            total={stats.aprovado?.total ?? '0'}
            icon={<CheckCircle2 className="h-4 w-4" />}
            accentClassName="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            label="Rejeitados"
            count={stats.rejeitado?.count ?? 0}
            total={stats.rejeitado?.total ?? '0'}
            icon={<XCircle className="h-4 w-4" />}
            accentClassName="bg-red-50 text-red-600"
          />
          <StatCard
            label="Pagos"
            count={stats.pago?.count ?? 0}
            total={stats.pago?.total ?? '0'}
            icon={<CreditCard className="h-4 w-4" />}
            accentClassName="bg-pitang-red/10 text-pitang-red"
          />
          <StatCard
            label="Cancelados"
            count={stats.cancelado?.count ?? 0}
            total={stats.cancelado?.total ?? '0'}
            icon={<XCircle className="h-4 w-4" />}
            accentClassName="bg-gray-100 text-gray-500"
          />
        </div>
      );

    default:
      return null;
  }
}