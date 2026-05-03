import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@/shared/errors';
import { reimbursementsService } from './reimbursements.service';
import {
  CreateReimbursementInput,
  RejectReimbursementInput,
  UpdateReimbursementInput,
} from './reimbursements.schemas';

// Helper que extrai o usuário autenticado do request
// Lança UnauthorizedError se faltar
function getUser(req: Request) {
  if (!req.user) {
    throw new UnauthorizedError('Usuário não autenticado');
  }
  return req.user;
}

export const reimbursementsController = {
  // CRUD

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = getUser(req);
      const input = req.body as CreateReimbursementInput;
      const result = await reimbursementsService.create(user, input);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async findMany(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = getUser(req);
      const result = await reimbursementsService.findMany(user);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async findById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = getUser(req);
      const { id } = req.params as { id: string };
      const result = await reimbursementsService.findById(user, id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = getUser(req);
      const { id } = req.params as { id: string };
      const input = req.body as UpdateReimbursementInput;
      const result = await reimbursementsService.update(user, id, input);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  // Transições
  // Poderia ter Factory para reduzir repetição
  // Mas cada método tem URL e semântica próprias
  // (ganho pequeno de factory com custo maior)
  async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = getUser(req);
      const { id } = req.params as { id: string };
      const result = await reimbursementsService.executeTransition(
        user,
        id,
        'SUBMIT',
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async approve(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = getUser(req);
      const { id } = req.params as { id: string };
      const result = await reimbursementsService.executeTransition(
        user,
        id,
        'APPROVE',
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async reject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = getUser(req);
      const { id } = req.params as { id: string };
      const { justificativa } = req.body as RejectReimbursementInput;
      const result = await reimbursementsService.executeTransition(
        user,
        id,
        'REJECT',
        { justificativa },
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async pay(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = getUser(req);
      const { id } = req.params as { id: string };
      const result = await reimbursementsService.executeTransition(
        user,
        id,
        'PAY',
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = getUser(req);
      const { id } = req.params as { id: string };
      const result = await reimbursementsService.executeTransition(
        user,
        id,
        'CANCEL',
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};
