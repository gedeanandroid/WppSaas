import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { UazapiClient } from '@/lib/uazapi/client'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const channelId = searchParams.get('channelId')
    
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

    const statusObj = await client.getStatus()

    const isConnected = statusObj?.instance?.status === 'connected' || statusObj?.status?.connected === true

    if (isConnected) {
      const phone = statusObj.instance?.owner || statusObj.status?.jid?.split(':')[0].split('@')[0] || ''
      await supabase.from('channels').update({ 
        status: 'connected',
        phone_number: phone,
        updated_at: new Date().toISOString()
      }).eq('id', channelId)
    }

    return NextResponse.json(statusObj)
  } catch (error: any) {
    console.error('API /instances/status error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
