import { TestResult, ProviderConfig } from '@/types'
import { decryptKey } from './encryption'

export async function testConnection(config: ProviderConfig): Promise<TestResult> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  const startTime = performance.now()

  try {
    const url = `${config.baseUrl}/v1/chat/completions`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const apiKey = decryptKey(config.apiKey)
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: config.enabledModels[0] || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Say: Connection successful' }],
        max_tokens: 10,
        stream: false,
      }),
    })

    clearTimeout(timeoutId)
    const latencyMs = Math.round(performance.now() - startTime)

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
        latencyMs,
      }
    }

    const data = await response.json()
    const responseText = data.choices?.[0]?.message?.content || 'No response'

    return {
      success: true,
      responseText,
      latencyMs,
    }
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request timeout (10s)' }
      }
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Unknown error' }
  }
}
