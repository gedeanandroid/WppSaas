import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { UazapiClient } from '@/lib/uazapi/client'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { channelId } = await request.json()
    if (!channelId) return NextResponse.json({ error: 'channelId required' }, { status: 400 })

    const { data: channel, error } = await supabase
      .from('channels')
      .select('instance_url, instance_token, organization_id')
      .eq('id', channelId)
      .single()

    if (error || !channel) throw new Error('Channel not found')

    const client = new UazapiClient({
      instanceUrl: channel.instance_url,
      token: channel.instance_token,
    })

    const data = await client.connect()
    console.log('[DEBUG] Uazapi Connect Response:', JSON.stringify(data, null, 2))

    // Configurar webhook automaticamente ao tentar conectar (pra garantir)
    const baseUrl = request.nextUrl.origin
    const webhookUrl = `${baseUrl}/api/webhooks/whatsapp/${channelId}`
    await client.setWebhook(webhookUrl).catch(console.error)

    // Salvar QR Code base 64 temporário no banco
    const qrCodeBase64 = data.instance?.qrcode || null
    await supabase.from('channels').update({ 
      qr_code: qrCodeBase64,
      status: 'connecting',
      updated_at: new Date().toISOString()
    }).eq('id', channelId)

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('API /instances/connect error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
