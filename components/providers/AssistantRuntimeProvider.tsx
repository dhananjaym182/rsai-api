'use client'

import { ReactNode, useMemo, useEffect } from 'react'
import {
  AssistantRuntimeProvider as AUIRuntimeProvider,
  useLocalRuntime,
  type CoreMessage,
} from '@assistant-ui/react'
import { useProvidersStore } from '@/store/providers-store'
import { useSettingsStore } from '@/store/settings-store'
import { useChatStore } from '@/store/chat-store'
import { createChatModelAdapter } from '@/lib/assistant-runtime'

export function AssistantRuntimeProvider({ children }: { children: ReactNode }) {
  const activeProviderId = useSettingsStore((state) => state.activeProviderId)
  const activeModel = useSettingsStore((state) => state.activeModel)
  const params = useSettingsStore((state) => state.params)
  const getProvider = useProvidersStore((state) => state.getProvider)
  const activeSession = useChatStore((state) => state.getActiveSession())
  const addMessage = useChatStore((state) => state.addMessage)

  // Get provider config
  const providerConfig = activeProviderId ? getProvider(activeProviderId) : null

  // Convert Zustand messages to assistant-ui format
  const initialMessages = useMemo<CoreMessage[]>(() => {
    if (!activeSession) return []

    return activeSession.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: [{ type: 'text' as const, text: m.content }],
      createdAt: new Date(m.timestamp),
    }))
  }, [activeSession?.id, activeSession?.messages.length])

  // Create chat model adapter
  const adapter = useMemo(() => {
    if (!providerConfig || !activeModel) {
      // Return a dummy adapter that does nothing
      return {
        async run() {
          return { content: [{ type: 'text' as const, text: 'Please configure a provider first.' }] }
        },
      }
    }

    return createChatModelAdapter({
      config: providerConfig,
      params,
      onMessageComplete: (content, messageId) => {
        // Save assistant message to Zustand store
        if (activeSession) {
          addMessage(activeSession.id, {
            id: messageId,
            role: 'assistant',
            content,
            timestamp: Date.now(),
            model: activeModel,
            providerId: activeProviderId || undefined,
          })
        }
      },
    })
  }, [providerConfig, activeModel, params, activeSession?.id, addMessage, activeProviderId])

  // Create runtime with initial messages
  const runtime = useLocalRuntime(adapter, {
    initialMessages,
  })

  // Save user messages to Zustand when they're sent
  useEffect(() => {
    if (!activeSession) return

    const unsubscribe = runtime.thread.subscribe(() => {
      const messages = runtime.thread.getState().messages
      const lastMessage = messages[messages.length - 1]
      
      if (lastMessage && lastMessage.role === 'user') {
        // Check if this message is already in Zustand
        const existsInStore = activeSession.messages.some(m => m.id === lastMessage.id)
        if (!existsInStore) {
          addMessage(activeSession.id, {
            id: lastMessage.id,
            role: 'user',
            content: lastMessage.content
              .filter((c) => c.type === 'text')
              .map((c) => c.text)
              .join('\n'),
            timestamp: lastMessage.createdAt.getTime(),
          })
        }
      }
    })

    return unsubscribe
  }, [activeSession?.id, runtime, addMessage])

  return <AUIRuntimeProvider runtime={runtime}>{children}</AUIRuntimeProvider>
}
