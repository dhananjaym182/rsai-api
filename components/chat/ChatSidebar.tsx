'use client'

import { useChatStore } from '@/store/chat-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, MessageSquare } from 'lucide-react'
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
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">{title}</h3>
        <div className="space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent group ${
                session.id === activeSessionId ? 'bg-accent' : ''
              }`}
              onClick={() => setActiveSession(session.id)}
            >
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 truncate text-sm">{session.title}</span>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
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
    <div className="flex flex-col h-full border-r bg-muted/10">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          NexusChat
        </h1>
      </div>

      <div className="p-4">
        <Button onClick={() => createSession()} className="w-full">
          + New Chat
        </Button>
      </div>

      <div className="px-4 pb-4">
        <Input
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {renderGroup('Today', today)}
        {renderGroup('Yesterday', yesterday)}
        {renderGroup('Last 7 Days', lastWeek)}
        {renderGroup('Older', older)}
      </div>

      <div className="p-4 border-t">
        <a href="/settings/providers">
          <Button variant="outline" className="w-full">
            Settings
          </Button>
        </a>
      </div>
    </div>
  )
}
