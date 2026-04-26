interface IconProps {
  size?: number
  color?: string
  filled?: boolean
}

export function IconStar({ size = 14, color = 'currentColor', filled = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.2">
      <path d="M12 3l2.6 5.6 6 .7-4.4 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.4 9.3l6-.7L12 3z" />
    </svg>
  )
}
