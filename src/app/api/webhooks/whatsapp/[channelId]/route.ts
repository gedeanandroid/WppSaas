import { NextRequest, NextResponse } from 'next/server'
import { handleWebhook } from '@/lib/uazapi/webhook-handler'
import type { UazapiWebhookPayload } from '@/lib/uazapi/types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params
    const payload: UazapiWebhookPayload = await request.json()

    // Processar em background (não bloqueia a resposta)
    handleWebhook(channelId, payload).catch(console.error)

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
