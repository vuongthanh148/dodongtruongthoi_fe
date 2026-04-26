import { cn } from '@/lib/utils'

interface LabelProps {
  children: React.ReactNode
  color?: 'bronze' | 'gold' | 'muted'
  className?: string
  style?: React.CSSProperties
}

const colorMap: Record<NonNullable<LabelProps['color']>, string> = {
  bronze: 'var(--bronze)',
  gold: 'var(--gold)',
  muted: 'var(--text-muted)',
}

export function Label({ children, color = 'bronze', className, style }: LabelProps) {
  return (
    <div
      className={cn(className)}
      style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: 13,
        letterSpacing: '0.2em',
        color: colorMap[color],
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
