import { redirect } from 'next/navigation'

export default function WorkspaceIndex() {
  // Por padrão redireciona para a página de chat/atendimentos
  redirect('/chat')
}
