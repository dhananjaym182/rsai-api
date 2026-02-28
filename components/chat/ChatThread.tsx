'use client'

import { useChatStore } from '@/store/chat-store'
import { useSettingsStore } from '@/store/settings-store'
import { useProvidersStore } from '@/store/providers-store'
import { ChatComposer } from './ChatComposer'
import { ChatMessage } from './ChatMessage'
import { ModelSelector } from '@/components/model/ModelSelector'
import { Button } from '@/components/ui/button'
import { PlusCircle, MessageSquare } from 'lucide-react'

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
      <div className="border-b px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto">
          <ModelSelector />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {activeSession.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3 max-w-md">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Start a conversation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Type a message below to begin chatting with your AI assistant
                </p>
              </div>
            </div>
          ) : (
            activeSession.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
        </div>
      </div>

      <div className="border-t px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto">
          <ChatComposer />
        </div>
      </div>
    </div>
  )
}
