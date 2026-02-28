'use client'

import { ChatMessage } from '@/types'
import { useChatStore } from '@/store/chat-store'
import { Button } from '@/components/ui/button'
import { Copy, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface MessageActionsProps {
  message: ChatMessage
}

export function MessageActions({ message }: MessageActionsProps) {
  const activeSession = useChatStore((state) => state.getActiveSession())
  const deleteMessage = useChatStore((state) => state.deleteMessage)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    toast.success('Copied to clipboard')
  }

  const handleDelete = () => {
    if (activeSession) {
      deleteMessage(activeSession.id, message.id)
      toast.success('Message deleted')
    }
  }

  return (
    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="ghost" size="sm" onClick={handleCopy}>
        <Copy className="h-3 w-3" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleDelete}>
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  )
}
