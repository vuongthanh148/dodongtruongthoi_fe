interface IconProps {
  size?: number
  color?: string
}

export function IconZalo({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="16" rx="4" fill="#0068ff" />
      <text x="12" y="15" fontFamily="var(--font-be-vietnam), sans-serif" fontWeight="700" fontSize="9" fill="white" textAnchor="middle">
        Zalo
      </text>
      <path d="M9 19l-2 3v-3z" fill="#0068ff" />
    </svg>
  )
}
