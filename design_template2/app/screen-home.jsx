// Home screen — redesigned v2
// System: full-bleed hero → category strip → trust bar → featured grid → campaign → story editorial → store → footer

const { useState: useH, useEffect: useEff } = React;

function ScreenHome({ onOpenProduct, onOpenCategory, onOpenSaved, onMenu, onOpenSearch, onNavigate, savedCount = 0 }) {
  const featured = PRODUCTS.slice(0, 6);
  const [bannerIdx, setBannerIdx] = useH(0);
  const [activeCat, setActiveCat] = useH('all');

  useEff(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 7000);
    return () => clearInterval(t);
  }, []);

  const filteredFeatured = activeCat === 'all'
    ? PRODUCTS.slice(0, 6)
    : PRODUCTS.filter(p => p.categoryId === activeCat).slice(0, 6);

  const b = BANNERS[bannerIdx];

  return (
    <div data-screen-label="01 Home" style={{ background: 'var(--ivory)', minHeight: '100%' }} className="paper">

      {/* ── Minimal transparent top bar (overlaid on hero) ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
        padding: '54px 14px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(20,14,9,0.55) 0%, transparent 100%)',
      }}>
        <button onClick={onMenu} style={ghostBtn}><IconMenu size={20} color="white" /></button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 15, letterSpacing: '0.05em', color: 'white', lineHeight: 1 }}>
            Đồ Đồng Trường Thơi
          </div>
          <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 9, color: 'rgba(201,169,97,0.9)', letterSpacing: '0.1em' }}>
            tinh hoa làng nghề Việt
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <button onClick={onOpenSearch} style={ghostBtn}><IconSearch size={18} color="white" /></button>
          <button onClick={onOpenSaved} style={{ ...ghostBtn, position: 'relative' }}>
            <IconHeart size={18} color="white" />
            {savedCount > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, background: 'var(--son)', borderRadius: '50%' }} />
            )}
          </button>
        </div>
      </div>

      {/* ── HERO — full-bleed, no margins ── */}
      <div style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        {/* Background: dark painterly gradient cycling per banner tone */}
        {BANNERS.map((bn, i) => (
          <div key={bn.id} style={{
            position: 'absolute', inset: 0,
            opacity: bannerIdx === i ? 1 : 0,
            transition: 'opacity 900ms ease',
            background:
              bn.tone === 'red'    ? 'linear-gradient(165deg, #4a1010 0%, #2a0808 45%, #0e0602 100%)' :
              bn.tone === 'bronze' ? 'linear-gradient(165deg, #3d2010 0%, #221208 45%, #0c0804 100%)' :
                                     'linear-gradient(165deg, #1e1408 0%, #120d04 45%, #060402 100%)',
          }}>
            {/* Texture overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage:
                'radial-gradient(ellipse 60% 55% at 75% 35%, rgba(201,169,97,0.22) 0%, transparent 65%),' +
                'radial-gradient(ellipse 50% 50% at 20% 80%, rgba(139,30,30,0.3) 0%, transparent 60%)',
            }} />
            {/* Dong-Son watermark */}
            <div style={{ position: 'absolute', right: -40, top: -30, opacity: 0.06 }}>
              <DrumMark size={280} color="var(--gold)" />
            </div>
          </div>
        ))}

        {/* Hero art piece (centered) */}
        <div style={{ position: 'absolute', right: 20, top: 80, width: 170 }}>
          <ArtPiece bg={b.tone === 'red' ? 'red' : b.tone === 'bronze' ? 'bronze' : 'dark'}
            frame="gold" label="tranh đồng" pad={10} aspect="4/5" />
        </div>

        {/* Hero copy (left-bottom) */}
        <div style={{ position: 'absolute', left: 22, right: 200, bottom: 36 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.28em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12 }}>
            {b.eyebrow}
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 30, fontWeight: 500, color: 'white', lineHeight: 1.05, marginBottom: 10, textWrap: 'balance' }}>
            {b.title}
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(244,237,224,0.7)', lineHeight: 1.55, marginBottom: 18 }}>
            {b.body}
          </div>
          <button onClick={() => onOpenCategory && onOpenCategory('tranh-phong-thuy')} style={{
            background: 'transparent', color: 'white',
            border: '1px solid rgba(255,255,255,0.5)',
            padding: '9px 16px', borderRadius: 2,
            fontFamily: 'Be Vietnam Pro', fontSize: 12, letterSpacing: '0.05em',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {b.cta} <span style={{ opacity: 0.7 }}>→</span>
          </button>
        </div>

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: 14, right: 20, display: 'flex', gap: 5 }}>
          {BANNERS.map((_, i) => (
            <button key={i} onClick={() => setBannerIdx(i)} style={{
              width: bannerIdx === i ? 18 : 6, height: 6, borderRadius: 3,
              background: bannerIdx === i ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
              border: 'none', padding: 0, cursor: 'pointer', transition: 'all 300ms ease',
            }} />
          ))}
        </div>
      </div>

      {/* ── CATEGORY STRIP — horizontal scroll pills ── */}
      <div style={{ borderBottom: '1px solid var(--line-2)', padding: '0' }}>
        <div style={{ display: 'flex', overflowX: 'auto', padding: '12px 16px', gap: 8 }} className="noscroll">
          <CatPill active={activeCat === 'all'} onClick={() => setActiveCat('all')}>Tất cả</CatPill>
          {CATEGORIES.map(c => (
            <CatPill key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
              {c.name}
            </CatPill>
          ))}
        </div>
      </div>

      {/* ── TRUST BAR ── */}
      <div style={{
        background: 'var(--ink)',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        padding: '14px 0',
      }}>
        {[
          { n: '10 năm', s: 'Bảo hành chống xỉn' },
          { n: '100%', s: 'Đồng nguyên chất' },
          { n: 'COD', s: 'Thanh toán khi nhận' },
        ].map((x, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '0 4px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 17, color: 'var(--gold)', lineHeight: 1 }}>{x.n}</div>
            <div style={{ fontSize: 9.5, color: 'rgba(244,237,224,0.6)', marginTop: 3, lineHeight: 1.3 }}>{x.s}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <div style={{ padding: '24px 0 0' }}>
        <div style={{ padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 4 }}>
              {activeCat === 'all' ? 'Nổi bật' : CATEGORIES.find(c => c.id === activeCat)?.name}
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.1 }}>
              {activeCat === 'all' ? 'Được chọn nhiều nhất' : 'Sản phẩm'}
            </div>
          </div>
          <button onClick={() => onOpenCategory(activeCat === 'all' ? 'tranh-phong-thuy' : activeCat)}
            style={{ background: 'transparent', border: 'none', color: 'var(--son)', fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 13, cursor: 'pointer' }}>
            Xem tất cả →
          </button>
        </div>

        {/* 2-col grid */}
        {filteredFeatured.length === 0 ? (
          <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            Chưa có sản phẩm trong danh mục này.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, borderTop: '1px solid var(--line)', borderLeft: '1px solid var(--line)' }}>
            {filteredFeatured.slice(0, 6).map((p, idx) => (
              <ProductCardV2 key={p.id} p={p} idx={idx} onOpen={() => onOpenProduct(p.id)} />
            ))}
          </div>
        )}
      </div>

      {/* ── CAMPAIGN BANNER — full-bleed dark editorial ── */}
      {CAMPAIGNS.map(c => (
        <div key={c.id} style={{ margin: '28px 0 0', background: 'var(--son)', overflow: 'hidden', position: 'relative', padding: '28px 22px 26px' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.08 }}>
            <DrumMark size={160} color="var(--gold)" />
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.25em', color: 'rgba(201,169,97,0.9)', textTransform: 'uppercase', marginBottom: 12 }}>
            {c.label} · {c.range}
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 500, color: 'white', lineHeight: 1.05, marginBottom: 8 }}>
            {c.deal}
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1.15, marginBottom: 8 }}>
            {c.title}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55, marginBottom: 20 }}>{c.body}</div>
          <button onClick={() => onOpenCategory('tranh-phong-thuy')} style={{
            background: 'transparent', color: 'white',
            border: '1px solid rgba(255,255,255,0.55)',
            padding: '10px 18px', borderRadius: 2,
            fontFamily: 'Be Vietnam Pro', fontSize: 12, cursor: 'pointer',
          }}>Xem sản phẩm khuyến mãi →</button>
        </div>
      ))}

      {/* ── STORY EDITORIAL — dark full-bleed ── */}
      <div style={{ background: 'var(--ink)', padding: '32px 22px 28px', marginTop: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: -40, bottom: -40, opacity: 0.04 }}>
          <DrumMark size={200} color="var(--gold)" />
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.28em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>
          Câu chuyện làng nghề
        </div>
        {/* Story art placeholder */}
        <div className="ph dark" style={{ aspectRatio: '16/9', borderRadius: 6, marginBottom: 18 }}>
          <span style={{ fontSize: 9, letterSpacing: '0.06em' }}>[ làng-đại-bái-cover.jpg ]</span>
        </div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 500, color: 'white', lineHeight: 1.15, marginBottom: 10 }}>
          Một bức tranh — hai mươi ngày — ba thế hệ thợ
        </div>
        <div style={{ fontSize: 12.5, color: 'rgba(244,237,224,0.65)', lineHeight: 1.7, marginBottom: 20 }}>
          Mỗi sản phẩm từ xưởng Trường Thơi là kết tinh của nghề gò đúc đồng truyền thống làng Đại Bái — nơi lửa lò và bàn tay người thợ cùng nhau tạo nên di sản.
        </div>
        <button onClick={() => onNavigate && onNavigate('craft')} style={{
          background: 'transparent', color: 'var(--gold)',
          border: '1px solid rgba(201,169,97,0.5)',
          padding: '10px 18px', borderRadius: 2,
          fontFamily: 'Be Vietnam Pro', fontSize: 12, cursor: 'pointer',
        }}>Đọc câu chuyện →</button>
      </div>

      {/* ── STORE — minimal ── */}
      <div style={{ padding: '28px 16px 0' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 14 }}>
          Showroom & xưởng
        </div>
        {STORES.map(s => (
          <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 19, fontWeight: 600, color: 'var(--ink)' }}>{s.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12.5, color: 'var(--ink-2)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <IconPin size={13} color="var(--bronze)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{s.addr}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconPhone size={13} color="var(--bronze)" />
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 16, color: 'var(--son)' }}>{s.phone}</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', paddingLeft: 21 }}>{s.hours}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
              <button style={{
                padding: '11px', borderRadius: 2, background: 'var(--son)', border: 'none',
                color: 'white', fontFamily: 'Be Vietnam Pro', fontSize: 12, cursor: 'pointer',
              }}>Gọi ngay</button>
              <button style={{
                padding: '11px', borderRadius: 2, background: 'transparent', border: '1px solid var(--line)',
                color: 'var(--ink)', fontFamily: 'Be Vietnam Pro', fontSize: 12, cursor: 'pointer',
              }}>Chỉ đường</button>
            </div>
          </div>
        ))}
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

