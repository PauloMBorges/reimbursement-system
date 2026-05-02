import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/shared/utils/jwt';
import { UnauthorizedError } from '@/shared/errors';

// Middleware que protege rotas privadas

// Espera header Authorization no formato "Bearer <token>"
// Se válido, decodifica JWT e anexa os dados do usuário em req.user
// Se inválido ou ausente, lança UnauthorizedError que vira 401 no errorMiddleware

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  // Verifica se o header Authorization existe
  if (!authHeader) {
    return next(new UnauthorizedError('Token não fornecido'));
  }

  // Divide o header em scheme (Bearer) e token
  const [scheme, token] = authHeader.split(' ');

  // Verifica se o scheme é 'Bearer' e se o token existe
  if (scheme !== 'Bearer' || !token) {
    return next(
      new UnauthorizedError('Formato de token inválido. Use: Bearer <token>'),
    );
  }

  // Decodifica e valida o JWT
  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      perfil: payload.perfil,
    };
    next();
  } catch (err) {
    next(err);
  }
}
