import request from 'supertest';
import { app } from '@/app';
import { createUser } from './helpers/factories';

describe('POST /auth/login', () => {
  it('autentica com credenciais válidas e retorna token + usuário', async () => {
    const user = await createUser({
      email: 'login-valido@test.com',
      perfil: 'COLABORADOR',
    });

    const response = await request(app)
      .post('/auth/login')
      .send({ email: user.email, senha: 'senha123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
    expect(response.body.token.length).toBeGreaterThan(20);

    expect(response.body.usuario).toMatchObject({
      id: user.id,
      email: user.email,
      perfil: 'COLABORADOR',
    });

    // Garantia adicional: a senha não deve estar na resposta
    expect(response.body.usuario).not.toHaveProperty('senha');
  });

  it('retorna 401 com senha incorreta', async () => {
    const user = await createUser({ email: 'senha-errada@test.com' });

    const response = await request(app)
      .post('/auth/login')
      .send({ email: user.email, senha: 'errada' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Credenciais inválidas');
  });

  it('retorna 401 com email inexistente (mesma mensagem de senha errada)', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'nao-existe@test.com', senha: 'qualquer123' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Credenciais inválidas');
  });

  it('retorna 400 quando email tem formato inválido', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'isso-nao-eh-email', senha: 'senha123' });

    expect(response.status).toBe(400);
    expect(response.body.issues).toHaveProperty('email');
  });

  it('retorna 400 quando body está vazio', async () => {
    const response = await request(app).post('/auth/login').send({});

    expect(response.status).toBe(400);
  });
});

describe('Middleware de autenticação', () => {
  it('retorna 401 quando rota protegida é acessada sem token', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/token/i);
  });

  it('retorna 401 quando token está malformado', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer token-invalido-123');

    expect(response.status).toBe(401);
  });

  it('retorna 401 quando esquema não é Bearer', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', 'Basic abc123');

    expect(response.status).toBe(401);
  });
});
