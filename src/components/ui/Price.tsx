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
  md: 14,
  lg: 22,
}

export function Price({ amount, size = 'md', strikethrough = false, className }: PriceProps) {
  return (
    <span
      className={`price-num ${className ?? ''}`}
      style={{
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        color: strikethrough ? 'var(--text-muted)' : 'var(--accent)',
        textDecoration: strikethrough ? 'line-through' : 'none',
        fontSize: sizeMap[size],
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {formatVnd(amount)}
    </span>
  )
}
