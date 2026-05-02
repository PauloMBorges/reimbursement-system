import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { requireRole } from '@/middlewares/rbac.middleware';
import { validate } from '@/middlewares/validate.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from './categories.schemas';
import { categoriesController } from './categories.controller';

// Camada de roteamento e segurança de categorias
// Mapeia endpoints HTTP (GET, POST, PUT) para as funções no Controller
// Antes de permitir que o Controller execute, passa por regras de segurança (autenticação e autorização)
// e de validação de dados (Zod)

const router = Router();

// Todas as rotas exigem autenticação
router.use(authMiddleware);

// Define o endpoint para listar categorias (todos usuários logados podem ver)
router.get('/', categoriesController.findAll);

// Define o endpoint para criar categorias (apenas ADMIN pode criar)
router.post(
  '/',
  requireRole('ADMIN'),
  validate(createCategorySchema),
  categoriesController.create,
);

// Define o endpoint para atualizar categoria (apenas ADMIN pode atualizar)
router.put(
  '/:id',
  requireRole('ADMIN'),
  validate(categoryIdParamSchema, 'params'),
  validate(updateCategorySchema),
  categoriesController.update,
);

export { router as categoriesRoutes };
