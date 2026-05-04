import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { requireRole } from '@/middlewares/rbac.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { reimbursementIdParamSchema } from '@/modules/reimbursements/reimbursements.schemas';
import { attachmentsController } from './attachments.controller';
import { createAttachmentSchema } from './attachments.schemas';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get(
  '/',
  validate(reimbursementIdParamSchema, 'params'),
  attachmentsController.findByReimbursementId,
);

router.post(
  '/',
  requireRole('COLABORADOR'),
  validate(reimbursementIdParamSchema, 'params'),
  validate(createAttachmentSchema),
  attachmentsController.create,
);

export { router as attachmentsRoutes };
