# Integração WhatsApp (uazapi) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar o WhatsApp ao sistema multi-atendimento via uazapi Cloud, com gestão de instâncias, webhooks e envio/recebimento de mensagens.

**Architecture:** Gateway Centralizado — SDK interno (`src/lib/uazapi/`) abstrai toda comunicação com a uazapi. Webhook receiver por canal. Licenciamento por quantidade de instâncias.

**Tech Stack:** Next.js API Routes, Supabase (DB + Realtime), uazapi Cloud API, Zod, Sonner

---

## Fase 6A — Infraestrutura

### Task 1: Migration — Atualizar `organizations`

**Files:**
- Create: `supabase/migrations/20260319000001_update_organizations_licensing.sql`

- [ ] **Step 1: Criar migration**

```sql
-- Adicionar campos de licenciamento
ALTER TABLE organizations
  ADD COLUMN max_instances INT DEFAULT 1,
  ADD COLUMN max_api_keys INT DEFAULT 0;

-- Remover campo 'plan' (substituído por quantidades)
ALTER TABLE organizations DROP COLUMN IF EXISTS plan;
```

- [ ] **Step 2: Aplicar no Supabase**

Usar o MCP Supabase para aplicar a migration no projeto `utjuozqjfzinylkmahii`.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260319000001_update_organizations_licensing.sql
git commit -m "feat: add licensing fields to organizations"
```

---

### Task 2: Migration — Atualizar `channels`

**Files:**
- Create: `supabase/migrations/20260319000002_update_channels_uazapi.sql`

- [ ] **Step 1: Criar migration**

```sql
ALTER TABLE channels
  ADD COLUMN instance_url TEXT,
  ADD COLUMN instance_token TEXT,
  ADD COLUMN qr_code TEXT,
  ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
```

- [ ] **Step 2: Aplicar no Supabase**

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260319000002_update_channels_uazapi.sql
git commit -m "feat: add uazapi fields to channels"
```

---

### Task 3: Migration — Criar `api_keys`

**Files:**
- Create: `supabase/migrations/20260319000003_create_api_keys.sql`

- [ ] **Step 1: Criar migration**

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  permissions JSONB DEFAULT '{"send_message": true, "read_contacts": true}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_isolation" ON api_keys
  USING (organization_id = (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));
```

- [ ] **Step 2: Aplicar no Supabase**

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260319000003_create_api_keys.sql
git commit -m "feat: create api_keys table with RLS"
```

---

### Task 4: Variáveis de Ambiente

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Atualizar as variáveis**

Substituir os placeholders do WhatsApp pelos valores reais da uazapi:

```env
UAZAPI_DEFAULT_URL=https://askchemicals.uazapi.com
UAZAPI_DEFAULT_TOKEN=<token-completo-do-usuario>
```

> O usuário deve preencher o token completo manualmente.

- [ ] **Step 2: Commit** (NÃO commitar .env.local, apenas o .env.local.example)

```bash
git add .env.local.example
git commit -m "docs: add uazapi env variables to example"
```

---

### Task 5: Criar SDK uazapi — Client

**Files:**
- Create: `src/lib/uazapi/client.ts`
- Create: `src/lib/uazapi/types.ts`

- [ ] **Step 1: Criar os tipos**

```typescript
// src/lib/uazapi/types.ts
export interface UazapiInstance {
  instanceUrl: string
  token: string
}

export interface UazapiQrCodeResponse {
  qrcode: string       // base64 do QR Code
  pairingCode?: string // código de pareamento alternativo
}

export interface UazapiStatusResponse {
  status: 'disconnected' | 'connecting' | 'connected'
  phone?: string
  name?: string
}

export interface UazapiWebhookPayload {
  event: string
  instance: string
  data: {
    key: {
      remoteJid: string
      fromMe: boolean
      id: string
    }
    message?: {
      conversation?: string
      imageMessage?: { url?: string; caption?: string }
      videoMessage?: { url?: string; caption?: string }
      audioMessage?: { url?: string }
      documentMessage?: { url?: string; fileName?: string }
    }
    messageTimestamp?: number
    pushName?: string
    status?: string
  }
}

export interface UazapiSendTextPayload {
  number: string
  text: string
}

export interface UazapiSendMediaPayload {
  number: string
  mediaUrl: string
  caption?: string
  mediaType: 'image' | 'video' | 'audio' | 'document'
}
```

- [ ] **Step 2: Criar o client**

