'use client'

import { ThreadPrimitive, ComposerPrimitive, MessagePrimitive } from '@assistant-ui/react'
import { Button } from '@/components/ui/button'
import { ArrowDownIcon, SendIcon, SquareIcon } from 'lucide-react'
import { type FC } from 'react'

export const Thread: FC = () => {
  return (
    <ThreadPrimitive.Root className="flex h-full flex-col bg-background">
      <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto px-4 pt-8">
        <ThreadPrimitive.Empty>
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-semibold">Start a conversation</h2>
              <p className="text-muted-foreground">
                Send a message to begin chatting with your AI assistant
              </p>
            </div>
          </div>
        </ThreadPrimitive.Empty>

        <div className="mx-auto max-w-3xl space-y-6 pb-4">
          <ThreadPrimitive.Messages
            components={{
              UserMessage,
              AssistantMessage,
            }}
          />
        </div>

        <ThreadPrimitive.ScrollToBottom asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-20 right-8 rounded-full shadow-md"
          >
            <ArrowDownIcon className="h-4 w-4" />
          </Button>
        </ThreadPrimitive.ScrollToBottom>
      </ThreadPrimitive.Viewport>

      <div className="border-t px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <Composer />
        </div>
      </div>
    </ThreadPrimitive.Root>
  )
}

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="flex justify-end gap-3">
      <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  )
}

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="flex justify-start gap-3">
      <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-3 prose prose-sm dark:prose-invert">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  )
}

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="relative flex w-full items-end gap-2 rounded-2xl border bg-background p-2">
      <ComposerPrimitive.Input
        placeholder="Send a message..."
        className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
        rows={1}
        autoFocus
      />
      
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <Button size="icon" className="h-8 w-8 rounded-full">
            <SendIcon className="h-4 w-4" />
          </Button>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>

      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full">
            <SquareIcon className="h-3 w-3 fill-current" />
          </Button>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </ComposerPrimitive.Root>
  )
}
