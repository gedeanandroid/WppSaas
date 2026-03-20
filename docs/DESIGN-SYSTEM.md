# Design System — Multi-Atendimento Omnichannel

> Extraído do HTML de referência. Todos os valores mapeados para classes Tailwind CSS v3.
> Data: 12/03/2026

---

## 🎨 Paleta de Cores

### Cores Primárias (Ação)

| Token | Tailwind | Hex | Uso |
|-------|----------|-----|-----|
| `primary` | `indigo-600` | `#4F46E5` | Botões de ação, ícone ativo, badges, balão do atendente |
| `primary-hover` | `indigo-700` | `#4338CA` | Hover em botões primários |
| `primary-light` | `indigo-50` | `#EEF2FF` | Fundo do chat selecionado (com `/50` opacity) |
| `primary-shadow` | `shadow-indigo-200` | `#C7D2FE` | Sombra colorida em botões |
| `primary-subtle` | `indigo-100` | `#E0E7FF` | Sombra colorida nos balões do atendente, timestamp |

### Cores de Fundo

| Token | Tailwind | Hex | Uso |
|-------|----------|-----|-----|
| `bg-app` | `bg-[#F3F4F6]` | `#F3F4F6` | Body / fundo geral da aplicação |
| `bg-surface` | `bg-white` | `#FFFFFF` | Painéis, cards, headers, áreas de conteúdo |
| `bg-sidebar-header` | `bg-[#f0f2f5]` | `#F0F2F5` | Header do painel de conversas |
| `bg-input` | `bg-slate-50` | `#F8FAFC` | Textarea do input de mensagem |
| `bg-search` | `bg-slate-100` | `#F1F5F9` | Campo de pesquisa |
| `bg-customer-msg` | `bg-slate-100` | `#F1F5F9` | Balão de mensagem do cliente |
| `bg-agent-msg` | `bg-indigo-600` | `#4F46E5` | Balão de mensagem do atendente |
| `bg-hover` | `bg-slate-50` | `#F8FAFC` | Hover em itens de lista |
| `bg-active-chat` | `bg-indigo-50/50` | `#EEF2FF` 50% | Item de chat selecionado |
| `bg-date-separator` | `bg-slate-200` | `#E2E8F0` | Separador de data entre mensagens |

### Cores de Texto

| Token | Tailwind | Hex | Uso |
|-------|----------|-----|-----|
| `text-body` | `text-slate-800` | `#1E293B` | Texto padrão do corpo |
| `text-heading` | `text-slate-900` | `#0F172A` | Títulos, nomes em negrito |
| `text-secondary` | `text-slate-500` | `#64748B` | Preview de mensagem, telefone, separador de data |
| `text-muted` | `text-slate-400` | `#94A3B8` | Timestamps, ícones inativos, placeholders |
| `text-hover-icon` | `text-slate-600` | `#475569` | Hover em ícones secundários |
| `text-hover-icon-dark` | `text-slate-700` | `#334155` | Hover em ícone de anexo |
| `text-on-primary` | `text-white` | `#FFFFFF` | Texto sobre fundo primário (balões, badges) |
| `text-on-primary-muted` | `text-indigo-100` | `#E0E7FF` | Timestamp nos balões do atendente |
| `text-primary` | `text-indigo-600` | `#4F46E5` | Ícone ativo, horário do chat ativo |

### Cores de Borda

| Token | Tailwind | Hex | Uso |
|-------|----------|-----|-----|
| `border-default` | `border-slate-200` | `#E2E8F0` | Bordas principais (sidebar, header, separadores) |
| `border-subtle` | `border-slate-100` | `#F1F5F9` | Bordas sutis (entre chat items, chat header inferior) |
| `border-active` | `border-indigo-600` | `#4F46E5` | Borda lateral do chat selecionado (border-left) |
| `border-avatar` | `border-slate-100` | `#F1F5F9` | Borda do avatar do operador |

### Cores de Estado

| Token | Tailwind | Hex | Uso |
|-------|----------|-----|-----|
| `status-online` | `green-500` | `#22C55E` | Indicador de status online (ponto verde pulsante) |
| `focus-ring` | `ring-indigo-500` | `#6366F1` | Ring de foco em inputs |

---

## 📐 Espaçamento (Spacing)

