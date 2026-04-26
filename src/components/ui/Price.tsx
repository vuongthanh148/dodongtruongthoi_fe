import { formatVnd } from '@/lib/format'

type PriceSize = 'sm' | 'md' | 'lg'

interface PriceProps {
  amount: number
  size?: PriceSize
  strikethrough?: boolean
  className?: string
}

const sizeMap: Record<PriceSize, number> = {
  sm: 13,
  md: 15,
  lg: 22,
}

export function Price({ amount, size = 'md', strikethrough = false, className }: PriceProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--font-cormorant), serif',
        fontWeight: 700,
        color: strikethrough ? 'var(--text-muted)' : 'var(--accent)',
        textDecoration: strikethrough ? 'line-through' : 'none',
        fontSize: sizeMap[size],
      }}
    >
      {formatVnd(amount)}
    </span>
  )
}
