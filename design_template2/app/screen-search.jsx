// Search screen — redesigned v2

function ScreenSearch({ onClose, onOpenProduct, onOpenCategory }) {
  const [q, setQ] = React.useState('');
  const inputRef = React.useRef(null);

  React.useEffect(() => { setTimeout(() => inputRef.current?.focus(), 60); }, []);

  const hasQuery = q.trim().length > 0;
  const matches  = hasQuery
    ? PRODUCTS.filter(p =>
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(q.toLowerCase()))
    : [];

  return (
    <div data-screen-label="Search" className="paper" style={{ background: 'var(--ivory)', minHeight: '100%' }}>

      {/* ── Search bar (sticky top) ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'var(--ivory)', borderBottom: '1px solid var(--line-2)',
        padding: '52px 14px 12px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={onClose} style={ghostBtn}><IconChevron dir="left" size={22} /></button>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8,
          background: '#fffdf7', border: '1px solid var(--line)',
          borderRadius: 8, padding: '10px 14px',
        }}>
          <IconSearch size={15} color="var(--muted)" />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Tìm tranh, đỉnh đồng, tượng..."
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontFamily: 'Be Vietnam Pro', fontSize: 14, color: 'var(--ink)',
            }}
          />
          {hasQuery && (
            <button onClick={() => setQ('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 2, display: 'flex' }}>
              <IconClose size={14} />
            </button>
          )}
        </div>
      </div>

      {!hasQuery ? (
        /* ── Browse state ── */
        <div style={{ padding: '20px 0 80px' }}>
          <div style={{ padding: '0 16px', marginBottom: 14 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 14 }}>
              Danh mục
            </div>
            {/* 2-col category grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => onOpenCategory && onOpenCategory(c.id)} style={{
                  background: '#fffdf7', border: '1px solid var(--line)', borderRadius: 8,
                  padding: 0, cursor: 'pointer', overflow: 'hidden', textAlign: 'left',
                }}>
                  <div style={{ background: 'var(--ivory-2)', padding: 8 }}>
                    <ArtPiece bg={c.tone} frame="bronze" label="" pad={4} aspect="3/2" />
                  </div>
                  <div style={{ padding: '8px 10px 10px' }}>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2 }}>{c.name}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'var(--muted)', marginTop: 2 }}>{c.count} sản phẩm</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Popular searches */}
          <div style={{ padding: '6px 16px 0' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 12 }}>
              Tìm kiếm phổ biến
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {['Tranh mã đáo', 'Đỉnh đồng thờ', 'Tranh cá chép', 'Tượng Phật', 'Quà tân gia', 'Tranh phong thủy'].map(s => (
                <button key={s} onClick={() => setQ(s)} style={{
                  padding: '7px 13px', borderRadius: 100,
                  background: 'transparent', border: '1px solid var(--line)',
                  fontFamily: 'Be Vietnam Pro', fontSize: 12.5, color: 'var(--ink-2)', cursor: 'pointer',
                }}>{s}</button>
              ))}
            </div>
          </div>

          {/* All products quick view */}
          <div style={{ padding: '22px 16px 0' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 12 }}>
              Tất cả sản phẩm
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {PRODUCTS.map(p => (
                <SearchRow key={p.id} p={p} onOpen={() => onOpenProduct && onOpenProduct(p.id)} />
              ))}
            </div>
          </div>
        </div>

      ) : matches.length === 0 ? (
        /* ── No results ── */
        <div style={{ padding: '60px 30px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 48, color: 'var(--line)', marginBottom: 14 }}>◦</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>
            Không tìm thấy kết quả
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            Thử từ khóa khác, hoặc duyệt theo danh mục bên dưới.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginTop: 20 }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => onOpenCategory && onOpenCategory(c.id)} style={{
                padding: '7px 13px', borderRadius: 100,
                background: 'var(--ivory-2)', border: '1px solid var(--line)',
                fontFamily: 'Be Vietnam Pro', fontSize: 12, color: 'var(--ink)', cursor: 'pointer',
              }}>{c.name}</button>
            ))}
          </div>
        </div>

      ) : (
        /* ── Results ── */
        <div style={{ padding: '0 0 80px' }}>
          <div style={{ padding: '12px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--line-2)' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase' }}>
              Kết quả
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, color: 'var(--muted)' }}>
              {matches.length} sản phẩm
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {matches.map(p => (
              <SearchRow key={p.id} p={p} onOpen={() => onOpenProduct && onOpenProduct(p.id)} query={q} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchRow({ p, onOpen, query }) {
  return (
    <button onClick={onOpen} style={{
      display: 'grid', gridTemplateColumns: '80px 1fr',
      borderBottom: '1px solid var(--line-2)',
      background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
    }}>
      <div style={{ background: 'var(--ivory-2)', padding: 8 }}>
        <ArtPiece bg={p.defaultBg} frame={p.defaultFrame} label="" pad={5} aspect="1/1" />
      </div>
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 15, color: 'var(--ink)', lineHeight: 1.2 }}>
          {p.title}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {p.subtitle}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 14 }}>
            {fmtVND(p.price)}
          </div>
          {p.reviews > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10.5, color: 'var(--muted)' }}>
              <IconStar size={10} color="#c9a961" /> {p.rating}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

const ghostBtn = { background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'var(--ink)' };

window.ScreenSearch = ScreenSearch;
