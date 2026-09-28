'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Price } from '@/components/ui/Price'
import { MEGA_MENU_GROUPS } from '@/lib/desktop-nav'
import type { Product } from '@/lib/types'

interface MegaMenuProps {
  id: string
  open: boolean
  activeItemId?: string
  featuredProducts: Product[]
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function MegaMenu({ id, open, activeItemId, featuredProducts, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  const featured = featuredProducts.slice(0, 2)

  return (
    <div
      id={id}
      role="region"
      aria-label="Danh mục sản phẩm"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-open={open}
      className="mm-panel absolute inset-x-0 top-full z-50 border-t border-[var(--border-soft)] border-b border-[var(--border)] bg-[var(--bg-page)]"
      style={{
        boxShadow: '0 28px 40px -28px rgba(42,31,26,0.45)',
        clipPath: open ? 'inset(0 0 -60px 0)' : 'inset(0 0 100% 0)',
        visibility: open ? 'visible' : 'hidden',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <Container className="grid grid-cols-4 gap-6 py-7 lg:gap-9 xl:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.6fr)]">
        {MEGA_MENU_GROUPS.map((group, gi) => (
          <div
            key={group.title}
            className="mm-col flex min-w-0 flex-col gap-0.5"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'none' : 'translateY(6px)',
              transitionDelay: open ? `${50 + gi * 40}ms` : '0ms',
            }}
          >
            <div className="mb-1.5 flex h-[30px] items-center gap-2 border-b border-[var(--border)] pb-2">
              <span className="label-mono min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--bronze)]">
                {group.title}
              </span>
              {group.badge && (
                <span className="shrink-0 whitespace-nowrap rounded-full bg-[rgba(139,30,30,0.08)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                  {group.badge}
                </span>
              )}
            </div>
            {group.items.map((item) => (
              <Link
                key={item.id}
                href={`/categories/${item.id}`}
                className="mm-link py-1.5 font-[family-name:var(--font-lora)] text-[15px]"
                style={{
                  color: activeItemId === item.id ? 'var(--accent)' : 'var(--text-primary)',
                  fontWeight: activeItemId === item.id ? 600 : 500,
                }}
              >
                {item.name}
              </Link>
            ))}
            {group.note && <div className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{group.note}</div>}
            <Link href={group.allHref} className="mm-link mt-auto pt-3 text-[13px] font-medium text-[var(--accent)]">
              {group.allLabel} →
            </Link>
          </div>
        ))}
        {featured.length > 0 && (
          <div
            className="mm-col hidden min-w-0 flex-col gap-2.5 xl:flex"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'none' : 'translateY(6px)',
              transitionDelay: open ? `${50 + 4 * 40}ms` : '0ms',
            }}
          >
            <div className="label-mono -mb-1 flex h-[30px] items-center border-b border-[var(--border)] pb-2 text-[var(--bronze)]">
              Bán chạy
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              {featured.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="mm-tile flex min-w-0 flex-col gap-2">
                  <div className="overflow-hidden rounded-lg bg-[var(--bg-surface-alt)] p-2.5">
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
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap font-[family-name:var(--font-lora)] text-sm font-semibold">
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
