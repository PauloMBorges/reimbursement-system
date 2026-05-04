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
import { historyRoutes } from '@/modules/history/history.routes';
import { attachmentsRoutes } from '@/modules/attachments/attachments.routes';

const router = Router();

// Todas as rotas exigem autenticação
// Permissões especificas (perfil) e regras de transição são
// checadas no service
router.use(authMiddleware);

// CRUD

router.get('/', reimbursementsController.findMany);

router.get(
  '/:id',
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

// Sub-rotas montadas em /reimbursements/:id/...
router.use('/:id/history', historyRoutes);
router.use('/:id/attachments', attachmentsRoutes);

export { router as reimbursementsRoutes };
