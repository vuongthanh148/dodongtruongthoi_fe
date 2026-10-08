import { ORDER_STATUS_LABELS } from '@/lib/content-data'

// Badge colours from the board (DStatus): gold for waiting, success for shipped/done, accent for cancelled.
const BADGE_STYLE: Record<string, { background: string; color: string }> = {
  pending_confirm: { background: 'var(--gold-subtle)', color: 'var(--primitive-gold-700)' },
  confirmed: { background: 'var(--gold-subtle)', color: 'var(--primitive-gold-700)' },
  processing: { background: 'var(--bg-surface-alt)', color: 'var(--bronze)' },
  shipped: { background: 'var(--color-success-subtle)', color: 'var(--color-success)' },
  completed: { background: 'var(--color-success-subtle)', color: 'var(--color-success)' },
  cancelled: { background: 'var(--accent-subtle)', color: 'var(--accent)' },
}

export function OrderStatusBadge({ status }: { status: string }) {
  const tone = BADGE_STYLE[status] ?? { background: 'var(--bg-surface-alt)', color: 'var(--text-secondary)' }
  return (
    <span
      className="inline-flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-semibold"
      style={tone}
    >
      {ORDER_STATUS_LABELS[status] ?? status}
    </span>
  )
}
