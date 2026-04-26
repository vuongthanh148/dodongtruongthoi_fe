interface DongsonBorderProps {
  className?: string
}

export function DongsonBorder({ className }: DongsonBorderProps) {
  return <div className={`dongson-border ${className ?? ''}`.trim()} aria-hidden="true" />
}
