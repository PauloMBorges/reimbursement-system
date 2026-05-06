# Sistema de Controle de Solicitações de Reembolso

Sistema fullstack para gestão de solicitações de reembolso com controle de fluxo aprovação, baseado em perfis de usuário (Colaborador, Gestor, Financeiro e Admin).

---

## Sumário

- [Stack](#stack)
- [Funcionalidades](#funcionalidades)
- [Como rodar](#como-rodar)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Decisões arquiteturais](#decisões-arquiteturais)
- [Testes](#testes)
- [Documentação da API](#documentação-da-api)
- [Diferenciais implementados](#diferenciais-implementados)

---

## Stack

### Backend

- **Node.js + Express** — servidor HTTP
- **TypeScript** — tipagem estática estrita
- **Prisma ORM** — acesso ao banco de dados
- **PostgreSQL 16** — banco relacional
- **Zod** — validação de schemas em runtime
- **JWT (jsonwebtoken)** — autenticação stateless
- **bcryptjs** — hash de senhas
- **Jest + Supertest** — testes de integração

### Frontend

- **Vite 8 + React 19** — bundler moderno e UI
- **TypeScript** — mesma tipagem estrita do backend
- **TanStack Query** — gestão de estado de servidor
- **Context API** — gestão de estado de cliente (autenticação)
- **React Router 7** — roteamento client-side
- **React Hook Form + Zod** — formulários com validação
- **Tailwind CSS + shadcn/ui** — design system
- **Vitest + Testing Library** — testes de componentes

### Infraestrutura

- **Docker Compose** — Postgres em container
- **dotenv** — gestão de variáveis de ambiente

---

## Funcionalidades

### Autenticação e autorização

- Login com email/senha (JWT)
- 4 perfis com permissões distintas: COLABORADOR, GESTOR, FINANCEIRO, ADMIN
- Cadastro de usuários restrito a ADMIN
- Sessão persistente via localStorage

### Gestão de solicitações

- Criação por COLABORADOR (status inicial RASCUNHO)
- Edição apenas em RASCUNHO pelo dono
- Anexos (URL externa) em RASCUNHO
- Visibilidade automática por perfil:
  - COLABORADOR: apenas próprias
  - GESTOR: tudo que saiu de RASCUNHO
  - FINANCEIRO: APROVADO e PAGO
  - ADMIN: todas

### Máquina de estados

RASCUNHO → ENVIADO → APROVADO → PAGO
→ REJEITADO
RASCUNHO ou ENVIADO → CANCELADO

Transições disponíveis por perfil:

- **SUBMIT:** dono em RASCUNHO
- **APPROVE / REJECT:** GESTOR em ENVIADO (rejeição exige justificativa)
- **PAY:** FINANCEIRO em APROVADO
- **CANCEL:** dono em RASCUNHO ou ENVIADO

### Histórico

- Linha do tempo automática de eventos por solicitação
- Cada transição registra autor, ação, observação opcional e timestamp

### Administração

- Cadastro de usuários (com escolha de perfil)
- CRUD de categorias com soft delete (ativar/desativar)

---

## Como rodar

### Pré-requisitos

- Node.js 20+
- Docker Desktop (para Postgres em container)
- Git

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd reimbursement-system
```

### 2. Configurar e rodar o backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# (edita o .env se necessário; defaults funcionam pra dev local)

# Subir o banco Postgres em container
docker compose up -d

# Aplicar migrations e popular banco com seed
npm run prisma:migrate
npm run prisma:seed

# Rodar em modo desenvolvimento
npm run dev
```

API disponível em **http://localhost:3333**.

Health check: **GET /health**

### 3. Configurar e rodar o frontend

Em outro terminal:

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# (defaults apontam pro backend em localhost:3333)

# Rodar em modo desenvolvimento
npm run dev
```

Aplicação disponível em **http://localhost:5173**.

### 4. Login com usuários do seed

Todos os usuários têm a senha `senha123`:

| Email                    | Perfil      |
| ------------------------ | ----------- |
| `admin@pitang.com`       | ADMIN       |
| `colaborador@pitang.com` | COLABORADOR |
| `gestor@pitang.com`      | GESTOR      |
| `financeiro@pitang.com`  | FINANCEIRO  |

---

## Estrutura do projeto

```
reimbursement-system/
├── backend/                  # API REST
│   ├── prisma/
│   │   ├── schema.prisma     # modelo de dados
│   │   ├── migrations/
│   │   └── seed.ts           # dados iniciais
│   ├── src/
│   │   ├── config/           # env (Zod) e Prisma client
│   │   ├── middlewares/      # auth, RBAC, validate, error
│   │   ├── modules/          # módulos por domínio
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── categories/
│   │   │   ├── reimbursements/
│   │   │   ├── history/
│   │   │   └── attachments/
│   │   ├── shared/           # erros, tipos, utils
│   │   ├── app.ts            # configuração Express
│   │   └── server.ts         # entry point
│   ├── tests/                # 36 testes de integração
│   └── docker-compose.yml
│
├── frontend/                 # SPA React
│   ├── src/
│   │   ├── api/              # clientes Axios
│   │   ├── components/
│   │   │   ├── layout/       # Header, AppLayout
│   │   │   ├── shared/       # componentes do projeto
│   │   │   └── ui/           # shadcn/ui
│   │   ├── contexts/         # AuthContext
│   │   ├── hooks/            # custom hooks (TanStack Query)
│   │   ├── lib/
│   │   │   ├── format.ts     # formatadores
│   │   │   └── schemas/      # schemas Zod
│   │   ├── pages/            # páginas
│   │   └── types/            # tipos compartilhados
│   ├── tests/                # 25 testes de componentes
│   └── vitest.config.ts
│
└── docs/
    ├── postman_collection.json
    └── postman_environment.json
```

---

## Decisões arquiteturais

### Backend

- **Modelagem em português** com `@@map` para snake_case no banco. Espelha o domínio de negócio brasileiro.
- **Decimal(12,2) para valores monetários:** `float` tem imprecisão; `Decimal` mantém centavos exatos.
- **Máquina de estados em arquivo separado** (`reimbursements.state.ts`) com `Record<Action, TransitionRule>`. TypeScript força mapear toda ação possível.
- **Transições atômicas** via `prisma.$transaction`: update do status + entrada no histórico ou nada.
- **Visibilidade por perfil aplicada no service** (não nos clientes). Frontend não precisa filtrar — backend já retorna apenas o que cada perfil pode ver.
- **bcryptjs em vez de bcrypt** por portabilidade no Windows.

### Frontend

- **Vite em vez de Create React App:** CRA está deprecado oficialmente.
- **TanStack Query para estado de servidor + Context API para estado de cliente:** dois tipos de estado têm soluções diferentes. Auth é cliente; listas e detalhes são servidor.
- **shadcn/ui (componentes copiados, não importados):** controle total sobre o código, sem dependência de pacote.
- **Defesa em camada:** RBAC implementado tanto no UI (esconde botões) quanto no backend (valida requisições). UI é UX; backend é segurança.
- **`Record<EnumType, ...>` em mapas exhaustivos:** TypeScript força mapeamento de todos os casos de status, ação, perfil. Adicionar valor novo no enum quebra o build, alertando que todos os mapas precisam ser atualizados.

### Compartilhadas

- **Validação Zod no backend e no frontend:** schemas espelham contratos. Frontend valida antes de enviar; backend re-valida sempre.
- **Mensagens de erro padronizadas:** `{ message, statusCode, error, issues, formErrors }` — frontend tem helper único `getErrorMessage` pra extrair texto amigável.

---

## Testes

### Backend (36 testes em ~4s)

```bash
cd backend

# Rodar testes
npm test

# Com cobertura
npm run test:coverage
```

Suites:

- `smoke` (2): infraestrutura
- `auth` (8): login, validação, middleware
- `categories` (8): CRUD com RBAC
- `reimbursements` (16): criação, transições válidas/inválidas, RBAC, visibilidade
- `integration-flow` (2): ciclos completos (aprovação e rejeição)

**Estratégia:** integração com banco real isolado (`reimbursement_db_test`). Cada teste sobe o app inteiro com Supertest e valida comportamento observável (status codes, payloads, persistência).

### Frontend (25 testes em ~3s)

```bash
cd frontend

# Rodar testes
npm test

# Com cobertura
npm run test:coverage

# Modo watch
npm run test:watch

# Interface visual
npm run test:ui
```

Suites:

- `smoke` (1)
- `StatusBadge` (6): mapeamento status → label
- `Timeline` (4): renderização, ordenação, observação
- `Login` (5): validação Zod + chamada do contexto
- `ReimbursementActions` (9): RBAC condicional (matriz perfil × status)

**Estratégia:** componentes isolados com React Testing Library. Foco em comportamento observável (texto, papéis ARIA, interações), não em detalhes de implementação.

---

## Documentação da API

Coleção Postman disponível em \`docs/postman_collection.json\`.

Importe junto com \`docs/postman_environment.json\` para usar variáveis de ambiente prontas (URL, tokens por perfil).

### Endpoints principais

```
POST   /auth/login                            # qualquer perfil
GET    /users                                 # ADMIN
POST   /users                                 # ADMIN

GET    /categories                            # autenticado
POST   /categories                            # ADMIN
PUT    /categories/:id                        # ADMIN

GET    /reimbursements                        # autenticado (filtra por perfil)
GET    /reimbursements/:id                    # autenticado
POST   /reimbursements                        # COLABORADOR
PUT    /reimbursements/:id                    # dono em RASCUNHO

POST   /reimbursements/:id/submit             # dono em RASCUNHO
POST   /reimbursements/:id/approve            # GESTOR em ENVIADO
POST   /reimbursements/:id/reject             # GESTOR em ENVIADO
POST   /reimbursements/:id/pay                # FINANCEIRO em APROVADO
POST   /reimbursements/:id/cancel             # dono em RASCUNHO ou ENVIADO

GET    /reimbursements/:id/history            # autenticado
GET    /reimbursements/:id/attachments        # autenticado
POST   /reimbursements/:id/attachments        # dono em RASCUNHO
```

### Health check

```
GET /health
→ 200 { "status": "ok", "uptime": ... }
```

---

## Diferenciais implementados

[A ser preenchido]

---

## Autor

Paulo Borges
