interface CatPillProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

export function CatPill({ active, onClick, children }: CatPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: 999,
        padding: '7px 14px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        border: '1px solid',
        borderColor: active ? 'var(--text-primary)' : 'var(--border)',
        background: active ? 'var(--text-primary)' : 'transparent',
        color: active ? 'var(--bg-page)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-be-vietnam), sans-serif',
        fontSize: 12.5,
        lineHeight: 1,
        cursor: 'pointer',
        transition: 'all 180ms ease',
      }}
    >
      {children}
    </button>
  )
}