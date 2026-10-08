'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import useSWR from 'swr'
import { IconBox, IconCart, IconChevron, IconHeart, IconSearch } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { Logo } from '@/components/layout/Logo'
import { MegaMenu } from '@/components/layout/MegaMenu'
import { SearchResultsDropdown } from '@/components/ui/SearchResultsDropdown'
import { DESK_NAV_LINKS } from '@/lib/desktop-nav'
import { getCartItems, getSavedProducts } from '@/lib/storage'
import { fetchProducts } from '@/lib/storefront-api'
import { SWR_KEYS } from '@/lib/swr-keys'

const XL_QUERY = '(min-width: 1280px)'

function subscribeXl(onChange: () => void) {
  const mq = window.matchMedia(XL_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

// Placeholder copy differs at lg (narrow search pill) vs xl. Server snapshot is xl.
function useIsXl() {
  return useSyncExternalStore(
    subscribeXl,
    () => window.matchMedia(XL_QUERY).matches,
    () => true,
  )
}

function IconBtnLink({
  href,
  Icon,
  count,
  label,
}: {
  href: string
  Icon: typeof IconHeart
  count?: number
  label: string
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative grid h-10 w-10 place-items-center text-[var(--text-primary)]"
    >
      <Icon size={22} />
      {typeof count === 'number' && count > 0 && (
        <span
          suppressHydrationWarning
          className="absolute top-[3px] right-[1px] grid h-4 min-w-4 place-items-center rounded-full bg-[var(--accent)] px-1 text-[12px] font-bold leading-none text-white"
        >
          {count}
        </span>
      )}
    </Link>
  )
}

export function DeskHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [megaOpen, setMegaOpen] = useState(false)
  const [savedCount, setSavedCount] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const [query, setQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchBlurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const isXl = useIsXl()

  const { data: allProducts = [] } = useSWR(SWR_KEYS.products, fetchProducts)
  const bestSellers = allProducts.filter((p) => p.badge === 'best_seller')
  const megaFeatured = (bestSellers.length > 0 ? bestSellers : allProducts).slice(0, 2)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedCount(getSavedProducts().length)
    setCartCount(getCartItems().reduce((s, i) => s + i.quantity, 0))
  }, [pathname])

  const openMega = () => {
    clearTimeout(closeTimer.current)
    setMegaOpen(true)
  }
  const scheduleClose = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setMegaOpen(false), 180)
  }
  const closeMegaNow = (refocus: boolean) => {
    clearTimeout(closeTimer.current)
    setMegaOpen(false)
    if (refocus) triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!megaOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMegaNow(true)
    }
    function onPointerDown(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeMegaNow(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [megaOpen])

  useEffect(() => () => clearTimeout(closeTimer.current), [])
  useEffect(() => () => clearTimeout(searchBlurTimer.current), [])

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    setSearchFocused(false)
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
  }

  const isProductsActive = pathname?.startsWith('/products') || pathname?.startsWith('/categories')

  return (
    <header ref={headerRef} className="sticky top-0 z-40 hidden border-b border-[var(--border)] bg-[var(--bg-page)] lg:block">
      <Container className="relative grid h-[76px] grid-cols-[auto_minmax(0,1fr)_auto] items-stretch gap-5 xl:gap-9">
        <div className="flex items-center">
          <Logo size="lg" tagline="xl" />
        </div>

        <nav className="flex min-w-0 items-stretch gap-5 overflow-hidden pl-2 xl:gap-7 xl:pl-6">
          {DESK_NAV_LINKS.map((link) => {
            const active = link.hasDropdown ? isProductsActive || megaOpen : pathname === link.href
            if (link.hasDropdown) {
              return (
                <button
                  key={link.id}
                  ref={triggerRef}
                  type="button"
                  aria-expanded={megaOpen}
                  aria-controls="desk-mega-menu"
                  onMouseEnter={openMega}
                  onMouseLeave={scheduleClose}
                  onClick={() => (megaOpen ? closeMegaNow(false) : openMega())}
                  className="desk-nav-link -mb-px flex items-center gap-1 whitespace-nowrap border-b-2 font-body text-sm font-medium cursor-pointer xl:text-[15px]"
                  style={{
                    color: active ? 'var(--accent)' : 'var(--text-primary)',
                    borderBottomColor: active ? 'var(--accent)' : 'transparent',
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  <span className="inline-grid">
                    <span style={{ gridArea: '1 / 1', fontWeight: active ? 600 : 500 }}>{link.name}</span>
                    <span aria-hidden style={{ gridArea: '1 / 1', fontWeight: 600, visibility: 'hidden' }}>
                      {link.name}
                    </span>
                  </span>
                  <span
                    className="inline-flex"
                    style={{ transition: 'transform 220ms ease', transform: megaOpen ? 'rotate(180deg)' : 'none' }}
                  >
                    <IconChevron dir="down" size={13} />
                  </span>
                </button>
              )
            }
            return (
              <Link
                key={link.id}
                href={link.href}
                className="desk-nav-link -mb-px flex items-center whitespace-nowrap border-b-2 font-body text-sm font-medium xl:text-[15px]"
                style={{
                  color: active ? 'var(--accent)' : 'var(--text-primary)',
                  borderBottomColor: active ? 'var(--accent)' : 'transparent',
                  fontWeight: active ? 600 : 500,
                }}
              >
                <span className="inline-grid">
                  <span style={{ gridArea: '1 / 1', fontWeight: active ? 600 : 500 }}>{link.name}</span>
                  <span aria-hidden style={{ gridArea: '1 / 1', fontWeight: 600, visibility: 'hidden' }}>
                    {link.name}
                  </span>
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 xl:gap-3">
          <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
            <label className="sr-only" htmlFor="desk-search">
              Tìm kiếm sản phẩm
            </label>
            <div className="brand-focus flex h-10 w-[170px] min-w-0 items-center gap-2 rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] px-3.5 xl:w-[220px]">
              <IconSearch size={16} color="var(--text-muted)" />
              <input
                id="desk-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  window.clearTimeout(searchBlurTimer.current)
                  setSearchFocused(true)
                }}
                onBlur={() => {
                  searchBlurTimer.current = setTimeout(() => setSearchFocused(false), 150)
                }}
                placeholder={isXl ? 'Tìm tranh đồng, đỉnh đồng…' : 'Tìm sản phẩm…'}
                className="min-w-0 flex-1 bg-transparent text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              />
            </div>
            <SearchResultsDropdown
              query={query}
              open={searchFocused}
              onNavigate={() => {
                setQuery('')
                setSearchFocused(false)
              }}
            />
          </form>
          <Link
            href="/orders"
            aria-label="Tra cứu đơn hàng"
            className="desk-nav-link flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full border px-2 xl:px-3"
            style={{
              borderColor: pathname?.startsWith('/orders') ? 'var(--accent)' : 'var(--border)',
              color: pathname?.startsWith('/orders') ? 'var(--accent)' : 'var(--text-primary)',
            }}
          >
            <IconBox size={18} />
            <span className="hidden font-body text-[13px] font-medium xl:inline">Tra cứu đơn</span>
          </Link>
          <IconBtnLink href="/saved" Icon={IconHeart} count={savedCount} label="Sản phẩm đã lưu" />
          <IconBtnLink href="/cart" Icon={IconCart} count={cartCount} label="Giỏ hàng" />
        </div>
      </Container>

      <MegaMenu
        id="desk-mega-menu"
        open={megaOpen}
        featuredProducts={megaFeatured}
        onMouseEnter={openMega}
        onMouseLeave={scheduleClose}
      />
    </header>
  )
}

export { DeskHeader as Header }
