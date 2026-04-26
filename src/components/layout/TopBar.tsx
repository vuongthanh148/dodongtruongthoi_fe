import { useEffect, useState } from 'react'
import { DrumMark, IconChevron, IconHeart, IconMenu, IconSearch } from '@/components/icons'
import { Btn } from '@/components/ui/Btn'
import { Heading } from '@/components/ui/Heading'
import { getSavedProducts } from '@/lib/storage'

interface TopBarProps {
  title?: string
  showLogo?: boolean
  savedCount?: number
  onBack?: () => void
  onMenu?: () => void
  onOpenSaved?: () => void
  onSearch?: () => void
}

export function TopBar({ title, showLogo = false, savedCount: _unused, onBack, onMenu, onOpenSaved, onSearch }: TopBarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [savedCount, setSavedCount] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    setSavedCount(getSavedProducts().length)

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
        background: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-soft)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {onBack ? (
        <Btn
          type="button"
          onClick={onBack}
          variant="ghost"
          size="sm"
          style={{ padding: 4, color: 'var(--text-primary)' }}
        >
          <IconChevron dir="left" size={22} />
        </Btn>
      ) : (
        <Btn
          type="button"
          onClick={onMenu}
          variant="ghost"
          size="sm"
          style={{ padding: 4, color: 'var(--text-primary)' }}
        >
          <IconMenu size={22} />
        </Btn>
      )}

      {showLogo ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }}>
          <DrumMark size={26} color="var(--accent)" />
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: '0.03em',
                color: 'var(--accent)',
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
                color: 'var(--bronze)',
                letterSpacing: '0.1em',
              }}
            >
              tinh hoa làng nghề Việt
            </div>
          </div>
        </div>
      ) : (
        <Heading size="sm" as="div" style={{ flex: 1, textAlign: 'center' }}>{title}</Heading>
      )}

      {onSearch && (
        <Btn type="button" variant="ghost" size="sm" onClick={onSearch} style={{ padding: 4, color: 'var(--text-primary)' }}>
          <IconSearch size={20} />
        </Btn>
      )}

      {onOpenSaved ? (
        <Btn
          type="button"
          onClick={onOpenSaved}
          variant="ghost"
          size="sm"
          style={{ padding: 4, color: 'var(--text-primary)', position: 'relative' }}
        >
          <IconHeart size={20} />
          {isHydrated && savedCount > 0 ? (
            <span
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
                display: 'grid',
                placeItems: 'center',
                lineHeight: 1,
              }}
            >
              {savedCount}
            </span>
          ) : null}
        </Btn>
      ) : null}
    </header>
  )
}
