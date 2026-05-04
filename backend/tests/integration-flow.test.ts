import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@/config/prisma';
import { createAllRoles, createCategoria, tokenFor } from './helpers/factories';

describe('Fluxo completo: criar → enviar → aprovar → pagar', () => {
  it('atravessa todo o ciclo de vida com histórico correto', async () => {
    const users = await createAllRoles();
    const categoria = await createCategoria({ nome: 'Alimentação' });

    // 1. Colaborador cria
    const createResp = await request(app)
      .post('/reimbursements')
      .set('Authorization', `Bearer ${tokenFor(users.COLABORADOR)}`)
      .send({
        categoriaId: categoria.id,
        descricao: 'Almoço com cliente',
        valor: 89.5,
        dataDespesa: '2026-04-15',
      });
    expect(createResp.status).toBe(201);
    const reimbId = createResp.body.id;

    // 2. Colaborador submete
    const submitResp = await request(app)
      .post(`/reimbursements/${reimbId}/submit`)
      .set('Authorization', `Bearer ${tokenFor(users.COLABORADOR)}`);
    expect(submitResp.status).toBe(200);
    expect(submitResp.body.status).toBe('ENVIADO');

    // 3. Gestor aprova
    const approveResp = await request(app)
      .post(`/reimbursements/${reimbId}/approve`)
      .set('Authorization', `Bearer ${tokenFor(users.GESTOR)}`);
    expect(approveResp.status).toBe(200);
    expect(approveResp.body.status).toBe('APROVADO');

    // 4. Financeiro paga
    const payResp = await request(app)
      .post(`/reimbursements/${reimbId}/pay`)
      .set('Authorization', `Bearer ${tokenFor(users.FINANCEIRO)}`);
    expect(payResp.status).toBe(200);
    expect(payResp.body.status).toBe('PAGO');

    // 5. Histórico foi gravado para cada ação
    const historyResp = await request(app)
      .get(`/reimbursements/${reimbId}/history`)
      .set('Authorization', `Bearer ${tokenFor(users.ADMIN)}`);

    expect(historyResp.status).toBe(200);
    const acoes = historyResp.body.map((h: { acao: string }) => h.acao);
    expect(acoes).toEqual(['CREATED', 'SUBMITTED', 'APPROVED', 'PAID']);

    // 6. Banco está consistente
    const finalState = await prisma.solicitacaoReembolso.findUnique({
      where: { id: reimbId },
    });
    expect(finalState?.status).toBe('PAGO');
  });

  it('ciclo de rejeição: criar → enviar → rejeitar', async () => {
    const users = await createAllRoles();
    const categoria = await createCategoria();

    const createResp = await request(app)
      .post('/reimbursements')
      .set('Authorization', `Bearer ${tokenFor(users.COLABORADOR)}`)
      .send({
        categoriaId: categoria.id,
        descricao: 'Despesa duvidosa',
        valor: 500,
        dataDespesa: '2026-04-15',
      });
    const reimbId = createResp.body.id;

    await request(app)
      .post(`/reimbursements/${reimbId}/submit`)
      .set('Authorization', `Bearer ${tokenFor(users.COLABORADOR)}`);

    const rejectResp = await request(app)
      .post(`/reimbursements/${reimbId}/reject`)
      .set('Authorization', `Bearer ${tokenFor(users.GESTOR)}`)
      .send({ justificativa: 'Despesa não relacionada ao trabalho' });

    expect(rejectResp.status).toBe(200);
    expect(rejectResp.body.status).toBe('REJEITADO');
    expect(rejectResp.body.justificativaRejeicao).toBe(
      'Despesa não relacionada ao trabalho',
    );

    // Tentar pagar uma rejeitada deve falhar
    const payResp = await request(app)
      .post(`/reimbursements/${reimbId}/pay`)
      .set('Authorization', `Bearer ${tokenFor(users.FINANCEIRO)}`);
    expect(payResp.status).toBe(400);
  });
});
