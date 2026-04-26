interface IconProps {
  size?: number
  color?: string
  dir?: 'right' | 'left' | 'up' | 'down'
}

const chevronPath: Record<NonNullable<IconProps['dir']>, string> = {
  right: 'M9 6l6 6-6 6',
  left: 'M15 6l-6 6 6 6',
  down: 'M6 9l6 6 6-6',
  up: 'M6 15l6-6 6 6',
}

export function IconChevron({ size = 16, color = 'currentColor', dir = 'right' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={chevronPath[dir]} />
    </svg>
  )
}
