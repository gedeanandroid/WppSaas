'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Smartphone, QrCode, Trash2, LogOut } from 'lucide-react'

export interface InstanceCardProps {
  id: string
  name: string
  phone_number?: string | null
  status: 'disconnected' | 'connecting' | 'connected'
  onConnect: (id: string) => void
  onDisconnect: (id: string) => void
  onRemove: (id: string) => void
}

export function InstanceCard({
  id,
  name,
  phone_number,
  status,
  onConnect,
  onDisconnect,
  onRemove,
}: InstanceCardProps) {
  const isConnected = status === 'connected'
  const isConnecting = status === 'connecting'

  return (
    <Card className="p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
            isConnected ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
            isConnecting ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
            'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}>
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{name}</h3>
            <p className="text-sm text-muted-foreground font-medium">
              {phone_number ? phone_number : 'Sem número'}
            </p>
          </div>
        </div>
        <Badge variant={isConnected ? 'default' : isConnecting ? 'secondary' : 'destructive'} 
          className={
            isConnected ? 'bg-emerald-500 hover:bg-emerald-600' :
            isConnecting ? 'bg-amber-500 hover:bg-amber-600' : ''
          }>
          {isConnected ? 'Conectado' : isConnecting ? 'Conectando...' : 'Desconectado'}
        </Badge>
      </div>

      <div className="flex gap-2 justify-end mt-4">
        {!isConnected && (
          <Button size="sm" onClick={() => onConnect(id)} disabled={isConnecting}>
            <QrCode className="mr-2 h-4 w-4" />
            Conectar (QR)
          </Button>
        )}
        {isConnected && (
          <Button size="sm" variant="secondary" onClick={() => onDisconnect(id)}>
            <LogOut className="mr-2 h-4 w-4" />
            Desconectar
          </Button>
        )}
        <Button size="sm" variant="destructive" onClick={() => onRemove(id)} title="Remover Instância">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
