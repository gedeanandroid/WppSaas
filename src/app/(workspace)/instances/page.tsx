'use client'

import { useState, useCallback, useEffect } from 'react'
import { Plus, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InstanceCard } from '@/components/instances/InstanceCard'
import { NewInstanceModal } from '@/components/instances/NewInstanceModal'
import { QrCodeModal } from '@/components/instances/QrCodeModal'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export default function InstancesPage() {
  const [instances, setInstances] = useState<any[]>([])
  const [org, setOrg] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [qrModalData, setQrModalData] = useState<{ open: boolean; channelId: string | null }>({
    open: false,
    channelId: null,
  })

  const supabase = createClient()

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', userData.user.id)
        .single()

      if (!profile?.organization_id) return

      const [orgRes, channelsRes] = await Promise.all([
        supabase.from('organizations').select('*').eq('id', profile.organization_id).single(),
        supabase.from('channels').select('*').eq('organization_id', profile.organization_id).eq('type', 'whatsapp'),
      ])

      setOrg(orgRes.data)
      setInstances(channelsRes.data || [])
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar instâncias')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  const canCreateNew = org ? instances.length < (org.max_instances || 1) : false

  const handleDisconnect = async (id: string) => {
    try {
      toast.loading('Desconectando...', { id: 'disconnect' })
      const res = await fetch('/api/instances/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId: id }),
      })
      if (!res.ok) throw new Error('Falha ao desconectar')
      toast.success('Desconectado com sucesso', { id: 'disconnect' })
      loadData()
    } catch (error: any) {
      toast.error(error.message, { id: 'disconnect' })
    }
  }

  const handleRemove = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta instância (e todas as suas conversas)?')) return
    try {
      const { error } = await supabase.from('channels').delete().eq('id', id)
      if (error) throw error
      toast.success('Instância removida')
      loadData()
    } catch (error: any) {
      toast.error('Erro ao remover: ' + error.message)
    }
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Instâncias WhatsApp</h1>
            <p className="text-muted-foreground mt-1">Conecte e gerencie seus números de WhatsApp usando a uazapi.</p>
          </div>
          
          <Button 
            onClick={() => setIsNewModalOpen(true)} 
            disabled={isLoading || !canCreateNew}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Instância
          </Button>
        </div>

        {org && (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-xl text-sm flex items-center gap-3 border border-blue-100 dark:border-blue-800/50">
            <Smartphone className="h-5 w-5" />
            <span>
              Você está utilizando <strong>{instances.length}</strong> de <strong>{org.max_instances || 1}</strong> instâncias permitidas na sua licença.
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        ) : instances.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <Smartphone className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Nenhuma instância conectada</h3>
            <p className="text-muted-foreground max-w-[400px] mb-6">
              Você ainda não configurou nenhuma instância do WhatsApp. Adicione sua primeira instância para começar a gerenciar mensagens.
            </p>
            <Button onClick={() => setIsNewModalOpen(true)} disabled={!canCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Instância
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instances.map((instance) => (
              <InstanceCard
                key={instance.id}
                id={instance.id}
                name={instance.name}
                phone_number={instance.phone_number}
                status={instance.status}
                onConnect={(id) => setQrModalData({ open: true, channelId: id })}
                onDisconnect={handleDisconnect}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>

      <NewInstanceModal 
        open={isNewModalOpen} 
        onOpenChange={setIsNewModalOpen} 
        organizationId={org?.id}
        onSuccess={loadData}
      />

      <QrCodeModal 
        open={qrModalData.open} 
        onOpenChange={(open) => setQrModalData({ ...qrModalData, open })}
        channelId={qrModalData.channelId}
        onSuccess={loadData}
      />
    </div>
  )
}
