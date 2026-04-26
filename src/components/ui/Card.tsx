import * as React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
  footer?: React.ReactNode
  noPadding?: boolean
}

function Card({ className, header, footer, children, noPadding = false, style: propStyle, ...rest }: CardProps) {
  return (
    <div
      className={cn('rounded-lg overflow-hidden', className)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 2px rgba(42, 31, 26, 0.05)',
        ...propStyle,
      }}
      {...rest}
    >
      {header && (
        <div className="border-b px-6 py-4" style={{ borderColor: 'var(--border-soft)' }}>{header}</div>
      )}
      {noPadding ? children : <div className="px-6 py-4">{children}</div>}
      {footer && (
        <div className="border-t px-6 py-4" style={{ borderColor: 'var(--border-soft)' }}>{footer}</div>
      )}
    </div>
  )
}

export { Card }
export type { CardProps }
