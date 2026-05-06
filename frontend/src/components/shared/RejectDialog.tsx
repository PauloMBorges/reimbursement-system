import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

const rejectSchema = z.object({
  justificativa: z
    .string()
    .min(1, 'Justificativa é obrigatória')
    .max(500, 'Justificativa deve ter no máximo 500 caracteres'),
});

type RejectInput = z.infer<typeof rejectSchema>;

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  onConfirm: (justificativa: string) => void;
}

export function RejectDialog({
  open,
  onOpenChange,
  isLoading = false,
  onConfirm,
}: RejectDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectInput>({
    resolver: zodResolver(rejectSchema),
    defaultValues: { justificativa: '' },
  });

  // Reseta o formulário quando o dialog é fechado externamente
  // (pra não manter texto antigo na próxima abertura)
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  function onSubmit(data: RejectInput) {
    onConfirm(data.justificativa);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejeitar solicitação</DialogTitle>
          <DialogDescription>
            Informe o motivo da rejeição. Esta justificativa será registrada no
            histórico e visível para o solicitante.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="justificativa">Justificativa</FieldLabel>
            <Textarea
              id="justificativa"
              rows={4}
              placeholder="Ex: Despesa não está dentro da política da empresa, faltam comprovantes, valor acima do permitido..."
              {...register('justificativa')}
            />
            {errors.justificativa && (
              <FieldError>{errors.justificativa.message}</FieldError>
            )}
          </Field>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Rejeitar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}