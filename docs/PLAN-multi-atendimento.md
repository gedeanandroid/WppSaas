# Multi-Atendimento Omnichannel — Plano de Implementação

> **Tipo:** WEB (Full-stack SaaS)
> **Stack:** Next.js 15 + Tailwind CSS v4 + shadcn/ui + Supabase (Auth, DB, Realtime, Storage, Edge Functions)
> **Deploy:** Vercel (frontend) + Supabase Cloud (backend)
> **Data:** 12/03/2026

---

## 📋 Overview

Sistema de multiatendimento omnichannel multi-tenant para equipes de suporte/vendas. Permite que operadores gerenciem conversas de clientes via WhatsApp (API não-oficial) em uma interface web moderna e responsiva. Arquitetura preparada para expansão futura com chatbots e múltiplos canais.

### Decisões Confirmadas

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| **Canais** | WhatsApp (API não-oficial) | MVP com canal mais usado no Brasil |
| **Multi-tenancy** | Sim, com `organization_id` em todas as tabelas | Múltiplas empresas na mesma instância |
| **Auth** | Apenas atendentes, login interno (email/senha) | Sem OAuth externo, Supabase Auth nativo |
| **Distribuição** | Manual/departamento (chatbot futuro) | Simples no MVP, escalável depois |
| **Deploy** | Vercel + Supabase Cloud | Sem infra para gerenciar |

---

## 🎯 Success Criteria

- [ ] Atendente faz login e vê lista de conversas em tempo real
- [ ] Mensagens enviadas/recebidas aparecem instantaneamente (Supabase Realtime)
- [ ] Interface 100% responsiva (mobile-first: lista → chat → voltar)
- [ ] Multi-tenant: dados isolados por organização (RLS ativo em todas as tabelas)
- [ ] WhatsApp conectado via API não-oficial (envio e recebimento de mensagens)
- [ ] Upload de arquivos/imagens no chat (Supabase Storage)
- [ ] Build sem erros no Vercel
- [ ] Tipos TypeScript gerados automaticamente do Supabase

---

## 🛠 Tech Stack

| Camada | Tecnologia | Versão | Justificativa |
|--------|-----------|--------|---------------|
| **Framework** | Next.js (App Router) | 15.x | SSR para auth/SEO, client-side para chat interativo |
| **Linguagem** | TypeScript | 5.x | Type-safety end-to-end |
| **Estilo** | Tailwind CSS | v4 | Utility-first, tokens de design, responsividade |
| **Componentes** | shadcn/ui | latest | Acessíveis, customizáveis, baseados em Radix UI |
| **Estado Global** | Zustand | 5.x | Leve, sem boilerplate, ideal para estado do chat |
| **Data Fetching** | TanStack React Query | 5.x | Cache, revalidação, sync otimista de mensagens |
| **Backend/DB** | Supabase (PostgreSQL 15) | Cloud | Auth + RLS + Realtime + Storage + Edge Functions |
| **Realtime** | Supabase Realtime | - | Channels para mensagens, Presence para status online |
| **Storage** | Supabase Storage | - | Upload de arquivos/imagens do chat |
| **Edge Functions** | Supabase Edge Functions (Deno) | - | Webhooks do WhatsApp, processamento assíncrono |
| **WhatsApp** | API não-oficial (ex: Baileys/Evolution API) | TBD | Integração com WhatsApp sem conta Business oficial |
| **Validação** | Zod | 3.x | Schemas compartilhados entre client e server |
| **Ícones** | Lucide React | latest | Consistente com shadcn/ui |

---

## 📁 File Structure

