import { Request, Response, NextFunction } from 'express';
import { PerfilUsuario } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '@/shared/errors';

// Middleware de controle de acesso por perfil (RBAC)
// Recebe um ou mais perfis permitidos. Se o usuário autenticado não tiver um desses perfis, retorna 403 Forbidden

export function requireRole(...perfisPermitidos: PerfilUsuario[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Usuário não autenticado'));
    }

    if (!perfisPermitidos.includes(req.user.perfil)) {
      return next(
        new ForbiddenError(
          `Acesso negado. Perfis permitidos: ${perfisPermitidos.join(', ')}`,
        ),
      );
    }
    next();
  };
}
