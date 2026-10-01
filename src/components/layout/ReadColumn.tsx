interface ReadColumnProps {
  children: React.ReactNode
  className?: string
}

// Centered long-form reading column, capped at 760px per the design spec
// (FAQ, Hướng dẫn mua hàng, Cẩm nang articles).
export function ReadColumn({ children, className }: ReadColumnProps) {
  return <div className={`mx-auto w-full max-w-[760px] ${className ?? ''}`}>{children}</div>
}
