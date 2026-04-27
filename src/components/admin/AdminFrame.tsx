'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clearAdminToken } from '@/lib/admin-auth'

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/banners', label: 'Banners' },
  { href: '/admin/customer-photos', label: 'Customer Photos' },
  { href: '/admin/contacts', label: 'Contacts' },
  { href: '/admin/campaigns', label: 'Campaigns' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/settings', label: 'Settings' },
]

interface AdminFrameProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  mobileHideSidebar?: boolean
}

export function AdminFrame({ title, subtitle, children, mobileHideSidebar = false }: AdminFrameProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    const resizeListener = () => checkMobile()
    window.addEventListener('resize', resizeListener)
    return () => window.removeEventListener('resize', resizeListener)
  }, [])

  const showMobileMenu = mobileHideSidebar && isMobile

  const sidebarContent = (
    <>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>DDTT Admin</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Content Management</div>
      </div>

      {navItems.map((item) => {
        // Exact match or starts with href + slash (but not dashboard which is /admin)
        const isExactMatch = pathname === item.href
        const isSubRoute = pathname.startsWith(`${item.href}/`)
        const active = item.href === '/admin' ? isExactMatch : (isExactMatch || isSubRoute)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            style={{
              textDecoration: 'none',
              color: active ? 'white' : '#d1d5db',
              background: active ? '#7f1d1d' : 'transparent',
              padding: '9px 10px',
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            {item.label}
          </Link>
        )
      })}

      <button
        type="button"
        onClick={() => {
          clearAdminToken()
          router.push('/admin/login')
        }}
        style={{
          marginTop: 'auto',
          border: '1px solid #991b1b',
          background: 'transparent',
          color: '#fecaca',
          padding: '8px 10px',
          borderRadius: 6,
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </>
  )

  // Suppress hydration mismatch by rendering default layout until mounted
  const gridCols = !mounted ? '220px 1fr' : (showMobileMenu ? '1fr' : '220px 1fr')

  return (
    <>
      <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: gridCols, background: '#f5f6f8' }}>
        {/* Always render sidebar on initial load to prevent hydration mismatch */}
        {!showMobileMenu && (
          <aside style={{ background: '#111827', color: '#e5e7eb', padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sidebarContent}
          </aside>
        )}

        <main style={{ padding: 20 }}>
          {mounted && showMobileMenu && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  border: 'none',
                  background: '#111827',
                  color: 'white',
                  padding: '8px 10px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 18,
                }}
              >
                ☰
              </button>
              <div>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>{title}</h1>
              </div>
            </div>
          )}

          {!mounted || !showMobileMenu ? (
            <div style={{ marginBottom: 16 }}>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#111827' }}>{title}</h1>
              {subtitle ? <p style={{ margin: '4px 0 0', color: '#6b7280' }}>{subtitle}</p> : null}
            </div>
          ) : null}

          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {mounted && showMobileMenu && sidebarOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
              width: 220,
              background: '#111827',
              color: '#e5e7eb',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              zIndex: 1000,
              overflowY: 'auto',
            }}
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
