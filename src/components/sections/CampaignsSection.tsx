'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { DrumMark } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { campaignDiscountLabel, campaignEndLine, isCampaignLive, type CampaignRule } from '@/lib/campaign-price'
import { formatVnd } from '@/lib/format'
import type { Campaign } from '@/lib/storefront-api'

interface CampaignsSectionProps {
  campaigns: Campaign[]
}

const cardBackground = 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)'

function CampaignCard({ campaign, now, variant }: { campaign: CampaignRule; now: Date; variant: 'band' | 'tile' }) {
  const isBand = variant === 'band'
  const end = campaignEndLine(campaign, now)
  const eyebrow = `${campaignDiscountLabel(campaign, formatVnd)} · ${end.text}`

  return (
    <div
      className={
        isBand
          ? 'relative flex flex-col gap-5 overflow-hidden rounded-[10px] p-5 md:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:p-7 xl:p-8'
          : 'relative flex h-full flex-col gap-4 overflow-hidden rounded-[10px] p-5 md:p-5'
      }
      style={{ background: cardBackground, color: 'var(--text-on-dark)', border: '1px solid var(--border-on-dark)' }}
    >
      <div className="pointer-events-none absolute" style={{ left: -60, top: -60, opacity: 0.06 }} aria-hidden="true">
        <DrumMark size={isBand ? 180 : 140} color="var(--bg-page)" />
      </div>
      <div className="relative min-w-0 flex-1">
        <div
          className="mb-2 text-[13px] font-medium"
          style={{ color: 'var(--gold)', fontWeight: end.soon ? 600 : 500 }}
        >
          {eyebrow}
        </div>
        <div
          className={isBand ? 'mb-2 text-[22px] font-semibold leading-[1.2] md:text-[26px] lg:text-[30px]' : 'mb-2 text-[20px] font-semibold leading-[1.2]'}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {campaign.name}
        </div>
        {campaign.description ? (
          <p className="m-0 max-w-[560px] text-[14px] leading-[1.55] md:text-[15px]" style={{ color: 'var(--text-on-dark-muted)' }}>
            {campaign.description}
          </p>
        ) : null}
      </div>
      <Link
        href={`/products?campaign=${campaign.id}`}
        className="relative inline-flex h-11 shrink-0 items-center justify-center self-start whitespace-nowrap rounded-[6px] px-[18px] text-sm font-semibold lg:self-center"
        style={{ color: 'var(--accent)', background: 'var(--bg-page)', textDecoration: 'none' }}
      >
        Xem ưu đãi →
      </Link>
    </div>
  )
}

// Home campaign block. 0 live campaigns: hidden. 1: full-width band. 2 or more: grid at
// md+ and a horizontal scroll with 85%-wide cards on mobile.
export function CampaignsSection({ campaigns }: CampaignsSectionProps) {
  const [now] = useState(() => new Date())
  const live = useMemo(() => campaigns.filter((c) => isCampaignLive(c, now)), [campaigns, now])

  if (live.length === 0) {
    return null
  }

  const count = live.length

  return (
    <Container>
      <section className="mt-10 md:mt-14 lg:mt-16 xl:mt-[72px]">
        <SectionTitle eyebrow="Ưu đãi" title="Chương trình khuyến mãi" />

        {count === 1 ? (
          <CampaignCard campaign={live[0]} now={now} variant="band" />
        ) : (
          <>
            <div className="noscroll -mx-4 flex snap-x gap-3 overflow-x-auto px-4 md:hidden">
              {live.map((campaign) => (
                <div key={campaign.id} className="w-[85%] shrink-0 snap-start">
                  <CampaignCard campaign={campaign} now={now} variant="tile" />
                </div>
              ))}
            </div>
            <div
              className={`hidden gap-4 md:grid lg:gap-5 ${count >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'}`}
            >
              {live.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} now={now} variant="tile" />
              ))}
            </div>
          </>
        )}
      </section>
    </Container>
  )
}
