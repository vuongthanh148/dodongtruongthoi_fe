// Checkout / Place order

function ScreenCheckout({ onBack, onMenu, onOpenSaved, savedCount = 0, items = [] }) {
  const lines = items.map(it => {
    const p = PRODUCTS.find(x => x.id === it.pid);
    return p ? { ...it, p, line: p.price * it.qty } : null;
  }).filter(Boolean);
  const total = lines.reduce((s, l) => s + l.line, 0);

  return (
    <div data-screen-label="Checkout" className="paper" style={{ background: 'var(--ivory)', minHeight: '100%' }}>
      <TopBar title="Đặt hàng" onMenu={onMenu} onOpenSaved={onOpenSaved} savedCount={savedCount} />

      <div style={{ padding: '12px 16px 4px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 30, fontWeight: 600, color: 'var(--ink)', margin: '6px 0 14px' }}>
          Đặt Hàng
        </h1>
      </div>

      {/* Summary card */}
      <div style={{ margin: '0 16px', background: '#fffdf7', border: '1px solid var(--line)', borderRadius: 10, padding: 16 }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 600, color: 'var(--ink)', paddingBottom: 12, borderBottom: '1px solid var(--line-2)', marginBottom: 12 }}>
          Đơn Hàng
        </div>
        {lines.map(l => (
          <div key={l.pid} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ fontFamily: 'Be Vietnam Pro', fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{l.p.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>x{l.qty} {l.size ? '· ' + l.size : ''}</div>
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 14 }}>{fmtVND(l.line)}</div>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--line-2)', marginTop: 12, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Row label="Tạm tính:" value={fmtVND(total)} />
          <Row label="Phí vận chuyển:" value="Liên hệ sau" />
          <div style={{ borderTop: '1px solid var(--line-2)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}>Tổng:</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: 'var(--son)' }}>{fmtVND(total)}</div>
          </div>
        </div>

        <div style={{
          marginTop: 14, padding: 12, background: 'rgba(120,160,200,0.1)',
          border: '1px solid rgba(120,160,200,0.3)', borderRadius: 6,
          fontSize: 12, color: '#3d5a7a', lineHeight: 1.55,
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>💡 Thông Tin:</div>
          Đơn hàng sẽ chờ xác nhận. Chúng tôi sẽ gọi điện thoại để xác nhận chi tiết.
        </div>
      </div>

      {/* Form */}
      <div style={{ margin: '12px 16px 0', background: '#fffdf7', border: '1px solid var(--line)', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Field label="Số Điện Thoại" required placeholder="0912345678" />
        <Field label="Tên Khách Hàng" placeholder="Nguyễn Văn A" />
        <Field label="Địa Chỉ Giao Hàng" placeholder="123 Đường ABC, Phường XYZ, TP. HCM" />
        <Field label="Ghi Chú" placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)" textarea />

        <button style={{
          marginTop: 6, width: '100%', background: 'var(--son)', color: 'white',
          border: 'none', padding: '14px', borderRadius: 4, cursor: 'pointer',
          fontFamily: 'Be Vietnam Pro', fontWeight: 500, fontSize: 14,
        }}>Đặt Hàng Ngay</button>
        <button onClick={onBack} style={{
          background: 'transparent', border: '1px solid var(--line)',
          padding: '11px', borderRadius: 4, cursor: 'pointer',
          fontFamily: 'Be Vietnam Pro', fontSize: 13, color: 'var(--ink-2)',
        }}>← Quay lại giỏ hàng</button>
      </div>

      <FooterMinimal />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-2)' }}>
      <span>{label}</span>
      <span style={{ color: 'var(--ink)' }}>{value}</span>
    </div>
  );
}
function Field({ label, required, placeholder, textarea }) {
  return (
    <div>
      <div style={{ fontFamily: 'Be Vietnam Pro', fontWeight: 500, fontSize: 13, color: 'var(--ink)', marginBottom: 6 }}>
        {label} {required && <span style={{ color: 'var(--son)' }}>*</span>}
      </div>
      {textarea ? (
        <textarea placeholder={placeholder} rows={3} style={inputStyle} />
      ) : (
        <input placeholder={placeholder} style={inputStyle} />
      )}
    </div>
  );
}
const inputStyle = {
  width: '100%', border: '1px solid var(--line)', background: '#fefcf7',
  borderRadius: 100, padding: '11px 16px', fontFamily: 'Be Vietnam Pro',
  fontSize: 13, color: 'var(--ink)', outline: 'none',
  boxSizing: 'border-box', resize: 'none',
};

window.ScreenCheckout = ScreenCheckout;