```
multi-Atendimento/
├── .agent/                          # Antigravity Kit (já existe)
├── docs/
│   └── PLAN-multi-atendimento.md    # Este arquivo
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                  # Grupo de rotas auth
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/             # Grupo de rotas autenticadas
│   │   │   ├── layout.tsx           # Layout com sidebar
│   │   │   ├── page.tsx             # Dashboard principal
│   │   │   ├── atendimentos/
│   │   │   │   └── page.tsx         # Workspace do chat (tela principal)
│   │   │   ├── contatos/
│   │   │   │   └── page.tsx
│   │   │   └── configuracoes/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   └── webhooks/
│   │   │       └── whatsapp/
│   │   │           └── route.ts     # Webhook receiver do WhatsApp
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Tailwind + tokens de design
│   │   └── providers.tsx            # QueryClient, Supabase, Zustand
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── sidebar.tsx          # Barra lateral de navegação
│   │   │   ├── sidebar-item.tsx     # Item de navegação
│   │   │   └── mobile-header.tsx    # Header mobile com hamburguer
│   │   ├── chat/
│   │   │   ├── chat-workspace.tsx   # Container principal do workspace
│   │   │   ├── conversation-list.tsx # Painel de conversas (esquerda)
│   │   │   ├── conversation-card.tsx # Card de cada conversa
│   │   │   ├── chat-area.tsx         # Área do chat (direita)
│   │   │   ├── chat-header.tsx       # Header da conversa ativa
│   │   │   ├── message-bubble.tsx    # Balão de mensagem
│   │   │   ├── message-input.tsx     # Input de envio
│   │   │   ├── channel-header.tsx    # Header do canal (nome, status)
│   │   │   └── search-bar.tsx        # Barra de pesquisa
│   │   └── shared/
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       └── status-indicator.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Supabase browser client
│   │   │   ├── server.ts            # Supabase server client
│   │   │   ├── middleware.ts        # Auth middleware
│   │   │   └── admin.ts            # Supabase admin (service role)
│   │   ├── hooks/
│   │   │   ├── use-conversations.ts  # Hook para listar/filtrar conversas
│   │   │   ├── use-messages.ts       # Hook para mensagens + realtime
│   │   │   ├── use-realtime.ts       # Hook genérico de realtime
│   │   │   └── use-auth.ts           # Hook de autenticação
│   │   ├── stores/
│   │   │   ├── chat-store.ts         # Zustand: conversa ativa, UI state
│   │   │   └── auth-store.ts         # Zustand: user session
│   │   ├── types/
│   │   │   ├── database.types.ts     # Tipos gerados do Supabase
│   │   │   └── app.types.ts          # Tipos da aplicação
│   │   ├── utils/
│   │   │   ├── format.ts             # Formatação de datas, telefones
│   │   │   └── cn.ts                 # Utility class merge (Tailwind)
│   │   └── validators/
│   │       └── schemas.ts            # Zod schemas
│   └── middleware.ts                 # Next.js middleware (auth guard)
├── supabase/
│   ├── migrations/                   # SQL migrations
│   │   ├── 001_create_organizations.sql
│   │   ├── 002_create_profiles.sql
│   │   ├── 003_create_channels.sql
│   │   ├── 004_create_conversations.sql
│   │   ├── 005_create_messages.sql
│   │   ├── 006_create_departments.sql
│   │   └── 007_enable_rls.sql
│   ├── functions/                    # Edge Functions
│   │   └── whatsapp-webhook/
│   │       └── index.ts
│   └── seed.sql                      # Dados de teste
├── public/
│   └── logo.svg
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🗃 Database Schema (Supabase PostgreSQL)

### Diagrama de Entidades

```
organizations ─┬─> profiles (atendentes)
               ├─> channels (canais WhatsApp conectados)
               ├─> departments (departamentos)
               └─> conversations ──> messages
                        │                  │
                        └── assigned_to ───┘ (profile_id)
```

### Tabelas Principais

#### `organizations`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
name            TEXT NOT NULL
slug            TEXT UNIQUE NOT NULL
plan            TEXT DEFAULT 'free'        -- free, pro, enterprise
max_agents      INT DEFAULT 3
created_at      TIMESTAMPTZ DEFAULT now()
```

#### `profiles` (atendentes/operadores)
```sql
id              UUID PRIMARY KEY REFERENCES auth.users(id)
organization_id UUID NOT NULL REFERENCES organizations(id)
full_name       TEXT NOT NULL
avatar_url      TEXT
role            TEXT DEFAULT 'agent'       -- admin, supervisor, agent
department_id   UUID REFERENCES departments(id)
is_online       BOOLEAN DEFAULT false
created_at      TIMESTAMPTZ DEFAULT now()
```

#### `channels` (canais WhatsApp conectados)
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID NOT NULL REFERENCES organizations(id)
type            TEXT DEFAULT 'whatsapp'    -- whatsapp, webchat (futuro)
name            TEXT NOT NULL               -- "WhatsApp Vendas"
phone_number    TEXT                        -- número conectado
status          TEXT DEFAULT 'disconnected' -- connected, disconnected
avatar_url      TEXT
config          JSONB DEFAULT '{}'          -- configs da API
created_at      TIMESTAMPTZ DEFAULT now()
```

#### `departments`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID NOT NULL REFERENCES organizations(id)
name            TEXT NOT NULL               -- "Vendas", "Suporte"
created_at      TIMESTAMPTZ DEFAULT now()
```

