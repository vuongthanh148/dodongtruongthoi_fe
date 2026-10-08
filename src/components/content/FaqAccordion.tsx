'use client'

import { useState } from 'react'
import { IconChevron } from '@/components/icons'

interface FaqAccordionProps {
  items: { q: string; a: string }[]
}

// Single-open accordion in a bordered ivory card. The first item is open by default;
// clicking the open item closes it (board: faq-*).
export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number>(0)

  return (
    <div
      className="overflow-hidden rounded-[10px]"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `faq-panel-${index}`
        return (
          <div key={item.q} style={{ borderTop: index > 0 ? '1px solid var(--border-soft)' : 'none' }}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-4 text-left md:px-6"
              style={{ minHeight: 56, paddingTop: 16, paddingBottom: 16, background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <span
                className="text-base md:text-[18px]"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 600, lineHeight: 1.4, color: 'var(--text-primary)' }}
              >
                {item.q}
              </span>
              <IconChevron dir={isOpen ? 'up' : 'down'} size={16} color="var(--accent)" />
            </button>
            {isOpen ? (
              <div
                id={panelId}
                className="px-4 pb-4 text-[14.5px] md:px-6 md:pb-[22px] md:text-base"
                style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}
              >
                {item.a}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
