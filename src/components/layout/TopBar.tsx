import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconBox, IconCart, IconHeart, IconMenu, IconSearch } from '@/components/icons'
import { Logo } from '@/components/layout/Logo'
import { SearchResultsDropdown } from '@/components/ui/SearchResultsDropdown'
import { getCartItems, getSavedProducts } from '@/lib/storage'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

interface TopBarProps {
  /**
   * Page title. Not rendered in the header: the design boards show the logo
   * in the mobile and tablet header on every page. Kept so call sites compile.
   */
  title?: string
  variant?: 'solid' | 'overlay'
  savedCount?: number
  onBack?: () => void
  onMenu?: () => void
  onOpenSaved?: () => void
  onSearch?: () => void
}

const ICON_BTN = 'grid h-10 w-10 place-items-center'

function CountBadge({ count }: { count: number }) {
  return (
    <span
      suppressHydrationWarning
      className="absolute top-[3px] right-[1px] grid h-4 min-w-4 place-items-center rounded-full bg-[var(--accent)] px-1 text-[12px] leading-none font-bold text-white"
    >
      {count}
    </span>
  )
}

// Mobile (sm) and tablet (md) header. Below lg only; desktop uses DeskHeader.
export function TopBar({
  variant = 'solid',
  savedCount,
  onBack,
  onMenu,
  onOpenSaved,
  onSearch,
}: TopBarProps) {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [storedSavedCount, setStoredSavedCount] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const [tabletQuery, setTabletQuery] = useState('')
  const [tabletSearchFocused, setTabletSearchFocused] = useState(false)
  const tabletSearchBlurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const displayedSavedCount = typeof savedCount === 'number' ? savedCount : storedSavedCount
  const overlay = variant === 'overlay'

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStoredSavedCount(getSavedProducts().length)
    setCartCount(getCartItems().reduce((s, i) => s + i.quantity, 0))
  }, [])

  useEffect(() => () => clearTimeout(tabletSearchBlurTimer.current), [])

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 2)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function handleTabletSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = tabletQuery.trim()
    setTabletSearchFocused(false)
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
  }

  function handleSavedClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (onOpenSaved) {
      e.preventDefault()
      onOpenSaved()
    }
  }

  const iconColor = overlay ? 'var(--text-on-dark)' : 'var(--text-primary)'
  const logoVariant = overlay ? 'light' : 'default'

  return (
    // display:contents removes this wrapper from the box model entirely,
    // so the sticky <header> below sticks against the real page container
    // (a plain block wrapper would shrink-wrap the header and break sticky).
    <div className="contents lg:hidden">
      <header
        className="flex flex-col px-4 md:px-6"
        style={{
          paddingTop: 'max(8px, env(safe-area-inset-top, 8px))',
          background: overlay
            ? 'linear-gradient(180deg, rgba(20, 14, 9, 0.75) 0%, rgba(20, 14, 9, 0.18) 100%)'
            : 'var(--bg-page)',
          borderBottom: overlay ? '' : '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: scrolled && !overlay ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
          backdropFilter: overlay ? 'blur(8px)' : 'none',
        }}
      >
        {/* Row: menu or back · logo · icons. sm centres the logo; md left-aligns it. */}
        <div className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-2 pb-2 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-4">
          {onBack ? (
            <button type="button" onClick={onBack} aria-label="Quay lại" className={ICON_BTN} style={{ color: iconColor }}>
              <svg
                width={22}
                height={22}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : (
            <button type="button" onClick={onMenu} aria-label="Menu" className={ICON_BTN} style={{ color: iconColor }}>
              <IconMenu size={22} />
            </button>
          )}

          <div className="flex min-w-0 justify-center md:justify-start">
            <Logo size="sm" tagline="none" variant={logoVariant} className="md:hidden" />
            <Logo size="md" tagline="always" variant={logoVariant} className="hidden md:flex" />
          </div>

          <div className="flex items-center justify-end gap-0.5">
            {onSearch ? (
              <button
                type="button"
                onClick={onSearch}
                aria-label="Tìm kiếm"
                className={cn(ICON_BTN, 'md:hidden')}
                style={{ color: iconColor }}
              >
                <IconSearch size={20} />
              </button>
            ) : (
              <Link href="/products" aria-label="Tìm kiếm" className={cn(ICON_BTN, 'md:hidden')} style={{ color: iconColor }}>
                <IconSearch size={20} />
              </Link>
            )}
            <Link
              href="/orders"
              aria-label="Tra cứu đơn hàng"
              className={cn(ICON_BTN, 'hidden md:grid')}
              style={{ color: iconColor }}
            >
              <IconBox size={22} />
            </Link>
            <Link
              href="/saved"
              aria-label="Sản phẩm đã lưu"
              onClick={handleSavedClick}
              className={cn(ICON_BTN, 'relative hidden md:grid')}
              style={{ color: iconColor }}
            >
              <IconHeart size={22} />
              {displayedSavedCount > 0 && <CountBadge count={displayedSavedCount} />}
            </Link>
            <Link href="/cart" aria-label="Giỏ hàng" className={cn(ICON_BTN, 'relative')} style={{ color: iconColor }}>
              <IconCart size={22} />
              {cartCount > 0 && <CountBadge count={cartCount} />}
            </Link>
          </div>
        </div>

        {/* Tablet search row (md only). */}
        {!overlay && (
          <form
            onSubmit={handleTabletSearchSubmit}
            className="brand-focus relative mb-3 hidden h-10 items-center gap-2 rounded-[20px] px-3.5 md:flex"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
            }}
          >
            <IconSearch size={16} color="var(--text-muted)" />
            <label htmlFor="tablet-search" className="sr-only">
              Tìm kiếm sản phẩm
            </label>
            <input
              id="tablet-search"
              type="search"
              value={tabletQuery}
              onChange={(e) => setTabletQuery(e.target.value)}
              onFocus={() => {
                window.clearTimeout(tabletSearchBlurTimer.current)
                setTabletSearchFocused(true)
              }}
              onBlur={() => {
                tabletSearchBlurTimer.current = setTimeout(() => setTabletSearchFocused(false), 150)
              }}
              placeholder="Tìm tranh đồng, đỉnh đồng, tượng đồng…"
              style={{
                flex: 1,
                minWidth: 0,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 13,
                color: 'var(--text-primary)',
              }}
            />
            <SearchResultsDropdown
              query={tabletQuery}
              open={tabletSearchFocused}
              onNavigate={() => {
                setTabletQuery('')
                setTabletSearchFocused(false)
              }}
            />
          </form>
        )}
      </header>
    </div>
  )
}
