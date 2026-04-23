import * as React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
  footer?: React.ReactNode
}

function Card({ className, header, footer, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white shadow-sm',
        className
      )}
      {...props}
    >
      {header && (
        <div className="border-b border-gray-200 px-6 py-4">{header}</div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="border-t border-gray-200 px-6 py-4">{footer}</div>
      )}
    </div>
  )
}

export { Card }
export type { CardProps }
