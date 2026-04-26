import type { MouseEventHandler } from 'react'
import { BG_TONES } from '@/lib/data'

interface VariantSwatchProps {
  tone: string
  active?: boolean
  size?: number
  onClick?: MouseEventHandler<HTMLDivElement>
}

export function VariantSwatch({ tone, active = false, size = 22, onClick }: VariantSwatchProps) {
  const toneInfo = BG_TONES.find((item) => item.id === tone) ?? BG_TONES[0]

  return (
    <div
      role="presentation"
      onClick={onClick}
      title={toneInfo.name}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: toneInfo.hex,
        border: active ? '2px solid var(--accent)' : '1.5px solid rgba(42,31,26,0.2)',
        padding: 0,
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: active
          ? '0 0 0 2px rgba(139,30,30,0.15)'
          : 'inset 0 1px 2px rgba(0,0,0,0.25)',
        transition: 'all 150ms ease',
      }}
    />
  )
}
