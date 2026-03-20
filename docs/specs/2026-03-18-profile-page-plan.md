# Página de Perfil — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar uma página de perfil do usuário (`/profile`) com edição de dados pessoais e alteração de senha, acessível pelo avatar clicável na Sidebar.

**Architecture:** Dois formulários independentes (`ProfileForm`, `PasswordForm`) dentro de uma página do grupo `(workspace)`. Cada um realiza chamadas separadas ao Supabase Auth. Feedback via toasts (Sonner).

**Tech Stack:** Next.js App Router, React Hook Form, Zod, Supabase Auth, Shadcn/UI, Sonner

---

### Task 1: Instalar Sonner e adicionar Toaster ao layout

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `src/app/providers.tsx`

- [ ] **Step 1: Instalar sonner**

```bash
npm install sonner
```

- [ ] **Step 2: Adicionar Toaster ao Providers**

Em `src/app/providers.tsx`, importar e renderizar o `<Toaster />`:

```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}
```

- [ ] **Step 3: Verificar que o app compila**

```bash
npm run dev
```
Esperado: Compilação sem erros.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/app/providers.tsx
git commit -m "feat: add sonner toaster to providers"
```

---

### Task 2: Criar ProfileForm

**Files:**
- Create: `src/components/profile/ProfileForm.tsx`

- [ ] **Step 1: Criar o componente ProfileForm**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, User } from 'lucide-react'

const profileSchema = z.object({
  fullName: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email(),
  phone: z.string()
    .regex(/^\(\d{2}\)\s\d\s\d{4}-\d{4}$/, 'Formato inválido. Use (XX) X XXXX-XXXX.')
    .or(z.literal('')),
})

type ProfileValues = z.infer<typeof profileSchema>

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`
}

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: '', email: '', phone: '' },
  })

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        form.reset({
          fullName: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
        })
      }
    }
    loadUser()
  }, [])

  async function onSubmit(data: ProfileValues) {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: data.fullName, phone: data.phone },
      })
      if (error) throw error
      toast.success('Perfil atualizado com sucesso!')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar perfil.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xs font-bold tracking-[0.05em] text-muted-foreground uppercase">
          Perfil do Usuário
        </h3>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nome
            </Label>
            <Input
              {...form.register('fullName')}
              placeholder="Seu nome completo"
              disabled={isLoading}
              className="h-12 rounded-xl bg-muted/40 border-muted-foreground/20 focus-visible:bg-transparent transition-colors px-4"
            />
            {form.formState.errors.fullName && (
              <p className="text-xs text-destructive font-semibold">{form.formState.errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Email
            </Label>
            <Input
              {...form.register('email')}
              type="email"
              disabled
              className="h-12 rounded-xl bg-muted/40 border-muted-foreground/20 px-4 opacity-60 cursor-not-allowed"
            />
            <p className="text-[10px] text-muted-foreground">O email não pode ser alterado.</p>
          </div>

          <div className="space-y-2 md:col-span-2 max-w-md">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Telefone / WhatsApp
            </Label>
            <Input
              value={form.watch('phone')}
              onChange={(e) => form.setValue('phone', formatPhone(e.target.value), { shouldValidate: true })}
              placeholder="(00) 0 0000-0000"
              disabled={isLoading}
              className="h-12 rounded-xl bg-muted/40 border-muted-foreground/20 focus-visible:bg-transparent transition-colors px-4"
            />
            {form.formState.errors.phone && (
              <p className="text-xs text-destructive font-semibold">{form.formState.errors.phone.message}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end pt-8">
          <Button type="submit" disabled={isLoading} className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/25">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Salvar Perfil
          </Button>
        </div>
      </form>
    </section>
  )
}
```

- [ ] **Step 2: Verificar que o app compila**

```bash
npm run dev
```
Esperado: Compilação sem erros (componente ainda não está em rota, apenas criado).

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/ProfileForm.tsx
git commit -m "feat: create ProfileForm component"
```

---

### Task 3: Criar PasswordForm

**Files:**
- Create: `src/components/profile/PasswordForm.tsx`

- [ ] **Step 1: Criar o componente PasswordForm**

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'A senha atual é obrigatória.'),
  newPassword: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .regex(/[a-zA-Z]/, 'A senha deve conter pelo menos uma letra.')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
    .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial.'),
  confirmPassword: z.string().min(1, 'Confirme a nova senha.'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword'],
})

type PasswordValues = z.infer<typeof passwordSchema>

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  async function onSubmit(data: PasswordValues) {
    setIsLoading(true)
    try {
      // 1. Verificar senha atual
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) throw new Error('Usuário não encontrado.')

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      })
      if (signInError) {
        throw new Error('Senha atual incorreta.')
      }

      // 2. Atualizar senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      })
      if (updateError) throw updateError

      toast.success('Senha alterada com sucesso!')
      form.reset()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao alterar senha.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xs font-bold tracking-[0.05em] text-muted-foreground uppercase">
          Alterar Senha
        </h3>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="space-y-2 md:col-span-2 max-w-md">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Senha Atual
            </Label>
            <Input
              {...form.register('currentPassword')}
              type="password"
              placeholder="Digite sua senha atual"
              disabled={isLoading}
              className="h-12 rounded-xl bg-muted/40 border-muted-foreground/20 focus-visible:bg-transparent transition-colors px-4"
            />
            {form.formState.errors.currentPassword && (
              <p className="text-xs text-destructive font-semibold">{form.formState.errors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nova Senha
            </Label>
            <Input
              {...form.register('newPassword')}
              type="password"
              placeholder="Mínimo 8 caracteres"
              disabled={isLoading}
              className="h-12 rounded-xl bg-muted/40 border-muted-foreground/20 focus-visible:bg-transparent transition-colors px-4"
            />
            {form.formState.errors.newPassword && (
              <p className="text-xs text-destructive font-semibold">{form.formState.errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Confirmar Nova Senha
            </Label>
            <Input
              {...form.register('confirmPassword')}
              type="password"
              placeholder="Repita a nova senha"
              disabled={isLoading}
              className="h-12 rounded-xl bg-muted/40 border-muted-foreground/20 focus-visible:bg-transparent transition-colors px-4"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive font-semibold">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end pt-8">
          <Button type="submit" disabled={isLoading} className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/25">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Alterar Senha
          </Button>
        </div>
      </form>
    </section>
  )
}
```

- [ ] **Step 2: Verificar que o app compila**

```bash
npm run dev
```
Esperado: Compilação sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/PasswordForm.tsx
git commit -m "feat: create PasswordForm component"
```

---

### Task 4: Criar a página /profile

**Files:**
- Create: `src/app/(workspace)/profile/page.tsx`

- [ ] **Step 1: Criar a página**

```tsx
import { ProfileForm } from '@/components/profile/ProfileForm'
import { PasswordForm } from '@/components/profile/PasswordForm'

export default function ProfilePage() {
  return (
    <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full overflow-y-auto">
      <div className="mb-10">
        <h2 className="text-2xl font-extrabold tracking-tight mb-1">Configurações do Usuário</h2>
        <p className="text-sm text-muted-foreground font-medium">
          Gerencie seus dados pessoais e credenciais de acesso.
        </p>
      </div>

      <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 flex flex-col gap-16">
        <ProfileForm />
        <hr className="border-border" />
        <PasswordForm />
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-muted-foreground tracking-widest uppercase font-medium">
          Multi-Atendimento v1.0.0
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificar a página no navegador**

Acessar `http://localhost:3000/profile`. Esperado: a página renderiza com as 2 seções (Perfil e Senha) dentro do layout do workspace.

- [ ] **Step 3: Commit**

```bash
git add src/app/(workspace)/profile/page.tsx
git commit -m "feat: create profile page with ProfileForm and PasswordForm"
```

---

### Task 5: Linkar o Avatar da Sidebar → /profile

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Envolver o Avatar com Link**

No final de `Sidebar.tsx`, substituir o `<Avatar>` por:

```tsx
<Link href="/profile">
  <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 ring-indigo-600 ring-offset-2 transition-all">
    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Operador" />
    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-medium">OP</AvatarFallback>
  </Avatar>
</Link>
```

E adicionar um Tooltip "Meu Perfil" envolvendo esse Link.

- [ ] **Step 2: Verificar no navegador**

Clicar no avatar na sidebar → deve navegar para `/profile`.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Sidebar.tsx
git commit -m "feat: link sidebar avatar to profile page"
```

---

### Task 6: Teste exploratório completo

- [ ] **Step 1: Verificar navegação** — Clicar no avatar → `/profile`
- [ ] **Step 2: Verificar perfil** — Editar nome e telefone, salvar, ver toast de sucesso
- [ ] **Step 3: Verificar validações** — Limpar nome (< 3 chars), telefone inválido → mensagens de erro
- [ ] **Step 4: Verificar senha incorreta** — Colocar senha atual errada → toast "Senha atual incorreta"
- [ ] **Step 5: Verificar troca de senha** — Preencher tudo correto → toast "Senha alterada com sucesso"
- [ ] **Step 6: Verificar login com nova senha** — Logout, login com sessão nova
