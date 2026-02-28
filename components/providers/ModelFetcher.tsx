'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ModelInfo } from '@/types'
import { fetchModels } from '@/lib/api-models'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ModelFetcherProps {
  baseUrl: string
  apiKey: string
  requiresKey: boolean
  onModelsFetched: (models: ModelInfo[]) => void
}

export function ModelFetcher({
  baseUrl,
  apiKey,
  requiresKey,
  onModelsFetched,
}: ModelFetcherProps) {
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    if (requiresKey && !apiKey) {
      toast.error('API key is required')
      return
    }

    if (!baseUrl) {
      toast.error('Base URL is required')
      return
    }

    setLoading(true)
    try {
      const models = await fetchModels(baseUrl, apiKey)
      onModelsFetched(models)
      toast.success(`Found ${models.length} models`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch models')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleFetch} disabled={loading} className="w-full">
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? 'Fetching Models...' : 'Fetch Models'}
    </Button>
  )
}
