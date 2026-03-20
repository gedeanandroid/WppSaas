import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { UazapiClient } from '@/lib/uazapi/client'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, text, mediaUrl, mediaType } = body

    if (!conversationId || (!text && !mediaUrl)) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
    }

    // Buscar a conversa para obter channel_id e contact_phone
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .select('channel_id, contact_phone')
      .eq('id', conversationId)
      .single()

    if (convError || !conv) throw new Error('Conversa não encontrada')

    // Buscar credenciais do canal
    const { data: channel, error: chanError } = await supabase
      .from('channels')
      .select('instance_url, instance_token, status')
      .eq('id', conv.channel_id)
      .single()

    if (chanError || !channel) throw new Error('Canal não encontrado')
    if (channel.status !== 'connected') throw new Error('Instância do WhatsApp desconectada')

    // Instanciar Uazapi e Enviar
    const client = new UazapiClient({
      instanceUrl: channel.instance_url!,
      token: channel.instance_token!,
    })

    const phone = conv.contact_phone + '@s.whatsapp.net'

    if (mediaUrl && mediaType) {
      await client.sendMedia({
        number: phone,
        mediaUrl,
        mediaType: mediaType as any,
        caption: text || undefined,
      })
    } else {
      await client.sendText({
        number: phone,
        text: text!,
      })
    }

    // Inserir mensagem no banco apenas se obteve sucesso da uazapi
    const { data: msg, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_type: 'agent',
        content: text || null,
        media_url: mediaUrl || null,
        media_type: mediaType || null,
        status: 'sent'
      })
      .select('id')
      .single()

    if (msgError) throw msgError

    // Atualizar last_message da conversa
    await supabase.from('conversations').update({
      last_message: text || `[${mediaType}] enviado`,
      last_message_at: new Date().toISOString()
    }).eq('id', conversationId)

    return NextResponse.json({ success: true, messageId: msg.id })
  } catch (error: any) {
    console.error('API /messages/send error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
