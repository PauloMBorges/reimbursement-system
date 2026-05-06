import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Check, Edit, Send, X, CreditCard, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from './ConfirmDialog';
import { RejectDialog } from './RejectDialog';
import { useReimbursementMutations } from '@/hooks/useReimbursementMutations';
import { useAuth } from '@/contexts/useAuth';
import { getErrorMessage } from '@/api/http';
import type { Reimbursement } from '@/types';

interface ReimbursementActionsProps {
  reimbursement: Reimbursement;
}

type ActiveDialog =
  | { type: 'submit' }
  | { type: 'approve' }
  | { type: 'reject' }
  | { type: 'pay' }
  | { type: 'cancel' }
  | null;

export function ReimbursementActions({ reimbursement }: ReimbursementActionsProps) {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { submit, approve, reject, pay, cancel } = useReimbursementMutations();
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);

  const isOwner = reimbursement.solicitanteId === user?.id;
  const status = reimbursement.status;

  // Helper para fechar dialog após sucesso ou erro
  function closeDialog() {
    setActiveDialog(null);
  }

  // Wrappers que executam a mutation e tratam UI
  async function handleSubmit() {
    try {
      await submit.mutateAsync(reimbursement.id);
      toast.success('Solicitação enviada para aprovação');
      closeDialog();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleApprove() {
    try {
      await approve.mutateAsync(reimbursement.id);
      toast.success('Solicitação aprovada');
      closeDialog();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleReject(justificativa: string) {
    try {
      await reject.mutateAsync({
        id: reimbursement.id,
        payload: { justificativa },
      });
      toast.success('Solicitação rejeitada');
      closeDialog();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handlePay() {
    try {
      await pay.mutateAsync(reimbursement.id);
      toast.success('Pagamento registrado');
      closeDialog();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleCancel() {
    try {
      await cancel.mutateAsync(reimbursement.id);
      toast.success('Solicitação cancelada');
      closeDialog();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  // Lógica de visibilidade das ações
  // Espelha as transições válidas da máquina de estados do backend

  const canSubmit = isOwner && status === 'RASCUNHO';
  const canEdit = isOwner && status === 'RASCUNHO';
  const canApprove = hasRole('GESTOR') && status === 'ENVIADO';
  const canReject = hasRole('GESTOR') && status === 'ENVIADO';
  const canPay = hasRole('FINANCEIRO') && status === 'APROVADO';
  const canCancel = isOwner && (status === 'RASCUNHO' || status === 'ENVIADO');

  // Se não há ação possível, não renderiza nada
  const hasAnyAction = canSubmit || canEdit || canApprove || canReject || canPay || canCancel;

  if (!hasAnyAction) {
    return null;
  }

  // Render
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {canEdit && (
          <Button
            variant="outline"
            onClick={() => navigate(`/reimbursements/${reimbursement.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}

        {canSubmit && (
          <Button onClick={() => setActiveDialog({ type: 'submit' })}>
            <Send className="h-4 w-4 mr-2" />
            Enviar para aprovação
          </Button>
        )}

        {canApprove && (
          <Button onClick={() => setActiveDialog({ type: 'approve' })}>
            <Check className="h-4 w-4 mr-2" />
            Aprovar
          </Button>
        )}

        {canReject && (
          <Button variant="destructive" onClick={() => setActiveDialog({ type: 'reject' })}>
            <X className="h-4 w-4 mr-2" />
            Rejeitar
          </Button>
        )}

        {canPay && (
          <Button onClick={() => setActiveDialog({ type: 'pay' })}>
            <CreditCard className="h-4 w-4 mr-2" />
            Registrar pagamento
          </Button>
        )}

        {canCancel && (
          <Button variant="outline" onClick={() => setActiveDialog({ type: 'cancel' })}>
            <Ban className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        )}
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        open={activeDialog?.type === 'submit'}
        onOpenChange={(open) => !open && closeDialog()}
        title="Enviar para aprovação?"
        description="Após enviar, você não poderá mais editar esta solicitação. O gestor será notificado para aprovar ou rejeitar."
        confirmLabel="Enviar"
        isLoading={submit.isPending}
        onConfirm={handleSubmit}
      />

      <ConfirmDialog
        open={activeDialog?.type === 'approve'}
        onOpenChange={(open) => !open && closeDialog()}
        title="Aprovar solicitação?"
        description="A solicitação será marcada como aprovada e seguirá para o financeiro processar o pagamento."
        confirmLabel="Aprovar"
        isLoading={approve.isPending}
        onConfirm={handleApprove}
      />

      <RejectDialog
        open={activeDialog?.type === 'reject'}
        onOpenChange={(open) => !open && closeDialog()}
        isLoading={reject.isPending}
        onConfirm={handleReject}
      />

      <ConfirmDialog
        open={activeDialog?.type === 'pay'}
        onOpenChange={(open) => !open && closeDialog()}
        title="Registrar pagamento?"
        description="Esta ação marca a solicitação como paga e finaliza o fluxo. Não poderá ser revertida."
        confirmLabel="Confirmar pagamento"
        isLoading={pay.isPending}
        onConfirm={handlePay}
      />

      <ConfirmDialog
        open={activeDialog?.type === 'cancel'}
        onOpenChange={(open) => !open && closeDialog()}
        title="Cancelar solicitação?"
        description="A solicitação será cancelada permanentemente e não poderá ser reativada."
        confirmLabel="Sim, cancelar"
        cancelLabel="Voltar"
        variant="destructive"
        isLoading={cancel.isPending}
        onConfirm={handleCancel}
      />
    </>
  );
}
