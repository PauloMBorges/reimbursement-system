import { prisma } from '@/config/prisma';
import { comparePassword } from '@/shared/utils/hash';
import { signToken } from '@/shared/utils/jwt';
import { UnauthorizedError } from '@/shared/errors';
import { LoginInput } from './auth.schemas';

interface LoginResult {
  token: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    perfil: string;
  };
}

export const authService = {
  async login({ email, senha }: LoginInput): Promise<LoginResult> {
    // Pega e-mail validado pelo Zod e busca no banco
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    // Mensagem genérica pra não vazar se o usuário existe
    if (!usuario) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    // Pega a senha que o usuário digitou, aplica o hash e compara com a senha armazenada
    const senhaCorreta = await comparePassword(senha, usuario.senha);
    if (!senhaCorreta) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    // E-mail existe e senha bateu -> gerar token (JWT_SECRET)
    const token = signToken({
      sub: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    };
  },
};
