'use client'

import { useState } from 'react'
import { useSettingsStore } from '@/store/settings-store'
import { useProvidersStore } from '@/store/providers-store'
import { providers } from '@/config/providers'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ChevronDown } from 'lucide-react'

export function ModelSelector() {
  const [search, setSearch] = useState('')
  const activeModel = useSettingsStore((state) => state.activeModel)
  const activeProviderId = useSettingsStore((state) => state.activeProviderId)
  const setActiveModel = useSettingsStore((state) => state.setActiveModel)
  const recentModels = useSettingsStore((state) => state.recentModels)
  const providerConfigs = useProvidersStore((state) => state.providers)

  const connectedProviders = Object.entries(providerConfigs)
    .filter(([, config]) => config.isConnected)
    .map(([id, config]) => ({
      ...providers.find((p) => p.id === id)!,
      enabledModels: config.enabledModels,
    }))

  const allModels = connectedProviders.flatMap((provider) =>
    provider.enabledModels.map((modelId) => ({
      providerId: provider.id,
      providerName: provider.name,
      providerColor: provider.color,
      modelId,
    }))
  )

  const filteredModels = allModels.filter((m) =>
    m.modelId.toLowerCase().includes(search.toLowerCase())
  )

  const recentModelsList = recentModels
    .map((rm) => allModels.find((m) => m.providerId === rm.providerId && m.modelId === rm.modelId))
    .filter(Boolean)

  const currentModel = allModels.find(
    (m) => m.providerId === activeProviderId && m.modelId === activeModel
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span>
            {currentModel ? `${currentModel.providerName} / ${currentModel.modelId}` : 'Select Model'}
          </span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96">
        <div className="p-2">
          <Input
            placeholder="Search models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {recentModelsList.length > 0 && !search && (
          <>
            <DropdownMenuLabel>Recent</DropdownMenuLabel>
            {recentModelsList.map((model) => (
              <DropdownMenuItem
                key={`${model!.providerId}-${model!.modelId}`}
                onClick={() => setActiveModel(model!.providerId, model!.modelId)}
              >
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: model!.providerColor }}
                />
                {model!.providerName} / {model!.modelId}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        {connectedProviders.map((provider) => {
          const providerModels = filteredModels.filter((m) => m.providerId === provider.id)
          if (providerModels.length === 0) return null

          return (
            <div key={provider.id}>
              <DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: provider.color }}
                  />
                  {provider.name}
                </div>
              </DropdownMenuLabel>
              {providerModels.map((model) => (
                <DropdownMenuItem
                  key={`${model.providerId}-${model.modelId}`}
                  onClick={() => setActiveModel(model.providerId, model.modelId)}
                >
                  {model.modelId}
                </DropdownMenuItem>
              ))}
            </div>
          )
        })}

        {filteredModels.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No models found
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
