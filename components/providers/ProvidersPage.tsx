'use client'

import { useState } from 'react'
import { providers } from '@/config/providers'
import { ProviderCard } from './ProviderCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProvidersStore } from '@/store/providers-store'
import { autoDetectLocalProviders } from '@/lib/auto-detect'
import { toast } from 'sonner'
import { Search, Zap, CheckCircle2 } from 'lucide-react'

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">AI Providers</h1>
          <p className="text-muted-foreground">
            Configure your API keys and connect to AI providers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-2">
            <CheckCircle2 className="h-3 w-3" />
            {connectedCount}/{providers.length} Connected
          </Badge>
          <Button onClick={handleAutoDetect} disabled={detecting} variant="outline">
            <Zap className="mr-2 h-4 w-4" />
            {detecting ? 'Detecting...' : 'Auto-detect Local'}
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search providers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProviders.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  )
}
