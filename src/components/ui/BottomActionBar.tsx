import Link from 'next/link'

interface BottomActionBarProps {
  totalLabel: string
  totalValue: string
  ctaLabel: string
  /** Renders the CTA as a link. Use this or the button props below. */
  ctaHref?: string
  ctaType?: 'button' | 'submit'
  /** Id of a form outside this bar that the submit button should submit. */
  ctaForm?: string
  ctaDisabled?: boolean
}

const ctaStyle: React.CSSProperties = {
  flexShrink: 0,
  height: 46,
  padding: '0 18px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
  background: 'var(--accent)',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  fontFamily: 'var(--font-be-vietnam), sans-serif',
  fontWeight: 500,
  fontSize: 14,
  textDecoration: 'none',
}

/** Sticky order bar for mobile (below md). Parent page must add bottom padding. */
export function BottomActionBar({
  totalLabel,
  totalValue,
  ctaLabel,
  ctaHref,
  ctaType = 'button',
  ctaForm,
  ctaDisabled = false,
}: BottomActionBarProps) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 md:hidden"
      style={{
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-soft)',
        boxShadow: '0 -8px 20px -12px rgba(0,0,0,0.25)',
        padding: '10px 16px calc(10px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3 }}>{totalLabel}</div>
        <div
          style={{
            fontFamily: 'var(--font-lora), serif',
            fontWeight: 700,
            fontSize: 18,
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--accent)',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {totalValue}
        </div>
      </div>
      {ctaHref ? (
        <Link href={ctaHref} style={ctaStyle}>
          {ctaLabel}
        </Link>
      ) : (
        <button
          type={ctaType}
          form={ctaForm}
          disabled={ctaDisabled}
          style={{
            ...ctaStyle,
            cursor: ctaDisabled ? 'not-allowed' : 'pointer',
            opacity: ctaDisabled ? 0.7 : 1,
          }}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  )
}
