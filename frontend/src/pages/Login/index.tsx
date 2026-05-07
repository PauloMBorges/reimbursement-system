import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Loader2, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/useAuth';
import { getErrorMessage } from '@/api/http';

const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

type LoginInput = z.infer<typeof loginSchema>;

// Configuração do formulário
export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Função que será chamada quando o formulário for enviado com sucesso
  async function onSubmit(data: LoginInput) {
    setServerError(null);
    try {
      await login(data.email, data.senha);
      navigate('/dashboard');
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  }

  return (
    <div className="min-h-screen flex">
 
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-pitang-red via-pitang-orange to-pitang-yellow">
  
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-pitang-yellow blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl p-2.5 shadow-lg">
              <Receipt className="h-7 w-7 text-pitang-red" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Reembolsos Pitang</span>
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="text-5xl font-bold leading-tight">
              Gestão simples de
              <br />
              reembolsos corporativos
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Solicite, acompanhe e aprove reembolsos com transparência total.
              Fluxo de aprovação inteligente, histórico completo, anexos e muito mais.
            </p>
          </div>

          <div className="text-sm text-white/70">
            Sistema de Controle de Solicitações de Reembolso
          </div>
        </div>
      </div>

      {/* Lado direito: formulário */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Header mobile (só aparece em telas pequenas) */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="bg-pitang-red rounded-xl p-2.5">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">Reembolsos</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Bem-vindo</h2>
            <p className="text-muted-foreground">
              Entre com suas credenciais para acessar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="senha">Senha</FieldLabel>
              <Input
                id="senha"
                type="password"
                autoComplete="current-password"
                {...register('senha')}
              />
              {errors.senha && <FieldError>{errors.senha.message}</FieldError>}
            </Field>

            {serverError && (
              <div
                role="alert"
                className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
              >
                {serverError}
              </div>
            )}

            <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Entrar
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Esqueceu sua senha? Contate o administrador do sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
