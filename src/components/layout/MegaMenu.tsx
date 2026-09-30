'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Price } from '@/components/ui/Price'
import type { Category, Product } from '@/lib/types'

interface MegaMenuProps {
  id: string
  open: boolean
  activeItemId?: string
  categories: Category[]
  featuredProducts: Product[]
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function MegaMenu({ id, open, activeItemId, categories, featuredProducts, onMouseEnter, onMouseLeave }: MegaMenuProps) {
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
      <Container className="grid grid-cols-1 gap-6 py-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-9">
        <div
          className="mm-col flex min-w-0 flex-col gap-0.5"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'none' : 'translateY(6px)',
            transitionDelay: open ? '50ms' : '0ms',
          }}
        >
          <div className="mb-1.5 flex h-[30px] items-center gap-2 border-b border-[var(--border)] pb-2">
            <span className="label-mono min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--bronze)]">
              Danh mục
            </span>
          </div>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="mm-link py-1.5 font-[family-name:var(--font-lora)] text-[15px]"
              style={{
                color: activeItemId === cat.id ? 'var(--accent)' : 'var(--text-primary)',
                fontWeight: activeItemId === cat.id ? 600 : 500,
              }}
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/categories" className="mm-link mt-auto pt-3 text-[13px] font-medium text-[var(--accent)]">
            Xem tất cả danh mục →
          </Link>
        </div>
        {featured.length > 0 && (
          <div
            className="mm-col hidden min-w-0 flex-col gap-2.5 lg:flex"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'none' : 'translateY(6px)',
              transitionDelay: open ? '90ms' : '0ms',
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
