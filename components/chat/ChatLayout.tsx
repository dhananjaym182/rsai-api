'use client'

import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ReactNode } from 'react'

interface ChatLayoutProps {
  children: ReactNode
}

export function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="grid grid-cols-[260px_1fr] h-screen">
      <ChatSidebar />
      <main className="overflow-hidden">{children}</main>
    </div>
  )
}
