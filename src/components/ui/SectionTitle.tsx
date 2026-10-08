import Link from 'next/link'

interface SectionTitleProps {
  eyebrow: string
  title: string
  action?: { label: string; href: string }
  light?: boolean
}

// Home and catalog section header per HANDOFF: eyebrow (.eyebrow) above a Playfair
// title, optional text link at md+ (the board hides it on mobile).
export function SectionTitle({ eyebrow, title, action, light = false }: SectionTitleProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 md:mb-6 lg:mb-7 xl:mb-8">
      <div className="flex min-w-0 flex-col gap-2 md:gap-3">
        <span className="eyebrow" style={light ? { color: 'var(--gold)' } : undefined}>
          {eyebrow}
        </span>
        <h2
          className="font-heading text-[28px] font-medium leading-[1.08] tracking-[-0.01em] md:text-[34px] lg:text-[38px] xl:text-[44px]"
          style={{ color: light ? 'var(--text-on-dark)' : 'var(--text-primary)', textWrap: 'balance' }}
        >
          {title}
        </h2>
      </div>
      {action ? (
        <Link
          href={action.href}
          className="hidden whitespace-nowrap pb-1.5 text-base font-medium md:inline-block"
          style={{
            color: light ? 'var(--gold)' : 'var(--accent)',
            borderBottom: '1px solid currentColor',
            textDecoration: 'none',
          }}
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  )
}
