import { Request, Response, NextFunction } from 'express';
import { categoriesService } from './categories.service';
import { CreateCategoryInput, UpdateCategoryInput } from './categories.schemas';

// Controller de categorias
// Recebe requisição, extrai os dados, delega execução para o Service e devolve resposta formatada para o cliente

export const categoriesController = {
  // Processa requisições GET /categories e devolve lista de todas categorias
  async findAll(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const categorias = await categoriesService.findAll();
      res.status(200).json(categorias);
    } catch (err) {
      next(err);
    }
  },

  // Processa requisições POST /categories, extrai os dados do corpo da requisição e cria nova categoria
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as CreateCategoryInput;
      const categoria = await categoriesService.create(input);
      res.status(201).json(categoria);
    } catch (err) {
      next(err);
    }
  },

  // Processa requisições PUT /categories/:id, extrai ID e dados do corpo da requisição e atualiza categoria
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const input = req.body as UpdateCategoryInput;
      const categoria = await categoriesService.update(id, input);
      res.status(200).json(categoria);
    } catch (err) {
      next(err);
    }
  },
};
