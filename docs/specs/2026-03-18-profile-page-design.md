# Spec: Página de Perfil com Alteração de Senha

> Data: 2026-03-18

## Objetivo

Criar uma página de perfil do usuário (`/profile`) dentro do workspace, com duas seções independentes: edição de dados pessoais e alteração de senha. O acesso será pelo avatar clicável no rodapé da Sidebar.

## Decisões de Design

- **Acesso:** Avatar no rodapé da Sidebar → `<Link href="/profile">`
- **Layout:** Página única com duas seções (cards) empilhadas, cada uma com seu próprio botão de ação
- **Senha atual obrigatória:** Para alterar a senha, o usuário precisa informar a senha atual
- **Email read-only:** Exibido mas não editável neste formulário
- **Idioma:** Todos os textos e validações em pt-BR

## Arquitetura

### Rota
`src/app/(workspace)/profile/page.tsx` — herda o layout com Sidebar + MobileHeader.

### Componentes

#### `ProfileForm` (`src/components/profile/ProfileForm.tsx`)
- **Campos:** Nome completo, Email (disabled), Telefone/WhatsApp (máscara brasileira)
- **Validação (Zod):**
  - Nome: obrigatório, min 3 chars
  - Telefone: formato `(XX) X XXXX-XXXX`
- **API:** `supabase.auth.updateUser({ data: { full_name, phone } })`
- **Feedback:** Toast Sonner (sucesso/erro)

#### `PasswordForm` (`src/components/profile/PasswordForm.tsx`)
- **Campos:** Senha atual, Nova senha, Confirmar nova senha
- **Validação (Zod):**
  - Senha atual: obrigatória
  - Nova senha: min 8 chars, 1 letra, 1 número, 1 caractere especial
  - Confirmação: deve ser igual à nova senha
- **Fluxo:**
  1. Verifica senha atual via `supabase.auth.signInWithPassword()`
  2. Se válida → `supabase.auth.updateUser({ password: novaSenha })`
- **Feedback:** Toast Sonner (sucesso/erro)

### Sidebar
- Envolver o `<Avatar>` existente em `<Link href="/profile">`
- Adicionar tooltip "Meu Perfil"

## Estilo Visual

Seguir integralmente o Design System (`globals.css` + `DESIGN-SYSTEM.md`):
- Cor primária: Indigo-500 (`hsl(239, 84%, 67%)`)
- Fonte: Plus Jakarta Sans (herdada do body)
- Componentes Shadcn: `Input`, `Button`, `Card`, `Label`
- Toasts via Sonner
- Inputs: fundo `bg-muted/40`, borda sutil, rounded-xl, transição de cores
- Container: `bg-card rounded-xl shadow-lg`, padding generoso (`p-12`)
- Botões de ação: `bg-primary text-primary-foreground`, rounded-xl, shadow

## Tratamento de Erros

| Cenário | Mensagem |
|---------|----------|
| Senha atual incorreta | "Senha atual incorreta." |
| Senhas não coincidem | "As senhas não coincidem." |
| Senha fraca | "A senha deve ter no mínimo 8 caracteres, incluindo letra, número e caractere especial." |
| Nome muito curto | "O nome deve ter pelo menos 3 caracteres." |
| Telefone inválido | "Formato de telefone inválido." |
| Erro de rede | "Erro ao salvar. Tente novamente." |
| Sucesso (perfil) | "Perfil atualizado com sucesso!" |
| Sucesso (senha) | "Senha alterada com sucesso!" |

## Dependências

- Nenhuma dependência nova necessária (Zod, react-hook-form, Sonner já existem)
- Verificar se `sonner` está instalado; caso contrário, adicionar

## Verificação

1. Acessar `/profile` clicando no avatar da Sidebar
2. Editar nome e telefone → salvar → verificar toast de sucesso
3. Tentar alterar senha com senha atual errada → verificar mensagem de erro
4. Alterar senha com dados corretos → verificar toast de sucesso
5. Fazer logout e login com a nova senha → verificar que funciona
