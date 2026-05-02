import { PrismaClient, PerfilUsuario } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

// Senha única para  todos usuários de teste (para facilitar avaliação)
const SENHA_PADRAO = 'senha123';

async function main() {
  console.log('Iniciando seed...');

  // Categorias iniciais

  const categorias = [
    { nome: 'Alimentação' },
    { nome: 'Transporte' },
    { nome: 'Hospedagem' },
    { nome: 'Treinamento e Cursos' },
    { nome: 'Material de escritório' },
    { nome: 'Outros' },
  ];

  // Insere ou atualiza categorias
  for (const cat of categorias) {
    await prisma.categoria.upsert({
      // Permite rodar o seed múltiplas vezes sem dar erro de chave única (idempotente)
      where: { nome: cat.nome },
      update: {}, // Se já existir, não faz nada
      create: cat,
    });
  }

  console.log(`${categorias.length} categorias criadas/atualizadas`);

  // Usuários de teste - um por perfil

  const senhaHash = await bcrypt.hash(SENHA_PADRAO, SALT_ROUNDS); // Hash gerado uma vez só e reusado para os 4 usuários pois bcrypt é caro computacionalmente

  const usuarios = [
    {
      nome: 'Admin do Sistema',
      email: 'admin@pitang.com',
      perfil: PerfilUsuario.ADMIN,
    },
    {
      nome: 'Carlos Colaborador',
      email: 'colaborador@pitang.com',
      perfil: PerfilUsuario.COLABORADOR,
    },
    {
      nome: 'Keven Gestor',
      email: 'gestor@pitang.com',
      perfil: PerfilUsuario.GESTOR,
    },
    {
      nome: 'Paulo Financeiro',
      email: 'financeiro@pitang.com',
      perfil: PerfilUsuario.FINANCEIRO,
    },
  ];

  // Insere ou atualiza usuários
  for (const user of usuarios) {
    await prisma.usuario.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        senha: senhaHash,
      },
    });
  }

  console.log(`${usuarios.length} usuários criados/atualizados`);

  // Resumo de credenciais
  console.log(
    '\nCredenciais de teste (todas com a senha "' + SENHA_PADRAO + '"):',
  );
  console.log('─────────────────────────────────────────────');
  usuarios.forEach((u) => {
    console.log(`${u.perfil.padEnd(12)} → ${u.email}`);
  });
  console.log('─────────────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
