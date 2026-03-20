import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'

export function useMessages(conversationId: string | null) {
  const supabase = createClient()
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId || !user) return []
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      
      return data
    },
    enabled: !!conversationId && !!user,
  })
}

export function useSendMessage() {
  const supabase = createClient()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
      mediaUrl = null,
      mediaType = null
    }: {
      conversationId: string
      content?: string
      mediaUrl?: string | null
      mediaType?: string | null
    }) => {
      if (!user) throw new Error('User not authenticated')

      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          text: content,
          mediaUrl,
          mediaType
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar mensagem')

      return data
    },
    onSuccess: (data, variables) => {
      // Invalidate both messages for this conversation and the conversation list
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }
  })
}