```typescript
// src/lib/uazapi/client.ts
import type {
  UazapiInstance,
  UazapiQrCodeResponse,
  UazapiStatusResponse,
  UazapiSendTextPayload,
  UazapiSendMediaPayload,
} from './types'

export class UazapiClient {
  private baseUrl: string
  private token: string

  constructor(instance: UazapiInstance) {
    this.baseUrl = instance.instanceUrl.replace(/\/$/, '')
    this.token = instance.token
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...options?.headers,
      },
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`uazapi error ${res.status}: ${body}`)
    }
    return res.json()
  }

  async getStatus(): Promise<UazapiStatusResponse> {
    return this.request('/instance/status')
  }

  async connect(): Promise<UazapiQrCodeResponse> {
    return this.request('/instance/connect', { method: 'POST' })
  }

  async disconnect(): Promise<void> {
    await this.request('/instance/disconnect', { method: 'POST' })
  }

  async sendText(payload: UazapiSendTextPayload): Promise<any> {
    return this.request('/message/sendText', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async sendMedia(payload: UazapiSendMediaPayload): Promise<any> {
    return this.request('/message/sendMedia', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async setWebhook(url: string): Promise<void> {
    await this.request('/instance/setWebhook', {
      method: 'POST',
      body: JSON.stringify({ webhookUrl: url }),
    })
  }
}
```

- [ ] **Step 3: Verificar compilação**

```bash
npm run dev
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/uazapi/
git commit -m "feat: create uazapi SDK client and types"
```

---

### Task 6: Criar Webhook Receiver

**Files:**
- Create: `src/lib/uazapi/webhook-handler.ts`
- Create: `src/app/api/webhooks/whatsapp/[channelId]/route.ts`

- [ ] **Step 1: Criar o webhook handler**

```typescript
// src/lib/uazapi/webhook-handler.ts
import { createClient } from '@supabase/supabase-js'
import type { UazapiWebhookPayload } from './types'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function extractPhoneNumber(jid: string): string {
  return jid.replace('@s.whatsapp.net', '').replace('@g.us', '')
}

function extractMessageContent(data: UazapiWebhookPayload['data']): {
  content: string | null
  mediaUrl: string | null
  mediaType: string | null
} {
  const msg = data.message
  if (!msg) return { content: null, mediaUrl: null, mediaType: null }

  if (msg.conversation) {
    return { content: msg.conversation, mediaUrl: null, mediaType: null }
  }
  if (msg.imageMessage) {
    return { content: msg.imageMessage.caption || null, mediaUrl: msg.imageMessage.url || null, mediaType: 'image' }
  }
  if (msg.videoMessage) {
    return { content: msg.videoMessage.caption || null, mediaUrl: msg.videoMessage.url || null, mediaType: 'video' }
  }
  if (msg.audioMessage) {
    return { content: null, mediaUrl: msg.audioMessage.url || null, mediaType: 'audio' }
  }
  if (msg.documentMessage) {
    return { content: msg.documentMessage.fileName || null, mediaUrl: msg.documentMessage.url || null, mediaType: 'document' }
  }

  return { content: null, mediaUrl: null, mediaType: null }
}

export async function handleWebhook(channelId: string, payload: UazapiWebhookPayload) {
  // Buscar canal para obter organization_id
  const { data: channel, error: channelError } = await supabaseAdmin
    .from('channels')
    .select('id, organization_id')
    .eq('id', channelId)
    .single()

  if (channelError || !channel) {
    console.error('Channel not found:', channelId)
    return
  }

  const phone = extractPhoneNumber(payload.data.key.remoteJid)
  const isFromMe = payload.data.key.fromMe
  const { content, mediaUrl, mediaType } = extractMessageContent(payload.data)

  if (!content && !mediaUrl) return // mensagem vazia

  // Buscar ou criar conversa
  let { data: conversation } = await supabaseAdmin
    .from('conversations')
    .select('id')
    .eq('channel_id', channelId)
    .eq('contact_phone', phone)
    .eq('status', 'open')
    .single()

  if (!conversation) {
    const { data: newConv } = await supabaseAdmin
      .from('conversations')
      .insert({
        organization_id: channel.organization_id,
        channel_id: channelId,
        contact_name: payload.data.pushName || phone,
        contact_phone: phone,
        status: 'open',
        last_message: content || `[${mediaType}]`,
        last_message_at: new Date().toISOString(),
      })
      .select('id')
      .single()
    conversation = newConv
  }

  if (!conversation) return

  // Inserir mensagem
  await supabaseAdmin.from('messages').insert({
    conversation_id: conversation.id,
    sender_type: isFromMe ? 'agent' : 'customer',
    content,
    media_url: mediaUrl,
    media_type: mediaType,
    status: 'sent',
  })

  // Atualizar conversa
  await supabaseAdmin
    .from('conversations')
    .update({
      last_message: content || `[${mediaType}]`,
      last_message_at: new Date().toISOString(),
      ...(isFromMe ? {} : { unread_count: (conversation as any).unread_count ? (conversation as any).unread_count + 1 : 1 }),
    })
    .eq('id', conversation.id)
}
```

