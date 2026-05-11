// Menu drawer screen — full menu per inventory

function ScreenMenu({ onClose, onNavigate, savedCount = 0, cartCount = 0 }) {
  const explore = [
    { id: 'home', label: 'Trang chủ', hint: 'Bộ sưu tập nổi bật' },
  ];
  const account = [
    { id: 'saved',    label: 'Sản phẩm đã lưu', hint: `${savedCount} mục` },
    { id: 'cart',     label: 'Giỏ hàng',         hint: cartCount > 0 ? `${cartCount} sản phẩm` : 'Đặt hàng nhanh' },
    { id: 'orders',   label: 'Đơn hàng của tôi', hint: 'Tra cứu bằng số điện thoại' },
  ];
  const info = [
    { id: 'craft',   label: 'Câu chuyện làng nghề' },
    { id: 'guide',   label: 'Hướng dẫn mua hàng'   },
    { id: 'faq',     label: 'Câu hỏi thường gặp'   },
    { id: 'ship',    label: 'Giao hàng & bảo hành' },
    { id: 'contact', label: 'Liên hệ'              },
  ];

  return (
    <div data-screen-label="Menu Drawer" style={{ position: 'absolute', inset: 0, zIndex: 200, display: 'flex' }}>
      {/* Drawer panel */}
      <div className="paper" style={{
        width: '88%', background: 'var(--ivory)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '4px 0 40px rgba(0,0,0,0.25)', overflow: 'auto',
      }}>
        {/* Top — dark header */}
        <div style={{ padding: '52px 18px 16px', background: 'var(--ink)', color: 'var(--ivory)', position: 'relative' }}>
          <button onClick={onClose} style={{
            position: 'absolute', right: 12, top: 50,
            border: 'none', background: 'transparent',
            color: 'var(--ivory)', cursor: 'pointer', padding: 4,
          }}><IconClose size={22} color="var(--ivory)" /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DrumMark size={36} color="var(--gold)" />
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 19, fontWeight: 600, color: 'var(--gold)', lineHeight: 1.05 }}>
                Đồ Đồng Trường Thơi
              </div>
              <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 10.5, color: 'rgba(244,237,224,0.7)', letterSpacing: '0.08em' }}>
                tinh hoa làng nghề Việt
              </div>
            </div>
          </div>
        </div>

        {/* Search trigger */}
        <div style={{ padding: '14px 16px 6px' }}>
          <button onClick={() => onNavigate && onNavigate('search')} style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            background: '#fffdf7', border: '1px solid var(--line)',
            borderRadius: 100, padding: '10px 14px', cursor: 'pointer',
          }}>
            <IconSearch size={15} color="var(--muted)" />
            <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Tìm tranh, đỉnh đồng...</span>
          </button>
        </div>

        {/* Khám phá */}
        <NavSection title="Khám phá" items={explore} onNavigate={onNavigate} />

        {/* Categories */}
        <div style={{ padding: '6px 0 0' }}>
          <div style={menuLabel}>Danh mục</div>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => onNavigate && onNavigate('category:' + c.id)} style={menuRow}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15.5, fontWeight: 600, color: 'var(--ink)' }}>{c.name}</div>
              <IconChevron size={14} color="var(--bronze)" />
            </button>
          ))}
        </div>

        {/* Account */}
        <NavSection title="Tài khoản & đơn hàng" items={account} onNavigate={onNavigate} />

        {/* Info */}
        <div style={{ padding: '14px 0 0' }}>
          <div style={menuLabel}>Thông tin</div>
          {info.map(it => (
            <button key={it.id} onClick={() => onNavigate && onNavigate(it.id)} style={menuRow}>
              <span style={{ fontSize: 13, color: 'var(--ink-2)', fontFamily: 'Be Vietnam Pro', fontWeight: 500 }}>{it.label}</span>
              <IconChevron size={13} color="var(--muted)" />
            </button>
          ))}
        </div>

        {/* Contact bottom block */}
        <div style={{ margin: '20px 16px 24px', padding: '14px', background: 'var(--ivory-2)', borderRadius: 8 }}>
          <div style={menuLabel2}>Chốt đơn trực tiếp</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            {[IconZalo, IconMessenger, IconFacebook, IconTiktok].map((Ic, i) => (
              <div key={i} style={{ flex: 1, aspectRatio: '1/1', background: '#fffdf7', border: '1px solid var(--line)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Ic size={24} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 700, color: 'var(--son)' }}>
            <IconPhone size={14} color="var(--son)" /> Hotline · 0899012288
          </div>
          <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            Xưởng Đại Bái · Gia Bình · Bắc Ninh
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div onClick={onClose} style={{ flex: 1, background: 'rgba(20,14,9,0.55)' }} />
    </div>
  );
}

const menuLabel  = { fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', padding: '0 18px 8px' };
const menuLabel2 = { fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 8 };
const menuRow    = {
  width: '100%', padding: '13px 18px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  background: 'transparent', border: 'none', borderBottom: '1px solid var(--line-2)',
  cursor: 'pointer', textAlign: 'left',
};

function NavSection({ title, items, onNavigate }) {
  return (
    <div style={{ padding: '14px 0 0' }}>
      <div style={menuLabel}>{title}</div>
      {items.map(it => (
        <button key={it.id} onClick={() => onNavigate && onNavigate(it.id)} style={menuRow}>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15.5, fontWeight: 600, color: 'var(--ink)' }}>{it.label}</div>
            {it.hint && <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>{it.hint}</div>}
          </div>
          <IconChevron size={13} color="var(--bronze)" />
        </button>
      ))}
    </div>
  );
}

window.ScreenMenu = ScreenMenu;
