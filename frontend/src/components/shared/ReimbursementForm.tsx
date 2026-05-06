import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import {
  reimbursementFormSchema,
  type ReimbursementFormInput,
} from '@/lib/schemas/reimbursement.schema';
import type { Reimbursement } from '@/types';

interface ReimbursementFormProps {
    // Reembolso existente para prencher o form em modo edição
    // Quando undefined o formulário começa vazio (criação)
    initialData?: Reimbursement; 

    // Callback chamado ao submeter o form com dados válidos
    // Recebe os dados já validados pelo Zod
    onSubmit: (data: ReimbursementFormInput) => Promise<void>;

    // Callback chamado quando o usuário clica em 'Cancelar'
    onCancel: () => void;

    // Rótulo do botão de submissão (default: 'Salvar')
    submitLabel?: string;
}

export function ReimbursementForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Salvar',
}: ReimbursementFormProps) {
  const { data: categorias, isLoading: isLoadingCategorias } = useCategories();

  // Inicializa o gerenciador de estado do form com o schema de validação
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ReimbursementFormInput>({
    resolver: zodResolver(reimbursementFormSchema),
    defaultValues: initialData
      ? {
          categoriaId: initialData.categoriaId,
          descricao: initialData.descricao,
          valor: initialData.valor,
          // Backend retorna ISO string completa, corta só a data (YYYY-MM-DD).
          dataDespesa: initialData.dataDespesa.slice(0, 10),
        }
      : {
          // Quando não há dados iniciais, começa com campos vazios
          categoriaId: '',
          descricao: '',
          valor: '',
          dataDespesa: '',
        },
  });

  // Filtra apenas categorias ativas no dropdown
  // Se editando um reembolso com categoria inativa, mantém a opção
  // visível para o usuário não perder contexto
  const activeCategorias = categorias?.filter((c) => c.ativo) ?? [];
  const currentCategoria = categorias?.find((c) => c.id === initialData?.categoriaId);
  const showInactiveCurrent =
    currentCategoria && !currentCategoria.ativo && initialData;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="categoriaId">Categoria</FieldLabel>
        <Controller
          name="categoriaId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isLoadingCategorias}
            >
              <SelectTrigger id="categoriaId">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {showInactiveCurrent && currentCategoria && (
                  <SelectItem value={currentCategoria.id}>
                    {currentCategoria.nome} (inativa)
                  </SelectItem>
                )}
                {activeCategorias.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoriaId && <FieldError>{errors.categoriaId.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="valor">Valor (R$)</FieldLabel>
        <Input
          id="valor"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register('valor')}
        />
        {errors.valor && <FieldError>{errors.valor.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="dataDespesa">Data da despesa</FieldLabel>
        <Input
          id="dataDespesa"
          type="date"
          {...register('dataDespesa')}
        />
        {errors.dataDespesa && <FieldError>{errors.dataDespesa.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
        <Textarea
          id="descricao"
          placeholder="Descreva a despesa (ex: almoço com cliente, deslocamento, material...)"
          rows={4}
          {...register('descricao')}
        />
        {errors.descricao && <FieldError>{errors.descricao.message}</FieldError>}
      </Field>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}