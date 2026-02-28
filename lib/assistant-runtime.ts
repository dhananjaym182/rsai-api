import type { ChatModelAdapter } from '@assistant-ui/react'
import { ProviderConfig, ChatParams } from '@/types'
import { decryptKey } from './encryption'

interface CreateAdapterOptions {
  config: ProviderConfig
  params: ChatParams
  onMessageComplete?: (content: string, messageId: string) => void
}

export function createChatModelAdapter({ 
  config, 
  params,
  onMessageComplete 
}: CreateAdapterOptions): ChatModelAdapter {
  return {
    async *run({ messages, abortSignal }) {
      const url = `${config.baseUrl}/v1/chat/completions`
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      const apiKey = decryptKey(config.apiKey)
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`
      }

      // Convert assistant-ui messages to API format
      const apiMessages = messages.map((m) => ({
        role: m.role,
        content: m.content
          .filter((c) => c.type === 'text')
          .map((c) => c.text)
          .join('\n'),
      }))

      const body = {
        model: config.enabledModels[0],
        messages: apiMessages,
        temperature: params.temperature,
        max_tokens: params.maxTokens,
        top_p: params.topP,
        stream: true,
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: abortSignal,
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
      let accumulatedText = ''
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

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
                  accumulatedText += content
                  yield {
                    content: [{ type: 'text', text: accumulatedText }],
                  }
                }
              } catch {
                continue
              }
            }
          }
        }

        // Call onMessageComplete when streaming is done
        if (onMessageComplete && accumulatedText) {
          onMessageComplete(accumulatedText, messageId)
        }
      } finally {
        reader.releaseLock()
      }
    },
  }
}
