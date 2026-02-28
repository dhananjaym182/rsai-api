'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

interface BaseUrlInputProps {
  value: string
  onChange: (value: string) => void
  defaultValue: string
}

export function BaseUrlInput({ value, onChange, defaultValue }: BaseUrlInputProps) {
  return (
    <div className="space-y-2">
      <Label>Base URL</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://api.example.com"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onChange(defaultValue)}
          title="Reset to default"
        >
          <RotateCcw size={16} />
        </Button>
      </div>
    </div>
  )
}
