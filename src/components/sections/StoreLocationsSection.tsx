'use client'

import { IconMapPin, IconPhone } from '@/components/icons'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { STORES } from '@/lib/constants'

export function StoreLocationsSection() {
  return (
    <section style={{ paddingBlock: '32px 24px' }}>
      <div style={{ padding: '0 16px', marginBottom: 20 }}>
        <SectionHeading title="Tìm chúng tôi" />
      </div>
      <div style={{ display: 'grid', gap: 12, padding: '0 16px' }}>
        {STORES.map((store) => (
          <div
            key={store.name}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 16,
              display: 'grid',
              gap: 10,
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>{store.name}</div>
            <a
              href={store.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
                color: 'var(--accent)',
                textDecoration: 'none',
                fontSize: 13,
              }}
            >
              <span style={{ marginTop: 1, flexShrink: 0 }}>
                <IconMapPin size={16} />
              </span>
              <span>{store.address}</span>
            </a>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex' }}>
                <IconPhone size={16} />
              </span>
              <a href={`tel:${store.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {store.phone}
              </a>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Giờ mở cửa: {store.hours}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
