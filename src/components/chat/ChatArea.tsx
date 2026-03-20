'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Phone, MoreVertical, Info } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'

import { useChatStore } from '@/lib/stores/chat-store'
import { useMessages } from '@/lib/hooks/use-messages'
import { useConversations } from '@/lib/hooks/use-conversations'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function ChatArea() {
  const { activeConversationId } = useChatStore()
  const { data: messages, isLoading: loadingMessages } = useMessages(activeConversationId)
  const { data: conversations } = useConversations()

  const activeConversation = conversations?.find((c: any) => c.id === activeConversationId) as any

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#f8fafc]">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-600">Nenhuma conversa selecionada</h3>
          <p className="text-sm text-slate-400">Selecione um atendimento na lista ao lado para começar.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] relative">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%234f46e5\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
      />
      
      {/* Header */}
      <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-indigo-50 border-2 border-white cursor-pointer hover:scale-105 transition-transform shadow-sm">
            {activeConversation.contact_avatar && <AvatarImage src={activeConversation.contact_avatar} />}
            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium">
              {activeConversation.contact_name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors">
              {activeConversation.contact_name}
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
              </span>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Offline</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors">
            <Phone className="h-[18px] w-[18px]" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors">
            <Info className="h-[18px] w-[18px]" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
            <MoreVertical className="h-[18px] w-[18px]" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 lg:p-6 z-10 custom-scrollbar">
        <div className="flex flex-col gap-3 pb-4">
          
          <div className="flex justify-center mb-6 mt-2">
            <div className="bg-white border border-slate-200 text-slate-500 text-xs px-4 py-1.5 rounded-full font-medium shadow-sm">
              Hoje
            </div>
          </div>

          {loadingMessages ? (
            <div className="text-center py-4 text-sm text-slate-500">
              Carregando mensagens...
            </div>
          ) : messages?.length === 0 ? (
            <div className="text-center py-4 text-sm text-slate-500">
              Nenhuma mensagem nesta conversa.
            </div>
          ) : (
            messages?.map((msg: any) => {
              const date = msg.created_at ? new Date(msg.created_at) : new Date()
              const time = format(date, 'HH:mm')
              
              return (
                <MessageBubble 
                  key={msg.id}
                  content={msg.content || ''}
                  time={time}
                  isOwn={msg.sender_type === 'agent'}
                />
              )
            })
          )}
          
        </div>
      </ScrollArea>

      <ChatInput conversationId={activeConversation.id} />
    </div>
  )
}
