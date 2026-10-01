import { cn } from '@/lib/utils'
import * as React from 'react'

type ContainerProps = React.HTMLAttributes<HTMLDivElement>

function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[1344px] px-4 md:px-6 lg:px-8', className)} {...props}>
      {children}
    </div>
  )
}

export { Container }
