import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReimbursementForm } from '@/components/shared/ReimbursementForm';
import { useReimbursementMutations } from '@/hooks/useReimbursementMutations';
import { getErrorMessage } from '@/api/http';
import type { ReimbursementFormInput } from '@/lib/schemas/reimbursement.schema';

export function ReimbursementCreatePage() {
  const navigate = useNavigate();
  const { create } = useReimbursementMutations();

  async function handleSubmit(data: ReimbursementFormInput) {
    try {
      const created = await create.mutateAsync({
        categoriaId: data.categoriaId,
        descricao: data.descricao,
        valor: parseFloat(data.valor),
        dataDespesa: data.dataDespesa,
      });
      toast.success('Solicitação criada como rascunho');
      navigate(`/reimbursements/${created.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="-ml-3">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Nova Solicitação</CardTitle>
          <CardDescription>
            Preencha os dados abaixo. A solicitação será criada como rascunho e você poderá editá-la
            antes de enviar para aprovação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReimbursementForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard')}
            submitLabel="Criar rascunho"
          />
        </CardContent>
      </Card>
    </div>
  );
}
