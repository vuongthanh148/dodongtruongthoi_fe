'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Price } from '@/components/ui/Price'
import { SearchNoResults } from '@/components/ui/SearchNoResults'
import { fetchProducts } from '@/lib/storefront-api'
import { SWR_KEYS } from '@/lib/swr-keys'

interface SearchResultsDropdownProps {
  query: string
  open: boolean
  onNavigate: () => void
}

const MAX_RESULTS = 6

export function SearchResultsDropdown({ query, open, onNavigate }: SearchResultsDropdownProps) {
  const { data: products = [] } = useSWR(SWR_KEYS.products, () => fetchProducts())
  const q = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!q) return []
    return products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(q))
      )
      .slice(0, MAX_RESULTS)
  }, [products, q])

  if (!open || !q) {
    return null
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: 0,
        right: 0,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
        zIndex: 60,
        overflow: 'hidden',
      }}
    >
      {results.length > 0 ? (
        <>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                onClick={onNavigate}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--border-soft)',
                }}
              >
                <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}>
                  <ArtPiece
                    bg={(product.defaultVariant['bg_tone'] as 'gold' | 'red' | 'bronze' | 'dark' | undefined) ?? 'gold'}
                    frame={(product.defaultVariant['frame'] as 'bronze' | 'gold' | 'dark' | 'carved' | undefined) ?? 'bronze'}
                    label=""
                    pad={3}
                    aspect="1/1"
                    imgSrc={product.images[0]?.url ?? null}
                  />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {product.title}
                  </div>
                  <Price amount={product.discountPrice ?? product.price} size="sm" />
                </div>
              </Link>
            ))}
          </div>
          <Link
            href={`/products?q=${encodeURIComponent(query.trim())}`}
            onClick={onNavigate}
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '10px 12px',
              fontSize: 12.5,
              fontWeight: 600,
              color: 'var(--accent)',
              textDecoration: 'none',
              background: 'var(--bg-surface-alt)',
            }}
          >
            Xem tất cả kết quả cho &ldquo;{query.trim()}&rdquo; →
          </Link>
        </>
      ) : (
        <SearchNoResults compact query={query.trim()} onNavigate={onNavigate} />
      )}
    </div>
  )
}