### Dimensões de Layout

| Elemento | Classe Tailwind | Valor | Descrição |
|----------|-----------------|-------|-----------|
| **Tela inteira** | `h-screen` | `100vh` | Layout ocupa tela toda |
| **Container máximo** | `max-w-[1600px]` | `1600px` | Largura máxima do workspace |
| **Sidebar de navegação** | `w-16` | `64px` (4rem) | Barra lateral fixa de ícones |
| **Painel de conversas** | `w-[30%] min-w-[320px]` | `30%` / mín `320px` | Lista de chats |
| **Área do chat** | `flex-1` | Restante | Ocupa todo espaço flexível |
| **Headers** | `h-16` | `64px` (4rem) | Altura fixa de headers |

### Padding

| Contexto | Classe Tailwind | Valor |
|----------|-----------------|-------|
| **Sidebar nav** | `py-6` | `24px` vertical |
| **Chat item ativo** | `px-4 py-4` | `16px` × `16px` |
| **Chat item normal** | `px-4 py-3` | `16px` × `12px` |
| **Barra de pesquisa container** | `p-2` | `8px` |
| **Input de pesquisa** | `pl-10 pr-4 py-2` | esq `40px`, dir `16px`, vert `8px` |
| **Chat header** | `px-6` | `24px` horizontal |
| **Área de mensagens** | `p-8` | `32px` |
| **Footer do chat** | `p-4` | `16px` |
| **Balão de mensagem** | `p-4` | `16px` |
| **Textarea** | `px-4 py-3` | `16px` × `12px` |
| **Botão primário** | `px-4 py-2` | `16px` × `8px` |
| **Badge de não-lidas** | `px-1.5 py-0.5` | `6px` × `2px` |
| **Nav item ativo** | `p-2` | `8px` |
| **Separador de data** | `px-4 py-1.5` | `16px` × `6px` |
| **Botão de anexo** | `p-2` | `8px` |
| **Botão de enviar** | `p-3` | `12px` |

### Gap (Espaçamento entre elementos)

| Contexto | Classe Tailwind | Valor |
|----------|-----------------|-------|
| **Ícones de navegação** | `gap-6` | `24px` |
| **Itens em chat card** | `gap-3` | `12px` |
| **Itens no footer** | `gap-4` | `16px` |
| **Ações no chat header** | `gap-5` | `20px` |
| **Mensagens no body** | `gap-6` | `24px` |
| **Botão finish (ícone + texto)** | `gap-2` | `8px` |

### Margin

| Contexto | Classe Tailwind | Valor |
|----------|-----------------|-------|
| **Logo → nav** | `mb-8` | `32px` |
| **Avatar do operador** | `mt-auto` | Empurra para o fundo |
| **Preview → badge** | `mt-0.5` | `2px` |
| **Separador de data** | `my-2` | `8px` vertical |
| **Imagem → texto no balão** | `mb-2` | `8px` |
| **Timestamp no balão** | `mt-1` / `mt-2` | `4px` / `8px` |

---

## 🔠 Tipografia

### Tamanhos de Fonte

| Elemento | Classe Tailwind | Tamanho | Peso |
|----------|-----------------|---------|------|
| **Logo icon** | `text-3xl` | `30px` | `font-bold` |
| **Título da seção** (Messages) | `text-lg` | `18px` | `font-bold` |
| **Nome do contato (lista)** | `text-sm` | `14px` | `font-bold` |
| **Nome do contato (header)** | `text-sm` | `14px` | `font-semibold` |
| **Corpo da mensagem** | `text-sm` | `14px` | normal |
| **Preview da mensagem** | `text-xs` | `12px` | normal |
| **Botão de ação** | `text-xs` | `12px` | `font-semibold` |
| **Placeholder input** | `text-sm` | `14px` | normal |
| **Horário (lista - ativo)** | `text-[11px]` | `11px` | `font-semibold` |
| **Horário (lista - normal)** | `text-[11px]` | `11px` | normal |
| **Telefone** | `text-[11px]` | `11px` | normal |
| **Separador de data** | `text-[11px]` | `11px` | `font-bold` + `uppercase` + `tracking-wider` |
| **Timestamp do balão** | `text-[10px]` | `10px` | normal |
| **Badge de não-lidas** | `text-[10px]` | `10px` | `font-bold` |

