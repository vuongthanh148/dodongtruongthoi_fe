interface IconProps {
  size?: number
  color?: string
}

export function IconFacebook({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#1877f2" />
      <path
        d="M13.5 21v-7h2.2l.3-2.5h-2.5V10c0-.7.2-1.2 1.2-1.2h1.3V6.6c-.6-.1-1.3-.1-2-.1-2 0-3.3 1.2-3.3 3.4v1.6H8.5V14h2.2v7h2.8z"
        fill="white"
      />
    </svg>
  )
}
