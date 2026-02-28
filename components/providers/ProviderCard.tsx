'use client'

import { useState } from 'react'
import { Provider, ProviderConfig, ModelInfo } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProvidersStore } from '@/store/providers-store'
import { ProviderStatusBadge } from './ProviderStatusBadge'
import { ApiKeyInput } from './ApiKeyInput'
import { BaseUrlInput } from './BaseUrlInput'
import { ModelFetcher } from './ModelFetcher'
import { ModelCheckboxList } from './ModelCheckboxList'
import { ProviderTestPanel } from './ProviderTestPanel'
import { encryptKey, decryptKey } from '@/lib/encryption'
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const config = useProvidersStore((state) => state.getProvider(provider.id))
  const saveProvider = useProvidersStore((state) => state.saveProvider)
  const resetProvider = useProvidersStore((state) => state.resetProvider)

  const [expanded, setExpanded] = useState(false)
  const [apiKey, setApiKey] = useState(() => {
    if (config?.apiKey) {
      return decryptKey(config.apiKey)
    }
    return ''
  })
  const [baseUrl, setBaseUrl] = useState(() => config?.baseUrl || provider.baseUrl)
  const [fetchedModels, setFetchedModels] = useState<ModelInfo[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>(() => config?.enabledModels || [])
  const [manualModelInput, setManualModelInput] = useState('')
  const [manualModels, setManualModels] = useState<string[]>([])

  const handleAddManualModel = () => {
    if (!manualModelInput.trim()) {
      toast.error('Please enter a model name')
      return
    }
    
    const modelId = manualModelInput.trim()
    if (selectedModels.includes(modelId) || manualModels.includes(modelId)) {
      toast.error('Model already added')
      return
    }

    setManualModels([...manualModels, modelId])
    setSelectedModels([...selectedModels, modelId])
    setManualModelInput('')
    toast.success(`Added model: ${modelId}`)
  }

  const handleRemoveManualModel = (modelId: string) => {
    setManualModels(manualModels.filter(m => m !== modelId))
    setSelectedModels(selectedModels.filter(m => m !== modelId))
  }

  const handleSave = () => {
    if (selectedModels.length === 0) {
      toast.error('Please select or add at least one model')
      return
    }

    const newConfig: ProviderConfig = {
      providerId: provider.id,
      apiKey: encryptKey(apiKey),
      baseUrl,
      enabledModels: selectedModels,
      isConnected: false,
      status: 'NOT_CONFIGURED',
    }
    saveProvider(newConfig)
    toast.success(`${provider.name} configuration saved`)
  }

  const handleReset = () => {
    resetProvider(provider.id)
    setApiKey('')
    setBaseUrl(provider.baseUrl)
    setFetchedModels([])
    setSelectedModels([])
    setManualModels([])
    toast.info(`${provider.name} configuration reset`)
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
              const modelIds = models.map((m) => m.id)
              setSelectedModels([...new Set([...selectedModels, ...modelIds])])
            }}
          />

          {fetchedModels.length > 0 && (
            <ModelCheckboxList
              models={fetchedModels}
              selectedModels={selectedModels}
              onSelectionChange={setSelectedModels}
            />
          )}

          {/* Manual Model Input */}
          <div className="space-y-2 border-t pt-4">
            <Label>Add Model Manually</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., gpt-4, claude-3-opus-20240229"
                value={manualModelInput}
                onChange={(e) => setManualModelInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddManualModel()
                  }
                }}
              />
              <Button onClick={handleAddManualModel} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {manualModels.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Manually added models:</p>
                {manualModels.map((modelId) => (
                  <div key={modelId} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="text-sm">{modelId}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveManualModel(modelId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

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

          {config && (
            <div className="text-xs text-muted-foreground">
              {config.enabledModels.length} model(s) configured
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
