import Link from 'next/link'
import { cn } from '@/lib/utils'

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
  /** Plain button handler for the CTA (no form or link). */
  onCtaClick?: () => void
  /** Extra controls rendered before the CTA (for example a secondary button or a save toggle). */
  extraActions?: React.ReactNode
}

const CTA_CLASS =
  'flex h-[46px] shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] bg-[var(--accent)] px-[18px] font-body text-[15px] font-semibold text-white no-underline'

/**
 * Sticky order bar for mobile (sm only; md and up put the CTA in the buy box or
 * summary). Parent page must add bottom padding.
 */
export function BottomActionBar({
  totalLabel,
  totalValue,
  ctaLabel,
  ctaHref,
  ctaType = 'button',
  ctaForm,
  ctaDisabled = false,
  onCtaClick,
  extraActions,
}: BottomActionBarProps) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 bg-[var(--bg-page)] md:hidden"
      style={{
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -8px 20px -12px rgba(0,0,0,0.25)',
        padding: '10px 16px calc(10px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="text-[12px] leading-[1.3] text-[var(--text-muted-strong)]">{totalLabel}</div>
        <div className="price-num truncate text-[18px] leading-[1.2]">{totalValue}</div>
      </div>
      {extraActions}
      {ctaHref ? (
        <Link href={ctaHref} className={CTA_CLASS}>
          {ctaLabel}
        </Link>
      ) : (
        <>
          <button
            type={ctaType}
            form={ctaForm}
            onClick={onCtaClick}
            disabled={ctaDisabled}
            className={cn(CTA_CLASS, ctaDisabled && 'cursor-not-allowed opacity-70')}
          >
            {ctaLabel}
          </button>
        </>
      )}
    </div>
  )
}
