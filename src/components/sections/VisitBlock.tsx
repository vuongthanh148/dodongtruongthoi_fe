import type { ReactNode } from 'react'
import { IconBox, IconMapPin, IconPhone } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { MapEmbed } from '@/components/ui/MapEmbed'
import { HOTLINE_TEL, STORES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const BTN =
  'flex h-[50px] items-center justify-center gap-2 whitespace-nowrap rounded-[6px] px-[22px] font-body text-[15px] font-semibold no-underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--accent-subtle)]'
const BTN_PRIMARY = 'bg-[var(--accent)] text-white'
const BTN_SECONDARY = 'border-[1.5px] border-[var(--accent)] bg-[var(--bg-card)] text-[var(--accent)]'

function InfoRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[22px_minmax(0,1fr)] items-center gap-2.5">
      {icon}
      {children}
    </div>
  )
}

// Showroom band above the footer. Every page renders it except /lien-he.
// Values come only from STORES (and HOTLINE_TEL) in lib/constants.ts.
export function VisitBlock() {
  const store = STORES[0]
  const hotline = store.phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')

  return (
    <section className="border-t border-[var(--border)] bg-[var(--bg-surface-alt)]">
      <Container className="grid grid-cols-1 items-center gap-5 py-7 md:gap-6 md:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
        <div className="flex min-w-0 flex-col gap-3.5">
          <div>
            <div className="eyebrow">Showroom & xưởng</div>
            <h2 className="mt-1.5 font-heading text-[22px] leading-[1.2] font-semibold md:text-[24px] xl:text-[26px]">
              {store.name}
            </h2>
          </div>

          <div className="flex flex-col gap-2.5 text-[15px] md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-2.5">
            <InfoRow icon={<IconMapPin size={18} color="var(--bronze)" />}>
              <span className="md:whitespace-nowrap">{store.address}</span>
            </InfoRow>
            <InfoRow icon={<IconPhone size={18} color="var(--bronze)" />}>
              <span className="font-body text-[19px] font-bold whitespace-nowrap tabular-nums text-[var(--accent)]">
                {hotline}
              </span>
            </InfoRow>
            <InfoRow icon={<IconBox size={18} color="var(--bronze)" />}>
              <span className="whitespace-nowrap text-[var(--text-secondary)]">{store.hours}</span>
            </InfoRow>
          </div>

          <div className="mt-1.5 grid max-w-none grid-cols-2 gap-2.5 lg:max-w-[380px]">
            <a href={HOTLINE_TEL} className={cn(BTN, BTN_PRIMARY)}>
              <IconPhone size={16} color="white" />
              Gọi ngay
            </a>
            <a
              href={store.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(BTN, BTN_SECONDARY)}
            >
              <IconMapPin size={16} color="var(--accent)" />
              Chỉ đường
            </a>
          </div>
        </div>

        <div className="h-[200px] min-w-0 md:h-[240px]">
          <MapEmbed src={store.mapEmbedUrl} title={`Bản đồ ${store.name}`} height="100%" />
        </div>
      </Container>
    </section>
  )
}
