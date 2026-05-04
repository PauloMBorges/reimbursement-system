import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { reimbursementIdParamSchema } from '@/modules/reimbursements/reimbursements.schemas';
import { historyController } from './history.controller';

// Router montado em /reimbursements/:id/history
// mergeParams permite que o handler acesse re.params.id que vem do prefixo do pai (/reimbursements/:id)

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get(
  '/',
  validate(reimbursementIdParamSchema, 'params'),
  historyController.findByReimbursementId,
);

export { router as historyRoutes };
