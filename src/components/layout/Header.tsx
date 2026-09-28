'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { DrumMark, IconBox, IconCart, IconChevron, IconHeart, IconSearch } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { MegaMenu } from '@/components/layout/MegaMenu'
import { SITE_NAME } from '@/lib/constants'
import { DESK_NAV_LINKS } from '@/lib/desktop-nav'
import { getCartItems, getSavedProducts } from '@/lib/storage'
import { fetchProducts } from '@/lib/storefront-api'
import { SWR_KEYS } from '@/lib/swr-keys'

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
          className="absolute top-0.5 right-0 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold leading-none text-white"
        >
          {count}
        </span>
      )}
    </Link>
  )
}

function Logo() {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-2.5">
      <DrumMark size={40} />
      <span className="min-w-0">
        <span className="block whitespace-nowrap font-[family-name:var(--font-lora)] text-[17px] leading-none font-semibold tracking-[0.02em] text-[var(--accent)] xl:text-[20px]">
          {SITE_NAME}
        </span>
        <span className="mt-[3px] hidden font-[family-name:var(--font-lora)] text-[11.5px] italic tracking-[0.08em] text-[var(--bronze)] xl:block">
          tinh hoa làng nghề Việt
        </span>
      </span>
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
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLDivElement>(null)

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
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
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

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
  }

  const isProductsActive = pathname?.startsWith('/products') || pathname?.startsWith('/categories')

  return (
    <header className="sticky top-0 z-40 hidden border-b border-[var(--border)] bg-[var(--bg-page)] lg:block">
      <Container className="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-stretch gap-5 xl:gap-9" style={{ height: 76 }}>
        <div className="flex items-center">
          <Logo />
        </div>

        <nav ref={navRef} className="flex min-w-0 items-stretch gap-5 overflow-hidden pl-2 xl:gap-7 xl:pl-6">
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
                  className="desk-nav-link -mb-px flex items-center gap-1 whitespace-nowrap border-b-2 font-[family-name:var(--font-lora)] text-sm cursor-pointer xl:text-[15px]"
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
                className="desk-nav-link -mb-px flex items-center whitespace-nowrap border-b-2 font-[family-name:var(--font-lora)] text-sm xl:text-[15px]"
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

        <div className="flex items-center gap-2 lg:gap-2 xl:gap-3">
          <form onSubmit={handleSearchSubmit} className="hidden lg:block">
            <label className="sr-only" htmlFor="desk-search">
              Tìm kiếm sản phẩm
            </label>
            <div className="brand-focus flex h-10 min-w-0 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3.5 lg:w-[170px] xl:w-[220px]">
              <IconSearch size={16} color="var(--text-muted)" />
              <input
                id="desk-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm tranh đồng, đỉnh đồng…"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              />
            </div>
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
            <span className="hidden text-[13px] font-medium xl:inline">Tra cứu đơn</span>
          </Link>
          <IconBtnLink href="/saved" Icon={IconHeart} count={savedCount} label="Sản phẩm đã lưu" />
          <IconBtnLink href="/cart" Icon={IconCart} count={cartCount} label="Giỏ hàng" />
        </div>
      </Container>

      <MegaMenu
        id="desk-mega-menu"
        open={megaOpen}
        activeItemId={undefined}
        featuredProducts={megaFeatured}
        onMouseEnter={openMega}
        onMouseLeave={scheduleClose}
      />
    </header>
  )
}

export { DeskHeader as Header }
