import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service';
import { CreateUserInput } from './users.schemas';

// Camada HTTP de usuários
// Aciona o service para criação/listagem e devolve os status corretos
// HTTP 201 para recurso criado e HTTP 200 para lsitagem

export const usersController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as CreateUserInput;
      const usuario = await usersService.create(input);
      res.status(201).json(usuario);
    } catch (err) {
      next(err);
    }
  },

  async findAll(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const usuarios = await usersService.findAll();
      res.status(200).json(usuarios);
    } catch (err) {
      next(err);
    }
  },
};
