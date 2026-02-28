'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Settings, Sparkles } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'

export function AppHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 cursor-pointer">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              NexusChat
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/chat"
              className={`transition-colors duration-200 hover:text-foreground/80 cursor-pointer ${
                pathname === '/chat' ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </div>
            </Link>
            <Link
              href="/settings/providers"
              className={`transition-colors duration-200 hover:text-foreground/80 cursor-pointer ${
                pathname?.startsWith('/settings') ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </div>
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Command palette trigger can go here */}
          </div>
          <nav className="flex items-center gap-2">
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
