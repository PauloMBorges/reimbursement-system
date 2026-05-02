import { Router } from 'express';
import { validate } from '@/middlewares/validate.middleware';
import { loginSchema } from './auth.schemas';
import { authController } from './auth.controller';

// Valida o body com loginSchema e depois chama o controller

const router = Router();

router.post('/login', validate(loginSchema), authController.login);

export { router as authRoutes };
