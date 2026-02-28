'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Lock } from 'lucide-react'

interface ApiKeyInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  isConfigured?: boolean
}

export function ApiKeyInput({ value, onChange, placeholder, isConfigured }: ApiKeyInputProps) {
  const maskKey = (key: string) => {
    if (!key) return ''
    if (key.length <= 8) return '•'.repeat(key.length)
    return key.slice(0, 4) + '•'.repeat(key.length - 8) + key.slice(-4)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>API Key</Label>
        {isConfigured && (
          <Badge variant="secondary" className="text-xs gap-1">
            <Lock className="h-3 w-3" />
            Encrypted
          </Badge>
        )}
      </div>
      <Input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isConfigured ? maskKey(placeholder) : placeholder}
        className="flex-1 font-mono"
      />
      {isConfigured && (
        <p className="text-xs text-muted-foreground">
          Key is encrypted. Enter a new key to update.
        </p>
      )}
    </div>
  )
}
