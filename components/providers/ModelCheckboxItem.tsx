'use client'

import { ModelInfo } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface ModelCheckboxItemProps {
  model: ModelInfo
  checked: boolean
  onToggle: () => void
}

export function ModelCheckboxItem({ model, checked, onToggle }: ModelCheckboxItemProps) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-accent rounded-md">
      <Checkbox checked={checked} onCheckedChange={onToggle} id={model.id} />
      <Label htmlFor={model.id} className="flex-1 cursor-pointer">
        <div className="flex items-center justify-between">
          <span className="font-medium">{model.name}</span>
          <div className="flex gap-2">
            {model.contextWindow && (
              <Badge variant="outline">{(model.contextWindow / 1000).toFixed(0)}k</Badge>
            )}
            {model.pricing && (
              <Badge variant="secondary">
                ${model.pricing.input.toFixed(2)}/1M
              </Badge>
            )}
          </div>
        </div>
      </Label>
    </div>
  )
}
