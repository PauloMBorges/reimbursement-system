import { Request, Response, NextFunction } from 'express';
import { PerfilUsuario } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '@/shared/errors';

// Middleware de controle de acesso por perfil (RBAC)
// Recebe um ou mais perfis permitidos. Se o usuário autenticado não tiver um desses perfis, retorna 403 Forbidden

// ...perfisPermitidos permite chamar requireRole('GESTOR') ou requireRole('GESTOR', 'ADMIN') sem ter que passar array explicitamente
export function requireRole(...perfisPermitidos: PerfilUsuario[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Checagem de req.user antes, caso esquecer de colocar authMiddleware ante do requireRole na rota
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
