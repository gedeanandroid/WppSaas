'use client'

import { useState, useRef } from 'react'
import { Paperclip, Smile, Mic, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSendMessage } from '@/lib/hooks/use-messages'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'

interface ChatInputProps {
  conversationId: string
}

export function ChatInput({ conversationId }: ChatInputProps) {
  const [content, setContent] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutate, isPending } = useSendMessage()
  const { organizationId } = useAuthStore()

  const handleSend = () => {
    if (!content.trim() || !conversationId) return
    mutate({ conversationId, content: content.trim() })
    setContent('')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !organizationId) return

    try {
      setIsUploading(true)
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const filePath = `${organizationId}/${conversationId}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-media')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('chat-media')
        .getPublicUrl(filePath)

      mutate({
        conversationId,
        content: `Arquivo anexo: ${file.name}`,
        mediaUrl: publicUrl,
        mediaType: file.type
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Erro ao enviar arquivo.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isBusy = isPending || isUploading

  return (
    <div className="p-4 bg-white border-t border-slate-200 z-10 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.05)]">
      <div className={`max-w-4xl mx-auto flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-600/20 focus-within:border-indigo-600 transition-all shadow-inner ${isBusy ? 'opacity-70 pointer-events-none' : ''}`}>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload} 
        />

        <div className="flex items-center gap-1 pb-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors h-10 w-10"
          >
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors h-10 w-10">
            <Smile className="h-5 w-5" />
          </Button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-0 focus:ring-0 resize-none min-h-[44px] max-h-32 py-3 px-2 text-[15px] text-slate-800 placeholder:text-slate-400 custom-scrollbar"
          placeholder="Digite uma mensagem..."
          rows={1}
        />

        <div className="flex items-center gap-2 pb-1 pr-1">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors h-10 w-10">
            <Mic className="h-5 w-5" />
          </Button>
          <Button 
            onClick={handleSend}
            disabled={(!content.trim() && !isUploading) || isBusy}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl shadow-md shadow-indigo-600/20 h-10 w-10 transition-all hover:scale-105 active:scale-95 px-0"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-0.5" />}
          </Button>
        </div>
        
      </div>
    </div>
  )
}
