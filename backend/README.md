# Backend — Sistema de Controle de Reembolsos

API REST para gerenciamento de solicitações de reembolso, com controle de acesso por perfil (RBAC), trilha de auditoria e validação rigorosa de regras de negócio.

## Stack

- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** + **PostgreSQL**
- **Zod** para validação
- **JWT** + **bcryptjs** para autenticação
- **DayJS** para manipulação de datas
- **Jest** + **Supertest** para testes

## Pré-requisitos

- Node.js 20 ou superior
- Docker e Docker Compose
- npm

## Como rodar

### 1. Clonar o repositório e instalar dependências

```bash
git clone
cd reimbursement-system/backend
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

O arquivo `.env.example` já vem com valores válidos para desenvolvimento local. Para produção, gere um `JWT_SECRET` seguro:

```bash
# No Linux/Mac
openssl rand -base64 32
```

### 3. Subir o banco de dados

Na raiz do repositório:

```bash
docker-compose up -d
```

### 4. Aplicar migrations e popular o banco

De volta em `backend/`:

```bash
npm run prisma:migrate
npm run prisma:seed
```

### 5. Iniciar o servidor

```bash
npm run dev
```

O servidor sobe em `http://localhost:3333`. Confirme com:

```bash
curl http://localhost:3333/health
```

## Credenciais de teste

Todos os usuários abaixo são criados pelo seed e usam a senha **`senha123`**:

| Perfil      | E-mail                 |
| ----------- | ---------------------- |
| ADMIN       | admin@pitang.com       |
| COLABORADOR | colaborador@pitang.com |
| GESTOR      | gestor@pitang.com      |
| FINANCEIRO  | financeiro@pitang.com  |

## Scripts disponíveis

| Comando                  | Descrição                                              |
| ------------------------ | ------------------------------------------------------ |
| `npm run dev`            | Inicia o servidor em modo desenvolvimento (hot reload) |
| `npm run build`          | Compila o TypeScript para `dist/`                      |
| `npm start`              | Roda o build de produção                               |
| `npm run lint`           | Verifica problemas de lint                             |
| `npm run lint:fix`       | Corrige problemas automaticamente                      |
| `npm run format`         | Formata o código com Prettier                          |
| `npm run prisma:migrate` | Aplica migrations no banco                             |
| `npm run prisma:seed`    | Popula o banco com dados de teste                      |
| `npm run prisma:studio`  | Abre o Prisma Studio (GUI do banco)                    |
| `npm run prisma:reset`   | Reseta o banco (⚠️ apaga tudo)                         |

## Testes

A suite de testes usa **Jest + Supertest** com banco PostgreSQL isolado (`reimbursement_db_test`).

### Configuração inicial (uma vez)

Cria o banco de testes:

```bash
docker exec -it reimbursement-postgres psql -U postgres -c "CREATE DATABASE reimbursement_db_test;"
```

Aplica as migrations:

```bash
npm run test:setup
```

### Rodando os testes

| Comando | O que faz |
|---|---|
| `npm test` | Roda todos os testes |
| `npm run test:watch` | Modo watch (re-roda ao salvar) |
| `npm run test:coverage` | Gera relatório de cobertura |
| `npm run test:ci` | Setup + coverage em um comando (recomendado) |

Após `npm run test:coverage`, o relatório HTML fica em `coverage/lcov-report/index.html`.

### Cobertura

A suite atual tem **36 testes** de integração distribuídos em 5 suites:

- `auth.test.ts` (8) — login, validação Zod, middleware de autenticação
- `categories.test.ts` (8) — CRUD com RBAC
- `reimbursements.test.ts` (16) — CRUD, transições válidas/inválidas, RBAC, visibilidade
- `integration-flow.test.ts` (2) — ciclos completos (aprovação e rejeição)
- `smoke.test.ts` (2) — saúde da infraestrutura

Os testes priorizam **comportamento observável** (status codes, payloads, persistência) sobre detalhes de implementação.