import { cn } from '@/lib/utils'

type HeadingSize = 'sm' | 'md' | 'lg' | 'xl'
type HeadingAs = 'h1' | 'h2' | 'h3' | 'div'

interface HeadingProps {
  children: React.ReactNode
  size?: HeadingSize
  as?: HeadingAs
  color?: string
  className?: string
  style?: React.CSSProperties
}

const sizeMap: Record<HeadingSize, number> = {
  sm: 16,
  md: 20,
  lg: 22,
  xl: 28,
}

// HANDOFF.md:96-97: --font-heading (Playfair) is only for real headings, minimum
// 20px; anything smaller is a card/dialog title and uses --font-body instead.
const fontMap: Record<HeadingSize, string> = {
  sm: 'var(--font-body)',
  md: 'var(--font-heading)',
  lg: 'var(--font-heading)',
  xl: 'var(--font-heading)',
}

export function Heading({ children, size = 'md', as = 'div', color = 'var(--text-primary)', className, style }: HeadingProps) {
  const Comp = as
  return (
    <Comp
      className={cn(className)}
      style={{
        fontFamily: fontMap[size],
        fontWeight: 600,
        lineHeight: 1.1,
        fontSize: sizeMap[size],
        color,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </Comp>
  )
}
