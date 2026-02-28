import { DetectedProvider } from '@/types'
import { fetchModels } from './api-models'

const LOCAL_PROVIDERS = [
  { id: 'ollama', baseUrl: 'http://localhost:11434/v1' },
  { id: 'lmstudio', baseUrl: 'http://localhost:1234/v1' },
]

export async function autoDetectLocalProviders(): Promise<DetectedProvider[]> {
  const detected: DetectedProvider[] = []

  await Promise.all(
    LOCAL_PROVIDERS.map(async (provider) => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000)

        const models = await fetchModels(provider.baseUrl)
        clearTimeout(timeoutId)

        if (models.length > 0) {
          detected.push({
            providerId: provider.id,
            baseUrl: provider.baseUrl,
            models,
          })
        }
      } catch {
        return
      }
    })
  )

  return detected
}
