interface IconProps {
  size?: number
  color?: string
}

export function IconFilter({ size = 16, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
      <path d="M3 5h18M6 12h12M10 19h4" />
    </svg>
  )
}
