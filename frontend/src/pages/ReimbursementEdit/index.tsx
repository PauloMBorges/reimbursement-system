import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ReimbursementForm } from '@/components/shared/ReimbursementForm';
import { useReimbursement } from '@/hooks/useReimbursements';
import { useReimbursementMutations } from '@/hooks/useReimbursementMutations';
import { useAuth } from '@/contexts/useAuth';
import { getErrorMessage } from '@/api/http';
import type { ReimbursementFormInput } from '@/lib/schemas/reimbursement.schema';

export function ReimbursementEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: reimbursement, isLoading, error } = useReimbursement(id ?? '');
  const { update } = useReimbursementMutations();

  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Estado de erro
  if (error || !reimbursement) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? getErrorMessage(error) : 'Solicitação não encontrada.'}
      </div>
    );
  }

  // Edição só permitida em RASCUNHO e pelo dono.
  // O backend já bloqueia, mas o UI também impede para evitar uma tela 'estranha'
  const isOwner = reimbursement.solicitanteId === user?.id;
  const isDraft = reimbursement.status === 'RASCUNHO';

  if (!isOwner || !isDraft) {
    return (
      <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">
        Esta solicitação não pode ser editada.
        {!isDraft && ' Apenas rascunhos podem ser editados.'}
      </div>
    );
  }

  async function handleSubmit(data: ReimbursementFormInput) {
    if (!id) return;
    try {
      await update.mutateAsync({ id, payload: {
        categoriaId: data.categoriaId,
        descricao: data.descricao,
        valor: parseFloat(data.valor),
        dataDespesa: data.dataDespesa,
      },
    });
      toast.success('Rascunho atualizado');
      navigate(`/reimbursements/${id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/reimbursements/${id}`)}
        className="-ml-3"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editar Rascunho</CardTitle>
          <CardDescription>
            Faça as alterações necessárias. Após enviar, a solicitação não poderá
            mais ser editada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReimbursementForm
            initialData={reimbursement}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/reimbursements/${id}`)}
            submitLabel="Salvar alterações"
          />
        </CardContent>
      </Card>
    </div>
  );
}