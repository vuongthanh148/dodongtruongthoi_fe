'use client'

import { IconMapPin, IconPhone } from '@/components/icons'
import { STORES } from '@/lib/constants'

export function StoreLocationsSection() {
  return (
    <section style={{ paddingBlock: '28px 0', paddingInline: '16px' }}>
      <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 14 }}>
        Showroom & xưởng
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {STORES.map((store) => (
          <div
            key={store.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontWeight: 600,
                fontSize: 19,
                color: 'var(--text-primary)',
              }}
            >
              {store.name}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12.5, color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ flexShrink: 0, marginTop: 2 }}>
                  <IconMapPin size={13} color="var(--bronze)" />
                </span>
                <span>{store.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconPhone size={13} color="var(--bronze)" />
                <span style={{ fontFamily: 'var(--font-cormorant), serif', fontWeight: 600, fontSize: 16, color: 'var(--accent)' }}>{store.phone}</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', paddingLeft: 21 }}>
                {store.hours}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
              <button style={{ padding: '11px', borderRadius: 2, background: 'var(--accent)', border: 'none', color: 'white', fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 12, cursor: 'pointer' }}>
                Gọi ngay
              </button>
              <button style={{ padding: '11px', borderRadius: 2, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 12, cursor: 'pointer' }}>
                Chỉ đường
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
