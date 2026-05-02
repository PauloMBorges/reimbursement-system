import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { LoginInput } from './auth.schemas';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // validate.middleware já validou o body com loginSchema
      const input = req.body as LoginInput;
      // Chama authService.login() e recebe de volta um token e os dados do usuário
      const result = await authService.login(input);
      // Retorna 200 OK com token e dados do usuário
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};
