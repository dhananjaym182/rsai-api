'use client'

import { useChatStore } from '@/store/chat-store'
import { useSettingsStore } from '@/store/settings-store'
import { useProvidersStore } from '@/store/providers-store'
import { ChatComposer } from './ChatComposer'
import { ChatMessage } from './ChatMessage'
import { ModelSelector } from '@/components/model/ModelSelector'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export function ChatThread() {
  const activeSession = useChatStore((state) => state.getActiveSession())
  const createSession = useChatStore((state) => state.createSession)
  const activeModel = useSettingsStore((state) => state.activeModel)
  const activeProviderId = useSettingsStore((state) => state.activeProviderId)
  const providers = useProvidersStore((state) => state.providers)

  const connectedProviders = Object.values(providers).filter((p) => p.isConnected)

  if (connectedProviders.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">No providers configured</h2>
          <p className="text-muted-foreground">
            Connect a provider in settings to start chatting
          </p>
          <a href="/settings/providers">
            <Button>Configure Providers</Button>
          </a>
        </div>
      </div>
    )
  }

  if (!activeSession) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Start a new conversation</h2>
          <Button onClick={() => createSession(activeModel || undefined, activeProviderId || undefined)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-4 py-3 bg-background">
        <ModelSelector />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {activeSession.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>

      <div className="border-t px-4 py-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <ChatComposer />
        </div>
      </div>
    </div>
  )
}