### Fonte

| Propriedade | Valor |
|-------------|-------|
| **Font Family** | `font-sans` (Tailwind default: Plus Jakarta Sans, system-ui fallback) |
| **Line Height** | `leading-relaxed` (`1.625`) nos balões, `leading-tight` (`1.25`) nos nomes |

---

## 📦 Border Radius

| Elemento | Classe Tailwind | Valor |
|----------|-----------------|-------|
| **Avatar** | `rounded-full` | `50%` |
| **Badge** | `rounded-full` | `50%` |
| **Separador de data** | `rounded-full` | `50%` |
| **Nav item ativo** | `rounded-xl` | `12px` |
| **Textarea** | `rounded-xl` | `12px` |
| **Botão enviar** | `rounded-xl` | `12px` |
| **Botão primário (finish)** | `rounded-lg` | `8px` |
| **Campo de pesquisa** | `rounded-lg` | `8px` |
| **Balão de mensagem** | `rounded-2xl` | `16px` |
| **Balão + canto cortado (cliente)** | `rounded-2xl rounded-tl-none` | `16px` sem top-left |
| **Balão + canto cortado (atendente)** | `rounded-2xl rounded-tr-none` | `16px` sem top-right |

---

## 🌑 Sombras (Shadows)

| Elemento | Classes Tailwind | Descrição |
|----------|------------------|-----------|
| **Container principal** | `shadow-2xl` | Sombra forte no workspace inteiro |
| **Balão do cliente** | `shadow-sm` | Sombra sutil |
| **Balão do atendente** | `shadow-lg shadow-indigo-100` | Sombra grande + colorida indigo |
| **Botão enviar** | `shadow-lg shadow-indigo-200` | Sombra grande + colorida indigo |
| **Botão finish** | `shadow-md shadow-indigo-200` | Sombra média + colorida indigo |

---

## 🖱 Interações e Transições

### Hover

| Elemento | Estado Normal | Hover |
|----------|---------------|-------|
| **Ícone de nav** | `text-slate-400` | `text-indigo-600` |
| **Chat item** | `bg-transparent` | `bg-slate-50` |
| **Botão primário** | `bg-indigo-600` | `bg-indigo-700` |
| **Ícone secundário** | `text-slate-400` | `text-slate-600` |
| **Ícone de anexo** | `text-slate-500` | `text-slate-700` |

### Transições

| Classe | Uso |
|--------|-----|
| `transition-colors` | Ícones de nav, chat items, ícone de anexo |
| `transition-all` | Inputs (focus ring), botões primários |
| `active:scale-95` | Botão de enviar (feedback tátil) |

### Animações

| Animação | Classe | Uso |
|----------|--------|-----|
| **Pulse verde** | `status-pulse` | Indicador de status online |

```css
@keyframes pulse-green {
  0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70%  { transform: scale(1);    box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}
```

### Focus

| Elemento | Classes |
|----------|---------|
| **Input de pesquisa** | `focus:ring-1 focus:ring-teal-500` |
| **Textarea** | `focus:ring-1 focus:ring-indigo-500` |

> ⚠️ **Nota:** O input de pesquisa usa `teal-500` no focus, enquanto o textarea usa `indigo-500`. Recomenda-se padronizar para `indigo-500` na implementação.

---

## 📱 Tamanhos de Componentes

### Avatares

| Contexto | Classe | Tamanho |
|----------|--------|---------|
| **Lista de conversas** | `w-12 h-12` | `48px` × `48px` |
| **Chat header** | `w-10 h-10` | `40px` × `40px` |
| **Operador (sidebar)** | `w-10 h-10` | `40px` × `40px` |

### Ícones

| Contexto | Classe | Tamanho |
|----------|--------|---------|
| **Ícone de nav (Material)** | default `24px` | `24px` |
| **Logo (Material)** | `text-3xl` | `30px` |
| **Ícone de pesquisa (SVG)** | `h-4 w-4` | `16px` |
| **Ícones do header (SVG)** | `h-5 w-5` | `20px` |
| **Ícone de anexo (SVG)** | `h-6 w-6` | `24px` |
| **Ícone de enviar (SVG)** | `h-5 w-5` | `20px` |
| **Checkmark (mensagem)** | `h-3 w-3` | `12px` |
| **Ícone dentro do botão finish** | `text-sm` | `14px` (Material) |

