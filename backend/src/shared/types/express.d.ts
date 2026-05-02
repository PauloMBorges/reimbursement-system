import { PerfilUsuario } from '@prisma/client';

// Extensão da interface Request do Express
// Adiciona tipagem para o objeto `user` inserido pelo middleware de autenticação

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        perfil: PerfilUsuario;
      };
    }
  }
}

export {};
