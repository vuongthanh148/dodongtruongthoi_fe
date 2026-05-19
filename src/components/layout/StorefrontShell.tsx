'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { MenuDrawer } from '@/components/layout/MenuDrawer'

interface StorefrontShellProps {
  children: React.ReactNode
}

export function StorefrontShell({ children }: StorefrontShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <TopBar
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      {children}
    </>
  )
}