// ── Category pill ──
function CatPill({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flexShrink: 0, padding: '7px 14px', borderRadius: 100,
      background: active ? 'var(--ink)' : 'transparent',
      color: active ? 'var(--ivory)' : 'var(--ink-2)',
      border: active ? '1px solid var(--ink)' : '1px solid var(--line)',
      fontFamily: 'Be Vietnam Pro', fontWeight: active ? 500 : 400, fontSize: 12.5,
      cursor: 'pointer', whiteSpace: 'nowrap',
      transition: 'all 180ms ease',
    }}>
      {children}
    </button>
  );
}

// ── Product card v2 — grid-border style, no individual card borders ──
function ProductCardV2({ p, idx, onOpen }) {
  const [bg, setBg] = React.useState(p.defaultBg);
  // Make every other card taller (first big card in each pair)
  const isTall = idx === 0 || idx === 1;
  return (
    <div onClick={onOpen} style={{
      background: '#fffdf7', borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
      cursor: 'pointer', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ background: 'var(--ivory-2)', padding: 8, position: 'relative' }}>
        <ArtPiece bg={bg} frame={p.defaultFrame} label={p.title} pad={6} aspect={isTall ? '1/1' : '4/3'} />
        {p.badge && (
          <span style={{
            position: 'absolute', top: 14, left: 14,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em',
            color: p.badge === 'SALE' ? 'white' : 'var(--ink)',
            textTransform: 'uppercase',
            background: p.badge === 'SALE' ? 'var(--son)' : 'rgba(255,253,247,0.9)',
            padding: '3px 7px', borderRadius: 2,
          }}>{p.badge}</span>
        )}
      </div>
      <div style={{ padding: '10px 10px 12px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {/* Color swatches */}
        <div style={{ display: 'flex', gap: 3 }}>
          {p.bgTones.slice(0, 3).map(t => (
            <button key={t} onClick={e => { e.stopPropagation(); setBg(t); }} style={{
              width: 12, height: 12, borderRadius: '50%', padding: 0, border: bg === t ? '1.5px solid var(--son)' : '1px solid rgba(0,0,0,0.15)',
              background: BG_TONES.find(b => b.id === t)?.hex || '#888',
              cursor: 'pointer',
            }} />
          ))}
        </div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2, marginTop: 2 }}>{p.title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 4 }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 14 }}>
            {fmtVND(p.price)}
          </div>
          {p.reviews > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 10, color: 'var(--muted)' }}>
              <IconStar size={9} color="#c9a961" /> {p.rating}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ghostBtn = {
  background: 'transparent', border: 'none', cursor: 'pointer',
  padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
};

window.ScreenHome = ScreenHome;
