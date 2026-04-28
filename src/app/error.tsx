'use client'

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: 40, textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>Đã xảy ra lỗi</h2>
      <p style={{ margin: '0 0 24px', color: 'var(--text-secondary)', fontSize: 14 }}>{error.message || 'Vui lòng thử lại sau'}</p>
      <button
        onClick={reset}
        style={{
          padding: '10px 20px',
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Thử lại
      </button>
    </div>
  )
}
