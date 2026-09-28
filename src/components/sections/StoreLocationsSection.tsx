'use client'

import { IconBox, IconMapPin, IconPhone } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { STORES } from '@/lib/constants'

export function StoreLocationsSection() {
  return (
    <section style={{ background: 'var(--bg-page)', paddingBlock: '20px' }}>
      <Container>
        {STORES.map((store) => (
          <div
            key={store.name}
            className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6"
          >
            <div className="shrink-0">
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: 'var(--bronze)',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Showroom & xưởng
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-lora), serif',
                  fontWeight: 600,
                  fontSize: 19,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {store.name}
              </div>
            </div>

            <div className="flex flex-col gap-2 lg:flex-1 lg:flex-row lg:flex-wrap lg:items-center lg:gap-6" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <IconMapPin size={14} color="var(--bronze)" />
                <span>{store.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconPhone size={14} color="var(--bronze)" />
                <span style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 600, fontSize: 16, color: 'var(--accent)' }}>
                  {store.phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <IconBox size={14} color="var(--bronze)" />
                <span>{store.hours}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:flex lg:shrink-0">
              <a
                href={`tel:${store.phone}`}
                className="flex items-center justify-center gap-2"
                style={{
                  padding: '11px 18px',
                  borderRadius: 6,
                  background: 'var(--accent)',
                  color: 'white',
                  fontFamily: 'var(--font-be-vietnam), sans-serif',
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <IconPhone size={14} color="white" /> Gọi ngay
              </a>
              <a
                href={store.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2"
                style={{
                  padding: '11px 18px',
                  borderRadius: 6,
                  background: 'transparent',
                  border: '1px solid var(--accent)',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-be-vietnam), sans-serif',
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <IconMapPin size={14} color="var(--accent)" /> Chỉ đường
              </a>
            </div>
          </div>
        ))}
      </Container>
    </section>
  )
}
