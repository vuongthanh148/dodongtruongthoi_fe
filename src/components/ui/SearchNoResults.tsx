'use client'

import Link from 'next/link'
import { SEARCH_EMPTY_COPY } from '@/lib/content-data'

interface SearchNoResultsProps {
  query: string
  /** Compact layout for the header dropdown; the overlay uses the default. */
  compact?: boolean
  onNavigate?: () => void
}

// No-results state for search (board: st-search-*). Title, query line, tips and two
// suggestion links: categories and all products.
export function SearchNoResults({ query, compact = false, onNavigate }: SearchNoResultsProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 10 : 14,
        padding: compact ? '16px 12px' : '24px 4px',
        color: 'var(--text-secondary)',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: compact ? 16 : 20,
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}
        >
          {SEARCH_EMPTY_COPY.title}
        </div>
        <p style={{ margin: '6px 0 0', fontSize: compact ? 13 : 15, lineHeight: 1.6 }}>
          {SEARCH_EMPTY_COPY.body(query)}
        </p>
      </div>

      <div style={{ fontSize: compact ? 13 : 14, fontWeight: 600, color: 'var(--text-primary)' }}>
        {SEARCH_EMPTY_COPY.tipsTitle}
      </div>
      <ul
        style={{
          margin: 0,
          paddingLeft: 20,
          fontSize: compact ? 13 : 14,
          lineHeight: 1.7,
        }}
      >
        {SEARCH_EMPTY_COPY.tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {SEARCH_EMPTY_COPY.suggestions.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            onClick={onNavigate}
            style={{
              padding: compact ? '6px 12px' : '9px 14px',
              borderRadius: 18,
              border: '1.5px solid var(--accent)',
              color: 'var(--accent)',
              fontSize: compact ? 13 : 14,
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
