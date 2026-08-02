'use client'

import { useMemo, useState } from 'react'
import { IconStar } from '@/components/icons'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Price } from '@/components/ui/Price'
import { Skeleton } from '@/components/ui/Skeleton'
import { VariantSwatch } from '@/components/ui/VariantSwatch'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  compact?: boolean
  noInnerPadding?: boolean
  onOpen?: (bgTone?: string) => void
}

const badgeMap: Record<NonNullable<Product['badge']>, string> = {
  best_seller: 'Bán chạy',
  new: 'Mới',
  sale: 'Sale',
}

function getBgToneValues(product: Product): string[] {
  return product.variantOptions.find((o) => o.key === 'bg_tone')?.values ?? []
}

function getDefaultBgTone(product: Product): string {
  return product.defaultVariant['bg_tone'] ?? 'gold'
}

function getDefaultFrame(product: Product): string {
  return product.defaultVariant['frame'] ?? 'bronze'
}

function getPrimaryImage(product: Product): string | null {
  return product.images[0]?.url ?? null
}

export function ProductCard({ product, compact = false, noInnerPadding = false, onOpen }: ProductCardProps) {
  const [bgTone, setBgTone] = useState(getDefaultBgTone(product))
  const displayPrice = useMemo(() => product.discountPrice ?? product.price, [product.discountPrice, product.price])
  const bgToneValues = getBgToneValues(product)
  const defaultFrame = getDefaultFrame(product)

  return (
    <Card
      noPadding
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(bgTone)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen?.(bgTone)
        }
      }}
      onMouseDown={(event) => {
        event.currentTarget.style.transform = 'scale(0.985)'
      }}
      onMouseUp={(event) => {
        event.currentTarget.style.transform = ''
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = ''
      }}
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
      }}
    >
      <div style={{ padding: noInnerPadding ? 0 : 8, background: 'var(--bg-surface-alt)', position: 'relative' }}>
        <ArtPiece bg={bgTone as 'gold' | 'red' | 'bronze' | 'dark'} frame={defaultFrame as 'bronze' | 'gold' | 'dark' | 'carved'} label={product.title} pad={6} aspect="4/3" />
        {product.badge && badgeMap[product.badge] ? (
          <span
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 11,
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              background: 'rgba(244,237,224,0.95)',
              padding: '3px 8px',
              borderRadius: 3,
              border: '1px solid rgba(139,30,30,0.15)',
            }}
          >
            {badgeMap[product.badge]}
          </span>
        ) : null}
      </div>
      <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Heading as="h3" size="sm" style={{ lineHeight: 1.2 }}>{product.title}</Heading>
        {!compact ? <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', height: 'auto' }}>{product.subtitle}</p> : null}
        {bgToneValues.length > 0 && (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 2 }}>
            {bgToneValues.slice(0, 4).map((tone) => (
              <VariantSwatch
                key={tone}
                tone={tone}
                active={bgTone === tone}
                size={compact ? 16 : 14}
                onClick={(event) => {
                  event.stopPropagation()
                  setBgTone(tone)
                }}
              />
            ))}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
          <Price amount={displayPrice} size="md" />
          {product.rating > 0 ? (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 2, alignItems: 'center' }}>
              <IconStar size={10} color="#c9a961" /> {Number(product.rating.toFixed(1))}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}

interface ProductCardV2Props {
  product: Product
  onOpen?: (bgTone?: string) => void
  tall?: boolean
  style?: React.CSSProperties
}

export function ProductCardV2({ product, onOpen, tall = false, style: styleProp }: ProductCardV2Props) {
  const [bgTone, setBgTone] = useState(getDefaultBgTone(product))
  const displayPrice = useMemo(() => product.discountPrice ?? product.price, [product.discountPrice, product.price])
  const imageUrl = getPrimaryImage(product)
  const aspectRatio = tall ? '3 / 4' : '4 / 3'
  const bgToneValues = getBgToneValues(product)
  const defaultFrame = getDefaultFrame(product)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(bgTone)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen?.(bgTone)
        }
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-page)',
        cursor: 'pointer',
        ...styleProp,
        minHeight: '100%',
      }}
    >
      <div style={{ position: 'relative', background: 'var(--bg-surface)', padding: 10 }}>
        <div style={{ position: 'relative' }}>
          <ArtPiece
            bg={bgTone as 'gold' | 'red' | 'bronze' | 'dark'}
            frame={defaultFrame as 'bronze' | 'gold' | 'dark' | 'carved'}
            label={product.title}
            pad={8}
            aspect={aspectRatio}
            imgSrc={imageUrl ?? undefined}
          />
        </div>

        {product.badge && badgeMap[product.badge] ? (
          <span
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 9,
              letterSpacing: '0.1em',
              color: product.badge === 'sale' ? 'white' : 'var(--text-primary)',
              textTransform: 'uppercase',
              background: product.badge === 'sale' ? 'var(--accent)' : 'rgba(255,253,247,0.9)',
              padding: '3px 8px',
              borderRadius: 2,
              border: 'none',
            }}
          >
            {badgeMap[product.badge]}
          </span>
        ) : null}
      </div>

      <div style={{ padding: '10px 10px 12px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <Heading
          as="h3"
          size="sm"
          style={{
            fontFamily: 'var(--font-lora), serif',
            fontSize: 14.5,
            fontWeight: 600,
            lineHeight: 1.15,
            margin: 0,
            color: 'var(--text-primary)',
          }}
        >
          {product.title}
        </Heading>

        {bgToneValues.length > 0 && (
          <div style={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            {bgToneValues.slice(0, 3).map((tone) => (
              <button
                key={tone}
                type="button"
                aria-label={`Chọn tông ${tone}`}
                onClick={(event) => {
                  event.stopPropagation()
                  setBgTone(tone)
                }}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  border: `1px solid ${bgTone === tone ? 'var(--accent)' : 'var(--border)'}`,
                  background:
                    tone === 'gold'
                      ? 'var(--gold)'
                      : tone === 'red'
                        ? 'var(--accent)'
                        : tone === 'bronze'
                          ? 'var(--bronze)'
                          : 'var(--bg-dark)',
                  boxShadow: bgTone === tone ? '0 0 0 2px rgba(139,30,30,0.08)' : 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
          <Price amount={displayPrice} size="md" />
          {product.rating > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--text-muted)' }}>
              <IconStar size={10} color="var(--gold)" />
              {Number(product.rating.toFixed(1))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function ProductCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', background: 'var(--bg-card)' }}>
      <Skeleton style={{ aspectRatio: '4/3', borderRadius: 0 }} />
      <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton style={{ height: 16, width: '75%' }} />
        {!compact && <Skeleton style={{ height: 13, width: '55%' }} />}
        <Skeleton style={{ height: 14, width: '40%' }} />
      </div>
    </div>
  )
}
