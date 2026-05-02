import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { requireRole } from '@/middlewares/rbac.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { createUserSchema } from './users.schemas';
import { usersController } from './users.controller';

// Define os endpoints /users (POST e GET)
// Exige que toda requisição tenha um JWT válido (autenticação)
// e que o usuário logado tenha a role ADMIN antes de chegar no controller

const router = Router();

router.use(authMiddleware, requireRole('ADMIN'));

router.post('/', validate(createUserSchema), usersController.create);
router.get('/', usersController.findAll);

export { router as usersRoutes };