### Largura Máxima das Mensagens

| Elemento | Classe | Valor |
|----------|--------|-------|
| **Balão de mensagem** | `max-w-[80%]` | `80%` do container |

---

## 🎛 Custom Scrollbar

```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;    /* slate-300 */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;    /* slate-400 */
}
```

---

## 📊 Resumo Visual da Hierarquia

```
┌─────────────────────────────────────────────────────────────────────┐
│ Body: bg-[#F3F4F6] h-screen                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Container: bg-white shadow-2xl max-w-[1600px]                │   │
│  │  ┌────┬──────────────────┬───────────────────────────────┐   │   │
│  │  │w-16│ w-[30%]          │ flex-1                        │   │   │
│  │  │    │ min-w-[320px]    │                               │   │   │
│  │  │    │                  │ ┌─────────────────────────┐   │   │   │
│  │  │NAV │ ┌──────────┐    │ │ Chat Header  h-16  px-6 │   │   │   │
│  │  │    │ │Header h-16│    │ ├─────────────────────────┤   │   │   │
│  │  │py-6│ ├──────────┤    │ │                         │   │   │   │
│  │  │    │ │Search p-2│    │ │ Messages  p-8  gap-6    │   │   │   │
│  │  │    │ ├──────────┤    │ │ max-w-[80%] per bubble  │   │   │   │
│  │  │    │ │          │    │ │                         │   │   │   │
│  │  │gap6│ │Chat List │    │ ├─────────────────────────┤   │   │   │
│  │  │    │ │px-4 py-3 │    │ │ Footer  p-4  gap-4     │   │   │   │
│  │  │    │ │          │    │ └─────────────────────────┘   │   │   │
│  │  └────┴──────────────────┴───────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuração Tailwind Sugerida

Quando inicializar o projeto Next.js, configure o `tailwind.config.ts` com estes tokens:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens mapeados do design
        primary: {
          DEFAULT: "#4F46E5",  // indigo-600
          hover: "#4338CA",    // indigo-700
          light: "#EEF2FF",    // indigo-50
          subtle: "#E0E7FF",   // indigo-100
          shadow: "#C7D2FE",   // indigo-200
        },
        surface: {
          app: "#F3F4F6",
          panel: "#FFFFFF",
          header: "#F0F2F5",
          input: "#F8FAFC",     // slate-50
          search: "#F1F5F9",    // slate-100
        },
        bubble: {
          customer: "#F1F5F9",  // slate-100
          agent: "#4F46E5",     // indigo-600
        },
      },
      spacing: {
        sidebar: "4rem",        // 64px
        header: "4rem",         // 64px
        "chat-panel-min": "320px",
      },
      maxWidth: {
        workspace: "1600px",
        bubble: "80%",
      },
      borderRadius: {
        bubble: "1rem",         // 16px (rounded-2xl)
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        "xs-plus": ["11px", { lineHeight: "16px" }],
      },
      keyframes: {
        "pulse-green": {
          "0%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.7)",
          },
          "70%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 6px rgba(34, 197, 94, 0)",
          },
          "100%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 0 0 rgba(34, 197, 94, 0)",
          },
        },
      },
      animation: {
        "status-pulse": "pulse-green 2s infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
```

---

## 📝 Notas de Implementação

1. **Ícones:** O HTML usa Google Material Symbols Outlined. Na implementação Next.js, usaremos **Lucide React** (padrão do shadcn/ui) que tem ícones equivalentes.

2. **Focus Ring:** Padronizar todos os focus rings para `ring-indigo-500` (o HTML mistura `teal-500` no search e `indigo-500` no textarea).

3. **Font:** O HTML usa `font-sans` do Tailwind (system fonts). Recomenda-se adicionar **Inter** via Google Fonts para consistência visual.

4. **Scrollbar:** O custom scrollbar usa pseudo-elementos WebKit. Funciona em Chrome/Edge/Safari. Para Firefox, adicionar `scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent;`.

5. **Sombras coloridas:** As classes `shadow-indigo-100` e `shadow-indigo-200` são nativas do Tailwind v3. Manter na implementação.
