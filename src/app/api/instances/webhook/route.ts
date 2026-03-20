import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { UazapiClient } from '@/lib/uazapi/client'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Consultar webhook atual
export async function GET(request: NextRequest) {
  try {
    const channelId = request.nextUrl.searchParams.get('channelId')
    if (!channelId) return NextResponse.json({ error: 'channelId required' }, { status: 400 })

    const { data: channel } = await supabase
      .from('channels')
      .select('instance_url, instance_token')
      .eq('id', channelId)
      .single()

    if (!channel) throw new Error('Channel not found')

    const client = new UazapiClient({
      instanceUrl: channel.instance_url,
      token: channel.instance_token,
    })

    const webhook = await client.getWebhook()
    return NextResponse.json(webhook)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Definir webhook manualmente
export async function POST(request: NextRequest) {
  try {
    const { channelId } = await request.json()
    if (!channelId) return NextResponse.json({ error: 'channelId required' }, { status: 400 })

    const { data: channel } = await supabase
      .from('channels')
      .select('instance_url, instance_token')
      .eq('id', channelId)
      .single()

    if (!channel) throw new Error('Channel not found')

    const client = new UazapiClient({
      instanceUrl: channel.instance_url,
      token: channel.instance_token,
    })

    // Determinar a URL base do webhook
    const baseUrl = request.nextUrl.origin
    const webhookUrl = `${baseUrl}/api/webhooks/whatsapp/${channelId}`

    console.log(`[WEBHOOK-SET] Setting webhook for ${channelId}: ${webhookUrl}`)
    
    await client.setWebhook(webhookUrl)

    // Verificar o que foi configurado
    let currentWebhook = null
    try {
      currentWebhook = await client.getWebhook()
    } catch {}

    return NextResponse.json({ 
      success: true, 
      webhookUrl, 
      currentConfig: currentWebhook 
    })
  } catch (error: any) {
    console.error('[WEBHOOK-SET] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
