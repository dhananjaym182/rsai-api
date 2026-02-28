import { ChatMessage, ChatParams, ProviderConfig } from '@/types'
import { decryptKey } from './encryption'

export async function* streamChat(
  config: ProviderConfig,
  messages: ChatMessage[],
  params: ChatParams,
  signal: AbortSignal
): AsyncGenerator<string> {
  const url = `${config.baseUrl}/v1/chat/completions`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const apiKey = decryptKey(config.apiKey)
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }

  const body = {
    model: config.enabledModels[0],
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    temperature: params.temperature,
    max_tokens: params.maxTokens,
    top_p: params.topP,
    stream: true,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }

  if (!response.body) {
    throw new Error('No response body')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue

        if (trimmed.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmed.slice(6))
            const content = json.choices?.[0]?.delta?.content
            if (content) {
              yield content
            }
          } catch {
            continue
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
