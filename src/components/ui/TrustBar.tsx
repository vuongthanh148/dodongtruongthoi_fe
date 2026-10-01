export function TrustBar() {
  const items = [
    { title: 'Đồng nguyên chất 99%', subtitle: 'Có giấy bảo hành chất liệu' },
    { title: 'Chế tác thủ công', subtitle: 'Nghệ nhân làng Đại Bái' },
    { title: 'Bảo hành 12 tháng', subtitle: 'Bảo dưỡng trọn đời' },
    { title: 'Giao & lắp đặt', subtitle: 'Toàn quốc 5–7 ngày' },
  ]

  return (
    <section
      className="mx-auto w-full lg:max-w-[1344px] grid grid-cols-2 md:grid-cols-4"
      style={{
        background: 'var(--bg-page)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {items.map((item, index) => {
        // On mobile (2-column): left border on odd indices (1, 3)
        // On md+ (4-column): left border on every index except 0
        const mobileLeftBorder = index % 2 === 1 ? 'border-l' : 'border-l-0'
        const desktopLeftBorder = index > 0 ? 'md:border-l' : 'md:border-l-0'
        return (
          <div
            key={item.title}
            style={{
              padding: 'clamp(12px, 2vw, 16px) clamp(10px, 2vw, 20px)',
              borderBottom: '1px solid var(--border)',
              borderLeftColor: 'var(--border)',
            }}
            className={`${mobileLeftBorder} ${desktopLeftBorder}`}
          >
            <div
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontSize: 'clamp(14px, 2vw, 16px)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                marginBottom: 2,
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                fontSize: 'clamp(11.5px, 1.5vw, 13px)',
                color: 'var(--text-muted)',
                marginTop: 2,
                lineHeight: 1.3,
              }}
            >
              {item.subtitle}
            </div>
          </div>
        )
      })}
    </section>
  )
}