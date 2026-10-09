'use client'

import { useState } from 'react'
import { Container } from '@/components/layout/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import {
  CRAFT_DETAIL_COPY,
  CRAFT_DETAIL_HOTSPOTS,
  CRAFT_DETAIL_IMAGE,
  CRAFT_STEPS,
  type CraftDetailHotspot,
} from '@/lib/content-data'

// Zoom factor for the crop thumbnails: the image is shown at ZOOM×100% size,
// backgroundPosition then centers that zoomed image on the hotspot's (x, y).
const ZOOM = 4.5

function cropPos(x: number, y: number, zoom: number): string {
  const px = ((x * zoom - 0.5) / (zoom - 1)) * 100
  const py = ((y * zoom - 0.5) / (zoom - 1)) * 100
  return `${px}% ${py}%`
}

function HotspotCrop({
  hotspot,
  active,
  onSelect,
}: {
  hotspot: CraftDetailHotspot
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onSelect}
      className="flex min-w-0 flex-col gap-2.5 text-left"
      style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-primary)' }}
    >
      <div
        className="relative aspect-[3/2] overflow-hidden rounded-[8px]"
        style={{
          backgroundImage: `url(${CRAFT_DETAIL_IMAGE})`,
          backgroundSize: `${ZOOM * 100}%`,
          backgroundPosition: cropPos(hotspot.x, hotspot.y, ZOOM),
          boxShadow: active ? '0 0 0 2px var(--gold), 0 16px 30px -16px rgba(0,0,0,0.5)' : 'inset 0 0 0 1px var(--border)',
          transition: 'box-shadow 200ms',
        }}
      >
        <span
          className="absolute left-2.5 top-2.5 grid h-[26px] w-[26px] place-items-center rounded-full text-[14.5px] font-bold"
          style={{
            background: active ? 'var(--gold)' : 'rgba(20,14,9,0.7)',
            color: active ? 'var(--text-primary)' : 'var(--text-on-dark)',
          }}
        >
          {hotspot.n}
        </span>
      </div>
      <div>
        <div className="text-[17px] font-semibold leading-[1.25] md:text-[18px]" style={{ fontFamily: 'var(--font-body)' }}>
          {hotspot.title}
        </div>
        <div className="mt-1 text-[15.5px] leading-[1.55] text-pretty" style={{ color: 'var(--text-secondary)' }}>
          {hotspot.body}
        </div>
      </div>
    </button>
  )
}

// "Chi tiết thủ công": a macro photo with clickable hotspots revealing zoomed
// crops of craftsmanship detail, plus the six craft steps below.
export function CraftDetailSection() {
  const [active, setActive] = useState(CRAFT_DETAIL_HOTSPOTS[0]?.n ?? 1)
  if (CRAFT_STEPS.length === 0) return null

  return (
    <Container>
      <section className="mt-10 md:mt-14 lg:mt-16 xl:mt-[72px]">
        <SectionTitle eyebrow={CRAFT_DETAIL_COPY.eyebrow} title={CRAFT_DETAIL_COPY.title} />

        <div className="grid grid-cols-1 items-start gap-6 md:gap-7 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
          <div className="relative overflow-hidden rounded-[10px]" style={{ background: 'var(--bg-surface-alt)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CRAFT_DETAIL_IMAGE} alt="Chi tiết chạm nổi trên tranh đồng" className="block w-full" />
            {CRAFT_DETAIL_HOTSPOTS.map((h) => (
              <button
                key={h.n}
                type="button"
                onClick={() => setActive(h.n)}
                aria-label={h.title}
                className="absolute grid h-[28px] w-[28px] place-items-center rounded-full text-[14px] font-bold md:h-[32px] md:w-[32px] md:text-[15.5px]"
                style={{
                  left: `${h.x * 100}%`,
                  top: `${h.y * 100}%`,
                  transform: 'translate(-50%,-50%)',
                  border: '2px solid var(--bg-card)',
                  background: active === h.n ? 'var(--gold)' : 'rgba(20,14,9,0.72)',
                  color: active === h.n ? 'var(--text-primary)' : 'var(--bg-card)',
                  boxShadow: active === h.n ? '0 0 0 6px var(--border-gold)' : '0 4px 10px rgba(0,0,0,0.35)',
                  transition: 'all 200ms',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {h.n}
              </button>
            ))}
          </div>

          <div className="noscroll flex gap-3 overflow-x-auto md:grid md:grid-cols-2 md:gap-5 md:overflow-visible lg:gap-6">
            {CRAFT_DETAIL_HOTSPOTS.map((h) => (
              <div key={h.n} className="w-[72%] shrink-0 md:w-auto">
                <HotspotCrop hotspot={h} active={active === h.n} onSelect={() => setActive(h.n)} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t pt-5 md:mt-9 md:pt-6" style={{ borderColor: 'var(--border)' }}>
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4 md:mb-6">
            <div className="text-[16px] font-semibold md:text-[17px]" style={{ color: 'var(--text-primary)' }}>
              {CRAFT_DETAIL_COPY.stepsTitle}
            </div>
            <div className="max-w-[560px] text-[14px] leading-[1.5]" style={{ color: 'var(--text-muted-strong)' }}>
              {CRAFT_DETAIL_COPY.note}
            </div>
          </div>
          <ol className="m-0 grid list-none grid-cols-2 gap-x-3.5 gap-y-[18px] p-0 md:grid-cols-3 md:gap-x-5 md:gap-y-6 xl:grid-cols-6">
            {CRAFT_STEPS.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-1.5">
                <span
                  className="grid h-[30px] w-[30px] place-items-center rounded-full border text-[15px]"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)', fontFamily: 'var(--font-body)' }}
                >
                  {i + 1}
                </span>
                <div className="mt-1 text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {step.title}
                </div>
                <div className="text-[14px] leading-[1.5] text-pretty" style={{ color: 'var(--text-muted-strong)' }}>
                  {step.body}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Container>
  )
}
