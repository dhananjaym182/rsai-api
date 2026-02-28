'use client'

import { useState } from 'react'
import { ProviderConfig } from '@/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { testConnection } from '@/lib/api-test'
import { useProvidersStore } from '@/store/providers-store'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

interface ProviderTestPanelProps {
  config: ProviderConfig
}

export function ProviderTestPanel({ config }: ProviderTestPanelProps) {
  const [testing, setTesting] = useState(false)
  const updateTestResult = useProvidersStore((state) => state.updateTestResult)
  const savedConfig = useProvidersStore((state) => state.getProvider(config.providerId))

  const handleTest = async () => {
    setTesting(true)
    try {
      const result = await testConnection(config)
      updateTestResult(config.providerId, {
        latency: result.latencyMs,
        response: result.responseText,
        error: result.error || null,
      })

      if (result.success) {
        toast.success(`Connected • ${result.latencyMs}ms`)
      } else {
        toast.error(result.error || 'Connection failed')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Test failed')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button onClick={handleTest} disabled={testing} className="w-full">
        {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {testing ? 'Testing Connection...' : 'Test Connection'}
      </Button>

      {savedConfig?.lastTestedAt && (
        <Card className="p-4 space-y-2">
          {savedConfig.isConnected ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={20} />
              <span className="font-medium">
                Connected • {savedConfig.lastTestLatency}ms
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle size={20} />
              <span className="font-medium">Error</span>
            </div>
          )}

          {savedConfig.lastTestResponse && (
            <div className="text-sm bg-muted p-2 rounded">
              {savedConfig.lastTestResponse}
            </div>
          )}

          {savedConfig.error && (
            <div className="text-sm text-red-600">{savedConfig.error}</div>
          )}

          <p className="text-xs text-muted-foreground">
            Last tested: {new Date(savedConfig.lastTestedAt).toLocaleString()}
          </p>
        </Card>
      )}
    </div>
  )
}
