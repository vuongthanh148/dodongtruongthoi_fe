export function TrustBar() {
  const items = [
    { value: '10 năm', label: 'Bảo hành chống xỉn' },
    { value: '100%', label: 'Đồng nguyên chất' },
    { value: 'COD', label: 'Thanh toán khi nhận' },
  ]

  return (
    <section
      style={{
        background: 'var(--bg-dark)',
        color: 'var(--text-on-dark)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        borderTop: '1px solid rgba(244,237,224,0.08)',
        borderBottom: '1px solid rgba(244,237,224,0.08)',
      }}
    >
      {items.map((item, index) => (
        <div
          key={item.label}
          style={{
            padding: '16px 12px',
            textAlign: 'center',
            borderRight: index < items.length - 1 ? '1px solid rgba(244,237,224,0.08)' : 'none',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 17,
              fontWeight: 600,
              color: 'var(--gold)',
              lineHeight: 1.1,
              marginBottom: 4,
            }}
          >
            {item.value}
          </div>
          <div
            style={{
              fontSize: 9.5,
              color: 'rgba(244,237,224,0.62)',
              marginTop: 3,
              lineHeight: 1.3,
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </section>
  )
}