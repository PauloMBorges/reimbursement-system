import { PerfilUsuario } from '@prisma/client';

// Extensão da interface Request do Express

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
