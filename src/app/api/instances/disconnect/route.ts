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
      .select('instance_url, instance_token')
      .eq('id', channelId)
      .single()

    if (error || !channel) throw new Error('Channel not found')

    const client = new UazapiClient({
      instanceUrl: channel.instance_url,
      token: channel.instance_token,
    })

    try {
      await client.disconnect()
    } catch (e: any) {
      console.warn('uazapi disconnect ignored:', e.message)
    }

    await supabase.from('channels').update({ 
      status: 'disconnected',
      phone_number: null,
      qr_code: null,
      updated_at: new Date().toISOString()
    }).eq('id', channelId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API /instances/disconnect error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
