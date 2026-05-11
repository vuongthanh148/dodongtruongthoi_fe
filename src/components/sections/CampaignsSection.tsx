'use client'

import { DrumMark } from '@/components/icons'
import { Btn } from '@/components/ui/Btn'
import { formatVnd } from '@/lib/format'
import type { Campaign } from '@/lib/storefront-api'

interface CampaignsSectionProps {
  campaigns: Campaign[]
}

export function CampaignsSection({ campaigns }: CampaignsSectionProps) {
  if (campaigns.length === 0) {
    return null
  }

  const singleCampaign = campaigns.length === 1

  return (
    <section style={{ paddingTop: '32px' }}>
      <div
        style={
          singleCampaign
             ? {  }
            : { display: 'flex', gap: 12, overflowX: 'auto' }
        }
        className={singleCampaign ? undefined : 'noscroll'}
      >
        {campaigns.map((campaign) => {
          const discountText =
            campaign.discountType === 'percentage'
              ? `Giảm ${campaign.discountValue}%`
              : `Giảm ${formatVnd(campaign.discountValue)}`
          const dateRange = `${new Date(campaign.startsAt).toLocaleDateString('vi-VN')} - ${new Date(campaign.endsAt).toLocaleDateString('vi-VN')}`

          return (
            <div
              key={campaign.id}
              style={{
                position: 'relative',
                flex: singleCampaign ? undefined : '0 0 85%',
                minWidth: singleCampaign ? undefined : '85%',
                padding: singleCampaign ? '22px 18px' : '20px 16px',
                background: singleCampaign
                  ? 'linear-gradient(135deg, var(--accent) 0%, #5d1812 100%)'
                  : 'linear-gradient(135deg, rgba(127,29,29,0.96) 0%, rgba(73,21,15,0.96) 100%)',
                color: 'var(--text-on-dark)',
                border: '1px solid rgba(244,237,224,0.12)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  right: -20,
                  top: -20,
                  opacity: 0.08,
                  pointerEvents: 'none',
                }}
              >
                <DrumMark size={160} color="var(--gold)" />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
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
                  style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    fontSize: singleCampaign ? 32 : 24,
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
                      marginBottom: 20,
                    }}
                  >
                    {campaign.description}
                  </div>
                ) : null}
                <Btn
                  type="button"
                  variant="ghost"
                  size="sm"
                  style={{
                    color: 'var(--text-on-dark)',
                    border: '1px solid rgba(255,255,255,0.55)',
                    borderRadius: 2,
                    background: 'transparent',
                    paddingInline: 14,
                  }}
                >
                  Xem sản phẩm khuyến mãi →
                </Btn>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
