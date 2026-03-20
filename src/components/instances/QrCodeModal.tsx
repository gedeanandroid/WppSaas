'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  channelId: string | null
  onSuccess: () => void
}

export function QrCodeModal({ open, onOpenChange, channelId, onSuccess }: Props) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // 1. Ao abrir o modal, gerar o QR Code chamando a API route interna
  useEffect(() => {
    if (!open || !channelId) return

    setQrCode(null)
    setError(null)
    setIsConnected(false)
    setIsConnecting(true)

    const fetchQr = async () => {
      try {
        const res = await fetch('/api/instances/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelId }),
        })
        const data = await res.json()
        
        if (!res.ok) throw new Error(data.error || 'Erro ao gerar QR Code')
        
        setQrCode(data.instance?.qrcode || data.qrcode)
        setIsConnecting(false)
      } catch (err: any) {
        setError(err.message)
        setIsConnecting(false)
      }
    }

    fetchQr()
  }, [open, channelId])

  // 2. Fazer polling do status a cada 3s para checar se o usuário leu o QR Code
  useEffect(() => {
    if (!open || !channelId || !qrCode || isConnected || error) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/instances/status?channelId=${channelId}`)
        const data = await res.json()
        
        const isConnected = data.instance?.status === 'connected' || data.status?.connected === true
        if (res.ok && isConnected) {
          setIsConnected(true)
          onSuccess() // Refresh page
          setTimeout(() => onOpenChange(false), 2000)
        }
      } catch (err) {
        // Ignora erros de polling silenciosamente
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [open, channelId, qrCode, isConnected, error])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm flex flex-col items-center justify-center p-8">
        <DialogHeader className="text-center w-full">
          <DialogTitle className="text-center">Conectar WhatsApp</DialogTitle>
          <DialogDescription className="text-center">
            Abra o WhatsApp no seu celular, vá em Aparelhos Conectados e leia o código abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex flex-col items-center justify-center min-h-[200px] w-full">
          {isConnected ? (
            <div className="flex flex-col items-center text-emerald-600 gap-4">
              <CheckCircle2 className="h-16 w-16" />
              <p className="font-medium text-lg">Aparelho Conectado!</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center text-destructive gap-4 text-center">
              <AlertCircle className="h-12 w-12" />
              <p className="text-sm">{error}</p>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar e tentar novamente
              </Button>
            </div>
          ) : isConnecting ? (
            <div className="flex flex-col items-center text-muted-foreground gap-4">
              <Loader2 className="h-12 w-12 animate-spin" />
              <p className="text-sm">Gerando QR Code...</p>
            </div>
          ) : qrCode ? (
            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-4">
              <div className="relative w-48 h-48">
                <Image 
                  src={qrCode} 
                  alt="WhatsApp QR Code" 
                  fill 
                  className="object-contain" 
                  unoptimized // É um base64
                />
              </div>
              <p className="text-xs text-muted-foreground animate-pulse text-center">
                Aguardando leitura...
              </p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
