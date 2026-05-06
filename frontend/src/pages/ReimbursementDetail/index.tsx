import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Timeline } from '@/components/shared/Timeline';
import { AttachmentsList } from '@/components/shared/AttachmentsList';
import { ReimbursementActions } from '@/components/shared/ReimbursementActions';
import { useReimbursement } from '@/hooks/useReimbursements';
import { useHistory } from '@/hooks/useHistory';
import { useAuth } from '@/contexts/useAuth';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import { getErrorMessage } from '@/api/http';

export function ReimbursementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: reimbursement,
    isLoading: isLoadingReimbursement,
    error: errorReimbursement,
  } = useReimbursement(id ?? '');

  const { data: history, isLoading: isLoadingHistory } = useHistory(id ?? '');

  // Loading da solicitação principal
  if (isLoadingReimbursement) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Erro ou not found
  if (errorReimbursement || !reimbursement) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="-ml-3">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {errorReimbursement ? getErrorMessage(errorReimbursement) : 'Solicitação não encontrada.'}
        </div>
      </div>
    );
  }

  const isOwner = reimbursement.solicitanteId === user?.id;
  const isDraft = reimbursement.status === 'RASCUNHO';
  const canManageAttachments = isOwner && isDraft;

  return (
    <div className="max-w-4xl space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="-ml-3">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para o dashboard
      </Button>

      {/* Cabeçalho com status, valor e ações */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-2xl">{formatCurrency(reimbursement.valor)}</CardTitle>
                <StatusBadge status={reimbursement.status} />
              </div>
              <CardDescription>
                {reimbursement.categoria.nome} • {formatDate(reimbursement.dataDespesa)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Descrição</h3>
            <p className="text-sm whitespace-pre-wrap">{reimbursement.descricao}</p>
          </div>

          {reimbursement.justificativaRejeicao && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
              <h3 className="text-sm font-semibold text-destructive mb-1">Motivo da rejeição</h3>
              <p className="text-sm">{reimbursement.justificativaRejeicao}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Solicitante</p>
              <p className="text-sm font-medium">{reimbursement.solicitante.nome}</p>
              <p className="text-xs text-muted-foreground">{reimbursement.solicitante.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Criada em</p>
              <p className="text-sm">{formatDateTime(reimbursement.criadoEm)}</p>
            </div>
          </div>

          <div className="pt-2 border-t">
            <ReimbursementActions reimbursement={reimbursement} />
          </div>
        </CardContent>
      </Card>

      {/* Anexos */}
      <Card>
        <CardContent className="pt-6">
          <AttachmentsList reimbursementId={reimbursement.id} canAdd={canManageAttachments} />
        </CardContent>
      </Card>

      {/* Histórico */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico</CardTitle>
          <CardDescription>Linha do tempo de eventos desta solicitação</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingHistory && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {history && <Timeline entries={history} />}
        </CardContent>
      </Card>
    </div>
  );
}
