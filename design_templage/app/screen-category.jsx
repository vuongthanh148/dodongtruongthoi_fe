// Category listing screen

function ScreenCategory({ categoryId, onBack, onOpenProduct, onOpenSaved, savedCount = 0 }) {
  const [view, setView] = React.useState('grid'); // 'grid' | 'list'
  const [sort, setSort] = React.useState('featured');
  const [activeCat, setActiveCat] = React.useState(categoryId || 'tranh-phong-thuy');

  const cat = CATEGORIES.find(c => c.id === activeCat) || CATEGORIES[0];
  let list = PRODUCTS.filter(p => p.categoryId === cat.id);
  if (list.length === 0) list = PRODUCTS; // demo fallback
  if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);

  return (
    <div data-screen-label="02 Category" className="paper" style={{ background: 'var(--ivory)', minHeight: '100%' }}>
      <TopBar title="Danh mục" onBack={onBack} onOpenSaved={onOpenSaved} savedCount={savedCount} />

      {/* breadcrumb */}
      <div style={{ padding: '4px 16px 0', fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 6, alignItems: 'center' }}>
        <span>Trang chủ</span>
        <IconChevron size={10} color="var(--muted)" />
        <span style={{ color: 'var(--ink)' }}>{cat.name}</span>
      </div>

      {/* Title */}
      <div style={{ padding: '10px 16px 6px' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.1 }}>
          {cat.name}
        </div>
        <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 12, color: 'var(--bronze)' }}>
          {cat.count} tác phẩm · chạm thủ công 100%
        </div>
      </div>

      {/* horizontal category pills */}
      <div style={{ padding: '10px 0 4px', overflowX: 'auto' }} className="noscroll">
        <div style={{ display: 'flex', gap: 8, padding: '0 16px' }}>
          {CATEGORIES.map(c => {
            const on = c.id === activeCat;
            return (
              <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
                flexShrink: 0,
                padding: '7px 13px', borderRadius: 100,
                border: on ? '1px solid var(--son)' : '1px solid var(--line)',
                background: on ? 'var(--son)' : '#fffdf7',
                color: on ? 'white' : 'var(--ink)',
                fontFamily: 'Be Vietnam Pro', fontSize: 12, fontWeight: on ? 500 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>{c.name}</button>
            );
          })}
        </div>
      </div>

      {/* filter bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', marginTop: 6,
        background: 'rgba(201,169,97,0.08)',
        borderTop: '1px solid var(--line-2)',
        borderBottom: '1px solid var(--line-2)',
      }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6, background: 'transparent',
          border: 'none', color: 'var(--ink)', fontSize: 12, cursor: 'pointer',
          fontFamily: 'Be Vietnam Pro',
        }}>
          <IconFilter size={14} /> Bộ lọc
        </button>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{
          background: 'transparent', border: 'none', fontSize: 12, color: 'var(--ink)',
          fontFamily: 'Be Vietnam Pro', cursor: 'pointer',
        }}>
          <option value="featured">Nổi bật</option>
          <option value="price-asc">Giá thấp → cao</option>
          <option value="price-desc">Giá cao → thấp</option>
        </select>
        <div style={{ display: 'flex', gap: 2, border: '1px solid var(--line)', borderRadius: 4, overflow: 'hidden' }}>
          <button onClick={() => setView('grid')} style={{
            padding: '4px 8px', border: 'none', cursor: 'pointer',
            background: view === 'grid' ? 'var(--ink)' : 'transparent',
            color: view === 'grid' ? 'var(--ivory)' : 'var(--ink)',
            display: 'flex', alignItems: 'center',
          }}><IconGrid size={13} /></button>
          <button onClick={() => setView('list')} style={{
            padding: '4px 8px', border: 'none', cursor: 'pointer',
            background: view === 'list' ? 'var(--ink)' : 'transparent',
            color: view === 'list' ? 'var(--ivory)' : 'var(--ink)',
            display: 'flex', alignItems: 'center',
          }}><IconList size={13} /></button>
        </div>
      </div>

      {/* grid / list */}
      <div style={{ padding: '14px 16px 100px' }}>
        {view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {list.map(p => (
              <ProductCard key={p.id} p={p} onOpen={() => onOpenProduct(p.id)} compact />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {list.map(p => <ListRow key={p.id} p={p} onOpen={() => onOpenProduct(p.id)} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function ListRow({ p, onOpen }) {
  return (
    <div onClick={onOpen} style={{
      display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12,
      background: '#fffdf7', border: '1px solid var(--line)',
      borderRadius: 8, padding: 10, cursor: 'pointer',
    }}>
      <ArtPiece bg={p.defaultBg} frame={p.defaultFrame} label={p.title} pad={5} aspect="1/1" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 15, color: 'var(--ink)', lineHeight: 1.2 }}>{p.title}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{p.subtitle}</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          {p.bgTones.map(t => <VariantSwatch key={t} tone={t} size={12} />)}
        </div>
        <div style={{ marginTop: 'auto', fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 15 }}>
          {fmtVND(p.price)}
        </div>
      </div>
    </div>
  );
}

window.ScreenCategory = ScreenCategory;
