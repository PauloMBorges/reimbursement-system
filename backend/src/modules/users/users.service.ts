import { hashPassword } from '@/shared/utils/hash';
import { BadRequestError } from '@/shared/errors';
import { usersRepository } from './users.repository';
import { CreateUserInput } from './users.schemas';

// Regra de negócio de usuários
// Verifica se o email já existe antes de cadastrar, executa o hash da senha e chama o repository para salvar os dados

export const usersService = {
  async create(input: CreateUserInput) {
    const existente = await usersRepository.findByEmail(input.email);
    if (existente) {
      throw new BadRequestError('Email já cadastrado');
    }

    const senhaHash = await hashPassword(input.senha);

    return usersRepository.create({
      nome: input.nome,
      email: input.email,
      senha: senhaHash,
      perfil: input.perfil,
    });
  },

  async findAll() {
    return usersRepository.findAll();
  },
};
