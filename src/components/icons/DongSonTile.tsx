interface IconProps {
  size?: number
  color?: string
  opacity?: number
}

export function DongSonTile({ size = 20, color = 'var(--bronze)', opacity = 0.4 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="0.8" opacity={opacity}>
      <path d="M0 10h20M10 0v20" />
      <circle cx="10" cy="10" r="3" />
      <path d="M0 0l10 10M20 0L10 10M0 20l10-10M20 20L10 10" />
    </svg>
  )
}
