'use client'

import { useState } from 'react'
import { ModelInfo } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ModelCheckboxItem } from './ModelCheckboxItem'

interface ModelCheckboxListProps {
  models: ModelInfo[]
  selectedModels: string[]
  onSelectionChange: (selected: string[]) => void
}

export function ModelCheckboxList({
  models,
  selectedModels,
  onSelectionChange,
}: ModelCheckboxListProps) {
  const [search, setSearch] = useState('')

  const filteredModels = models.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelectAll = () => {
    onSelectionChange(filteredModels.map((m) => m.id))
  }

  const handleDeselectAll = () => {
    onSelectionChange([])
  }

  const handleToggle = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onSelectionChange(selectedModels.filter((id) => id !== modelId))
    } else {
      onSelectionChange([...selectedModels, modelId])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Search models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" size="sm" onClick={handleSelectAll}>
          Select All
        </Button>
        <Button variant="outline" size="sm" onClick={handleDeselectAll}>
          Deselect All
        </Button>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2 border rounded-md p-3">
        {filteredModels.map((model) => (
          <ModelCheckboxItem
            key={model.id}
            model={model}
            checked={selectedModels.includes(model.id)}
            onToggle={() => handleToggle(model.id)}
          />
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {selectedModels.length} of {models.length} models selected
      </p>
    </div>
  )
}
