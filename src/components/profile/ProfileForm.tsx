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
