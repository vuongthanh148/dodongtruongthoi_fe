import { ORDER_STEPS } from '@/lib/content-data'

// Progress for a live order: horizontal from md, vertical below md (board: sm stacks the steps).
// Cancelled orders do not use the stepper; the page shows the cancelled banner instead.
export function OrderStepper({ status }: { status: string }) {
  const current = ORDER_STEPS.findIndex((s) => s.status === status)
  const last = ORDER_STEPS.length - 1

  return (
    <ol className="flex flex-col md:flex-row" aria-label="Tiến trình đơn hàng">
      {ORDER_STEPS.map((step, i) => {
        const reached = i <= current
        const isCurrent = i === current
        const linkDone = i < current
        return (
          <li
            key={step.status}
            aria-current={isCurrent ? 'step' : undefined}
            className="relative flex items-center gap-3 pb-5 last:pb-0 md:flex-1 md:flex-col md:items-start md:gap-2.5 md:pb-0"
          >
            {i < last && (
              <span
                aria-hidden
                className="absolute left-[11px] top-6 bottom-0 w-px md:hidden"
                style={{ background: linkDone ? 'var(--accent)' : 'var(--border)' }}
              />
            )}
            {i < last && (
              <span
                aria-hidden
                className="absolute left-[30px] right-0 top-[11px] hidden h-px md:block"
                style={{ background: linkDone ? 'var(--accent)' : 'var(--border)' }}
              />
            )}
            <span
              className="relative grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-semibold"
              style={{
                background: reached ? 'var(--accent)' : 'var(--bg-surface-alt)',
                color: reached ? 'var(--primitive-white)' : 'var(--text-muted)',
                border: reached ? 'none' : '1px solid var(--border)',
                boxShadow: isCurrent ? '0 0 0 3px var(--accent-subtle)' : undefined,
              }}
            >
              {reached ? '✓' : i + 1}
            </span>
            <span
              className="text-[14px]"
              style={{
                color: reached ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: isCurrent ? 600 : 400,
              }}
            >
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
