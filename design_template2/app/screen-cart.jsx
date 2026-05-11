// Cart screen

function ScreenCart({ onBack, onMenu, onOpenSaved, savedCount = 0, items = [], onUpdateQty, onRemove, onCheckout, onContinue }) {
  const lines = items.map(it => {
    const p = PRODUCTS.find(x => x.id === it.pid);
    return p ? { ...it, p, line: p.price * it.qty } : null;
  }).filter(Boolean);
  const total = lines.reduce((s, l) => s + l.line, 0);
  const empty = lines.length === 0;

  return (
    <div data-screen-label="Cart" className="paper" style={{ background: 'var(--ivory)', minHeight: '100%' }}>
      <TopBar title="Giỏ hàng" onMenu={onMenu} onOpenSaved={onOpenSaved} savedCount={savedCount} />

      <div style={{ padding: '12px 16px 4px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 30, fontWeight: 600, color: 'var(--ink)', margin: '6px 0 14px' }}>
          Giỏ Hàng
        </h1>
      </div>

      {empty ? (
        <div style={{ padding: '40px 30px 80px', textAlign: 'center' }}>
          <IconCart size={48} color="var(--bronze)" />
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginTop: 14 }}>
            Giỏ hàng đang trống
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, lineHeight: 1.55 }}>
            Khám phá bộ sưu tập tranh đồng và đỉnh đồng truyền thống của chúng tôi.
          </div>
          <button onClick={onContinue} style={{
            marginTop: 24, background: 'var(--son)', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: 4, fontFamily: 'Be Vietnam Pro', fontSize: 13, cursor: 'pointer',
          }}>Tiếp tục mua sắm</button>
        </div>
      ) : (
        <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lines.map(l => (
            <div key={l.pid + (l.variant || '')} style={{
              background: '#fffdf7', border: '1px solid var(--line)',
              borderRadius: 10, padding: 14,
              display: 'grid', gridTemplateColumns: '1fr auto', gap: 10,
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2 }}>{l.p.title}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.5 }}>
                  {l.size && <div>Kích thước: {l.size}</div>}
                  {l.bg && <div>Tông màu: {l.bg}</div>}
                  {l.frame && <div>Khung: {l.frame}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--line)', borderRadius: 4, overflow: 'hidden' }}>
                  <button onClick={() => onUpdateQty && onUpdateQty(l.pid, l.qty - 1)} style={qtyBtn}><IconMinus size={12} /></button>
                  <div style={{ minWidth: 28, textAlign: 'center', fontFamily: 'Be Vietnam Pro', fontSize: 13 }}>{l.qty}</div>
                  <button onClick={() => onUpdateQty && onUpdateQty(l.pid, l.qty + 1)} style={qtyBtn}><IconPlus size={12} /></button>
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 14 }}>
                  {fmtVND(l.line)}
                </div>
                <button onClick={() => onRemove && onRemove(l.pid)} style={{
                  background: 'transparent', border: 'none', color: 'var(--son)',
                  fontFamily: 'Be Vietnam Pro', fontSize: 12, cursor: 'pointer', padding: 2,
                }}>Xóa</button>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div style={{
            background: '#fffdf7', border: '1px solid var(--line)', borderRadius: 10,
            padding: 18, marginTop: 6,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--line-2)', paddingBottom: 12, marginBottom: 12 }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>Tổng Cộng:</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: 'var(--son)' }}>{fmtVND(total)}</div>
            </div>
            <button onClick={onContinue} style={{
              width: '100%', background: 'transparent', border: '1px solid var(--line)',
              padding: '12px', borderRadius: 4, fontFamily: 'Be Vietnam Pro', fontSize: 13.5,
              color: 'var(--ink)', cursor: 'pointer', marginBottom: 10,
            }}>Tiếp Tục Mua Sắm</button>
            <button onClick={onCheckout} style={{
              width: '100%', background: 'var(--son)', color: 'white', border: 'none',
              padding: '14px', borderRadius: 4, fontFamily: 'Be Vietnam Pro', fontWeight: 500, fontSize: 14, cursor: 'pointer',
            }}>Tiến Hành Đặt Hàng</button>
          </div>
        </div>
      )}

      <FooterMinimal />
    </div>
  );
}

const qtyBtn = {
  width: 28, height: 28, background: 'transparent', border: 'none',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--ink)',
};

window.ScreenCart = ScreenCart;
