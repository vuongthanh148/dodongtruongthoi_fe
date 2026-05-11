// Order lookup screen + Order detail screen

function ScreenOrders({ onBack, onMenu, onOpenSaved, savedCount = 0, onOpenOrder }) {
  const [phone, setPhone] = React.useState('');
  const [results, setResults] = React.useState(null);

  const submit = () => {
    if (!phone.trim()) return;
    setResults(ORDERS); // mock — return all
  };

  return (
    <div data-screen-label="Orders Lookup" className="paper" style={{ background: 'var(--ivory)', minHeight: '100%' }}>
      <TopBar title="Đơn hàng của tôi" onBack={onBack} onMenu={onMenu} onOpenSaved={onOpenSaved} savedCount={savedCount} />

      <div style={{ padding: '14px 16px 4px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 600, color: 'var(--ink)', margin: '4px 0 14px' }}>
          Tra Cứu Đơn Hàng
        </h1>
      </div>

      <div style={{ margin: '0 16px', background: '#fffdf7', border: '1px solid var(--line)', borderRadius: 10, padding: 14 }}>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Nhập số điện thoại"
          style={{ ...inputStyle, marginBottom: 10 }}
        />
        <button onClick={submit} style={{
          width: '100%', background: 'var(--son)', color: 'white', border: 'none',
          padding: '12px', borderRadius: 4, fontFamily: 'Be Vietnam Pro', fontSize: 13, cursor: 'pointer',
        }}>Tra cứu →</button>
      </div>

      {results === null ? (
        <div style={{
          margin: '14px 16px 0', padding: 14,
          background: 'rgba(120,160,200,0.1)', border: '1px solid rgba(120,160,200,0.3)',
          borderRadius: 8, color: '#3d5a7a',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontWeight: 600, fontSize: 13 }}>
            <span>📱</span>
            <span>Nhập số điện thoại mà bạn sử dụng khi đặt hàng</span>
          </div>
          <div style={{ fontSize: 12.5, marginTop: 6, paddingLeft: 22, lineHeight: 1.5 }}>
            Chúng tôi sẽ hiển thị tất cả đơn hàng của bạn
          </div>
        </div>
      ) : results.length === 0 ? (
        <div style={{ padding: '40px 30px', textAlign: 'center', color: 'var(--muted)' }}>
          Không tìm thấy đơn hàng với số điện thoại này.
        </div>
      ) : (
        <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {results.map(o => (
            <button key={o.id} onClick={() => onOpenOrder && onOpenOrder(o.id)} style={{
              background: '#fffdf7', border: '1px solid var(--line)',
              borderRadius: 10, padding: 14, textAlign: 'left', cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--bronze)' }}>{o.id}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{o.date}</div>
                </div>
                <StatusBadge status={o.status} label={o.statusLabel} />
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14.5, color: 'var(--ink)', fontWeight: 500, lineHeight: 1.3, marginBottom: 4 }}>
                {o.items[0] && PRODUCTS.find(p => p.id === o.items[0].pid)?.title}
                {o.items.length > 1 && (
                  <span style={{ fontFamily: 'Be Vietnam Pro', fontWeight: 400, fontSize: 12, color: 'var(--muted)' }}> · +{o.items.length - 1} sản phẩm</span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 16 }}>{fmtVND(o.total)}</div>
                <div style={{ color: 'var(--bronze)', fontSize: 12, fontStyle: 'italic', fontFamily: 'Lora, serif' }}>Xem chi tiết →</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <FooterMinimal />
    </div>
  );
}

function StatusBadge({ status, label }) {
  const styles = {
    pending_confirm: { bg: 'rgba(201,169,97,0.15)', fg: '#8a6a1e' },
    shipped:         { bg: 'rgba(80,140,80,0.15)',  fg: '#3a6a3a' },
    cancelled:       { bg: 'rgba(139,30,30,0.1)',   fg: 'var(--son)' },
  }[status] || { bg: 'rgba(0,0,0,0.06)', fg: 'var(--ink-2)' };
  return (
    <span style={{
      fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.1em',
      textTransform: 'uppercase', padding: '4px 8px', borderRadius: 3,
      background: styles.bg, color: styles.fg, whiteSpace: 'nowrap',
    }}>{label}</span>
  );
}

function ScreenOrderDetail({ orderId, onBack, onMenu, onOpenSaved, savedCount = 0 }) {
  const o = ORDERS.find(x => x.id === orderId) || ORDERS[0];
  return (
    <div data-screen-label="Order Detail" className="paper" style={{ background: 'var(--ivory)', minHeight: '100%' }}>
      <TopBar title="Chi tiết đơn hàng" onBack={onBack} onMenu={onMenu} onOpenSaved={onOpenSaved} savedCount={savedCount} />

      {o.status === 'pending_confirm' && (
        <div style={{
          margin: '12px 16px 0', padding: 12,
          background: 'rgba(80,140,80,0.1)', border: '1px solid rgba(80,140,80,0.3)',
          borderRadius: 6, color: '#2f5a2f', fontSize: 12.5, lineHeight: 1.5,
        }}>
          ✓ <b>Đặt hàng thành công.</b> Chúng tôi sẽ gọi xác nhận trong 1–2 giờ làm việc.
        </div>
      )}

      <div style={{ padding: '14px 16px 4px' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--bronze)' }}>{o.id}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 4 }}>
          <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Đặt ngày {o.date}</div>
          <StatusBadge status={o.status} label={o.statusLabel} />
        </div>
      </div>

      <div style={{ margin: '14px 16px 0', background: '#fffdf7', border: '1px solid var(--line)', borderRadius: 10, padding: 14 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 10 }}>Khách hàng</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--ink-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><IconPhone size={13} color="var(--bronze)" /> 0912 345 678</div>
          <div>Nguyễn Văn A</div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}><IconPin size={13} color="var(--bronze)" /> 123 Lê Lợi, Q.1, TP.HCM</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Ghi chú: Giao giờ hành chính, gọi trước 30 phút.</div>
        </div>
      </div>

      <div style={{ margin: '12px 16px 0', background: '#fffdf7', border: '1px solid var(--line)', borderRadius: 10, padding: 14 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 10 }}>Sản phẩm</div>
        {o.items.map((it, i) => {
          const p = PRODUCTS.find(x => x.id === it.pid);
          if (!p) return null;
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 10, padding: '10px 0', borderBottom: i < o.items.length - 1 ? '1px solid var(--line-2)' : 'none', alignItems: 'center' }}>
              <ArtPiece bg={p.defaultBg} frame={p.defaultFrame} label={p.title} pad={4} aspect="1/1" />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{p.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{it.sub} · x{it.qty}</div>
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 14, color: 'var(--son)' }}>{fmtVND(p.price * it.qty)}</div>
            </div>
          );
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line-2)' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 600 }}>Tổng</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 700, color: 'var(--son)' }}>{fmtVND(o.total)}</div>
        </div>
      </div>

      <FooterMinimal />
    </div>
  );
}

window.ScreenOrders = ScreenOrders;
window.ScreenOrderDetail = ScreenOrderDetail;
