interface IconProps {
  size?: number
  color?: string
}

export function DrumMark({ size = 34, color = 'var(--accent)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.4">
      <circle cx="32" cy="32" r="28" />
      <circle cx="32" cy="32" r="22" />
      <circle cx="32" cy="32" r="14" />
      <circle cx="32" cy="32" r="6" />
      <g transform="translate(32 32)">
        <line x1="-5" y1="0" x2="5" y2="0" />
        <line x1="0" y1="-5" x2="0" y2="5" />
        <line x1="-3.6" y1="-3.6" x2="3.6" y2="3.6" />
        <line x1="3.6" y1="-3.6" x2="-3.6" y2="3.6" />
      </g>
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16
        return <line key={i} x1="32" y1="8" x2="32" y2="11" transform={`rotate(${angle} 32 32)`} />
      })}
    </svg>
  )
}
