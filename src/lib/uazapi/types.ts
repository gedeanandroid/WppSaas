export interface UazapiInstance {
  instanceUrl: string
  token: string
}

export interface UazapiQrCodeResponse {
  connected: boolean
  instance?: {
    qrcode: string
    paircode?: string
    status?: string
  }
}

export interface UazapiStatusResponse {
  instance?: {
    status: 'disconnected' | 'connecting' | 'connected'
    name?: string
    owner?: string
  }
  status?: {
    connected: boolean
    jid?: string
    loggedIn?: boolean
  }
}

export interface UazapiWebhookPayload {
  event: string
  instance: string
  data: {
    key: {
      remoteJid: string
      fromMe: boolean
      id: string
    }
    message?: {
      conversation?: string
      imageMessage?: { url?: string; caption?: string }
      videoMessage?: { url?: string; caption?: string }
      audioMessage?: { url?: string }
      documentMessage?: { url?: string; fileName?: string }
    }
    messageTimestamp?: number
    pushName?: string
    status?: string
  }
}

export interface UazapiSendTextPayload {
  number: string
  text: string
}

export interface UazapiSendMediaPayload {
  number: string
  mediaUrl: string
  caption?: string
  mediaType: 'image' | 'video' | 'audio' | 'document'
}
