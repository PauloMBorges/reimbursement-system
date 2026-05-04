import { reimbursementsService } from '@/modules/reimbursements/reimbursements.service';
import { PerfilUsuario } from '@prisma/client';
import { historyRepository } from './history.repository';

interface ActingUser {
  id: string;
  perfil: PerfilUsuario;
}

export const historyService = {
  // Lista o histórico de uma solicitação
  // Reutiliza reimbursementsService.findById para reaproveitar a regra de visibilidade
  // (quem pode ver a solicitação pode ver o histórico dela)

  async findByReimbursementId(user: ActingUser, reimbursementId: string) {
    await reimbursementsService.findById(user, reimbursementId);

    return historyRepository.findByReimbursementId(reimbursementId);
  },
};
