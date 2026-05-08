# Sistema de Controle de Solicitações de Reembolso

Sistema fullstack para gestão de solicitações de reembolso com controle de fluxo aprovação, baseado em perfis de usuário (Colaborador, Gestor, Financeiro e Admin).

---

## Sumário

- [Stack](#stack)
- [Funcionalidades principais](#funcionalidades-principais)
- [Diferenciais implementados](#diferenciais-implementados)
- [Como rodar](#como-rodar)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Decisões arquiteturais](#decisões-arquiteturais)
- [Testes](#testes)
- [Documentação da API](#documentação-da-api)

---

## Stack

### Backend

- **Node.js + Express** - servidor HTTP
- **TypeScript** - tipagem estática estrita
- **Prisma ORM** - acesso ao banco
- **PostgreSQL 16** - banco relacional
- **Zod** - validação de schemas em runtime
- **JWT** - autenticação stateless
- **bcryptjs** - hash de senhas
- **Jest + Supertest** - testes de integração

### Frontend

- **Vite 8 + React 19** - bundler moderno e UI
- **TypeScript** - tipagem estrita
- **TanStack Query** - estado de servidor
- **Context API** - estado de cliente (autenticação)
- **React Router 7** - roteamento client-side
- **React Hook Form + Zod** - formulários
- **Tailwind CSS + shadcn/ui** - design system
- **Vitest + Testing Library** - testes de componentes

### Infraestrutura

- **Docker Compose** - Postgres em container
- **dotenv** - variáveis de ambiente

### Integrações externas

- **BrasilAPI** - feriados nacionais
- **ntfy.sh** - notificações push

---

## Funcionalidades principais

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
- Histórico imutável de ações

### Máquina de estados

```
[ RASCUNHO ] ──> [ ENVIADO ] ──> [ APROVADO ] ──> [ PAGO ]
     │                │
     │                ├──> [ REJEITADO ]
     │                │
     └────────────────┴──> [ CANCELADO ]
```

Transições disponíveis por perfil:

- **SUBMIT:** dono em RASCUNHO
- **APPROVE / REJECT:** GESTOR em ENVIADO (rejeição exige justificativa)
- **PAY:** FINANCEIRO em APROVADO
- **CANCEL:** dono em RASCUNHO ou ENVIADO

### Histórico

- Linha do tempo automática de eventos por solicitação
- Cada transição registra autor, ação, observação opcional e timestamp

### Administração (ADMIN)

- Cadastro de usuários (com escolha de perfil)
- CRUD de categorias com soft delete (ativar/desativar)
- Limites de valor por categoria

---

### Diferenciais implementados

| Diferencial                                     | Onde                                                                                                                                                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ✅ **Bloqueio de despesas futuras**             | Schema Zod (back e front) com `.refine()` validando que `dataDespesa <= hoje`. Defesa em 3 camadas: HTML5 `max`, Zod frontend, Zod backend                                                                         |
| ✅ **Limite de valor por categoria**            | Campo `valorMaximo Decimal?` em Categoria. Validação no service de criação/edição. Dropdown mostra "(até R$ X,XX)". Admin edita no CRUD de categoria                                                               |
| ✅ **Bloqueio de submissão sem anexo > R$ 100** | Validação na transição SUBMIT do `executeTransition`. UI desabilita botão preventivamente                                                                                                                          |
| ✅ **Dashboard com totais**                     | Endpoint `GET /reimbursements/stats` com `prisma.groupBy()`. Cards adaptados por perfil: COLABORADOR vê próprias por status, GESTOR vê o que tem pra decidir, FINANCEIRO vê fluxo financeiro, ADMIN vê visão geral |
| ✅ **Soft delete**                              | Categorias com flag `ativo`. Não exclui fisicamente, preserva integridade referencial                                                                                                                              |
| ✅ **Seeds iniciais**                           | `backend/prisma/seed.ts` cria 4 usuários (1 por perfil) e 5 categorias (3 com limite, 2 sem)                                                                                                                       |
| ✅ **Collection Postman**                       | `docs/postman_collection.json` + `docs/postman_environment.json` com tokens prontos por perfil                                                                                                                     |
| ✅ **Testes automatizados backend**             | 46 testes Jest + Supertest com banco isolado (`reimbursement_db_test`), executando em ~5s                                                                                                                          |
| ✅ **Testes automatizados frontend**            | 25 testes Vitest + Testing Library cobrindo componentes críticos                                                                                                                                                   |
| ✅ **Docker Compose**                           | Postgres em container, isolado e reproduzível                                                                                                                                                                      |
| ✅ **Notificações push (ntfy)**                 | Endpoint configurável `NTFY_TOPIC` no .env. Notifica solicitante em APPROVE/REJECT/PAY. Falha de ntfy não quebra a transição                                                                                       |
| ✅ **Integração com API externa**               | BrasilAPI consultada para detectar feriados nacionais. Alerta visual abaixo do datepicker quando data selecionada é feriado                                                                                        |

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

### 5. (Opcional) Notificações push

Para testar o diferencial de notificações:

1. Instale o app **ntfy** no celular (gratuito)
2. Subscreva a um tópico único (ex: `meu-app-reembolsos-9k3m`)
3. Defina `NTFY_TOPIC=meu-app-reembolsos-9k3m` no `backend/.env`
4. Reinicie o backend
5. Aprove uma solicitação como gestor → push chega no celular

Sem `NTFY_TOPIC` configurado, o sistema funciona normalmente sem enviar notificações.

## Estrutura do projeto

```
reimbursement-system/
├── backend/                  # API REST
│   ├── prisma/
│   │   ├── schema.prisma     # modelo de dados em PT com @@map snake_case
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
│   │   ├── shared/           # erros, services compartilhados
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/                # 46 testes de integração
│   └── docker-compose.yml
│
├── frontend/                 # SPA React
│   ├── src/
│   │   ├── api/              # clientes Axios por domínio
│   │   ├── components/
│   │   │   ├── layout/       # Header, AppLayout
│   │   │   ├── shared/       # componentes do projeto
│   │   │   └── ui/           # shadcn/ui (não modificar)
│   │   ├── contexts/         # AuthContext
│   │   ├── hooks/            # custom hooks (TanStack Query)
│   │   ├── lib/
│   │   │   ├── format.ts     # formatadores
│   │   │   ├── utils.ts      # utilitário cn() do shadcn
│   │   │   └── schemas/      # schemas Zod
│   │   ├── pages/
│   │   ├── types/
│   │   ├── App.tsx           # entrada principal e configuração de Providers
│   │   ├── index.css         # estilos globais e variáveis do Tailwind
│   │   ├── main.tsx          # ponto de montagem (render) do React
│   │   └── routes.tsx        # definições do React Router
│   ├── tests/                # 25 testes de componentes
│   └── vitest.config.ts
│
└── docs/
    ├── postman_collection.json
    └── postman_environment.json
```

---

## Testes

### Backend (46 testes em ~4s)

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
- `reimbursements` (24): CRUD, transições, RBAC, visibilidade, limite por categoria, bloqueio sem anexo, stats
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
---

## Autor

Paulo de Melo Borges
