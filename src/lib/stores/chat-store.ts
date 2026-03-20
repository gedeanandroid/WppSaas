import { create } from 'zustand'

interface ChatState {
  activeConversationId: string | null
  isMobileSidebarOpen: boolean
  setActiveConversation: (id: string | null) => void
  setMobileSidebarOpen: (isOpen: boolean) => void
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversationId: null,
  isMobileSidebarOpen: false,
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setMobileSidebarOpen: (isOpen) => set({ isMobileSidebarOpen: isOpen }),
}))
