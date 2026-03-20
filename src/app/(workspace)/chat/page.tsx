import { ConversationList } from '@/components/chat/ConversationList'
import { ChatArea } from '@/components/chat/ChatArea'

export default function ChatWorkspacePage() {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <ConversationList />
      <ChatArea />
    </div>
  )
}
