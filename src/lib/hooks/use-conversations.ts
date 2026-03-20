import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'

export function useConversations() {
  const supabase = createClient()
  const { organizationId, user } = useAuthStore()

  return useQuery({
    queryKey: ['conversations', organizationId],
    queryFn: async () => {
      if (!organizationId || !user) return []
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          channels (
            type
          )
        `)
        .eq('organization_id', organizationId)
        .order('last_message_at', { ascending: false })
      
      if (error) throw error
      
      return data
    },
    enabled: !!organizationId && !!user,
  })
}
