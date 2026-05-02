import jwt, { SignOptions } from 'jsonwebtoken';
import { PerfilUsuario } from '@prisma/client';
import { env } from '@/config/env';
import { UnauthorizedError } from '@/shared/errors';

// Payload que armazenamos no JWT
// Apenas o suficiente para identificar o usuário e checar permissões sem consultar o banco

export interface JwtPayload {
  sub: string; // subject - id do usuário
  email: string;
  perfil: PerfilUsuario;
}

// Gera token JWT assinado com o segredo configurado
export function signToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

// Verifica e decodifica token JWT
// Lança UnauthorizedError se inválido, expirado ou malformado

export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    return decoded;
    // Catch genérico, qualquer falha vira UnauthorizedError (desnecessário mostrar detalhes de erro JWT pro cliente)
  } catch {
    throw new UnauthorizedError('Token inválido ou expirado');
  }
}
