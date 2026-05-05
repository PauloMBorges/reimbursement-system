import { useContext } from 'react';
import { AuthContext } from './auth-context';

// Importa o objeto de contexto criado no auth-context.ts 
// e consome utilizando o hook useContext
// Porta de entrada para as telas da interface acessarem os dados
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}