'use client'

import { useState, type ReactNode } from 'react'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs'
import { Footer } from '@/components/layout/Footer'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { VisitBlock } from '@/components/sections/VisitBlock'

interface ContentPageShellProps {
  topTitle: string
  crumbs: BreadcrumbItem[]
  withVisit?: boolean
  onBack?: () => void
  children: ReactNode
}

// Common frame for every content page (Cẩm nang, Bài viết, Liên hệ, FAQ, Hướng dẫn, Làng nghề):
// header, mobile top bar, breadcrumbs, page body, showroom band and footer.
export function ContentPageShell({ topTitle, crumbs, withVisit = true, onBack, children }: ContentPageShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <DeskHeader />
      <TopBar title={topTitle} onBack={onBack} onMenu={() => setIsMenuOpen(true)} />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={crumbs} />
      {children}
      {withVisit ? <VisitBlock /> : null}
      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
