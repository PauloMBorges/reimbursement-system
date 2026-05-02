import { BadRequestError, NotFoundError } from '@/shared/errors';
import { categoriesRepository } from './categories.repository';
import { CreateCategoryInput, UpdateCategoryInput } from './categories.schemas';

// Camada de regras de negócio das categorias

export const categoriesService = {
  async findAll() {
    return categoriesRepository.findAll();
  },

  // Recebe nome que o usuário quer dar para categoria
  // Repository verifica no banco se nome já existe
  // Não confiar só no @unique do Prisma (voltaria como erro 500)
  async create({ nome }: CreateCategoryInput) {
    const existente = await categoriesRepository.findByName(nome);
    if (existente) {
      throw new BadRequestError('Já existe uma categoria com este nome');
    }

    return categoriesRepository.create({ nome });
  },

  // Atualiza categoria
  async update(id: string, input: UpdateCategoryInput) {
    const categoria = await categoriesRepository.findById(id);
    // Se categoria não existir retorna erro 404
    if (!categoria) {
      throw new NotFoundError('Categoria não encontrada');
    }

    // Se está alterando, verifica se o novo nome já está em uso por outra categoria (excluindo a própria)
    if (input.nome && input.nome !== categoria.nome) {
      const existente = await categoriesRepository.findByName(input.nome);
      if (existente) {
        throw new BadRequestError('Já existe uma categoria com esse nome');
      }
    }

    return categoriesRepository.update(id, input);
  },
};
