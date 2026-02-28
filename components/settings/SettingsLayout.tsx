'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AppHeader } from '@/components/app-header'
import { ArrowLeft, Palette, Info, Plug } from 'lucide-react'

interface SettingsLayoutProps {
  children: ReactNode
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/settings/providers', label: 'Providers', icon: Plug },
    { href: '/settings/appearance', label: 'Appearance', icon: Palette },
    { href: '/settings/about', label: 'About', icon: Info },
  ]

  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <div className="flex-1 overflow-hidden">
        <div className="container h-full py-8">
          <div className="flex flex-col gap-8 h-full">
            <div className="flex items-center gap-4">
              <Link href="/chat">
                <Button variant="ghost" size="sm" className="cursor-pointer hover:bg-accent transition-all">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Chat
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Settings
              </h1>
            </div>

            <div className="grid grid-cols-[240px_1fr] gap-8 flex-1 overflow-hidden">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={pathname === item.href ? 'secondary' : 'ghost'}
                        className={`w-full justify-start cursor-pointer transition-all ${
                          pathname === item.href ? 'shadow-sm' : ''
                        }`}
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  )
                })}
              </nav>

              <div className="overflow-auto pr-2">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
