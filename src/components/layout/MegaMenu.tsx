'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Price } from '@/components/ui/Price'
import { MEGA_MENU_GROUPS } from '@/lib/desktop-nav'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

interface MegaMenuProps {
  id: string
  open: boolean
  featuredProducts: Product[]
  onMouseEnter: () => void
  onMouseLeave: () => void
}

// Column reveal stagger: 50ms base, +40ms per column (design handoff).
const colDelay = (i: number, open: boolean) => (open ? `${50 + i * 40}ms` : '0ms')

export function MegaMenu({ id, open, featuredProducts, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  const featured = featuredProducts.slice(0, 2)
  const hasFeatured = featured.length > 0

  return (
    <div
      id={id}
      role="region"
      aria-label="Danh mục sản phẩm"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-open={open}
      className="mm-panel absolute inset-x-0 top-full z-50 border-t border-b border-t-[var(--border-soft)] border-b-[var(--border)] bg-[var(--bg-page)]"
      style={{
        boxShadow: '0 28px 40px -28px rgba(42,31,26,0.45)',
        clipPath: open ? 'inset(0 0 -60px 0)' : 'inset(0 0 100% 0)',
        visibility: open ? 'visible' : 'hidden',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <Container
        className={cn(
          'grid grid-cols-1 gap-6 pt-[26px] pb-7 lg:grid-cols-4 lg:gap-6',
          hasFeatured ? 'xl:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.6fr)] xl:gap-9' : 'xl:gap-9',
        )}
      >
        {MEGA_MENU_GROUPS.map((group, gi) => (
          <div
            key={group.title}
            className="mm-col flex min-w-0 flex-col gap-0.5 self-stretch"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'none' : 'translateY(6px)',
              transitionDelay: colDelay(gi, open),
            }}
          >
            <div className="mb-1.5 flex h-[30px] items-center gap-2 border-b border-[var(--border)] pb-2">
              <span className="label-mono min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--bronze)]">
                {group.title}
              </span>
              {group.badge && (
                <span className="shrink-0 cursor-default rounded-[8px] bg-[var(--accent-subtle)] px-1.5 py-0.5 text-[10px] leading-none font-semibold whitespace-nowrap text-[var(--accent)]">
                  {group.badge}
                </span>
              )}
            </div>
            {group.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="mm-link py-1.5 font-[family-name:var(--font-lora)] text-[15px] font-medium text-[var(--text-primary)]"
              >
                {item.label}
              </Link>
            ))}
            {group.note && (
              <div className="mt-1 text-xs leading-[1.45] text-[var(--text-muted)]">{group.note}</div>
            )}
            <Link href={group.allHref} className="mm-link mt-auto pt-3 text-[13px] font-medium text-[var(--accent)]">
              {group.allLabel} →
            </Link>
          </div>
        ))}
        {hasFeatured && (
          <div
            className="mm-col hidden min-w-0 flex-col gap-2.5 xl:flex"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'none' : 'translateY(6px)',
              transitionDelay: colDelay(MEGA_MENU_GROUPS.length, open),
            }}
          >
            <div className="label-mono -mb-1 flex h-[30px] items-center border-b border-[var(--border)] pb-2 text-[var(--bronze)]">
              Bán chạy
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              {featured.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="mm-tile flex min-w-0 flex-col gap-2">
                  <div className="overflow-hidden rounded-[8px] bg-[var(--bg-surface-alt)] p-2.5">
                    <div className="mm-img">
                      <ArtPiece
                        bg={(p.defaultVariant.bg_tone as 'gold' | 'red' | 'bronze' | 'dark') ?? 'gold'}
                        frame={(p.defaultVariant.frame as 'bronze' | 'gold' | 'dark' | 'carved') ?? 'bronze'}
                        pad={4}
                        aspect="4/3"
                        imgSrc={p.images[0]?.url ?? null}
                        label={p.title}
                      />
                    </div>
                  </div>
                  <span className="overflow-hidden font-[family-name:var(--font-lora)] text-sm font-semibold text-ellipsis whitespace-nowrap">
                    {p.title}
                  </span>
                  <span className="price-num -mt-1 flex items-center gap-1 text-[13px] text-[var(--accent)]">
                    từ <Price amount={p.discountPrice ?? p.price} size="sm" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
