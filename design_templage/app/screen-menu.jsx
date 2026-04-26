// Menu drawer screen — opened when user taps top-left menu button

function ScreenMenu({ onClose, onNavigate, savedCount = 0 }) {
  const items = [
    { id: 'home',     label: 'Trang chủ',             hint: 'Bộ sưu tập nổi bật' },
    { id: 'category', label: 'Tranh Phong Thủy',      hint: '24 tác phẩm' },
    { id: 'category2',label: 'Tranh Quê Hương',       hint: '18 tác phẩm' },
    { id: 'category3',label: 'Đỉnh Đồng · Tam Sự',    hint: '14 tác phẩm' },
    { id: 'saved',    label: 'Sản phẩm đã lưu',       hint: `${savedCount} mục` },
  ];
  const info = [
    { id: 'craft',   label: 'Câu chuyện làng nghề' },
    { id: 'guide',   label: 'Cẩm nang phong thủy' },
    { id: 'ship',    label: 'Giao hàng & bảo hành' },
    { id: 'contact', label: 'Liên hệ' },
  ];

  return (
    <div data-screen-label="05 Menu" style={{
      position: 'absolute', inset: 0, zIndex: 200,
      display: 'flex',
    }}>
      {/* Drawer */}
      <div className="paper" style={{
        width: '86%', background: 'var(--ivory)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '4px 0 40px rgba(0,0,0,0.25)',
        overflow: 'auto',
      }}>
        {/* Top */}
        <div style={{ padding: '52px 20px 16px', background: 'var(--ink)', color: 'var(--ivory)', position: 'relative' }}>
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

        {/* Search */}
        <div style={{ padding: '14px 16px 6px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#fffdf7', border: '1px solid var(--line)',
            borderRadius: 100, padding: '9px 14px',
          }}>
            <IconSearch size={15} color="var(--muted)" />
            <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Tìm tranh, đỉnh đồng...</span>
          </div>
        </div>

        {/* Primary nav */}
        <div style={{ padding: '14px 0 0' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', padding: '0 20px 10px' }}>
            Khám phá
          </div>
          {items.map(it => (
            <button key={it.id} onClick={() => onNavigate && onNavigate(it.id)} style={{
              width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'transparent', border: 'none', borderBottom: '1px solid var(--line-2)',
              cursor: 'pointer', textAlign: 'left',
            }}>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{it.label}</div>
                <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>{it.hint}</div>
              </div>
              <IconChevron size={14} color="var(--bronze)" />
            </button>
          ))}
        </div>

        <div style={{ padding: '20px 0 0' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', padding: '0 20px 6px' }}>
            Thông tin
          </div>
          {info.map(it => (
            <button key={it.id} style={{
              width: '100%', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
            }}>
              <span style={{ fontSize: 13, color: 'var(--ink-2)', fontFamily: 'Be Vietnam Pro' }}>{it.label}</span>
              <IconChevron size={13} color="var(--muted)" />
            </button>
          ))}
        </div>

        {/* Contact block */}
        <div style={{ margin: '20px 16px 20px', padding: '14px', background: 'var(--ivory-2)', borderRadius: 8 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 8 }}>
            Chốt đơn trực tiếp
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            {[IconZalo, IconMessenger, IconFacebook, IconTiktok].map((Ic, i) => (
              <div key={i} style={{
                flex: 1, aspectRatio: '1/1', background: '#fffdf7',
                border: '1px solid var(--line)', borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}><Ic size={24} /></div>
            ))}
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 600, color: 'var(--son)', marginTop: 12 }}>
            Hotline · 0899·01·2288
          </div>
          <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            Xưởng Đại Bái · Gia Bình · Bắc Ninh
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div onClick={onClose} style={{
        flex: 1, background: 'rgba(20,14,9,0.55)', backdropFilter: 'blur(2px)',
      }} />
    </div>
  );
}

window.ScreenMenu = ScreenMenu;
