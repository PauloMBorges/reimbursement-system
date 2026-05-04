import request from 'supertest';
import { app } from '@/app';
import { createUser } from './helpers/factories';

describe('Smoke test - infraestrutura de testes', () => {
  it('responde no /health com 200', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });

  it('consegue criar usuário no banco de testes', async () => {
    const user = await createUser({
      email: 'smoke@test.com',
      perfil: 'COLABORADOR',
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe('smoke@test.com');
    expect(user.perfil).toBe('COLABORADOR');
    // Senha foi hasheada
    expect(user.senha).not.toBe('senha123');
  });
});
