import type {
  UazapiInstance,
  UazapiQrCodeResponse,
  UazapiStatusResponse,
  UazapiSendTextPayload,
  UazapiSendMediaPayload,
} from './types'

export class UazapiClient {
  private baseUrl: string
  private token: string

  constructor(instance: UazapiInstance) {
    this.baseUrl = instance.instanceUrl.replace(/\/$/, '')
    this.token = instance.token
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'token': this.token,
        ...options?.headers,
      },
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`uazapi error ${res.status}: ${body}`)
    }
    return res.json()
  }

  async getStatus(): Promise<UazapiStatusResponse> {
    return this.request<UazapiStatusResponse>('/instance/status')
  }

  async connect(): Promise<UazapiQrCodeResponse> {
    return this.request<UazapiQrCodeResponse>('/instance/connect', { method: 'POST' })
  }

  async disconnect(): Promise<void> {
    await this.request<void>('/instance/disconnect', { method: 'POST' })
  }

  async sendText(payload: UazapiSendTextPayload): Promise<any> {
    return this.request<any>('/send/text', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async sendMedia(payload: UazapiSendMediaPayload): Promise<any> {
    return this.request<any>('/send/media', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async setWebhook(url: string): Promise<any> {
    return this.request<any>('/webhook', {
      method: 'POST',
      body: JSON.stringify({
        enabled: true,
        url,
        events: ['messages', 'connection'],
        excludeMessages: ['wasSentByApi'],
      }),
    })
  }

  async getWebhook(): Promise<any> {
    return this.request<any>('/webhook')
  }
}
