'use client'

import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Campaign } from '@/lib/storefront-api'

interface CampaignsSectionProps {
  campaigns: Campaign[]
}

export function CampaignsSection({ campaigns }: CampaignsSectionProps) {
  if (campaigns.length === 0) {
    return null
  }

  const activeCampaigns = campaigns.filter((c) => c.isActive)
  if (activeCampaigns.length === 0) {
    return null
  }

  return (
    <section style={{ paddingBlock: '24px', background: 'var(--bg-page)' }}>
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <SectionHeading title="Khuyến mãi" />
      </div>
      <div style={{ display: 'grid', gap: 12, padding: '0 16px' }}>
        {activeCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 16,
              background: 'var(--bg-surface)',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', marginBottom: 6 }}>
              {campaign.name}
            </div>
            {campaign.description && (
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.5 }}>
                {campaign.description}
              </div>
            )}
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--accent)' }}>
              {campaign.discountType === 'percentage' ? `${campaign.discountValue}%` : `${campaign.discountValue.toLocaleString()} đ`} giảm
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
