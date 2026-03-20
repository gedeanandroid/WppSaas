import { NextRequest, NextResponse } from 'next/server'
import { handleWebhook } from '@/lib/uazapi/webhook-handler'
import type { UazapiWebhookPayload } from '@/lib/uazapi/types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params
    const body = await request.text()
    
    console.log(`[WEBHOOK] Received for channel ${channelId}:`, body.substring(0, 500))
    
    let payload: UazapiWebhookPayload
    try {
      payload = JSON.parse(body)
    } catch {
      console.error('[WEBHOOK] Invalid JSON body')
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    // Processar em background (não bloqueia a resposta)
    handleWebhook(channelId, payload).catch(err => {
      console.error('[WEBHOOK] Handler error:', err)
    })

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('[WEBHOOK] Route error:', error)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
