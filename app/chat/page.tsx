'use client'

import { ChatThread } from '@/components/chat/ChatThread'
import { ChatLayout } from '@/components/chat/ChatLayout'
import { AppHeader } from '@/components/app-header'

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <div className="flex-1 overflow-hidden">
        <ChatLayout>
          <ChatThread />
        </ChatLayout>
      </div>
    </div>
  )
}
