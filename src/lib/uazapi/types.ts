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
    sender: string
    text?: string
    fromMe?: boolean
    isGroup?: boolean
    pushName?: string
    messageTimestamp?: number
    
    // Fallback/Legacy fields in case of hybrid payloads
    key?: {
      remoteJid: string
      fromMe: boolean
      id: string
    }
    message?: any
  }
}

export interface UazapiSendTextPayload {
  number: string
  text: string
  linkPreview?: boolean
}

export interface UazapiSendMediaPayload {
  number: string
  mediaUrl: string
  caption?: string
  mediaType: 'image' | 'video' | 'audio' | 'document'
}
