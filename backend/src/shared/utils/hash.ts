import bcrypt from 'bcryptjs';
import { env } from '@/config/env';

// Gera o hash de uma senha em texto puro
// Usado no momento de criar/atualizar usuários

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, env.BCRYPT_SALT_ROUNDS);
}

// Compara uma senha em texto puro com hash armazenado
// Retorna true se baterem

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