#### `conversations`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID NOT NULL REFERENCES organizations(id)
channel_id      UUID NOT NULL REFERENCES channels(id)
department_id   UUID REFERENCES departments(id)
assigned_to     UUID REFERENCES profiles(id)  -- atendente responsável
contact_name    TEXT NOT NULL
contact_phone   TEXT NOT NULL
contact_avatar  TEXT
status          TEXT DEFAULT 'open'           -- open, closed, pending
unread_count    INT DEFAULT 0
last_message    TEXT                           -- preview para a lista
last_message_at TIMESTAMPTZ
created_at      TIMESTAMPTZ DEFAULT now()
```

#### `messages`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
conversation_id UUID NOT NULL REFERENCES conversations(id)
sender_type     TEXT NOT NULL                  -- 'agent', 'customer'
sender_id       UUID                           -- profile_id se agent
content         TEXT
media_url       TEXT                           -- URL do arquivo/imagem
media_type      TEXT                           -- image, video, audio, document
status          TEXT DEFAULT 'sent'            -- sent, delivered, read
created_at      TIMESTAMPTZ DEFAULT now()
```

### Row Level Security (RLS)

Todas as tabelas terão RLS habilitado com policies baseadas em `organization_id`:

```sql
-- Padrão para todas as tabelas:
CREATE POLICY "org_isolation" ON [table]
  USING (organization_id = (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));
```

---

## 📋 Task Breakdown

### Fase 1: Foundation (P0) — `database-architect` + `security-auditor`

- [ ] **T1.1** Criar projeto Supabase Cloud
  - → OUTPUT: Project ID, URL, anon key
  - → VERIFY: `supabase status` retorna dados do projeto

- [ ] **T1.2** Estrutura do banco: criar migrations SQL
  - → INPUT: Schema definido acima
  - → OUTPUT: Arquivos em `supabase/migrations/`
  - → VERIFY: `supabase db push` executa sem erros

- [ ] **T1.3** Habilitar RLS e criar policies de isolamento
  - → INPUT: Tabelas criadas
  - → OUTPUT: Migration `007_enable_rls.sql`
  - → VERIFY: Query direta sem `auth.uid()` retorna vazio

- [ ] **T1.4** Configurar Supabase Auth (email/senha apenas)
  - → OUTPUT: Auth configurado no dashboard, sem providers externos
  - → VERIFY: Criar usuário via API, login retorna JWT válido

- [ ] **T1.5** Gerar tipos TypeScript do schema
  - → OUTPUT: `src/lib/types/database.types.ts`
  - → VERIFY: Arquivo gerado com todas as tabelas tipadas

- [ ] **T1.6** Seed data: criar organização e usuário de teste
  - → OUTPUT: `supabase/seed.sql`
  - → VERIFY: Login com usuário seed funciona

---

### Fase 2: Project Setup (P0) — `frontend-specialist`

- [ ] **T2.1** Inicializar Next.js 15 com TypeScript e Tailwind CSS v4
  - → CMD: `npx -y create-next-app@latest ./ --ts --tailwind --app --src-dir --eslint`
  - → VERIFY: `npm run dev` roda na porta 3000

- [ ] **T2.2** Instalar dependências do projeto
  - → CMD: `npm install @supabase/supabase-js @supabase/ssr zustand @tanstack/react-query zod lucide-react`
  - → VERIFY: `package.json` contém todas as deps

- [ ] **T2.3** Instalar e configurar shadcn/ui
  - → CMD: `npx shadcn@latest init`
  - → VERIFY: `components.json` criado na raiz

- [ ] **T2.4** Configurar Supabase clients (browser + server + middleware)
  - → OUTPUT: `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`
  - → VERIFY: Import funciona, client se conecta ao projeto

- [ ] **T2.5** Configurar Next.js middleware para auth guard
  - → OUTPUT: `src/middleware.ts`
  - → VERIFY: Rotas `/atendimentos` redirecionam para `/login` sem sessão

- [ ] **T2.6** Configurar providers (QueryClient, Supabase)
  - → OUTPUT: `src/app/providers.tsx`
  - → VERIFY: App renderiza sem erros

