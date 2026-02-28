import { ModelInfo } from '@/types'

export async function fetchModels(
  baseUrl: string,
  apiKey?: string
): Promise<ModelInfo[]> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const url = `${baseUrl}/v1/models`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }

    const response = await fetch(url, {
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format')
    }

    return data.data.map((model: unknown) => {
      const m = model as Record<string, unknown>
      return {
        id: String(m.id || ''),
        name: String(m.id || m.name || ''),
        contextWindow: typeof m.context_length === 'number' ? m.context_length : undefined,
        pricing:
          m.pricing &&
          typeof m.pricing === 'object' &&
          'input' in m.pricing &&
          'output' in m.pricing
            ? {
                input: Number(m.pricing.input),
                output: Number(m.pricing.output),
              }
            : undefined,
      }
    })
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout (5s)')
      }
      throw error
    }
    throw new Error('Failed to fetch models')
  }
}
