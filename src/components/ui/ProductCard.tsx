'use client'

import { useMemo, useState } from 'react'
import { IconStar } from '@/components/icons'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { VariantSwatch } from '@/components/ui/VariantSwatch'
import { campaignEndLine, resolveProductSale } from '@/lib/campaign-price'
import { formatVnd } from '@/lib/format'
import { useCampaigns } from '@/lib/use-campaigns'
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

// One card for every listing. A product with a sale renders the campaign variant
// (CampCard in the handoff): −n% badge, sale price, struck original, end-date line.
export function ProductCard({ product, compact = false, noInnerPadding = false, onOpen }: ProductCardProps) {
  const [bgTone, setBgTone] = useState(getDefaultBgTone(product))
  const { data: campaigns = [] } = useCampaigns()
  const sale = useMemo(() => resolveProductSale(product, campaigns), [product, campaigns])
  const bgToneValues = getBgToneValues(product)
  const defaultFrame = getDefaultFrame(product)
  const endLine = sale?.campaign ? campaignEndLine(sale.campaign) : null

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
        <ArtPiece bg={bgTone as 'gold' | 'red' | 'bronze' | 'dark'} frame={defaultFrame as 'bronze' | 'gold' | 'dark' | 'carved'} label={product.title} pad={6} aspect="4/3" imgSrc={getPrimaryImage(product)} />
        {sale ? (
          <span
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              display: 'inline-flex',
              alignItems: 'center',
              height: 24,
              padding: '0 8px',
              borderRadius: 4,
              background: 'var(--accent)',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
            }}
          >
            −{sale.percent}%
          </span>
        ) : null}
        {product.badge && badgeMap[product.badge] ? (
          <span
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-primary)',
              background: 'var(--bg-card)',
              padding: '3px 8px',
              borderRadius: 4,
              border: '1px solid var(--border)',
            }}
          >
            {badgeMap[product.badge]}
          </span>
        ) : null}
      </div>
      <div
        style={{
          padding: sale ? '12px 14px 14px' : '10px 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          flex: 1,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1.25,
            color: 'var(--text-primary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.title}
        </h3>
        {!compact ? (
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-muted-strong)',
              margin: 0,
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.subtitle}
          </p>
        ) : null}
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
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
            flexWrap: 'wrap',
            marginTop: sale ? 'auto' : 4,
            paddingTop: sale ? 4 : 0,
          }}
        >
          <span className="price-num" style={{ fontSize: 16 }}>
            {formatVnd(sale ? sale.sale : product.price)}
          </span>
          {sale ? (
            <s style={{ fontSize: 13, color: 'var(--text-muted-strong)', fontVariantNumeric: 'tabular-nums' }}>
              {formatVnd(product.price)}
            </s>
          ) : null}
          {product.rating > 0 ? (
            <div
              style={{
                marginLeft: 'auto',
                fontSize: 12,
                color: 'var(--text-muted-strong)',
                display: 'flex',
                gap: 3,
                alignItems: 'center',
              }}
            >
              <IconStar size={11} color="var(--gold)" /> {Number(product.rating.toFixed(1))}
            </div>
          ) : null}
        </div>
        {endLine ? (
          <div
            style={{
              fontSize: 12.5,
              color: endLine.soon ? 'var(--accent)' : 'var(--text-muted-strong)',
              fontWeight: endLine.soon ? 600 : 400,
            }}
          >
            {endLine.text}
          </div>
        ) : null}
      </div>
    </Card>
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
