import { useReimbursements } from '@/hooks/useReimbursements';
import { ReimbursementsTable } from '@/components/shared/ReimbursementsTable';
import { ReimbursementsTableSkeleton } from '@/components/shared/ReimbursementsTableSkeleton';
import { NewReimbursementButton } from '@/components/shared/NewReimbursementButton';
import { getErrorMessage } from '@/api/http';

export function DashboardPage() {
  const { data, isLoading, error } = useReimbursements();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Solicitações de Reembolso</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe suas solicitações e aprovações
          </p>
        </div>
        <NewReimbursementButton />
      </div>

      {isLoading && <ReimbursementsTableSkeleton />}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {getErrorMessage(error)}
        </div>
      )}

      {data && <ReimbursementsTable reimbursements={data} />}
    </div>
  );
}
