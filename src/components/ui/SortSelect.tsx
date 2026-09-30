'use client'

import { IconChevron } from '@/components/icons'

export interface SortSelectOption {
  value: string
  label: string
}

interface SortSelectProps {
  value: string
  onChange: (value: string) => void
  options: SortSelectOption[]
}

export function SortSelect({ value, onChange, options }: SortSelectProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          border: '1px solid var(--border)',
          borderRadius: 100,
          background: 'var(--bg-card)',
          padding: '8px 32px 8px 16px',
          fontSize: 13,
          fontFamily: 'var(--font-be-vietnam), sans-serif',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span
        style={{
          position: 'absolute',
          right: 12,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconChevron dir="down" size={13} color="var(--text-muted)" />
      </span>
    </div>
  )
}
