import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { LoginInput } from './auth.schemas';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as LoginInput;
      const result = await authService.login(input);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};
