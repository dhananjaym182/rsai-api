'use client'

import { useState } from 'react'
import { providers } from '@/config/providers'
import { ProviderCard } from './ProviderCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useProvidersStore } from '@/store/providers-store'
import { autoDetectLocalProviders } from '@/lib/auto-detect'
import { toast } from 'sonner'

export function ProvidersPage() {
  const [search, setSearch] = useState('')
  const [detecting, setDetecting] = useState(false)
  const providerConfigs = useProvidersStore((state) => state.providers)

  const filteredProviders = providers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const connectedCount = Object.values(providerConfigs).filter(
    (c) => c.isConnected
  ).length

  const handleAutoDetect = async () => {
    setDetecting(true)
    try {
      const detected = await autoDetectLocalProviders()
      if (detected.length === 0) {
        toast.info('No local providers detected')
      } else {
        detected.forEach((d) => {
          toast.success(`${d.providerId} detected — ${d.models.length} models available`)
        })
      }
    } catch {
      toast.error('Auto-detect failed')
    } finally {
      setDetecting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Providers</h1>
          <p className="text-muted-foreground mt-1">
            Connected: {connectedCount}/{providers.length}
          </p>
        </div>
        <Button onClick={handleAutoDetect} disabled={detecting}>
          {detecting ? 'Detecting...' : 'Auto-detect Local'}
        </Button>
      </div>

      <Input
        placeholder="Search providers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProviders.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  )
}
