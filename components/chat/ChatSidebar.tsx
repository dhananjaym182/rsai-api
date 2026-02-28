'use client'

import { useChatStore } from '@/store/chat-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Trash2, MessageSquare, Plus, Search } from 'lucide-react'
import { useState } from 'react'

export function ChatSidebar() {
  const [search, setSearch] = useState('')
  const sessions = useChatStore((state) => state.sessions)
  const activeSessionId = useChatStore((state) => state.activeSessionId)
  const setActiveSession = useChatStore((state) => state.setActiveSession)
  const deleteSession = useChatStore((state) => state.deleteSession)
  const createSession = useChatStore((state) => state.createSession)

  const sessionsList = Object.values(sessions).sort((a, b) => b.updatedAt - a.updatedAt)

  const filteredSessions = sessionsList.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  )

  const now = new Date().getTime()
  const today = filteredSessions.filter((s) => now - s.updatedAt < 86400000)
  const yesterday = filteredSessions.filter(
    (s) => now - s.updatedAt >= 86400000 && now - s.updatedAt < 172800000
  )
  const lastWeek = filteredSessions.filter(
    (s) => now - s.updatedAt >= 172800000 && now - s.updatedAt < 604800000
  )
  const older = filteredSessions.filter((s) => now - s.updatedAt >= 604800000)

  const renderGroup = (title: string, sessions: typeof sessionsList) => {
    if (sessions.length === 0) return null
    return (
      <div className="mb-4">
        <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
        <div className="space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent cursor-pointer ${
                session.id === activeSessionId ? 'bg-accent' : ''
              }`}
              onClick={() => setActiveSession(session.id)}
            >
              <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate">{session.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteSession(session.id)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      <div className="p-4 space-y-3">
        <Button onClick={() => createSession()} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-border"
          />
        </div>
      </div>

      <Separator className="bg-border" />

      <ScrollArea className="flex-1 px-2">
        <div className="py-4">
          {renderGroup('Today', today)}
          {renderGroup('Yesterday', yesterday)}
          {renderGroup('Last 7 Days', lastWeek)}
          {renderGroup('Older', older)}
        </div>
      </ScrollArea>
    </div>
  )
}
