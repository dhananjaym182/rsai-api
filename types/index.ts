export interface Provider {
  id: string
  name: string
  color: string
  icon: string
  baseUrl: string
  docsUrl: string
  requiresKey: boolean
  keyPlaceholder: string
  defaultModel: string
  modelEndpoint: string
  supportsStreaming: boolean
  autoDetect?: boolean
}

export interface ModelInfo {
  id: string
  name: string
  contextWindow?: number
  pricing?: {
    input: number
    output: number
  }
}

export interface SavedModel {
  providerId: string
  modelId: string
  name: string
  contextWindow?: number
  pricing?: {
    input: number
    output: number
  }
}

export type ProviderStatus = 'NOT_CONFIGURED' | 'TESTING' | 'CONNECTED' | 'ERROR'

export interface ProviderConfig {
  providerId: string
  apiKey: string
  baseUrl: string
  enabledModels: string[]
  isConnected: boolean
  lastTestedAt?: string
  lastTestLatency?: number
  lastTestResponse?: string
  error?: string | null
  status: ProviderStatus
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  model?: string
  providerId?: string
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
  model?: string
  providerId?: string
}

export interface StreamChunk {
  content: string
  done: boolean
}

export interface TestResult {
  success: boolean
  responseText?: string
  latencyMs?: number
  error?: string
}

export interface ChatParams {
  temperature: number
  maxTokens: number
  topP: number
  systemPrompt?: string
  reasoningEffort?: 'low' | 'medium' | 'high'
}

export type Theme = 'light' | 'dark' | 'system'

export interface DetectedProvider {
  providerId: string
  baseUrl: string
  models: ModelInfo[]
}
