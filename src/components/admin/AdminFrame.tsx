'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, Menu, X } from 'lucide-react'
import { clearAdminToken } from '@/lib/admin-auth'
import { ADMIN_COPY } from '@/lib/content-data'
import { DrumMark } from '@/components/icons/DrumMark'

const navItems = [
  { href: '/admin', label: ADMIN_COPY.nav.dashboard },
  { href: '/admin/orders', label: ADMIN_COPY.nav.orders },
  { href: '/admin/products', label: ADMIN_COPY.nav.products },
  { href: '/admin/campaigns', label: ADMIN_COPY.nav.campaigns },
  { href: '/admin/categories', label: ADMIN_COPY.nav.categories },
  { href: '/admin/images', label: ADMIN_COPY.nav.images },
  { href: '/admin/banners', label: ADMIN_COPY.nav.banners },
  { href: '/admin/customer-photos', label: ADMIN_COPY.nav.customerPhotos },
  { href: '/admin/contacts', label: ADMIN_COPY.nav.contacts },
  { href: '/admin/contact-messages', label: ADMIN_COPY.nav.contactMessages },
  { href: '/admin/audit-log', label: ADMIN_COPY.nav.auditLog },
  { href: '/admin/reviews', label: ADMIN_COPY.nav.reviews },
  { href: '/admin/settings', label: ADMIN_COPY.nav.settings },
]

interface AdminFrameProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  /** Kept for existing callers. The shell now collapses to a top bar below lg at every page. */
  mobileHideSidebar?: boolean
}

export function AdminFrame({ title, subtitle, children }: AdminFrameProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  function logout() {
    clearAdminToken()
    router.push('/admin/login')
  }

  const nav = (
    <AdminNav
      pathname={pathname}
      onNavigate={() => setMenuOpen(false)}
      onLogout={logout}
    />
  )

  return (
    <div className="adm min-h-screen lg:grid lg:grid-cols-[232px_minmax(0,1fr)]" style={{ background: 'var(--admin-bg)' }}>
      <aside
        className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-y-auto"
        style={{ background: 'var(--admin-sidebar-bg)', color: 'var(--admin-sidebar-ink)' }}
      >
        {nav}
      </aside>

      <div className="flex min-w-0 flex-col">
        <header
          className="sticky top-0 z-20 flex h-14 items-center gap-2 px-2 lg:hidden"
          style={{ background: 'var(--admin-surface)', borderBottom: '1px solid var(--admin-border)' }}
        >
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={ADMIN_COPY.menuOpen}
            aria-expanded={menuOpen}
            aria-controls="admin-mobile-nav"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-md"
            style={{ color: 'var(--admin-ink)' }}
          >
            <Menu size={22} aria-hidden />
          </button>
          <h1
            className="font-heading min-w-0 flex-1 truncate text-[18px] font-semibold"
            style={{ color: 'var(--admin-ink)' }}
          >
            {title}
          </h1>
        </header>

        <main className="min-w-0 flex-1 px-4 py-5 md:px-6 lg:py-6 xl:px-8">
          <div className="mb-5 lg:mb-6">
            <h1
              className="font-heading hidden text-[26px] leading-[1.1] font-semibold lg:block"
              style={{ color: 'var(--admin-ink)' }}
            >
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 text-[14px] leading-normal" style={{ color: 'var(--admin-muted)' }}>
                {subtitle}
              </p>
            ) : null}
          </div>
          {children}
        </main>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label={ADMIN_COPY.menuClose}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-admin-ink/50 lg:hidden"
          />
          <aside
            id="admin-mobile-nav"
            className="fixed inset-y-0 left-0 z-50 flex w-[260px] max-w-[85vw] flex-col overflow-y-auto lg:hidden"
            style={{ background: 'var(--admin-sidebar-bg)', color: 'var(--admin-sidebar-ink)' }}
          >
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={ADMIN_COPY.menuClose}
                className="grid h-11 w-11 place-items-center rounded-md"
                style={{ color: 'var(--admin-sidebar-ink)' }}
              >
                <X size={20} aria-hidden />
              </button>
            </div>
            {nav}
          </aside>
        </>
      ) : null}
    </div>
  )
}

function AdminNav({
  pathname,
  onNavigate,
  onLogout,
}: {
  pathname: string
  onNavigate: () => void
  onLogout: () => void
}) {
  return (
    <nav aria-label="Quản trị" className="flex flex-1 flex-col gap-0.5 px-3 pb-4 pt-1 lg:pt-4">
      <div className="flex items-center gap-2.5 px-2 pb-5">
        <DrumMark size={30} color="var(--gold)" />
        <div className="min-w-0">
          <div className="font-heading text-[16px] font-semibold text-white">{ADMIN_COPY.brandName}</div>
          <div className="text-[12px] opacity-70">{ADMIN_COPY.brandSub}</div>
        </div>
      </div>

      {navItems.map((item) => {
        // Dashboard matches only /admin; other items also match their sub-routes.
        const active =
          item.href === '/admin' ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className="flex h-10 items-center rounded-md px-2.5 text-[14px] no-underline transition-colors hover:bg-admin-sidebar-line/40"
            style={{
              color: active ? '#fff' : 'var(--admin-sidebar-ink)',
              background: active ? 'var(--admin-primary)' : undefined,
              fontWeight: active ? 600 : 400,
            }}
          >
            {item.label}
          </Link>
        )
      })}

      <button
        type="button"
        onClick={onLogout}
        className="mt-auto flex h-10 items-center gap-2 rounded-md px-2.5 text-left text-[14px]"
        style={{
          border: '1px solid var(--admin-sidebar-line)',
          color: 'var(--admin-sidebar-ink)',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <LogOut size={16} aria-hidden />
        {ADMIN_COPY.logout}
      </button>
    </nav>
  )
}
