'use client'

import { useState } from 'react'
import { useChatStore } from '@/store/chat-store'
import { useSettingsStore } from '@/store/settings-store'
import { useProvidersStore } from '@/store/providers-store'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { streamChat } from '@/lib/api-chat'
import { AbortManager } from '@/lib/abort-manager'
import { estimateTokenCount, formatTokenCount } from '@/lib/token-counter'
import { Send, Square } from 'lucide-react'
import { toast } from 'sonner'

const abortManager = new AbortManager()

export function ChatComposer() {
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)

  const activeSession = useChatStore((state) => state.getActiveSession())
  const addMessage = useChatStore((state) => state.addMessage)
  const activeModel = useSettingsStore((state) => state.activeModel)
  const activeProviderId = useSettingsStore((state) => state.activeProviderId)
  const params = useSettingsStore((state) => state.params)
  const getProvider = useProvidersStore((state) => state.getProvider)

  const tokenCount = estimateTokenCount(input)

  const handleSend = async () => {
    if (!input.trim() || !activeSession || !activeProviderId || !activeModel) return

    const providerConfig = getProvider(activeProviderId)
    if (!providerConfig) {
      toast.error('Provider not configured')
      return
    }

    const userMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      role: 'user' as const,
      content: input.trim(),
      timestamp: Date.now(),
    }

    addMessage(activeSession.id, userMessage)
    setInput('')
    setStreaming(true)

    const assistantMessageId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    let accumulatedContent = ''
    let hasContent = false

    try {
      const signal = abortManager.start()
      const messages = [...activeSession.messages, userMessage]

      for await (const chunk of streamChat(providerConfig, messages, params, signal)) {
        accumulatedContent += chunk
        hasContent = true
        addMessage(activeSession.id, {
          id: assistantMessageId,
          role: 'assistant',
          content: accumulatedContent,
          timestamp: Date.now(),
          model: activeModel,
          providerId: activeProviderId,
        })
      }

      if (!hasContent) {
        toast.error('No response received from the model')
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          toast.info('Response stopped')
        } else {
          toast.error(error.message, {
            action: {
              label: 'Retry',
              onClick: () => handleSend(),
            },
          })
        }
      }
    } finally {
      setStreaming(false)
      abortManager.abort()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleStop = () => {
    abortManager.abort()
    setStreaming(false)
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
        className="min-h-[100px] resize-none bg-secondary border-border"
        disabled={streaming}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-mono">
          {formatTokenCount(tokenCount)} tokens
        </span>
        {streaming ? (
          <Button onClick={handleStop} variant="destructive" size="sm">
            <Square className="mr-2 h-4 w-4" />
            Stop
          </Button>
        ) : (
          <Button onClick={handleSend} disabled={!input.trim()} size="sm">
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        )}
      </div>
    </div>
  )
}
