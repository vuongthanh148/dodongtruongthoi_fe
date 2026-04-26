interface IconProps {
  size?: number
  color?: string
}

export function IconTiktok({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="5" fill="#000" />
      <path
        d="M15.3 6c.2 1.5 1.2 2.6 2.7 2.9v2.1c-1.1 0-2-.3-2.8-.8v4.3c0 2.4-2 4.2-4.3 4.2-2.2 0-4-1.7-4-4s1.8-4 4-4c.3 0 .5 0 .8.1v2.3c-.3-.1-.5-.2-.8-.2-1 0-1.9.8-1.9 1.9 0 1 .8 1.9 1.9 1.9 1 0 2-.8 2-1.9V6h2.4z"
        fill="white"
      />
    </svg>
  )
}
