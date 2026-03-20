'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Search, Filter } from 'lucide-react'

import { useConversations } from '@/lib/hooks/use-conversations'
import { useRealtimeSync } from '@/lib/hooks/use-realtime'
import { useChatStore } from '@/lib/stores/chat-store'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function ConversationList() {
  useRealtimeSync()
  const { data: conversations, isLoading } = useConversations()
  const { activeConversationId, setActiveConversation } = useChatStore()

  return (
    <div className="w-full md:w-80 lg:w-96 flex flex-col h-full bg-white border-r border-slate-200 shadow-sm z-10">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Atendimentos</h2>
          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold shadow-sm">
            {conversations ? conversations.length : 0} Abertos
          </Badge>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar conversas..."
            className="pl-9 h-10 bg-slate-50 border-transparent hover:bg-white hover:border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-indigo-600 transition-all rounded-xl shadow-sm"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full bg-slate-100/50 p-1 rounded-xl">
            <TabsTrigger value="all" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Todos</TabsTrigger>
            <TabsTrigger value="active" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Meus</TabsTrigger>
            <TabsTrigger value="waiting" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-amber-600">Fila</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-2 space-y-1">
          {isLoading && (
            <div className="p-4 text-center text-sm text-slate-500">
              Carregando conversas...
            </div>
          )}
          {!isLoading && conversations?.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-500">
              Nenhuma conversa encontrada.
            </div>
          )}
          {conversations?.map((chat: any) => {
            const channelType = (chat.channels as any)?.type || 'whatsapp'
            
            // Format time
            let timeStr = ''
            if (chat.last_message_at) {
              const date = new Date(chat.last_message_at)
              // If today, show time. Otherwise, show date.
              if (new Date().toDateString() === date.toDateString()) {
                timeStr = format(date, 'HH:mm')
              } else {
                timeStr = format(date, 'dd/MM', { locale: ptBR })
              }
            }
            
            return (
              <div
                key={chat.id}
                onClick={() => setActiveConversation(chat.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group flex items-start gap-4 ${
                  activeConversationId === chat.id
                    ? 'bg-indigo-50 border border-indigo-100 shadow-sm'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-medium">
                      {chat.contact_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {channelType === 'whatsapp' && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold truncate ${activeConversationId === chat.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                      {chat.contact_name}
                    </h3>
                    <span className={`text-xs whitespace-nowrap ${activeConversationId === chat.id ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}>
                      {timeStr}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate ${chat.unread_count && chat.unread_count > 0 ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                      {chat.last_message || 'Sem mensagens'}
                    </p>
                    {chat.unread_count && chat.unread_count > 0 ? (
                      <Badge className="h-5 min-w-5 flex items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold shadow-sm shadow-indigo-600/30">
                        {chat.unread_count}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
