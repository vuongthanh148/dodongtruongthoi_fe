'use client'

import { useState, type ReactNode } from 'react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { VisitBlock } from '@/components/sections/VisitBlock'

type Crumb = { label: string; href?: string }

// Shared frame for the order lookup and order detail pages: header, mobile menu, breadcrumbs, showroom, footer.
export function OrderPageShell({ topBarTitle, crumbs, children }: { topBarTitle: string; crumbs: Crumb[]; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--bg-page)' }}>
      <DeskHeader />
      <TopBar title={topBarTitle} onMenu={() => setMenuOpen(true)} />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, ...crumbs]} />
      <Container className="pb-12 md:pb-16">{children}</Container>
      <VisitBlock />
      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
