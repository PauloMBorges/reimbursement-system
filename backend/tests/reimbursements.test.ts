import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@/config/prisma';
import { createAllRoles, createCategoria, tokenFor } from './helpers/factories';

// Helper local: cria uma solicitação direta no banco em determinado status
// Permite pular fluxo HTTP nas situações que queremos testar só a transição

async function createReimbursement(
  solicitanteId: string,
  categoriaId: string,
  status:
    | 'RASCUNHO'
    | 'ENVIADO'
    | 'APROVADO'
    | 'REJEITADO'
    | 'PAGO'
    | 'CANCELADO' = 'RASCUNHO',
) {
  return prisma.solicitacaoReembolso.create({
    data: {
      solicitanteId,
      categoriaId,
      descricao: 'Teste',
      valor: 100,
      dataDespesa: new Date('2026-04-01'),
      status,
    },
  });
}

describe('Reimbursements - criação', () => {
  it('colaborador cria reembolso e ele nasce em RASCUNHO', async () => {
    const users = await createAllRoles();
    const categoria = await createCategoria({ nome: 'Alimentação' });

    const response = await request(app)
      .post('/reimbursements')
      .set('Authorization', `Bearer ${tokenFor(users.COLABORADOR)}`)
      .send({
        categoriaId: categoria.id,
        descricao: 'Almoço com cliente',
        valor: 89.5,
        dataDespesa: '2026-04-15',
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('RASCUNHO');
    expect(response.body.solicitanteId).toBe(users.COLABORADOR.id);
  });

  it('rejeita criação com categoria inativa', async () => {
    const users = await createAllRoles();
    const categoria = await createCategoria({
      nome: 'Inativa',
      ativo: false,
    });

    const response = await request(app)
      .post('/reimbursements')
      .set('Authorization', `Bearer ${tokenFor(users.COLABORADOR)}`)
      .send({
        categoriaId: categoria.id,
        descricao: 'Tentativa',
        valor: 50,
        dataDespesa: '2026-04-15',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/inativa/i);
  });

  it('rejeita criação com valor zero', async () => {
    const users = await createAllRoles();
    const categoria = await createCategoria();

    const response = await request(app)
      .post('/reimbursements')
      .set('Authorization', `Bearer ${tokenFor(users.COLABORADOR)}`)
      .send({
        categoriaId: categoria.id,
        descricao: 'Teste',
        valor: 0,
        dataDespesa: '2026-04-15',
      });

    expect(response.status).toBe(400);
    expect(response.body.issues).toHaveProperty('valor');
  });

  it('gestor não pode criar reembolso (403)', async () => {
    const users = await createAllRoles();
    const categoria = await createCategoria();

    const response = await request(app)
      .post('/reimbursements')
      .set('Authorization', `Bearer ${tokenFor(users.GESTOR)}`)
      .send({
        categoriaId: categoria.id,
        descricao: 'Teste',
        valor: 50,
        dataDespesa: '2026-04-15',
      });

    expect(response.status).toBe(403);
  });

  describe('Reimbursements - transições válidas', () => {
    it('SUBMIT: RASCUNHO → ENVIADO', async () => {
      const users = await createAllRoles();
      const categoria = await createCategoria();
      const reimb = await createReimbursement(
        users.COLABORADOR.id,
        categoria.id,
        'RASCUNHO',
      );

      const response = await request(app)
        .post(`/reimbursements/${reimb.id}/submit`)
        .set('Authorization', `Bearer ${tokenFor(users.COLABORADOR)}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ENVIADO');
    });

    it('APPROVE: ENVIADO → APROVADO (apenas gestor)', async () => {
      const users = await createAllRoles();
      const categoria = await createCategoria();
      const reimb = await createReimbursement(
        users.COLABORADOR.id,
        categoria.id,
        'ENVIADO',
      );

      const response = await request(app)
        .post(`/reimbursements/${reimb.id}/approve`)
        .set('Authorization', `Bearer ${tokenFor(users.GESTOR)}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('APROVADO');
    });

    it('REJECT: ENVIADO → REJEITADO com justificativa', async () => {
      const users = await createAllRoles();
      const categoria = await createCategoria();
      const reimb = await createReimbursement(
        users.COLABORADOR.id,
        categoria.id,
        'ENVIADO',
      );

      const response = await request(app)
        .post(`/reimbursements/${reimb.id}/reject`)
        .set('Authorization', `Bearer ${tokenFor(users.GESTOR)}`)
        .send({ justificativa: 'Falta o cupom fiscal' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('REJEITADO');
      expect(response.body.justificativaRejeicao).toBe('Falta o cupom fiscal');
    });

    it('PAY: APROVADO → PAGO (apenas financeiro)', async () => {
      const users = await createAllRoles();
      const categoria = await createCategoria();
      const reimb = await createReimbursement(
        users.COLABORADOR.id,
        categoria.id,
        'APROVADO',
      );

      const response = await request(app)
        .post(`/reimbursements/${reimb.id}/pay`)
        .set('Authorization', `Bearer ${tokenFor(users.FINANCEIRO)}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('PAGO');
    });
  });

  describe('Reimbursements - transições inválidas', () => {
    it('rejeita aprovar solicitação em RASCUNHO', async () => {
      const users = await createAllRoles();
      const categoria = await createCategoria();
      const reimb = await createReimbursement(
        users.COLABORADOR.id,
        categoria.id,
        'RASCUNHO',
      );

      const response = await request(app)
        .post(`/reimbursements/${reimb.id}/approve`)
        .set('Authorization', `Bearer ${tokenFor(users.GESTOR)}`);

      expect(response.status).toBe(400);
    });

    it('rejeita pagar solicitação REJEITADA', async () => {
      const users = await createAllRoles();
      const categoria = await createCategoria();
      const reimb = await createReimbursement(
        users.COLABORADOR.id,
        categoria.id,
        'REJEITADO',
      );

      const response = await request(app)
        .post(`/reimbursements/${reimb.id}/pay`)
        .set('Authorization', `Bearer ${tokenFor(users.FINANCEIRO)}`);

      expect(response.status).toBe(400);
    });

    it('rejeita reject sem justificativa', async () => {
      const users = await createAllRoles();
      const categoria = await createCategoria();
      const reimb = await createReimbursement(
        users.COLABORADOR.id,
        categoria.id,
        'ENVIADO',
      );

      const response = await request(app)
        .post(`/reimbursements/${reimb.id}/reject`)
        .set('Authorization', `Bearer ${tokenFor(users.GESTOR)}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('Reimbursements - RBAC nas transições', () => {
    it('colaborador não pode aprovar (403)', async () => {
      const users = await createAllRoles();
      const categoria = await createCategoria();
      const reimb = await createReimbursement(
        users.COLABORADOR.id,
        categoria.id,
        'ENVIADO',
      );

      const response = await request(app)
        .post(`/reimbursements/${reimb.id}/approve`)
        .set('Authorization', `Bearer ${tokenFor(users.COLABORADOR)}`);

      expect(response.status).toBe(403);
    });

    it('financeiro não pode aprovar (403)', async () => {
      const users = await createAllRoles();
      const categoria = await createCategoria();
      const reimb = await createReimbursement(
        users.COLABORADOR.id,
        categoria.id,
        'ENVIADO',
      );

      const response = await request(app)
        .post(`/reimbursements/${reimb.id}/approve`)
        .set('Authorization', `Bearer ${tokenFor(users.FINANCEIRO)}`);

      expect(response.status).toBe(403);
    });

    it('gestor não pode pagar (403)', async () => {
      const users = await createAllRoles();
      const categoria = await createCategoria();
      const reimb = await createReimbursement(
        users.COLABORADOR.id,
        categoria.id,
        'APROVADO',
      );

      const response = await request(app)
        .post(`/reimbursements/${reimb.id}/pay`)
        .set('Authorization', `Bearer ${tokenFor(users.GESTOR)}`);

      expect(response.status).toBe(403);
    });
  });

  describe('Reimbursements - visibilidade por perfil', () => {
    it('colaborador só vê as próprias na listagem', async () => {
      const users = await createAllRoles();
      const colaborador2 = await prisma.usuario.create({
        data: {
          nome: 'Outro Colaborador',
          email: 'outro@test.com',
          senha: 'fake-hash',
          perfil: 'COLABORADOR',
        },
      });
      const categoria = await createCategoria();

      await createReimbursement(users.COLABORADOR.id, categoria.id, 'RASCUNHO');
      await createReimbursement(colaborador2.id, categoria.id, 'RASCUNHO');

      const response = await request(app)
        .get('/reimbursements')
        .set('Authorization', `Bearer ${tokenFor(users.COLABORADOR)}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].solicitanteId).toBe(users.COLABORADOR.id);
    });

    it('admin vê todas', async () => {
      const users = await createAllRoles();
      const categoria = await createCategoria();

      await createReimbursement(users.COLABORADOR.id, categoria.id, 'RASCUNHO');
      await createReimbursement(users.COLABORADOR.id, categoria.id, 'ENVIADO');
      await createReimbursement(users.COLABORADOR.id, categoria.id, 'APROVADO');

      const response = await request(app)
        .get('/reimbursements')
        .set('Authorization', `Bearer ${tokenFor(users.ADMIN)}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
    });
  });
});
