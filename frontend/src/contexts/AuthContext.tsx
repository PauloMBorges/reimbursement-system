import { useState } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { tokenStorage, userStorage } from '@/api/http';
import type { PerfilUsuario, Usuario } from '@/types';
import { AuthContext, type AuthContextValue } from './auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  // Lazy Init: cria a variável de estado user (passa uma função
  // ao invés de um valor), só roda uma vez no primeiro render
  const [user, setUser] = useState<Usuario | null>(() => {
    const storedToken = tokenStorage.get();
    const storedUser = userStorage.get();
    return storedToken && storedUser ? storedUser : null;
  });

  const isLoading = false;

  async function login(email: string, senha: string) {
    const result = await authApi.login({ email, senha });
    tokenStorage.set(result.token);
    userStorage.set(result.usuario);
    setUser(result.usuario);
    //  Limpa cache de queries antigas
    // (caso tenha logado outro usuário antes sem fazer logout)
    queryClient.clear();
  }

  function logout() {
    tokenStorage.remove();
    userStorage.remove();
    setUser(null);
    // Limpa cache de queries antigas
    // (dados de usuário anterior podem aparecer brevemente
    // se o próximo login acontecer dentro do staleTime configurado)
    queryClient.clear();
  }

  function hasRole(...perfis: PerfilUsuario[]) {
    if (!user) return false;
    return perfis.includes(user.perfil);
  }

  // Provider que empacota todos estados e funções no objeto value
  // e os entrega para todos children (telas e componentes filhos) do app
  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
