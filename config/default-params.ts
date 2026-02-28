import { ChatParams } from '@/types'

export const defaultParams: ChatParams = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1.0,
  systemPrompt: '',
  reasoningEffort: 'medium',
}
