import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@/shared/errors';
import { historyService } from './history.service';

function getUser(req: Request) {
  if (!req.user) {
    throw new UnauthorizedError('Usuário não autenticado');
  }
  return req.user;
}

export const historyController = {
  async findByReimbursementId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = getUser(req);
      const { id } = req.params as { id: string };
      const result = await historyService.findByReimbursementId(user, id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};
