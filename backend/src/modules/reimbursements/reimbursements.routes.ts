import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { requireRole } from '@/middlewares/rbac.middleware';
import { validate } from '@/middlewares/validate.middleware';
import {
  createReimbursementSchema,
  reimbursementIdParamSchema,
  rejectReimbursementSchema,
  updateReimbursementSchema,
} from './reimbursements.schemas';
import { reimbursementsController } from './reimbursements.controller';

const router = Router();

// Todas as rotas exigem autenticação
// Permissões especificas (perfil) e regras de transição são
// checadas no service
router.use(authMiddleware);

// CRUD

router.get('/', reimbursementsController.findMany);

router.get(
  ':/id',
  validate(reimbursementIdParamSchema, 'params'),
  reimbursementsController.findById,
);

router.post(
  '/',
  requireRole('COLABORADOR'),
  validate(createReimbursementSchema),
  reimbursementsController.create,
);

router.put(
  '/:id',
  requireRole('COLABORADOR'),
  validate(reimbursementIdParamSchema, 'params'),
  validate(updateReimbursementSchema),
  reimbursementsController.update,
);

// Transições
router.post(
  '/:id/submit',
  requireRole('COLABORADOR'),
  validate(reimbursementIdParamSchema, 'params'),
  reimbursementsController.submit,
);

router.post(
  '/:id/approve',
  requireRole('GESTOR'),
  validate(reimbursementIdParamSchema, 'params'),
  reimbursementsController.approve,
);

router.post(
  '/:id/reject',
  requireRole('GESTOR'),
  validate(reimbursementIdParamSchema, 'params'),
  validate(rejectReimbursementSchema),
  reimbursementsController.reject,
);

router.post(
  '/:id/pay',
  requireRole('FINANCEIRO'),
  validate(reimbursementIdParamSchema, 'params'),
  reimbursementsController.pay,
);

router.post(
  '/:id/cancel',
  requireRole('COLABORADOR'),
  validate(reimbursementIdParamSchema, 'params'),
  reimbursementsController.cancel,
);

export { router as reimbursementsRoutes };
