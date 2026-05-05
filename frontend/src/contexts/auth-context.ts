import { createContext } from 'react';
import type { PerfilUsuario, Usuario } from '@/types';

// Interface que tipa os dados e métodos da autenticação
export interface AuthContextValue {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  hasRole: (...perfis: PerfilUsuario[]) => boolean;
}
// Cria o contexto com o tipo da interface AuthContextValue e valor inicial undefined
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);