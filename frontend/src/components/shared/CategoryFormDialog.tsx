import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
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
import { Input } from '@/components/ui/input';
import {
  categoryFormSchema,
  type CategoryFormInput,
} from '@/lib/schemas/category.schema';
import { useCategoryMutations } from '@/hooks/useCategoryMutations';
import { getErrorMessage } from '@/api/http';
import type { Categoria } from '@/types';


interface CategoryFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // Categoria existente para editar
    // Quando undefined, dialog em modo criação
    category?: Categoria;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const { create, update } = useCategoryMutations();
  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { nome: '' },
  });

  // Reseta o formulário quando o dialog abre/fecha ou quando muda a categoria
  useEffect(() => {
    if (open) {
      reset({ nome: category?.nome ?? '' });
    }
  }, [open, category, reset]);

  async function onSubmit(data: CategoryFormInput) {
    try {
      if (isEditing && category) {
        await update.mutateAsync({ id: category.id, payload: data });
        toast.success('Categoria atualizada');
      } else {
        await create.mutateAsync(data);
        toast.success('Categoria criada');
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  const isPending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar categoria' : 'Nova categoria'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere o nome da categoria.'
              : 'Categorias são usadas para classificar solicitações de reembolso.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="nome">Nome</FieldLabel>
            <Input
              id="nome"
              placeholder="Ex: Alimentação, Transporte..."
              {...register('nome')}
            />
            {errors.nome && <FieldError>{errors.nome.message}</FieldError>}
          </Field>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}