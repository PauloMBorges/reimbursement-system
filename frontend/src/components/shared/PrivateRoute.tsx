import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/useAuth';
import type { PerfilUsuario } from '@/types';

interface PrivateRouteProps {
  children: ReactNode;
  // Se informado, restringe o acesso aos perfis listados
  // Se omitido, qualquer perfil autenticado pode acessar
  allowedRoles?: PerfilUsuario[];
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  // Extrai as informações necessárias para tomar decisão de roteamento
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  // Bloqueia execução das próximas regras se a aplicação
  // ainda estiver lendo os dados de autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se foram informados perfis e o usuário não tem
  // nenhum deles, redireciona para o dashboard
  if (allowedRoles && !hasRole(...allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
