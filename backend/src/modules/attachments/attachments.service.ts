import { PerfilUsuario } from '@prisma/client';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '@/shared/errors';
import { reimbursementsRepository } from '@/modules/reimbursements/reimbursements.repository';
import { reimbursementsService } from '@/modules/reimbursements/reimbursements.service';
import { attachmentsRepository } from './attachments.repository';
import { CreateAttachmentInput } from './attachments.schemas';

interface ActingUser {
  id: string;
  perfil: PerfilUsuario;
}

export const attachmentsService = {
  async findByReimbursementId(user: ActingUser, reimbursementId: string) {
    // Reaproveita regra de visibilidade do reembolso
    await reimbursementsService.findById(user, reimbursementId);

    return attachmentsRepository.findByReimbursementId(reimbursementId);
  },

  async create(
    user: ActingUser,
    reimbursementId: string,
    input: CreateAttachmentInput,
  ) {
    const reimbursement =
      await reimbursementsRepository.findById(reimbursementId);
    if (!reimbursement) {
      throw new NotFoundError('Solicitação não encontrada');
    }

    // Apenas o dono pode anexar arquivos
    if (reimbursement.solicitanteId !== user.id) {
      throw new ForbiddenError(
        'Você só pode anexar arquivos em suas prórpias solicitações',
      );
    }

    // Apenas em RASCUNHO permite anexar
    if (reimbursement.status !== 'RASCUNHO') {
      throw new BadRequestError(
        'Anexos só podem adicionados em solicitações em rascunho',
      );
    }

    // Service manda os dados já validados pelo Zod misturados com
    // o ID do reembolso para o Repository salvar no banco
    return attachmentsRepository.create({
      solicitacaoId: reimbursementId,
      ...input,
    });
  },
};
