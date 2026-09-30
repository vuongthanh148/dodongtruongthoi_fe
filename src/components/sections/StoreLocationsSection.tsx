'use client'

import { IconBox, IconMapPin, IconPhone } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { MapEmbed } from '@/components/ui/MapEmbed'
import { STORES } from '@/lib/constants'

export function StoreLocationsSection() {
  return (
    <section style={{ background: 'var(--bg-surface-alt)', borderTop: '1px solid var(--border)' }}>
      <Container className="py-7 md:py-9">
        {STORES.map((store) => (
          <div key={store.name} className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
            <div className="flex flex-col gap-3.5">
              <div>
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
                    fontSize: 22,
                    color: 'var(--text-primary)',
                  }}
                >
                  {store.name}
                </div>
              </div>

              <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center lg:gap-6" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-2">
                  <IconMapPin size={15} color="var(--bronze)" />
                  <span>{store.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone size={15} color="var(--bronze)" />
                  <span style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 700, fontSize: 17, color: 'var(--accent)' }}>
                    {store.phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IconBox size={15} color="var(--bronze)" />
                  <span>{store.hours}</span>
                </div>
              </div>

              <div className="grid max-w-[380px] grid-cols-2 gap-2.5">
                <a
                  href={`tel:${store.phone}`}
                  className="flex items-center justify-center gap-2"
                  style={{
                    height: 50,
                    borderRadius: 6,
                    background: 'var(--accent)',
                    color: 'white',
                    fontFamily: 'var(--font-be-vietnam), sans-serif',
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <IconPhone size={16} color="white" /> Gọi ngay
                </a>
                <a
                  href={store.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2"
                  style={{
                    height: 50,
                    borderRadius: 6,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--accent)',
                    color: 'var(--accent)',
                    fontFamily: 'var(--font-be-vietnam), sans-serif',
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <IconMapPin size={16} color="var(--accent)" /> Chỉ đường
                </a>
              </div>
            </div>

            <MapEmbed src={store.mapEmbedUrl} title={`Bản đồ ${store.name}`} height={230} />
          </div>
        ))}
      </Container>
    </section>
  )
}
