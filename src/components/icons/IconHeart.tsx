interface IconProps {
  size?: number
  color?: string
  filled?: boolean
}

export function IconHeart({ size = 18, color = 'currentColor', filled = false }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </svg>
  )
}
