'use client'

import { Thread } from '@/components/assistant-ui/thread'
import { AssistantRuntimeProvider } from '@/components/providers/AssistantRuntimeProvider'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { AppHeader } from '@/components/app-header'

export default function ChatPage() {
  return (
    <AssistantRuntimeProvider>
      <div className="flex flex-col h-screen">
        <AppHeader />
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-[280px_1fr] h-full bg-background">
            <ChatSidebar />
            <main className="overflow-hidden">
              <Thread />
            </main>
          </div>
        </div>
      </div>
    </AssistantRuntimeProvider>
  )
}
