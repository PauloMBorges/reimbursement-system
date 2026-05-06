import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { ExternalLink, FileText, Image as ImageIcon, Paperclip, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAttachments } from '@/hooks/useAttachments';
import { useAttachmentMutations } from '@/hooks/useAttachmentMutations';
import { getErrorMessage } from '@/api/http';
import type { Anexo, TipoArquivo } from '@/types';

const attachmentSchema = z.object({
  nomeArquivo: z.string().min(1, 'Nome do arquivo é obrigatório'),
  urlArquivo: z.string().url('URL inválida'),
  tipoArquivo: z.enum(['PDF', 'JPG', 'PNG']),
});

type AttachmentInput = z.infer<typeof attachmentSchema>;

interface AttachmentsListProps {
  reimbursementId: string;
   //Se true, exibe o botão "Adicionar anexo".
   // Geralmente true apenas para o dono em RASCUNHO.
  canAdd: boolean;
}

const TIPO_ICON: Record<TipoArquivo, typeof FileText> = {
  PDF: FileText,
  JPG: ImageIcon,
  PNG: ImageIcon,
};

export function AttachmentsList({ reimbursementId, canAdd }: AttachmentsListProps) {
  const { data: anexos, isLoading } = useAttachments(reimbursementId);
  const { create } = useAttachmentMutations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AttachmentInput>({
    resolver: zodResolver(attachmentSchema),
    defaultValues: { nomeArquivo: '', urlArquivo: '', tipoArquivo: 'PDF' },
  });

  async function onSubmit(data: AttachmentInput) {
    try {
      await create.mutateAsync({ reimbursementId, payload: data });
      toast.success('Anexo adicionado');
      reset();
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Paperclip className="h-4 w-4" />
          Anexos ({anexos?.length ?? 0})
        </h3>
        {canAdd && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar anexo</DialogTitle>
                <DialogDescription>
                  Informe o nome, a URL e o tipo do arquivo. Em uma versão real,
                  haveria upload direto.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="nomeArquivo">Nome do arquivo</FieldLabel>
                  <Input
                    id="nomeArquivo"
                    placeholder="comprovante.pdf"
                    {...register('nomeArquivo')}
                  />
                  {errors.nomeArquivo && <FieldError>{errors.nomeArquivo.message}</FieldError>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="urlArquivo">URL do arquivo</FieldLabel>
                  <Input
                    id="urlArquivo"
                    placeholder="https://exemplo.com/comprovante.pdf"
                    {...register('urlArquivo')}
                  />
                  {errors.urlArquivo && <FieldError>{errors.urlArquivo.message}</FieldError>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="tipoArquivo">Tipo</FieldLabel>
                  <Controller
                    name="tipoArquivo"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="tipoArquivo">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PDF">PDF</SelectItem>
                          <SelectItem value="JPG">JPG</SelectItem>
                          <SelectItem value="PNG">PNG</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.tipoArquivo && <FieldError>{errors.tipoArquivo.message}</FieldError>}
                </Field>
                <DialogFooter className="gap-2 sm:gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={create.isPending}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={create.isPending}>
                    {create.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Adicionar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Carregando anexos...</p>
      )}

      {!isLoading && anexos && anexos.length === 0 && (
        <p className="text-sm text-muted-foreground py-2">Nenhum anexo.</p>
      )}

      {anexos && anexos.length > 0 && (
        <ul className="space-y-2">
          {anexos.map((anexo) => (
            <AttachmentItem key={anexo.id} anexo={anexo} />
          ))}
        </ul>
      )}
    </div>
  );
}

function AttachmentItem({ anexo }: { anexo: Anexo }) {
  const Icon = TIPO_ICON[anexo.tipoArquivo];
  return (
    <li className="flex items-center justify-between gap-2 p-2 rounded-md border bg-card">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-sm truncate" title={anexo.nomeArquivo}>
          {anexo.nomeArquivo}
        </span>
        <span className="text-xs text-muted-foreground shrink-0">
          ({anexo.tipoArquivo})
        </span>
      </div>
      <a
        href={anexo.urlArquivo}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground shrink-0"
        aria-label="Abrir anexo"
      >
        <ExternalLink className="h-4 w-4" />
      </a>
    </li>
  );
}