- [ ] **T2.7** Configurar design tokens (cores, fontes) no `globals.css`
  - → Cor primária: Indigo (#4F46E5)
  - → Fundo: #F3F4F6, conteúdo: #FFFFFF
  - → Fonte: Inter (Google Fonts)
  - → VERIFY: Tokens acessíveis via Tailwind classes

---

### Fase 3: Auth & Layout (P1) — `frontend-specialist` + `backend-specialist`

- [ ] **T3.1** Página de login (`/login`)
  - → Formulário email/senha com validação Zod
  - → Loading state, error handling
  - → VERIFY: Login com seed user redireciona para dashboard

- [ ] **T3.2** Layout autenticado com Sidebar
  - → Sidebar vertical minimalista (logo, ícones, avatar, logout)
  - → Ícones: Dashboard, Atendimentos (ativo), Contatos, Configurações
  - → Estado ativo com cor primária
  - → VERIFY: Sidebar renderiza, logout funciona

- [ ] **T3.3** Mobile header com menu hamburguer
  - → Sidebar oculta em mobile, acessível via drawer
  - → VERIFY: Responsivo em viewport 375px

- [ ] **T3.4** Zustand stores (chat-store, auth-store)
  - → OUTPUT: `src/lib/stores/`
  - → VERIFY: Estado persiste entre navegações

---

### Fase 4: Chat Workspace (P2) — `frontend-specialist`

- [ ] **T4.1** Componente `chat-workspace.tsx` (container flex de 3 colunas)
  - → Flex layout: sidebar | conversation-list | chat-area
  - → 100vh, responsive
  - → VERIFY: Layout correto em desktop e mobile

- [ ] **T4.2** `conversation-list.tsx` — Painel de conversas
  - → Channel header (foto, nome, status online)
  - → Search bar com ícone de lupa
  - → Lista de cards com scroll vertical
  - → VERIFY: Renderiza com dados mock

- [ ] **T4.3** `conversation-card.tsx` — Card de cada conversa
  - → Avatar, nome (bold), preview truncada, horário
  - → Badge de não-lidas (cor primária)
  - → Selecionado: bg indigo-50, border-left indigo
  - → VERIFY: Hover e seleção funcionam

- [ ] **T4.4** `chat-area.tsx` — Área do chat principal
  - → Chat header (avatar, nome, telefone, botões)
  - → Message body (scroll, balões)
  - → Message input (footer fixo)
  - → VERIFY: Layout completo renderiza

- [ ] **T4.5** `message-bubble.tsx` — Balões de mensagem
  - → Cliente: bg #E5E7EB, alinhado esquerda
  - → Atendente: bg #4F46E5, texto branco, alinhado direita
  - → Suporte a mídia (imagem placeholder)
  - → VERIFY: Ambos estilos renderizam corretamente

- [ ] **T4.6** `message-input.tsx` — Input de envio
  - → Botão clipe (anexos), textarea expansível, botão enviar
  - → Botão enviar fica indigo quando há texto
  - → VERIFY: Digitação e envio funcionam

- [ ] **T4.7** Comportamento responsivo mobile
  - → Mobile: exibe apenas conversation-list OU chat-area
  - → Click no card → chat desliza 100% da tela
  - → Botão voltar no header retorna à lista
  - → VERIFY: Transição suave em viewport 375px

---

### Fase 5: Realtime & Data (P2) — `backend-specialist` + `frontend-specialist`

- [ ] **T5.1** Hook `use-conversations.ts` — listar conversas com React Query
  - → Fetch do Supabase, filtro por organization_id (RLS automático)
  - → Ordenação por `last_message_at DESC`
  - → VERIFY: Lista carrega no painel de conversas

- [ ] **T5.2** Hook `use-messages.ts` — mensagens da conversa ativa
  - → Fetch paginado, scroll to bottom
  - → VERIFY: Mensagens carregam ao selecionar conversa

- [ ] **T5.3** Hook `use-realtime.ts` — subscribe em novos eventos
  - → Supabase Realtime channel para `messages` (INSERT)
  - → Supabase Realtime channel para `conversations` (UPDATE)
  - → Atualiza React Query cache automaticamente
  - → VERIFY: Mensagem inserida no DB aparece instantaneamente na UI

- [ ] **T5.4** Envio de mensagens
  - → Insert na tabela `messages`
  - → Atualiza `conversations.last_message` e `last_message_at`
  - → Sync otimista (aparece antes do DB confirmar)
  - → VERIFY: Mensagem aparece instantaneamente, sem flicker

- [ ] **T5.5** Upload de arquivos (Supabase Storage)
  - → Bucket `chat-media` com policy por organization_id
  - → Upload via input de anexo
  - → Preview de imagem no balão
  - → VERIFY: Upload de imagem aparece no chat

- [ ] **T5.6** Presença online (Supabase Presence)
  - → Atendente logado = online (ponto verde)
  - → Track via `supabase.channel('presence')`
  - → VERIFY: Status muda ao fazer login/logout

---

### Fase 6: WhatsApp Integration (P2) — `backend-specialist`

- [ ] **T6.1** Pesquisar e escolher API não-oficial do WhatsApp
  - → Opções: Baileys, Evolution API, WPPConnect
  - → Decisão baseada em: estabilidade, documentação, comunidade
  - → OUTPUT: Decisão documentada

- [ ] **T6.2** Configurar webhook receiver (`/api/webhooks/whatsapp`)
  - → Next.js API Route para receber mensagens
  - → Validação do payload, criação de conversa/mensagem no DB
  - → VERIFY: Webhook recebe POST e cria mensagem

- [ ] **T6.3** Edge Function para envio de mensagens
  - → Supabase Edge Function que chama a API do WhatsApp
  - → Chamada a partir do frontend após confirmar envio
  - → VERIFY: Mensagem enviada chega no WhatsApp do cliente

- [ ] **T6.4** Gerenciamento de sessão/conexão do WhatsApp
  - → Tela em `/configuracoes` para conectar/desconectar
  - → QR Code para autenticação (se aplicável)
  - → VERIFY: WhatsApp conecta e indica status "online"

---

### Fase 7: Polish & UX (P3) — `frontend-specialist`

- [ ] **T7.1** Animações e transições (Tailwind + CSS)
  - → Transição suave de slide no mobile
  - → Fade-in nos balões de mensagem
  - → Hover effects nos cards
  - → VERIFY: Animações fluidas sem jank

- [ ] **T7.2** Estados vazios e loading
  - → Skeleton loaders nas listas
  - → Empty state: "Nenhuma conversa" com ilustração
  - → VERIFY: Todas as telas têm loading/empty state

- [ ] **T7.3** Notificações sonoras
  - → Som ao receber nova mensagem (quando tab inativa)
  - → VERIFY: Som toca quando mensagem chega

- [ ] **T7.4** Finalizar atendimento
  - → Botão "Finalizar" muda status para `closed`
  - → Conversa sai da lista principal
  - → VERIFY: Conversa fechada não aparece na lista

---

## 🔐 Segurança

| Item | Implementação |
|------|---------------|
| **RLS** | Todas as tabelas com policy por `organization_id` |
| **Auth Guard** | Next.js middleware bloqueia rotas sem sessão |
| **CSRF** | Supabase Auth usa httpOnly cookies via `@supabase/ssr` |
| **Validação** | Zod schemas em todos os inputs |
| **Rate Limiting** | Supabase Edge Functions com rate limit |
| **Storage** | Bucket com policy: apenas org do usuário acessa |

---

## 🚀 Deploy

| Componente | Plataforma | Pipeline |
|-----------|-----------|----------|
| **Frontend** | Vercel | Git push → auto-deploy |
| **Database** | Supabase Cloud | Migrations via CLI |
| **Edge Functions** | Supabase Cloud | `supabase functions deploy` |
| **Storage** | Supabase Storage | Automático (cloud) |

### Variáveis de Ambiente (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...      # Apenas server-side
WHATSAPP_API_URL=http://...            # URL da API não-oficial
WHATSAPP_API_KEY=...                   # Token de acesso
```

---

## Phase X: Verification (FINAL)

- [ ] `npm run build` — Build sem erros
- [ ] `npx tsc --noEmit` — Sem erros de tipo
- [ ] `npm run lint` — Sem warnings
- [ ] Login → ver conversas → enviar mensagem → receber em tempo real
- [ ] Mobile: lista → click → chat → voltar — transição suave
- [ ] RLS: usuário da org A não vê dados da org B
- [ ] Upload de imagem aparece no chat
- [ ] WhatsApp: mensagem enviada chega no cliente

---

## 📝 Notas

1. **WhatsApp API:** A escolha da API não-oficial será feita na Fase 6. Evolution API é a recomendação inicial por ter boa documentação e comunidade brasileira ativa.

2. **Chatbot (futuro):** A schema já contempla `departments` e `assigned_to` para facilitar roteamento automático. Um chatbot poderá ser adicionado como um `profile` com `role: 'bot'`.

3. **Escalabilidade:** Supabase Realtime suporta até 200 conexões simultâneas no plano free. Para produção com múltiplos tenants, será necessário o plano Pro.

4. **Internacionalização:** Não está no escopo do MVP, mas a estrutura com componentes isolados facilita adicionar i18n depois.

---

> ✅ **Próximos passos:** Revise este plano e execute `/create` para iniciar a implementação.
