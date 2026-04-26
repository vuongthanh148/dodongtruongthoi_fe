'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { IconChevron, IconSearch } from '@/components/icons'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Btn } from '@/components/ui/Btn'
import { Heading } from '@/components/ui/Heading'
import { Label } from '@/components/ui/Label'
import { Price } from '@/components/ui/Price'
import type { Category, Product } from '@/lib/types'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
  categories: Category[]
  initialProducts: Product[]
}

export function SearchOverlay({ open, onClose, categories, initialProducts }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      window.setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const results = useMemo(() => {
    if (!query.trim()) {
      return initialProducts
    }
    const q = query.toLowerCase()
    return initialProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q))
    )
  }, [query, initialProducts])

  if (!open) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        background: 'var(--bg-page)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-soft)',
          flexShrink: 0,
        }}
      >
        <Btn
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          style={{
            padding: 4,
            minWidth: 28,
          }}
        >
          <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
            <IconChevron size={18} color="var(--text-primary)" />
          </span>
        </Btn>
        <IconSearch size={16} color="var(--text-muted)" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm tranh, đỉnh đồng..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            fontSize: 15,
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
      </div>

      {/* Category Quick Links */}
      {!query.trim() && (
        <div style={{ padding: '12px 16px', flexShrink: 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 10,
            }}
          >
            Danh mục nhanh
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
            }}
          >
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                onClick={onClose}
                style={{
                  flex: '0 0 auto',
                  padding: '8px 12px',
                  background: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-soft)',
                  borderRadius: 20,
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.name}
                <IconChevron size={12} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 16px',
        }}
      >
        {!query.trim() && (
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 10,
              }}
            >
              Sản phẩm nổi bật
            </div>
          </div>
        )}

        {results.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                onClick={onClose}
                style={{
                  display: 'flex',
                  gap: 10,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-soft)',
                  borderRadius: 10,
                  padding: 8,
                  textDecoration: 'none',
                }}
              >
                <div style={{ width: 112, flexShrink: 0 }}>
                  <ArtPiece
                    bg={(product.defaultBg as 'gold' | 'red' | 'bronze' | 'dark') || 'bronze'}
                    frame={(product.defaultFrame as 'bronze' | 'gold' | 'dark' | 'carved') || 'bronze'}
                    label={product.title}
                    pad={5}
                    aspect="4/3"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                  <div>
                    <Heading as="h3" size="sm" style={{ color: 'var(--text-primary)', lineHeight: 1.25 }}>
                      {product.title}
                    </Heading>
                    <p style={{ margin: '4px 0 0', fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                      {product.subtitle}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <Price amount={product.discountPrice ?? product.price} size="sm" />
                    <Label style={{ fontSize: 11, letterSpacing: '0.1em' }}>
                      {product.rating.toFixed(1)} ★
                    </Label>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              paddingTop: 40,
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>Không tìm thấy sản phẩm phù hợp</div>
            <Btn
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setQuery('')}
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              Xóa tìm kiếm
            </Btn>
          </div>
        )}
      </div>
    </div>
  )
}
