import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>Không tìm thấy trang</h2>
      <p style={{ margin: '0 0 24px', color: 'var(--text-secondary)', fontSize: 14 }}>Trang bạn tìm kiếm không tồn tại</p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          background: 'var(--accent)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Về trang chủ
      </Link>
    </div>
  )
}
