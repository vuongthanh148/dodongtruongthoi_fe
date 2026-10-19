import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BtnVariant = 'primary' | 'outline' | 'ghost' | 'dark'
type BtnSize = 'sm' | 'md' | 'lg'

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: BtnSize
  icon?: React.ReactNode
}

const sizeStyles: Record<BtnSize, React.CSSProperties> = {
  sm: { padding: '6px 10px', fontSize: 11 },
  md: { padding: '0 22px', fontSize: 15, height: 50 },
  lg: { padding: '12px 14px', fontSize: 13 },
}

const variantStyles: Record<BtnVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: 6,
  },
  outline: {
    background: 'transparent',
    color: 'var(--accent)',
    border: '1.5px solid var(--accent)',
    borderRadius: 6,
  },
  ghost: {
    background: 'transparent',
    color: 'var(--accent)',
    border: 'none',
    borderRadius: 6,
  },
  dark: {
    background: 'var(--bg-dark)',
    color: 'var(--gold)',
    border: '1px solid var(--gold)',
    borderRadius: 6,
  },
}

export function Btn({ variant = 'primary', size = 'md', icon, className, style, children, ...props }: BtnProps) {
  return (
    <button
      className={cn(className)}
      style={{
        fontFamily: 'var(--font-body), sans-serif',
        fontWeight: 600,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
        opacity: props.disabled ? 0.45 : 1,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
      {icon}
    </button>
  )
}
