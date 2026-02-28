'use client'

import { useSettingsStore } from '@/store/settings-store'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ParametersPanel() {
  const params = useSettingsStore((state) => state.params)
  const updateParams = useSettingsStore((state) => state.updateParams)

  return (
    <div className="w-80 border-l p-4 space-y-4 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle>Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Temperature: {params.temperature}</Label>
            <Slider
              value={[params.temperature]}
              onValueChange={([value]) => updateParams({ temperature: value })}
              min={0}
              max={2}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <Label>Max Tokens</Label>
            <Input
              type="number"
              value={params.maxTokens}
              onChange={(e) => updateParams({ maxTokens: parseInt(e.target.value) })}
              min={1}
              max={100000}
            />
          </div>

          <div className="space-y-2">
            <Label>Top P: {params.topP}</Label>
            <Slider
              value={[params.topP]}
              onValueChange={([value]) => updateParams({ topP: value })}
              min={0}
              max={1}
              step={0.05}
            />
          </div>

          <div className="space-y-2">
            <Label>Reasoning Effort</Label>
            <Select
              value={params.reasoningEffort}
              onValueChange={(value: 'low' | 'medium' | 'high') =>
                updateParams({ reasoningEffort: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>System Prompt</Label>
            <Textarea
              value={params.systemPrompt}
              onChange={(e) => updateParams({ systemPrompt: e.target.value })}
              placeholder="Optional system prompt..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
