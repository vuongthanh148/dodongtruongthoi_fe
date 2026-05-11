// Category listing screen — redesigned v2

function ScreenCategory({ categoryId, onBack, onOpenProduct, onOpenSaved, onNavigate, savedCount = 0 }) {
  const [sort, setSort] = React.useState('featured');
  const [activeCat, setActiveCat] = React.useState(categoryId || 'tranh-phong-thuy');
  const [view, setView] = React.useState('grid'); // 'grid' | 'list'

  const cat = CATEGORIES.find(c => c.id === activeCat) || CATEGORIES[0];
  let list = PRODUCTS.filter(p => p.categoryId === cat.id);
  if (list.length === 0) list = PRODUCTS;
  if (sort === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
  if (sort === 'rating')     list = [...list].sort((a, b) => b.rating - a.rating);

  return (
    <div data-screen-label="02 Category" className="paper" style={{ background: 'var(--ivory)', minHeight: '100%' }}>

      {/* ── Sticky top bar ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--ivory)', borderBottom: '1px solid var(--line-2)' }}>
        <div style={{ padding: '52px 14px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={onBack} style={ghostBtn}><IconChevron dir="left" size={22} /></button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase' }}>
              Danh mục
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.1 }}>
              {cat.name}
            </div>
          </div>
          <button onClick={onOpenSaved} style={{ ...ghostBtn, position: 'relative' }}>
            <IconHeart size={20} />
            {savedCount > 0 && <span style={savedDot} />}
          </button>
        </div>

        {/* Category switcher pills */}
        <div style={{ display: 'flex', overflowX: 'auto', padding: '0 14px 12px', gap: 7 }} className="noscroll">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: 100,
              background: c.id === activeCat ? 'var(--ink)' : 'transparent',
              color: c.id === activeCat ? 'var(--ivory)' : 'var(--ink-2)',
              border: c.id === activeCat ? '1px solid var(--ink)' : '1px solid var(--line)',
              fontFamily: 'Be Vietnam Pro', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 150ms',
            }}>{c.name}</button>
          ))}
        </div>
      </div>

      {/* ── Filter/sort/view bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '10px 16px',
        borderBottom: '1px solid var(--line-2)', gap: 8,
      }}>
        <div style={{ flex: 1, fontSize: 12, color: 'var(--muted)' }}>
          {list.length} sản phẩm
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{
          background: 'transparent', border: '1px solid var(--line)', borderRadius: 4,
          padding: '5px 8px', fontSize: 12, color: 'var(--ink)', fontFamily: 'Be Vietnam Pro', cursor: 'pointer',
        }}>
          <option value="featured">Nổi bật</option>
          <option value="price-asc">Giá: thấp → cao</option>
          <option value="price-desc">Giá: cao → thấp</option>
          <option value="rating">Đánh giá cao</option>
        </select>
        <div style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: 4, overflow: 'hidden' }}>
          {[['grid', IconGrid], ['list', IconList]].map(([v, Ic]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '5px 8px', border: 'none', cursor: 'pointer',
              background: view === v ? 'var(--ink)' : 'transparent',
              color: view === v ? 'var(--ivory)' : 'var(--ink)',
              display: 'flex', alignItems: 'center',
            }}><Ic size={14} /></button>
          ))}
        </div>
      </div>

      {/* ── Product list ── */}
      <div style={{ padding: '0 0 80px' }}>
        {view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, borderLeft: '1px solid var(--line)', borderTop: '1px solid var(--line)' }}>
            {list.map((p, idx) => <CatProductCard key={p.id} p={p} idx={idx} onOpen={() => onOpenProduct(p.id)} />)}
            {list.length % 2 !== 0 && (
              <div style={{ borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'rgba(244,237,224,0.4)' }} />
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {list.map(p => <CatListRow key={p.id} p={p} onOpen={() => onOpenProduct(p.id)} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function CatProductCard({ p, idx, onOpen }) {
  const [bg, setBg] = React.useState(p.defaultBg);
  return (
    <div onClick={onOpen} style={{
      borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
      background: idx % 4 === 3 ? 'var(--ivory-2)' : '#fffdf7',
      cursor: 'pointer', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ background: 'var(--ivory-2)', padding: 10, position: 'relative' }}>
        <ArtPiece bg={bg} frame={p.defaultFrame} label={p.title} pad={8} aspect="1/1" />
        {p.badge && (
          <span style={{
            position: 'absolute', top: 14, left: 14,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            background: p.badge === 'SALE' ? 'var(--son)' : 'rgba(255,253,247,0.9)',
            color: p.badge === 'SALE' ? 'white' : 'var(--ink)',
            padding: '2px 6px', borderRadius: 2,
          }}>{p.badge}</span>
        )}
      </div>
      <div style={{ padding: '10px 10px 14px', display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {p.bgTones.slice(0, 3).map(t => (
            <button key={t} onClick={e => { e.stopPropagation(); setBg(t); }} style={{
              width: 10, height: 10, borderRadius: '50%', padding: 0, border: bg === t ? '1.5px solid var(--son)' : '1px solid rgba(0,0,0,0.12)',
              background: BG_TONES.find(b => b.id === t)?.hex || '#888', cursor: 'pointer',
            }} />
          ))}
        </div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2 }}>{p.title}</div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 13, marginTop: 'auto', paddingTop: 4 }}>
          {fmtVND(p.price)}
        </div>
      </div>
    </div>
  );
}

function CatListRow({ p, onOpen }) {
  return (
    <div onClick={onOpen} style={{
      display: 'grid', gridTemplateColumns: '100px 1fr',
      borderBottom: '1px solid var(--line-2)', cursor: 'pointer',
      background: '#fffdf7',
    }}>
      <div style={{ background: 'var(--ivory-2)', padding: 8 }}>
        <ArtPiece bg={p.defaultBg} frame={p.defaultFrame} label="" pad={5} aspect="1/1" />
      </div>
      <div style={{ padding: '14px 14px 14px 12px', display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--bronze)', textTransform: 'uppercase' }}>
          {CATEGORIES.find(c => c.id === p.categoryId)?.name}
        </div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 16, color: 'var(--ink)', lineHeight: 1.2 }}>{p.title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.subtitle}</div>
        <div style={{ display: 'flex', gap: 3, marginTop: 2 }}>
          {p.bgTones.slice(0, 4).map(t => (
            <div key={t} style={{ width: 10, height: 10, borderRadius: '50%', background: BG_TONES.find(b => b.id === t)?.hex, border: '1px solid rgba(0,0,0,0.1)' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 15 }}>{fmtVND(p.price)}</div>
          {p.reviews > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 10.5, color: 'var(--muted)' }}>
              <IconStar size={10} color="#c9a961" /> {p.rating}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ghostBtn = { background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'var(--ink)' };
const savedDot = { position: 'absolute', top: 4, right: 4, width: 7, height: 7, background: 'var(--son)', borderRadius: '50%' };

window.ScreenCategory = ScreenCategory;
