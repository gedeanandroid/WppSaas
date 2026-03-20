import { createClient } from '@supabase/supabase-js'
import type { UazapiWebhookPayload } from './types'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function extractPhoneNumber(jid: string): string {
  return jid.replace('@s.whatsapp.net', '').replace('@g.us', '')
}

function extractMessageContent(data: UazapiWebhookPayload['data']): {
  content: string | null
  mediaUrl: string | null
  mediaType: string | null
} {
  // Uazapi V2 format
  if (data.text) {
    return { content: data.text, mediaUrl: null, mediaType: null }
  }

  // Fallback to V1 / Baileys format
  const msg = data.message
  if (!msg) return { content: null, mediaUrl: null, mediaType: null }

  if (msg.conversation) {
    return { content: msg.conversation, mediaUrl: null, mediaType: null }
  }
  if (msg.imageMessage) {
    return { content: msg.imageMessage.caption || null, mediaUrl: msg.imageMessage.url || null, mediaType: 'image' }
  }
  if (msg.videoMessage) {
    return { content: msg.videoMessage.caption || null, mediaUrl: msg.videoMessage.url || null, mediaType: 'video' }
  }
  if (msg.audioMessage) {
    return { content: null, mediaUrl: msg.audioMessage.url || null, mediaType: 'audio' }
  }
  if (msg.documentMessage) {
    return { content: msg.documentMessage.fileName || null, mediaUrl: msg.documentMessage.url || null, mediaType: 'document' }
  }

  return { content: null, mediaUrl: null, mediaType: null }
}

export async function handleWebhook(channelId: string, payload: UazapiWebhookPayload) {
  if (payload.event !== 'messages' && payload.event !== 'messages.upsert') {
    console.log(`[WEBHOOK] Ignorando evento não suportado: ${payload.event}`)
    return
  }

  // Buscar canal para obter organization_id
  const { data: channel, error: channelError } = await supabaseAdmin
    .from('channels')
    .select('id, organization_id')
    .eq('id', channelId)
    .single()

  if (channelError || !channel) {
    console.error('Channel not found:', channelId)
    return
  }

  const senderId = payload.data.sender || payload.data.key?.remoteJid
  if (!senderId) {
    console.log('[WEBHOOK] Sem remetente no payload', JSON.stringify(payload.data))
    return
  }

  const phone = extractPhoneNumber(senderId)
  const isFromMe = payload.data.fromMe ?? (payload.data.key?.fromMe || false)
  const { content, mediaUrl, mediaType } = extractMessageContent(payload.data)

  if (!content && !mediaUrl) return // mensagem vazia

  // Buscar ou criar conversa
  let { data: conversation } = await supabaseAdmin
    .from('conversations')
    .select('id')
    .eq('channel_id', channelId)
    .eq('contact_phone', phone)
    .eq('status', 'open')
    .single()

  if (!conversation) {
    const { data: newConv } = await supabaseAdmin
      .from('conversations')
      .insert({
        organization_id: channel.organization_id,
        channel_id: channelId,
        contact_name: payload.data.pushName || phone,
        contact_phone: phone,
        status: 'open',
        last_message: content || `[${mediaType}]`,
        last_message_at: new Date().toISOString(),
      })
      .select('id')
      .single()
    conversation = newConv
  }

  if (!conversation) return

  // Inserir mensagem
  await supabaseAdmin.from('messages').insert({
    conversation_id: conversation.id,
    sender_type: isFromMe ? 'agent' : 'customer',
    content,
    media_url: mediaUrl,
    media_type: mediaType,
    status: 'sent',
  })

  // Atualizar conversa
  await supabaseAdmin
    .from('conversations')
    .update({
      last_message: content || `[${mediaType}]`,
      last_message_at: new Date().toISOString(),
      ...(isFromMe ? {} : { unread_count: (conversation as any).unread_count ? (conversation as any).unread_count + 1 : 1 }),
    })
    .eq('id', conversation.id)
}
