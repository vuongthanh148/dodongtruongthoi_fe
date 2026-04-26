interface IconProps {
  size?: number
  color?: string
}

export function IconMessenger({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#0084ff" />
      <path d="M7 14.5l3-3 2.2 2L16 10l-3 4-2.2-2L7 14.5z" fill="white" />
    </svg>
  )
}
