import request from 'supertest';
import { app } from '@/app';
import { createAllRoles, tokenFor } from './helpers/factories';

describe('Categorias — listagem (GET /categories)', () => {
  it('lista categorias para qualquer perfil autenticado', async () => {
    const users = await createAllRoles();

    // Testa com cada um dos 4 perfis.
    for (const perfil of [
      'ADMIN',
      'COLABORADOR',
      'GESTOR',
      'FINANCEIRO',
    ] as const) {
      const response = await request(app)
        .get('/categories')
        .set('Authorization', `Bearer ${tokenFor(users[perfil])}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    }
  });

  it('retorna 401 quando não autenticado', async () => {
    const response = await request(app).get('/categories');
    expect(response.status).toBe(401);
  });
});

describe('Categorias - criação (POST /categories)', () => {
  it('admin cria categoria com sucesso', async () => {
    const users = await createAllRoles();

    const response = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${tokenFor(users.ADMIN)}`)
      .send({ nome: 'Equipamentos' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      nome: 'Equipamentos',
      ativo: true,
    });
    expect(response.body).toHaveProperty('id');
  });

  it.each([
    ['COLABORADOR'] as const,
    ['GESTOR'] as const,
    ['FINANCEIRO'] as const,
  ])('retorna 403 quando perfil %s tenta criar categoria', async (perfil) => {
    const users = await createAllRoles();

    const response = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${tokenFor(users[perfil])}`)
      .send({ nome: 'Tentativa' });

    expect(response.status).toBe(403);
  });

  it('retorna 400 ao criar categoria com nome duplicado', async () => {
    const users = await createAllRoles();
    const adminToken = tokenFor(users.ADMIN);

    await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nome: 'Hospedagem' });

    const response = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nome: 'Hospedagem' });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/já existe/i);
  });

  it('retorna 400 ao criar com nome vazio (validação Zod)', async () => {
    const users = await createAllRoles();

    const response = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${tokenFor(users.ADMIN)}`)
      .send({ nome: '' });

    expect(response.status).toBe(400);
    expect(response.body.issues).toHaveProperty('nome');
  });
});
