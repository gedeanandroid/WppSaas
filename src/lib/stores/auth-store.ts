import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { createClient } from '../supabase/client'

interface AuthState {
  user: User | null
  organizationId: string | null
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setOrganizationId: (id: string | null) => void
  signIn: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organizationId: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setOrganizationId: (id) => set({ organizationId: id }),
  signIn: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
           throw new Error("E-mail ou senha incorretos.");
        }
        throw error;
      }

      set({ user: data.user, isLoading: false })
      return true
    } catch (err: any) {
      console.error('Error signing in:', err.message)
      set({ error: err.message || 'Erro ao realizar login', isLoading: false })
      return false
    }
  },
  logout: async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (error: any) {
      console.error('Error logging out:', error.message)
    } finally {
      set({ user: null, organizationId: null })
    }
  },
}))
