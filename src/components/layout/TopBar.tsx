import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconBox, IconCart, IconHeart, IconMenu, IconSearch } from '@/components/icons'
import { Btn } from '@/components/ui/Btn'
import { Heading } from '@/components/ui/Heading'
import { SearchResultsDropdown } from '@/components/ui/SearchResultsDropdown'
import { getCartItems, getSavedProducts } from '@/lib/storage'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

interface TopBarProps {
  title?: string
  variant?: 'solid' | 'overlay'
  showLogo?: boolean
  savedCount?: number
  onBack?: () => void
  onMenu?: () => void
  onOpenSaved?: () => void
  onSearch?: () => void
}

function BrandLogo({ overlay, className }: { overlay: boolean; className?: string }) {
  return (
    <div className={cn('min-w-0', className)}>
      <div
        className="truncate text-base md:text-lg"
        style={{
          fontFamily: 'var(--font-lora), serif',
          fontWeight: 600,
          letterSpacing: '0.03em',
          color: overlay ? 'var(--text-on-dark)' : 'var(--accent)',
          lineHeight: 1,
        }}
      >
        Đồ Đồng Trường Thơi
      </div>
      <div
        className="text-[9px] md:text-[11px]"
        style={{
          fontFamily: 'var(--font-lora), serif',
          fontStyle: 'italic',
          color: overlay ? 'rgba(244,237,224,0.75)' : 'var(--bronze)',
          letterSpacing: '0.1em',
        }}
      >
        tinh hoa làng nghề Việt
      </div>
    </div>
  )
}

export function TopBar({
  title,
  variant = 'solid',
  showLogo = false,
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

  function handleTabletSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = tabletQuery.trim()
    setTabletSearchFocused(false)
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
  }

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 2)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const iconColor = overlay ? 'var(--text-on-dark)' : 'var(--text-primary)'

  return (
    // display:contents removes this wrapper from the box model entirely,
    // so the sticky <header> below sticks against the real page container
    // (a plain block wrapper would shrink-wrap the header and break sticky).
    <div className="contents lg:hidden">
    <header
      className="flex flex-col px-3.5 md:px-6"
      style={{
        paddingTop: 'max(12px, env(safe-area-inset-top, 12px))',
        background: overlay
          ? 'linear-gradient(180deg, rgba(20, 14, 9, 0.75) 0%, rgba(20, 14, 9, 0.18) 100%)'
          : 'var(--bg-page)',
        borderBottom: overlay ? '' : '1px solid var(--border-soft)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: scrolled && !overlay ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
        backdropFilter: overlay ? 'blur(8px)' : 'none',
      }}
    >
      {/* Row: menu/back · brand or title · icons (tablet adds tra cứu) */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 pb-3 md:gap-4">
        {/* Left: back or menu */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {onBack ? (
            <Btn
              type="button"
              onClick={onBack}
              variant="ghost"
              size="sm"
              style={{ padding: 4, color: iconColor }}
              aria-label="Quay lại"
            >
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
            </Btn>
          ) : (
            <Btn type="button" onClick={onMenu} variant="ghost" size="sm" style={{ padding: 4, color: iconColor }}>
              <IconMenu size={22} />
            </Btn>
          )}
        </div>

        {/* Center: logo (always on tablet) or page title (mobile) */}
        <div className="min-w-0 text-center md:text-left">
          {showLogo ? (
            <BrandLogo overlay={overlay} />
          ) : (
            <>
              <BrandLogo overlay={overlay} className="hidden md:block" />
              <Heading
                size="sm"
                as="div"
                className="truncate md:hidden"
                style={{ textAlign: 'center', color: iconColor }}
              >
                {title}
              </Heading>
            </>
          )}
        </div>

        {/* Right: search (mobile, when handled) · tra cứu (tablet) · saved · cart */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
          {onSearch && (
            <Btn
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSearch}
              aria-label="Tìm kiếm"
              className="md:hidden"
              style={{ padding: 4, color: iconColor }}
            >
              <IconSearch size={20} />
            </Btn>
          )}
          <Link
            href="/orders"
            aria-label="Tra cứu đơn hàng"
            className="hidden md:grid"
            style={{ width: 44, height: 44, placeItems: 'center', color: iconColor }}
          >
            <IconBox size={20} />
          </Link>
          {onOpenSaved && (
            <Btn
              type="button"
              onClick={onOpenSaved}
              variant="ghost"
              size="sm"
              aria-label="Đã lưu"
              style={{ padding: 4, color: iconColor, position: 'relative' }}
            >
              <IconHeart size={20} />
              <span
                suppressHydrationWarning
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  minWidth: 14,
                  height: 14,
                  padding: '0 3px',
                  background: 'var(--accent)',
                  color: 'white',
                  borderRadius: 7,
                  fontSize: 9,
                  fontWeight: 700,
                  display: displayedSavedCount > 0 ? 'grid' : 'none',
                  placeItems: 'center',
                  lineHeight: 1,
                }}
              >
                {displayedSavedCount || ''}
              </span>
            </Btn>
          )}
          <Link
            href="/cart"
            aria-label="Giỏ hàng"
            className="grid"
            style={{
              position: 'relative',
              width: 44,
              height: 44,
              placeItems: 'center',
              color: iconColor,
            }}
          >
            <IconCart size={20} />
            {cartCount > 0 && (
              <span
                suppressHydrationWarning
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 2,
                  minWidth: 14,
                  height: 14,
                  padding: '0 3px',
                  background: 'var(--accent)',
                  color: 'white',
                  borderRadius: 7,
                  fontSize: 9,
                  fontWeight: 700,
                  display: 'grid',
                  placeItems: 'center',
                  lineHeight: 1,
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Tablet search row (inside the sticky header, per design) */}
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
