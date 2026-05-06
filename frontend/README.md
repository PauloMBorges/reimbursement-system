# Frontend — Sistema de Reembolsos

SPA React/TypeScript que consome a API do backend.

> Documentação geral: [../README.md](../README.md)

## Stack

- Vite 8 + React 19 + TypeScript
- TanStack Query (estado de servidor)
- Context API (autenticação)
- React Router 7
- React Hook Form + Zod
- Tailwind CSS + shadcn/ui
- Vitest + Testing Library

## Como rodar (local)

```bash
npm install
cp .env.example .env  # ou crie manualmente
npm run dev
```

App em http://localhost:5173.

## Scripts disponíveis

| Comando                 | O que faz                           |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Modo desenvolvimento com hot reload |
| `npm run build`         | Build de produção em `dist/`        |
| `npm run preview`       | Servidor de preview do build        |
| `npm run lint`          | Roda ESLint                         |
| `npm run lint:fix`      | Roda ESLint corrigindo o que dá     |
| `npm run format`        | Formata arquivos com Prettier       |
| `npm run format:check`  | Verifica formatação sem alterar     |
| `npm test`              | Roda todos os testes                |
| `npm run test:watch`    | Modo watch                          |
| `npm run test:coverage` | Gera relatório de cobertura         |
| `npm run test:ui`       | Interface visual dos testes         |

## Estrutura de pastas
```
src/
├── api/              # Clientes Axios por domínio
├── components/
│   ├── layout/       # Header, AppLayout
│   ├── shared/       # Componentes do projeto (PrivateRoute, StatusBadge, etc.)
│   └── ui/           # Componentes shadcn/ui (não modifique direto)
├── contexts/         # AuthContext (auth-context.ts, AuthContext.tsx, useAuth.ts)
├── hooks/            # Custom hooks com TanStack Query
├── lib/
│   ├── format.ts     # Formatadores (currency, date)
│   ├── utils.ts      # cn() do shadcn
│   └── schemas/      # Schemas Zod
├── pages/            # Páginas da aplicação
├── types/            # Tipos compartilhados (espelham API)
├── App.tsx           # BrowserRouter > AuthProvider > Routes
├── main.tsx
├── index.css
└── routes.tsx
tests/                # 25 testes Vitest + Testing Library
```

## Adicionando componentes shadcn/ui

```bash
npx shadcn@latest add <nome>
```

Ex: `npx shadcn@latest add tooltip`. Os arquivos vão pra `src/components/ui/`.

## Variáveis de ambiente

| Variável       | Descrição               | Exemplo                 |
| -------------- | ----------------------- | ----------------------- |
| `VITE_API_URL` | URL base da API backend | `http://localhost:3333` |

> Variáveis Vite precisam do prefixo `VITE_` para serem expostas ao cliente.

## Convenções

- **Imports absolutos via alias `@/`:** `import { Button } from '@/components/ui/button'` (configurado em `vite.config.ts` e `tsconfig.app.json`)
- **`Record<EnumType, ...>` em mapas exhaustivos:** TypeScript força mapeamento completo
- **Componentes "burros" + páginas "espertas":** componentes em `shared/` recebem props/callbacks; páginas em `pages/` integram com hooks e roteamento
- **TanStack Query com chaves hierárquicas:** `['reimbursements', id, 'history']` permite invalidação em cascata
