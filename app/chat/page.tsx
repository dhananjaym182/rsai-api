'use client'

import { ChatThread } from '@/components/chat/ChatThread'
import { ChatLayout } from '@/components/chat/ChatLayout'

export default function ChatPage() {
  return (
    <ChatLayout>
      <ChatThread />
    </ChatLayout>
  )
}