- [ ] **Step 2: Criar a API Route**

```typescript
// src/app/api/webhooks/whatsapp/[channelId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { handleWebhook } from '@/lib/uazapi/webhook-handler'
import type { UazapiWebhookPayload } from '@/lib/uazapi/types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params
    const payload: UazapiWebhookPayload = await request.json()

    // Processar em background (não bloqueia a resposta)
    handleWebhook(channelId, payload).catch(console.error)

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
```

- [ ] **Step 3: Verificar compilação**

- [ ] **Step 4: Commit**

```bash
git add src/lib/uazapi/webhook-handler.ts src/app/api/webhooks/whatsapp/
git commit -m "feat: create webhook receiver and handler"
```

---

## Fase 6B — UI de Instâncias

### Task 7: Criar Página de Instâncias

**Files:**
- Create: `src/app/(workspace)/instances/page.tsx`
- Create: `src/components/instances/InstanceCard.tsx`
- Create: `src/components/instances/NewInstanceModal.tsx`
- Create: `src/components/instances/QrCodeModal.tsx`

- [ ] **Step 1: Criar InstanceCard**

Componente que exibe: nome, número, status (badge colorido), e botões de ação (Conectar/Desconectar/Remover).

- [ ] **Step 2: Criar NewInstanceModal**

Modal com formulário: Nome da instância, URL da uazapi, Token. Valida com Zod. Verifica limite `max_instances`. Insere na tabela `channels`.

- [ ] **Step 3: Criar QrCodeModal**

Modal que chama `POST /instance/connect` na uazapi via API Route interna, exibe o QR Code em base64, e faz polling a cada 3s para checar status. Ao conectar, atualiza `channels.status = 'connected'` e `channels.phone_number`.

- [ ] **Step 4: Criar a página principal**

Lista instâncias da organização, exibe contador "X de Y instâncias", botão "Nova Instância" (desabilitado se limite atingido).

- [ ] **Step 5: Adicionar link na Sidebar**

Adicionar item "Instâncias" na navegação da Sidebar (`Sidebar.tsx`) com ícone `Smartphone`.

- [ ] **Step 6: Verificar no navegador**

- [ ] **Step 7: Commit**

```bash
git add src/app/(workspace)/instances/ src/components/instances/ src/components/layout/Sidebar.tsx
git commit -m "feat: create instances management page with QR code"
```

---

### Task 8: API Routes internas para instâncias

**Files:**
- Create: `src/app/api/instances/connect/route.ts`
- Create: `src/app/api/instances/disconnect/route.ts`
- Create: `src/app/api/instances/status/route.ts`

- [ ] **Step 1: Criar as rotas**

Cada rota: recebe `channelId`, busca credenciais na tabela `channels`, instancia `UazapiClient`, chama o método correspondente. Isso evita expor tokens no frontend.

- [ ] **Step 2: Verificar compilação**

- [ ] **Step 3: Commit**

```bash
git add src/app/api/instances/
git commit -m "feat: create internal API routes for instance management"
```

---

## Fase 6C — Chat Integrado

### Task 9: API Route para envio de mensagens

**Files:**
- Create: `src/app/api/messages/send/route.ts`

- [ ] **Step 1: Criar a rota de envio**

Recebe `{ channelId, phone, text, mediaUrl?, mediaType? }`. Busca credenciais do canal, chama `UazapiClient.sendText()` ou `sendMedia()`. Insere a mensagem no Supabase como `sender_type: 'agent'`.

- [ ] **Step 2: Commit**

```bash
git add src/app/api/messages/send/
git commit -m "feat: create message send API route"
```

---

### Task 10: Integrar envio no ChatInput

**Files:**
- Modify: `src/components/chat/ChatInput.tsx`

- [ ] **Step 1: Atualizar o submit**

Ao enviar mensagem, chamar `POST /api/messages/send` ao invés de inserir diretamente no Supabase. A API Route faz o INSERT + envio via uazapi.

- [ ] **Step 2: Verificar no navegador**

- [ ] **Step 3: Commit**

```bash
git add src/components/chat/ChatInput.tsx
git commit -m "feat: integrate message sending with uazapi"
```

---

### Task 11: Teste Exploratório Completo

- [ ] **Step 1:** Criar instância, gerar QR Code, verificar conexão
- [ ] **Step 2:** Receber mensagem via webhook → verificar no workspace
- [ ] **Step 3:** Enviar mensagem pelo workspace → verificar no WhatsApp
- [ ] **Step 4:** Testar limite de instâncias (bloqueio)
- [ ] **Step 5:** Desconectar instância, verificar status
