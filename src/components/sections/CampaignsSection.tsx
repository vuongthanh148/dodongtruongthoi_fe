'use client'

import { DrumMark } from '@/components/icons'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Container } from '@/components/layout/Container'
import { formatVnd } from '@/lib/format'
import type { Campaign } from '@/lib/storefront-api'
import Link from 'next/link'

interface CampaignsSectionProps {
  campaigns: Campaign[]
}

export function CampaignsSection({ campaigns }: CampaignsSectionProps) {
  if (campaigns.length === 0) {
    return null
  }

  const singleCampaign = campaigns.length === 1

  // Helper to render the content inside a campaign card (shared between all layout variants)
  const renderCardContent = (campaign: Campaign) => {
    const discountText =
      campaign.discountType === 'percentage'
        ? `Giảm ${campaign.discountValue}%`
        : `Giảm ${formatVnd(campaign.discountValue)}`
    const dateRange = `${new Date(campaign.startsAt).toLocaleDateString('vi-VN')} - ${new Date(campaign.endsAt).toLocaleDateString('vi-VN')}`

    return {
      discountText,
      dateRange,
      render: (isSingleCard: boolean) => (
        <>
          <div
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 9.5,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: 8,
            }}
          >
            {discountText} · {dateRange}
          </div>
          <div
            className={isSingleCard ? 'text-[30px] md:text-[32px] lg:text-[36px] xl:text-[40px]' : undefined}
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: isSingleCard ? undefined : 24,
              fontWeight: 500,
              lineHeight: 1.02,
              marginBottom: 8,
            }}
          >
            {campaign.name}
          </div>
          {campaign.description ? (
            <div
              style={{
                fontSize: 11.5,
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.7)',
                marginBottom: isSingleCard ? 0 : 20,
              }}
            >
              {campaign.description}
            </div>
          ) : null}
        </>
      ),
    }
  }

  // Helper to render a campaign card for multi-campaign layout
  const renderMultiCard = (campaign: Campaign) => {
    const content = renderCardContent(campaign)
    return (
      <div
        key={campaign.id}
        style={{
          position: 'relative',
          flex: '0 0 85%',
          minWidth: '85%',
          padding: '20px 16px',
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
          color: 'var(--text-on-dark)',
          border: '1px solid rgba(244,237,224,0.12)',
          overflow: 'hidden',
          borderRadius: 10,
        }}
        className="flex flex-col xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center xl:gap-x-8"
      >
        <div
          style={{
            position: 'absolute',
            left: -60,
            top: -60,
            opacity: 0.06,
            pointerEvents: 'none',
          }}
        >
          <DrumMark size={180} color="var(--text-on-dark)" />
        </div>
        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          {content.render(false)}
        </div>
        <Link
          href={`/products?campaign=${campaign.id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)',
            background: '#fffdf7',
            borderRadius: 6,
            height: 44,
            paddingInline: 18,
            fontFamily: 'var(--font-be-vietnam), sans-serif',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
            border: 'none',
            whiteSpace: 'nowrap',
          }}
          className="mt-auto xl:mt-0 xl:flex-shrink-0"
        >
          Xem ưu đãi →
        </Link>
      </div>
    )
  }

  // Single campaign: render two versions (mobile flex, lg grid)
  if (singleCampaign) {
    const campaign = campaigns[0]
    const content = renderCardContent(campaign)

    return (
      <Container>
        <section className="mt-6 md:mt-10 lg:mt-14 xl:mt-[72px]">
          <SectionHeading eyebrow="Ưu đãi" title="Chương trình khuyến mãi" />

          {/* Mobile/tablet version (flex column, visible below lg) */}
          <div
            style={{
              position: 'relative',
              padding: '22px 18px',
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
              color: 'var(--text-on-dark)',
              border: '1px solid rgba(244,237,224,0.12)',
              overflow: 'hidden',
              borderRadius: 10,
              gap: 20,
            }}
            className="flex flex-col lg:hidden"
          >
            <div
              style={{
                position: 'absolute',
                left: -60,
                top: -60,
                opacity: 0.06,
                pointerEvents: 'none',
              }}
            >
              <DrumMark size={140} color="var(--text-on-dark)" />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              {content.render(true)}
            </div>
            <Link
              href={`/products?campaign=${campaign.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
                background: '#fffdf7',
                borderRadius: 6,
                height: 44,
                paddingInline: 18,
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                border: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Xem ưu đãi →
            </Link>
          </div>

          {/* Desktop version (grid, visible at lg and up) */}
          <div
            style={{
              position: 'relative',
              padding: '22px 18px',
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
              color: 'var(--text-on-dark)',
              border: '1px solid rgba(244,237,224,0.12)',
              overflow: 'hidden',
              borderRadius: 10,
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              alignItems: 'center',
              gap: 40,
            }}
            className="hidden lg:grid"
          >
            <div
              style={{
                position: 'absolute',
                left: -60,
                top: -60,
                opacity: 0.06,
                pointerEvents: 'none',
              }}
            >
              <DrumMark size={180} color="var(--text-on-dark)" />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              {content.render(true)}
            </div>
            <Link
              href={`/products?campaign=${campaign.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
                background: '#fffdf7',
                borderRadius: 6,
                height: 44,
                paddingInline: 18,
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                border: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Xem ưu đãi →
            </Link>
          </div>
        </section>
      </Container>
    )
  }

  // Multi-campaign: render mobile scroll, md grid, and lg grid in three separate blocks
  return (
    <Container>
      <section className="mt-6 md:mt-10 lg:mt-14 xl:mt-[72px]">
        <SectionHeading eyebrow="Ưu đãi" title="Chương trình khuyến mãi" />

        {/* Mobile scroll version: visible only below md */}
        <div
          style={{ gap: 12, overflowX: 'auto' }}
          className="flex md:hidden noscroll"
        >
          {campaigns.map((campaign) => renderMultiCard(campaign))}
        </div>

        {/* Tablet (md) grid: 2 columns, visible only at md and below lg */}
        <div
          style={{
            gridTemplateColumns: `repeat(${Math.min(campaigns.length, 2)}, minmax(0, 1fr))`,
            gap: 16,
          }}
          className="hidden md:grid lg:hidden"
        >
          {campaigns.map((campaign) => renderMultiCard(campaign))}
        </div>

        {/* Desktop (lg+) grid: 3 columns, visible only at lg and up */}
        <div
          style={{
            gridTemplateColumns: `repeat(${Math.min(campaigns.length, 3)}, minmax(0, 1fr))`,
            gap: 20,
          }}
          className="hidden lg:grid"
        >
          {campaigns.map((campaign) => renderMultiCard(campaign))}
        </div>
      </section>
    </Container>
  )
}
