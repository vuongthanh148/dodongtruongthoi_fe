import { IconHeart, IconMenu, IconSearch } from '@/components/icons'
import { Btn } from '@/components/ui/Btn'
import { Heading } from '@/components/ui/Heading'
import { getSavedProducts } from '@/lib/storage'
import { useEffect, useState } from 'react'

interface TopBarProps {
  title?: string
  variant?: 'solid' | 'overlay'
  showLogo?: boolean
  savedCount?: number
  onMenu?: () => void
  onOpenSaved?: () => void
  onSearch?: () => void
}

export function TopBar({
  title,
  variant = 'solid',
  showLogo = false,
  savedCount,
  onMenu,
  onOpenSaved,
  onSearch,
}: TopBarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [storedSavedCount, setStoredSavedCount] = useState(0)
  const displayedSavedCount = typeof savedCount === 'number' ? savedCount : storedSavedCount

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStoredSavedCount(getSavedProducts().length)
  }, [])

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 2)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      style={{
        padding: '12px 14px',
        paddingTop: 'max(12px, env(safe-area-inset-top, 12px))',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background:
          variant === 'overlay'
            ? 'linear-gradient(180deg, rgba(20, 14, 9, 0.75) 0%, rgba(20, 14, 9, 0.18) 100%)'
            : 'var(--bg-page)',
        borderBottom:
          variant === 'overlay'
            ? ''
            : '1px solid var(--border-soft)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: scrolled && variant !== 'overlay' ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
        backdropFilter: variant === 'overlay' ? 'blur(8px)' : 'none',
      }}
    >
      <Btn
        type="button"
        onClick={onMenu}
        variant="ghost"
        size="sm"
        style={{
          padding: 4,
          color: variant === 'overlay' ? 'var(--text-on-dark)' : 'var(--text-primary)',
        }}
      >
        <IconMenu size={22} />
      </Btn>

      {showLogo ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: '0.03em',
                color: variant === 'overlay' ? 'var(--text-on-dark)' : 'var(--accent)',
                lineHeight: 1,
              }}
            >
              Đồ Đồng Trường Thơi
            </div>
            <div
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontStyle: 'italic',
                fontSize: 9,
                color: variant === 'overlay' ? 'rgba(244,237,224,0.75)' : 'var(--bronze)',
                letterSpacing: '0.1em',
              }}
            >
              tinh hoa làng nghề Việt
            </div>
          </div>
        </div>
      ) : (
        <Heading
          size="sm"
          as="div"
          style={{
            flex: 1,
            textAlign: 'center',
            color: variant === 'overlay' ? 'var(--text-on-dark)' : 'var(--text-primary)',
          }}
        >
          {title}
        </Heading>
      )}

      {onSearch && (
        <Btn
          type="button"
          variant="ghost"
          size="sm"
          onClick={onSearch}
          style={{
            padding: 4,
            color: variant === 'overlay' ? 'var(--text-on-dark)' : 'var(--text-primary)',
          }}
        >
          <IconSearch size={20} />
        </Btn>
      )}

      {onOpenSaved ? (
        <Btn
          type="button"
          onClick={onOpenSaved}
          variant="ghost"
          size="sm"
          style={{
            padding: 4,
            color: variant === 'overlay' ? 'var(--text-on-dark)' : 'var(--text-primary)',
            position: 'relative',
          }}
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
      ) : !onSearch ? <div style={{ width: 30, flexShrink: 0 }} /> : null}
    </header>
  )
}
