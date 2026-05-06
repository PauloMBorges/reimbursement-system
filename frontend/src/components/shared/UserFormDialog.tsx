import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  userFormSchema,
  type UserFormInput,
} from '@/lib/schemas/user.schema';
import { useUserMutations } from '@/hooks/useUsers';
import { getErrorMessage } from '@/api/http';

interface UserFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void
}

export function UserFormDialog({ open, onOpenChange }: UserFormDialogProps ){
    const { create } = useUserMutations();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<UserFormInput>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            nome: '',
            email: '',
            senha: '',
            perfil: 'COLABORADOR',
        },
    });

    // Reseta o formulário quando o dialog é fechado.
    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    async function onSubmit(data: UserFormInput) {
        try {
            await create.mutateAsync(data);
            toast.success('Usuário criado');
            onOpenChange(false);
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    }

     return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo usuário</DialogTitle>
          <DialogDescription>
            Crie um novo usuário com acesso ao sistema. O usuário poderá entrar
            com o email e senha cadastrados.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="nome">Nome completo</FieldLabel>
            <Input id="nome" {...register('nome')} />
            {errors.nome && <FieldError>{errors.nome.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="senha">Senha</FieldLabel>
            <Input
              id="senha"
              type="password"
              // Impede que o gerenciador de senhas do admin tente preencher 
              // a sua própria senha no campo, já que está criando uma conta para outra pessoa
              autoComplete="new-password"
              {...register('senha')}
            />
            {errors.senha && <FieldError>{errors.senha.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="perfil">Perfil</FieldLabel>
            <Controller
              name="perfil"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="perfil">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COLABORADOR">Colaborador</SelectItem>
                    <SelectItem value="GESTOR">Gestor</SelectItem>
                    <SelectItem value="FINANCEIRO">Financeiro</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.perfil && <FieldError>{errors.perfil.message}</FieldError>}
          </Field>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={create.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar usuário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
