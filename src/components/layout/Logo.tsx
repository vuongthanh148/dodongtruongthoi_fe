import Link from 'next/link'
import { DrumMark } from '@/components/icons'
import { SITE_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

export type LogoSize = 'sm' | 'md' | 'lg'
export type LogoTagline = 'always' | 'md' | 'xl' | 'none'
export type LogoVariant = 'default' | 'gold' | 'light'

interface LogoProps {
  /**
   * sm: 28px mark (mobile header). md: 34px mark (tablet header).
   * lg: 34px below xl, 40px at xl (desktop header and footer).
   */
  size?: LogoSize
  /** default: accent wordmark (light pages). gold: footer. light: text on dark or photo. */
  variant?: LogoVariant
  /** always · md (tablet and up) · xl (desktop xl only) · none. */
  tagline?: LogoTagline
  /** Link target. Defaults to home. Pass null for a non-link wrapper. */
  href?: string | null
  className?: string
}

const WORDMARK_SIZE: Record<LogoSize, string> = {
  sm: 'text-[16px]',
  md: 'text-[18px]',
  lg: 'text-[17px] xl:text-[20px]',
}

const TAGLINE_VISIBILITY: Record<Exclude<LogoTagline, 'none'>, string> = {
  always: 'block',
  md: 'hidden md:block',
  xl: 'hidden xl:block',
}

const COLORS: Record<LogoVariant, { wordmark: string; tagline: string; drum: string }> = {
  default: { wordmark: 'var(--accent)', tagline: 'var(--bronze)', drum: 'var(--accent)' },
  gold: { wordmark: 'var(--gold)', tagline: 'var(--text-on-dark-muted)', drum: 'var(--gold)' },
  light: { wordmark: 'var(--text-on-dark)', tagline: 'var(--text-on-dark-muted)', drum: 'var(--text-on-dark)' },
}

// The logo mark is decorative (the wordmark carries the name), so it is aria-hidden.
function Mark({ size, color }: { size: LogoSize; color: string }) {
  if (size === 'sm') return <DrumMark size={28} color={color} />
  if (size === 'md') return <DrumMark size={34} color={color} />
  return (
    <>
      <span className="xl:hidden" aria-hidden>
        <DrumMark size={34} color={color} />
      </span>
      <span className="hidden xl:block" aria-hidden>
        <DrumMark size={40} color={color} />
      </span>
    </>
  )
}

export function Logo({
  size = 'md',
  variant = 'default',
  tagline = 'always',
  href = '/',
  className,
}: LogoProps) {
  const colors = COLORS[variant]
  const content = (
    <>
      <Mark size={size} color={colors.drum} />
      <span className="min-w-0">
        <span
          className={cn(
            'block font-accent leading-none font-semibold tracking-[0.02em] whitespace-nowrap',
            WORDMARK_SIZE[size],
          )}
          style={{ color: colors.wordmark }}
        >
          {SITE_NAME}
        </span>
        {tagline !== 'none' && (
          <span
            className={cn(
              'mt-[3px] font-accent text-[12px] italic tracking-[0.08em]',
              TAGLINE_VISIBILITY[tagline],
            )}
            style={{ color: colors.tagline }}
          >
            tinh hoa làng nghề Việt
          </span>
        )}
      </span>
    </>
  )

  const base = cn('flex min-w-0 items-center gap-2.5', className)

  if (href === null) {
    return <div className={base}>{content}</div>
  }
  return (
    <Link href={href} aria-label={SITE_NAME} className={base}>
      {content}
    </Link>
  )
}
