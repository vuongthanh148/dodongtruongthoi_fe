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
  md: { padding: '9px 12px', fontSize: 12 },
  lg: { padding: '12px 14px', fontSize: 13 },
}

const variantStyles: Record<BtnVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: 2,
  },
  outline: {
    background: 'transparent',
    color: 'var(--accent)',
    border: '1px solid var(--accent)',
    borderRadius: 2,
  },
  ghost: {
    background: 'transparent',
    color: 'var(--accent)',
    border: 'none',
    borderRadius: 2,
  },
  dark: {
    background: 'var(--bg-dark)',
    color: 'var(--gold)',
    border: '1px solid var(--gold)',
    borderRadius: 2,
  },
}

export function Btn({ variant = 'primary', size = 'md', icon, className, style, children, ...props }: BtnProps) {
  return (
    <button
      className={cn(className)}
      style={{
        fontFamily: 'var(--font-be-vietnam), sans-serif',
        fontWeight: 500,
        letterSpacing: '0.05em',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
        opacity: props.disabled ? 0.6 : 1,
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
