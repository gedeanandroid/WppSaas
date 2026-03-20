'use client'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'

export function useRealtimeSync() {
  const supabase = createClient()
  const { organizationId, user } = useAuthStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!organizationId || !user) return

    const channel = supabase
      .channel(`sync-${organizationId}`)
      // Escutar novas mensagens
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload: any) => {
          const newMsg = payload.new as any
          if (newMsg && newMsg.conversation_id) {
            queryClient.invalidateQueries({ queryKey: ['messages', newMsg.conversation_id] })
          }
        }
      )
      // Escutar mudanças nas conversas da organização atual
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `organization_id=eq.${organizationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations', organizationId] })
        }
      )
      // Presence (track online users)
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState()
        // Here we could store online user IDs in Zustand if needed
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          // Track current user as online
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, organizationId, user, queryClient])
}
