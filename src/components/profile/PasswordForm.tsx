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
