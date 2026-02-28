'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

interface ApiKeyInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export function ApiKeyInput({ value, onChange, placeholder }: ApiKeyInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div className="space-y-2">
      <Label>API Key</Label>
      <div className="flex gap-2">
        <Input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </Button>
      </div>
    </div>
  )
}
