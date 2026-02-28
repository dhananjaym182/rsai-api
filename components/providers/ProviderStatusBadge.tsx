'use client'

import { ProviderStatus } from '@/types'
import { Badge } from '@/components/ui/badge'

interface ProviderStatusBadgeProps {
  status: ProviderStatus
}

export function ProviderStatusBadge({ status }: ProviderStatusBadgeProps) {
  const variants: Record<ProviderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    NOT_CONFIGURED: { label: 'Not Configured', variant: 'secondary' },
    TESTING: { label: 'Testing...', variant: 'outline' },
    CONNECTED: { label: 'Connected', variant: 'default' },
    ERROR: { label: 'Error', variant: 'destructive' },
  }

  const { label, variant } = variants[status]

  return <Badge variant={variant}>{label}</Badge>
}
