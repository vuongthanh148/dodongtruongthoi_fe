export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 12, color: 'var(--admin-muted)' }}>{label}</span>
      {children}
    </label>
  )
}
