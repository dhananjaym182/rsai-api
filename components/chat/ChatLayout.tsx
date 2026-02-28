'use client'

import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ReactNode } from 'react'

interface ChatLayoutProps {
  children: ReactNode
}

export function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="grid grid-cols-[280px_1fr] h-full">
      <ChatSidebar />
      <main className="overflow-hidden border-l">{children}</main>
    </div>
  )
}
