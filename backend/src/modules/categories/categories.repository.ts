import { prisma } from '@/config/prisma';
import { CreateCategoryInput, UpdateCategoryInput } from './categories.schemas';

// Camada de acesso a dados de categorias
// Centraliza todas as queries relacionadas a tabela 'categorias'

export const categoriesRepository = {
  // Retorna a lista de todas categorias ordenadas por nome
  async findAll() {
    return prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
    });
  },

  // Retorna categoria específica por ID
  async findById(id: string) {
    return prisma.categoria.findUnique({ where: { id } });
  },
  // Retorna categoria específica por Nome
  async findByName(nome: string) {
    return prisma.categoria.findUnique({ where: { nome } });
  },
  // Cria uma nova categoria
  async create(data: CreateCategoryInput) {
    return prisma.categoria.create({ data });
  },

  // Modifica os dados de uma categoria existente (nome ou status de ativação)
  // Sem delete (Soft Delete, apenas atualiza o status para inativo)
  async update(id: string, data: UpdateCategoryInput) {
    return prisma.categoria.update({
      where: { id },
      data,
    });
  },
};
