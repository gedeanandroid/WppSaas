# Spec: Integração WhatsApp via uazapi

> Data: 2026-03-19

## Objetivo

Integrar o WhatsApp ao sistema multi-atendimento via API uazapi Cloud, permitindo que organizações conectem múltiplas instâncias e gerenciem conversas pelo workspace. Inclui modelo API-only para clientes que desejam apenas o serviço de API.

## Decisões de Design

- **API:** uazapi Cloud SaaS (`https://{instancia}.uazapi.com`)
- **Arquitetura:** Gateway Centralizado — SDK interno (`src/lib/uazapi/`) abstrai todas as chamadas
- **Auth:** Token por instância, armazenado na tabela `channels`
- **Multi-instância:** Cada organização pode ter N instâncias (controlado por `max_instances`)
- **Dois modelos de negócio:** Plataforma completa (workspace) + API-only
- **Licenciamento:** Sem planos — apenas quantidades (`max_instances` + `max_api_keys`)
- **Valores:** Tratados em fase posterior

---

## Schema do Banco

### `organizations` (atualização)
- Remover/ignorar campo `plan`
- Adicionar `max_instances INT DEFAULT 1`
- Adicionar `max_api_keys INT DEFAULT 0`

### `channels` (atualização)
- Adicionar `instance_url TEXT` — URL da instância uazapi
- Adicionar `instance_token TEXT` — token da instância
- Adicionar `qr_code TEXT` — QR code base64 temporário
- Adicionar `updated_at TIMESTAMPTZ DEFAULT now()`

### `api_keys` (nova)
- `id UUID PK`, `organization_id UUID FK`, `name TEXT`, `key_hash TEXT`, `key_prefix TEXT`
- `permissions JSONB`, `is_active BOOLEAN`, `last_used_at TIMESTAMPTZ`, `created_at TIMESTAMPTZ`

---

## Arquitetura de Componentes

### Camada de Serviço
- **`src/lib/uazapi/client.ts`** — HTTP client (connect, disconnect, getStatus, getQrCode, sendText, sendMedia, setWebhook)
- **`src/lib/uazapi/types.ts`** — Tipos TypeScript dos payloads
- **`src/lib/uazapi/webhook-handler.ts`** — Processa webhooks → INSERT messages no Supabase

### Webhook Receiver
- **`src/app/api/webhooks/whatsapp/[channelId]/route.ts`** — Recebe POST da uazapi, valida e roteia

### UI de Instâncias
- **`src/app/(workspace)/instances/page.tsx`** — Lista, cria, conecta, desconecta instâncias
- **`src/components/instances/QrCodeModal.tsx`** — Exibe QR Code e faz polling de status
- Exibe: "X de Y instâncias utilizadas"
- Bloqueio quando `max_instances` atingido

### Fluxo de Dados

```
Recebimento: [WhatsApp] → [uazapi] → [Webhook] → [Supabase INSERT] → [Realtime → UI]
Envio:       [Atendente UI] → [API Route] → [uazapi client] → [uazapi] → [WhatsApp]
```

---

## Tratamento de Erros

| Cenário | Ação |
|---------|------|
| Instância desconectada | Badge vermelho, bloqueio de envio |
| QR Code expirado | Botão "Gerar novo QR Code" |
| Limite atingido | Modal informando limite |
| Token inválido | Marca "Erro de autenticação" |
| Falha no envio | Toast erro + retry 1x |

---

## Sub-fases de Implementação

- **6A:** Migrations, SDK uazapi, webhook receiver
- **6B:** UI de instâncias, QR Code, controle de licenças
- **6C:** Envio/recebimento de mensagens no workspace

## Verificação

1. Criar instância com URL e token da uazapi
2. Gerar QR Code e conectar WhatsApp
3. Enviar mensagem do workspace → chegar no WhatsApp
4. Receber mensagem do WhatsApp → aparecer no workspace em tempo real
5. Verificar controle de licenças (bloqueio ao atingir limite)
