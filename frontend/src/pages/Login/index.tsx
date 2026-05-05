import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/useAuth';
import { getErrorMessage } from '@/api/http';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

type LoginInput = z.infer<typeof loginSchema>

// Configuração do formulário 
export function LoginPage() {
    const navigate = useNavigate();
    const {login} = useAuth();
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
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
            <CardTitle className="text-2xl">Sistema de Reembolsos</CardTitle>
            <CardDescription>
                Entre com suas credenciais para acessar
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
            </form>
            </CardContent>
        </Card>
    </div>

    );
}

