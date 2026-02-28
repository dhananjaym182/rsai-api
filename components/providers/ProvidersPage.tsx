'use client'

import { useState } from 'react'
import { providers } from '@/config/providers'
import { ProviderCard } from './ProviderCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useProvidersStore } from '@/store/providers-store'
import { autoDetectLocalProviders } from '@/lib/auto-detect'
import { toast } from 'sonner'
import { Search, Zap, CheckCircle2, ShieldCheck, Lock } from 'lucide-react'

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
          <p className="text-sm text-muted-foreground">
            Configure your API keys and connect to AI providers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-2 bg-secondary">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            {connectedCount}/{providers.length} Connected
          </Badge>
          <Button onClick={handleAutoDetect} disabled={detecting} variant="outline">
            <Zap className="mr-2 h-4 w-4" />
            {detecting ? 'Detecting...' : 'Auto-detect Local'}
          </Button>
        </div>
      </div>

      <Alert className="border-primary/20 bg-primary/5">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm leading-relaxed">
          <div className="flex items-start gap-2">
            <Lock className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
            <div>
              <strong className="font-semibold">Privacy & Security:</strong> All API keys and credentials are encrypted and stored locally on your machine using AES encryption. Your data never leaves your device and is not shared with any third-party services. We do not have access to your API keys or conversation history.
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search providers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-secondary border-border"
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
