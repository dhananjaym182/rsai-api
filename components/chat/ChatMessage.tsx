'use client'

import { ChatMessage as ChatMessageType } from '@/types'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageActions } from './MessageActions'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import { Bot, User } from 'lucide-react'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 group ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="h-9 w-9 border-2 border-primary/20 flex-shrink-0 shadow-sm">
          <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col space-y-2 max-w-[75%] md:max-w-[65%]`}>
        <Card className={`px-4 py-3 shadow-sm ${
          isUser 
            ? 'bg-primary text-primary-foreground border-primary' 
            : 'bg-card border-border hover:shadow-md transition-shadow'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </Card>
        {!isUser && <MessageActions message={message} />}
      </div>

      {isUser && (
        <Avatar className="h-9 w-9 border-2 border-muted flex-shrink-0 shadow-sm">
          <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 text-primary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
