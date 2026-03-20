'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  instanceUrl: z.string().url('A URL deve ter o formato https://...'),
  token: z.string().min(1, 'O token é obrigatório.'),
})

type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  organizationId: string
}

export function NewInstanceModal({ open, onOpenChange, onSuccess, organizationId }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', instanceUrl: '', token: '' },
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    try {
      // Cria a instância na tabela channels
      const { error } = await supabase.from('channels').insert({
        organization_id: organizationId,
        type: 'whatsapp',
        name: data.name,
        instance_url: data.instanceUrl,
        instance_token: data.token,
        status: 'disconnected',
      })

      if (error) throw error

      toast.success('Instância criada com sucesso!')
      form.reset()
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar instância.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Instância do WhatsApp</DialogTitle>
          <DialogDescription>
            Conecte uma API do Uazapi. Insira a URL base e o token de acesso.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nome da Instância</Label>
            <Input
              {...form.register('name')}
              placeholder="Ex: WhatsApp Vendas"
              disabled={isLoading}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>URL Base (uazapi)</Label>
            <Input
              {...form.register('instanceUrl')}
              placeholder="Ex: https://sua-instancia.uazapi.com"
              disabled={isLoading}
            />
            {form.formState.errors.instanceUrl && (
              <p className="text-xs text-destructive">{form.formState.errors.instanceUrl.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Token de Acesso</Label>
            <Input
              {...form.register('token')}
              type="password"
              placeholder="Seu token uazapi..."
              disabled={isLoading}
            />
            {form.formState.errors.token && (
              <p className="text-xs text-destructive">{form.formState.errors.token.message}</p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvar Instância
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
