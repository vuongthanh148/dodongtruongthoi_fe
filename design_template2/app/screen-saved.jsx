// Saved products screen

function ScreenSaved({ onBack, savedIds = [], onOpenProduct, onRemove }) {
  const saved = (savedIds || [])
    .map(id => PRODUCTS.find(x => x.id === id))
    .filter(Boolean);

  return (
    <div data-screen-label="04 Saved" className="paper" style={{ background: 'var(--ivory)', minHeight: '100%' }}>
      <TopBar title="Sản phẩm đã lưu" onBack={onBack} />

      <div style={{ padding: '10px 16px 6px' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.1 }}>
          Đã lưu
        </div>
        <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 12, color: 'var(--bronze)' }}>
          {saved.length} tác phẩm được yêu thích
        </div>
      </div>

      {saved.length === 0 ? (
        <div style={{ padding: '60px 30px', textAlign: 'center' }}>
          <DrumMark size={52} color="var(--bronze)" />
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 19, fontWeight: 600, color: 'var(--ink)', marginTop: 14 }}>
            Chưa có sản phẩm nào
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6, lineHeight: 1.55 }}>
            Bấm nút <IconHeart size={11} color="var(--son)" /> ở trang chi tiết để lưu các tác phẩm yêu thích.
          </div>
        </div>
      ) : (
        <div style={{ padding: '14px 16px 100px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {saved.map(p => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 12,
              background: '#fffdf7', border: '1px solid var(--line)',
              borderRadius: 8, padding: 10, alignItems: 'center',
            }}>
              <div onClick={() => onOpenProduct && onOpenProduct(p.id)} style={{ cursor: 'pointer' }}>
                <ArtPiece bg={p.defaultBg} frame={p.defaultFrame} label={p.title} pad={5} aspect="1/1" />
              </div>
              <div onClick={() => onOpenProduct && onOpenProduct(p.id)} style={{ cursor: 'pointer', minWidth: 0 }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 15, color: 'var(--ink)', lineHeight: 1.2 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{p.subtitle}</div>
                <div style={{ marginTop: 6, fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 15 }}>
                  {fmtVND(p.price)}
                </div>
              </div>
              <button onClick={() => onRemove && onRemove(p.id)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--son)', padding: 6,
              }}>
                <IconHeart size={20} color="var(--son)" filled />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

window.ScreenSaved = ScreenSaved;
