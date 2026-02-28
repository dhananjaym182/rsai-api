'use client'

import { useState } from 'react'
import { Provider, ProviderConfig, ModelInfo } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useProvidersStore } from '@/store/providers-store'
import { ProviderStatusBadge } from './ProviderStatusBadge'
import { ApiKeyInput } from './ApiKeyInput'
import { BaseUrlInput } from './BaseUrlInput'
import { ModelFetcher } from './ModelFetcher'
import { ModelCheckboxList } from './ModelCheckboxList'
import { ProviderTestPanel } from './ProviderTestPanel'
import { encryptKey } from '@/lib/encryption'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState(provider.baseUrl)
  const [fetchedModels, setFetchedModels] = useState<ModelInfo[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])

  const config = useProvidersStore((state) => state.getProvider(provider.id))
  const saveProvider = useProvidersStore((state) => state.saveProvider)
  const resetProvider = useProvidersStore((state) => state.resetProvider)

  const handleSave = () => {
    const newConfig: ProviderConfig = {
      providerId: provider.id,
      apiKey: encryptKey(apiKey),
      baseUrl,
      enabledModels: selectedModels,
      isConnected: false,
      status: 'NOT_CONFIGURED',
    }
    saveProvider(newConfig)
  }

  const handleReset = () => {
    resetProvider(provider.id)
    setApiKey('')
    setBaseUrl(provider.baseUrl)
    setFetchedModels([])
    setSelectedModels([])
  }

  return (
    <Card>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: provider.color }}
            />
            <CardTitle>{provider.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <ProviderStatusBadge status={config?.status || 'NOT_CONFIGURED'} />
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          {provider.requiresKey && (
            <ApiKeyInput
              value={apiKey}
              onChange={setApiKey}
              placeholder={provider.keyPlaceholder}
            />
          )}

          <BaseUrlInput
            value={baseUrl}
            onChange={setBaseUrl}
            defaultValue={provider.baseUrl}
          />

          <ModelFetcher
            baseUrl={baseUrl}
            apiKey={apiKey}
            requiresKey={provider.requiresKey}
            onModelsFetched={(models) => {
              setFetchedModels(models)
              setSelectedModels(models.map((m) => m.id))
            }}
          />

          {fetchedModels.length > 0 && (
            <ModelCheckboxList
              models={fetchedModels}
              selectedModels={selectedModels}
              onSelectionChange={setSelectedModels}
            />
          )}

          {selectedModels.length > 0 && (
            <ProviderTestPanel
              config={{
                providerId: provider.id,
                apiKey: encryptKey(apiKey),
                baseUrl,
                enabledModels: selectedModels,
                isConnected: false,
                status: 'NOT_CONFIGURED',
              }}
            />
          )}

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={selectedModels.length === 0}>
              Save Configuration
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
