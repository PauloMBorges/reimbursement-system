import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@/shared/errors';
import { attachmentsService } from './attachments.service';
import { CreateAttachmentInput } from './attachments.schemas';

function getUser(req: Request) {
  if (!req.user) {
    throw new UnauthorizedError('Usuário não autenticado');
  }
  return req.user;
}

export const attachmentsController = {
  async findByReimbursementId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = getUser(req);
      const { id } = req.params as { id: string };
      const result = await attachmentsService.findByReimbursementId(user, id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = getUser(req);
      const { id } = req.params as { id: string };
      const input = req.body as CreateAttachmentInput;
      const result = await attachmentsService.create(user, id, input);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
};
