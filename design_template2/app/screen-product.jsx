// Product detail — v3: focus on variant configurator experience
// Art gallery → Title/Price → Configurator (nền / khung / kích thước) → Tabs → Related

const { useState: useP, useEffect: useEP, useRef: useRP } = React;

function ScreenProduct({ productId, onBack, recentIds = [], onOpenProduct, onOpenCategory, onOpenSaved,
  isSaved = false, onToggleSave, savedCount = 0, onAddToCart, onBuyNow }) {

  const p = PRODUCTS.find(x => x.id === productId) || PRODUCTS[0];
  const [bg,      setBg]      = useP(p.defaultBg);
  const [frame,   setFrame]   = useP(p.defaultFrame);
  const [size,    setSize]    = useP(SIZES[1].id);
  const [tab,     setTab]     = useP('mota');
  const [compare, setCompare] = useP(false);
  const [zoomed,  setZoomed]  = useP(false);

  useEP(() => {
    setBg(p.defaultBg); setFrame(p.defaultFrame); setSize(SIZES[1].id); setTab('mota');
  }, [p.id]);

  const bgInfo    = BG_TONES.find(b => b.id === bg)         || BG_TONES[0];
  const frameInfo = FRAME_STYLES.find(f => f.id === frame)  || FRAME_STYLES[0];
  const sizeInfo  = SIZES.find(s => s.id === size)          || SIZES[1];
  const cat       = CATEGORIES.find(c => c.id === p.categoryId);
  const price     = Math.round(p.price * sizeInfo.priceMul);

  const recents = (recentIds || []).filter(id => id !== p.id)
    .map(id => PRODUCTS.find(x => x.id === id)).filter(Boolean).slice(0, 8);
  const related = PRODUCTS.filter(x => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 6);

  const TABS = [
    { id: 'mota',     label: 'Mô tả'     },
    { id: 'huongdan', label: 'Hướng dẫn' },
    { id: 'thongso',  label: 'Thông số'  },
    { id: 'danhgia',  label: 'Đánh giá'  },
  ];

  // Build all combos for thumbnail gallery: each bg × current frame
  const thumbCombos = p.bgTones.map(t => ({ bg: t, frame }));

  return (
    <div data-screen-label="03 Product" className="paper" style={{ background: 'var(--ivory)', minHeight: '100%', paddingBottom: 90 }}>

      {/* ── Art viewer ── */}
      <div style={{ position: 'relative', background: 'var(--ivory-2)', borderBottom: '1px solid var(--line-2)' }}>
        {/* Back / actions overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          padding: '50px 12px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          pointerEvents: 'none',
        }}>
          <button onClick={onBack} style={{ ...pBtn, pointerEvents: 'all', background: 'rgba(244,237,224,0.88)', borderRadius: '50%', width: 36, height: 36, justifyContent: 'center' }}>
            <IconChevron dir="left" size={20} />
          </button>
          <div style={{ display: 'flex', gap: 6, pointerEvents: 'all' }}>
            <button onClick={() => onToggleSave && onToggleSave(p.id)} style={{
              ...pBtn, background: 'rgba(244,237,224,0.88)', borderRadius: '50%',
              width: 36, height: 36, justifyContent: 'center',
              color: isSaved ? 'var(--son)' : 'var(--ink)',
            }}>
              <IconHeart size={18} color={isSaved ? 'var(--son)' : 'var(--ink)'} filled={isSaved} />
            </button>
          </div>
        </div>

        {/* Main art — tap to zoom */}
        <div onClick={() => setZoomed(true)} style={{ padding: '74px 24px 16px', cursor: 'zoom-in' }}>
          <ArtPiece bg={bg} frame={frame} label={p.title} pad={20} aspect="4/3" style={{ transition: 'all 400ms ease' }} />
          <div style={{ textAlign: 'center', marginTop: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>
            Nhấn để phóng to
          </div>
        </div>

        {/* Thumbnail gallery: all bg tones for quick switch */}
        <div style={{ display: 'flex', gap: 8, padding: '0 16px 16px', overflowX: 'auto' }} className="noscroll">
          {thumbCombos.map(c => (
            <button key={c.bg} onClick={() => setBg(c.bg)} style={{
              flexShrink: 0, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer',
            }}>
              <div style={{
                width: 56, height: 44,
                border: bg === c.bg ? '2px solid var(--son)' : '1.5px solid var(--line)',
                borderRadius: 5, overflow: 'hidden',
                boxShadow: bg === c.bg ? '0 0 0 2px rgba(139,30,30,0.15)' : 'none',
                transition: 'all 150ms',
              }}>
                <ArtPiece bg={c.bg} frame={c.frame} label="" pad={4} aspect="4/3.1" />
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5,
                textAlign: 'center', marginTop: 4, letterSpacing: '0.06em',
                color: bg === c.bg ? 'var(--son)' : 'var(--muted)',
                fontWeight: bg === c.bg ? 600 : 400,
              }}>
                {BG_TONES.find(b => b.id === c.bg)?.name.replace('Nền ', '')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Title + price ── */}
      <div style={{ padding: '18px 18px 0' }}>
        {cat && (
          <button onClick={() => onOpenCategory && onOpenCategory(cat.id)} style={catChip}>
            {cat.name} →
          </button>
        )}
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 26, margin: '8px 0 4px', color: 'var(--ink)', lineHeight: 1.1 }}>
          {p.title}
        </h1>
        <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 12.5, color: 'var(--bronze)', marginBottom: 10 }}>
          {p.subtitle}
        </div>
        {p.reviews > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 1 }}>
              {[1,2,3,4,5].map(i => <IconStar key={i} size={11} color={i <= Math.round(p.rating) ? '#c9a961' : 'rgba(0,0,0,0.12)'} />)}
            </div>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{p.rating} · {p.reviews} đánh giá</span>
          </div>
        )}
        {/* Live price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 32, transition: 'all 200ms' }}>
            {fmtVND(price)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'Lora, serif', fontStyle: 'italic', lineHeight: 1.3 }}>
            khổ {sizeInfo.name}<br />đã bao gồm lắp đặt
          </div>
        </div>
      </div>

      {/* ── CONFIGURATOR ── */}
      <div style={{ margin: '18px 0 0', borderTop: '1px solid var(--line-2)' }}>

        {/* ①  Tông nền */}
        <ConfigSection
          num="01"
          label="Tông nền tranh"
          selected={bgInfo.name}
        >
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 18px 4px' }} className="noscroll">
            {p.bgTones.map(t => {
              const info = BG_TONES.find(b => b.id === t);
              const on   = t === bg;
              return (
                <button key={t} onClick={() => setBg(t)} style={{
                  flexShrink: 0, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 8,
                    background: info?.hex,
                    border: on ? '2.5px solid var(--son)' : '1.5px solid rgba(0,0,0,0.12)',
                    boxShadow: on ? '0 0 0 3px rgba(139,30,30,0.12)' : 'inset 0 1px 2px rgba(0,0,0,0.2)',
                    transition: 'all 150ms',
                  }} />
                  <div style={{
                    fontFamily: 'Be Vietnam Pro', fontSize: 10.5, lineHeight: 1.2, textAlign: 'center', maxWidth: 54,
                    color: on ? 'var(--son)' : 'var(--ink-2)',
                    fontWeight: on ? 600 : 400,
                  }}>{info?.name.replace('Nền ', '')}</div>
                </button>
              );
            })}
          </div>
        </ConfigSection>

        {/* ② Kiểu khung */}
        <ConfigSection
          num="02"
          label="Kiểu khung"
          selected={frameInfo.name}
        >
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 18px 4px' }} className="noscroll">
            {p.frames.map(f => {
              const fi   = FRAME_STYLES.find(x => x.id === f);
              const on   = f === frame;
              const fColor = { bronze: '#6b4423', gold: '#c9a961', dark: '#2a1d13', carved: '#8B5E3C' }[f] || '#888';
              return (
                <button key={f} onClick={() => setFrame(f)} style={{
                  flexShrink: 0, cursor: 'pointer',
                  background: on ? 'rgba(139,30,30,0.05)' : '#fffdf7',
                  border: on ? '1.5px solid var(--son)' : '1px solid var(--line)',
                  borderRadius: 8, padding: '8px 12px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  minWidth: 110,
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: 5, background: fColor, flexShrink: 0, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: 'Be Vietnam Pro', fontSize: 11.5, fontWeight: on ? 600 : 400, color: on ? 'var(--son)' : 'var(--ink)', lineHeight: 1.2 }}>
                      {fi?.name.replace('Khung ', '')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ConfigSection>

        {/* ③ Kích thước */}
        <ConfigSection
          num="03"
          label="Kích thước"
          selected={`${sizeInfo.name} · ${fmtVND(price)}`}
        >
          <div style={{ padding: '0 18px 4px', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {SIZES.map(s => {
              const on      = s.id === size;
              const sPrice  = Math.round(p.price * s.priceMul);
              return (
                <button key={s.id} onClick={() => setSize(s.id)} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto',
                  alignItems: 'center', cursor: 'pointer',
                  padding: '11px 14px',
                  background: on ? 'rgba(139,30,30,0.05)' : '#fffdf7',
                  border: on ? '1.5px solid var(--son)' : '1px solid var(--line)',
                  borderRadius: 8,
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: 'Be Vietnam Pro', fontSize: 13.5, fontWeight: on ? 600 : 400, color: on ? 'var(--son)' : 'var(--ink)' }}>
                      {s.name}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'var(--muted)', marginTop: 2, letterSpacing: '0.05em' }}>
                      {s.id === 's' ? 'Phòng nhỏ, bàn làm việc' :
                       s.id === 'm' ? 'Phòng khách vừa' :
                       s.id === 'l' ? 'Phòng khách lớn, sảnh' :
                                      'Biệt thự, văn phòng lớn'}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 15, color: on ? 'var(--son)' : 'var(--ink-2)' }}>
                    {fmtVND(sPrice)}
                  </div>
                </button>
              );
            })}
          </div>
        </ConfigSection>
      </div>

      {/* ── Compare link ── */}
      <div style={{ padding: '10px 18px 0' }}>
        <button onClick={() => setCompare(true)} style={{
          background: 'transparent', border: '1px solid var(--line)', borderRadius: 6,
          padding: '8px 14px', color: 'var(--ink-2)', fontFamily: 'Be Vietnam Pro',
          fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <IconCompare size={13} /> So sánh các biến thể nền & khung
        </button>
      </div>

      {/* ── Tabs ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 15, background: 'var(--ivory)', borderBottom: '2px solid var(--line-2)', marginTop: 20 }}>
        <div style={{ display: 'flex', overflowX: 'auto', padding: '0 18px' }} className="noscroll">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flexShrink: 0, padding: '12px 14px 10px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'Be Vietnam Pro', fontSize: 12.5, fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? 'var(--ink)' : 'var(--muted)',
              borderBottom: `2px solid ${tab === t.id ? 'var(--son)' : 'transparent'}`,
              transition: 'all 150ms', marginBottom: -2, whiteSpace: 'nowrap',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 18px 0' }}>
        {tab === 'mota'     && <TabMota p={p} />}
        {tab === 'huongdan' && <TabHuongDan p={p} />}
        {tab === 'thongso'  && <TabThongSo p={p} frameInfo={frameInfo} sizeInfo={sizeInfo} />}
        {tab === 'danhgia'  && <TabDanhGia p={p} />}
      </div>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <div style={{ padding: '28px 0 0' }}>
          <div style={{ padding: '0 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 3 }}>Cùng danh mục</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 600, color: 'var(--ink)' }}>Sản phẩm liên quan</div>
            </div>
            <button onClick={() => onOpenCategory && onOpenCategory(p.categoryId)}
              style={{ background: 'transparent', border: 'none', color: 'var(--son)', fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 12, cursor: 'pointer' }}>
              Xem tất cả →
            </button>
          </div>
          <div style={{ display: 'flex', gap: 1, overflowX: 'auto', borderTop: '1px solid var(--line)', borderLeft: '1px solid var(--line)' }} className="noscroll">
            {related.map(rp => (
              <div key={rp.id} onClick={() => onOpenProduct && onOpenProduct(rp.id)} style={{
                flexShrink: 0, width: 148,
                borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
                background: '#fffdf7', cursor: 'pointer',
              }}>
                <div style={{ background: 'var(--ivory-2)', padding: 8 }}>
                  <ArtPiece bg={rp.defaultBg} frame={rp.defaultFrame} label="" pad={6} aspect="1/1" />
                </div>
                <div style={{ padding: '8px 10px 12px' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rp.title}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 12, marginTop: 4 }}>{fmtVND(rp.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recently viewed ── */}
      {recents.length > 0 && (
        <div style={{ padding: '24px 0 16px' }}>
          <div style={{ padding: '0 18px', marginBottom: 14 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 3 }}>Gợi nhớ</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 600, color: 'var(--ink)' }}>Đã xem gần đây</div>
          </div>
          <div style={{ display: 'flex', gap: 1, overflowX: 'auto', borderTop: '1px solid var(--line)', borderLeft: '1px solid var(--line)' }} className="noscroll">
            {recents.map(rp => (
              <div key={rp.id} onClick={() => onOpenProduct && onOpenProduct(rp.id)} style={{
                flexShrink: 0, width: 136,
                borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
                background: '#fffdf7', cursor: 'pointer',
              }}>
                <div style={{ background: 'var(--ivory-2)', padding: 8 }}>
                  <ArtPiece bg={rp.defaultBg} frame={rp.defaultFrame} label="" pad={5} aspect="1/1" />
                </div>
                <div style={{ padding: '7px 10px 10px' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rp.title}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 12, marginTop: 3 }}>{fmtVND(rp.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Sticky CTA ── */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50,
        background: 'rgba(255,253,247,0.97)', backdropFilter: 'blur(14px)',
        borderTop: '1px solid var(--line-2)', padding: '10px 14px 20px',
        display: 'flex', gap: 8,
      }}>
        <button onClick={() => onToggleSave && onToggleSave(p.id)} style={{
          width: 44, height: 44, borderRadius: 6, flexShrink: 0,
          border: isSaved ? '1.5px solid var(--son)' : '1px solid var(--line)',
          background: isSaved ? 'rgba(139,30,30,0.07)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <IconHeart size={18} color={isSaved ? 'var(--son)' : 'var(--ink)'} filled={isSaved} />
        </button>
        <button onClick={() => onAddToCart && onAddToCart(p.id, { size: sizeInfo.name, bg: bgInfo.name, frame: frameInfo.name })} style={{
          flex: 1, height: 44, borderRadius: 6,
          border: '1px solid var(--ink)', background: 'transparent',
          color: 'var(--ink)', fontFamily: 'Be Vietnam Pro', fontWeight: 500, fontSize: 12.5,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <IconCart size={14} /> Thêm vào giỏ
        </button>
        <button onClick={() => onBuyNow && onBuyNow(p.id, { size: sizeInfo.name, bg: bgInfo.name, frame: frameInfo.name })} style={{
          flex: 1.3, height: 44, borderRadius: 6, border: 'none',
          background: 'var(--son)', color: 'white',
          fontFamily: 'Be Vietnam Pro', fontWeight: 500, fontSize: 12.5, cursor: 'pointer',
        }}>
          Mua ngay · {fmtVND(price)}
        </button>
      </div>

      {/* ── Zoom overlay ── */}
      {zoomed && (
        <div onClick={() => setZoomed(false)} style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(10,7,4,0.95)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: 20, cursor: 'zoom-out',
        }}>
          <ArtPiece bg={bg} frame={frame} label={p.title} pad={20} aspect="1/1" style={{ width: '100%', maxWidth: 380 }} />
          <button onClick={() => setZoomed(false)} style={{
            position: 'absolute', top: 56, right: 16,
            background: 'rgba(244,237,224,0.15)', border: 'none', borderRadius: '50%',
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}><IconClose size={18} color="white" /></button>
        </div>
      )}

      {compare && <CompareModal p={p} onClose={() => setCompare(false)} activeBg={bg} activeFrame={frame} />}
    </div>
  );
}

// ── Numbered config section ──
function ConfigSection({ num, label, selected, children }) {
  return (
    <div style={{ borderBottom: '1px solid var(--line-2)', padding: '16px 0' }}>
      <div style={{ padding: '0 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.15em', color: 'var(--bronze)', fontWeight: 500 }}>{num}</span>
          <span style={{ fontFamily: 'Be Vietnam Pro', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{label}</span>
        </div>
        <span style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 12, color: 'var(--son)' }}>{selected}</span>
      </div>
      {children}
    </div>
  );
}

const pBtn    = { background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--ink)' };
const catChip = { fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.15em', color: 'var(--bronze)', textTransform: 'uppercase', background: 'rgba(107,68,35,0.07)', padding: '3px 8px', borderRadius: 3, border: '1px solid rgba(107,68,35,0.18)', cursor: 'pointer' };

// ── Tab: Mô tả ──
function TabMota({ p }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 8 }}>
      <TabBlock eyebrow="Về tác phẩm" body={p.description} />
      <TabBlock eyebrow="Ý nghĩa phong thủy" body={p.meaning} />
      <TabBlock eyebrow="Giải thích chi tiết">
        <p style={bodyS}>Mỗi chi tiết trên bức tranh đều được người nghệ nhân gửi gắm ý niệm riêng. Nét chạm nổi trung tâm là điểm nhấn, các hoa văn viền mang hơi hướm Đông Sơn, kết hợp cùng phông nền đồng được đánh bóng tạo chiều sâu thị giác.</p>
        <div style={{ padding: '12px 14px', background: 'rgba(201,169,97,0.08)', borderLeft: '2px solid var(--gold)', fontSize: 12.5, lineHeight: 1.65, color: 'var(--bronze)', fontFamily: 'Lora, serif', fontStyle: 'italic', marginTop: 12 }}>
          "Chúng tôi gò từng đường nét bằng tay, không dùng máy dập."
          <div style={{ marginTop: 5, fontSize: 10, fontStyle: 'normal', letterSpacing: '0.1em' }}>— NGHỆ NHÂN LÊ VĂN TRƯỜNG</div>
        </div>
      </TabBlock>
    </div>
  );
}

// ── Tab: Hướng dẫn ──
function TabHuongDan({ p }) {
  const matchedZ = p.zodiac.map(id => ZODIAC.find(z => z.id === id)).filter(Boolean);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 8 }}>
      <TabBlock eyebrow="Mục đích sử dụng">
        <PurposeGroup label="Đặt / treo tại" items={p.purpose.place} icon="🏠" />
        <PurposeGroup label="Phù hợp tặng" items={p.purpose.use} icon="🎁" />
        <PurposeGroup label="Lưu ý" items={p.purpose.avoid} icon="⚠" />
      </TabBlock>
      <TabBlock eyebrow="Hợp với tuổi (12 con giáp)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {matchedZ.map(z => (
            <div key={z.id} style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 10, alignItems: 'center', padding: '10px 12px', background: 'rgba(201,169,97,0.06)', borderRadius: 6 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: 'var(--son)' }}>{z.name}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'Be Vietnam Pro', fontWeight: 500, fontSize: 13, color: 'var(--ink)' }}>Tuổi {z.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>{z.years}</div>
              </div>
            </div>
          ))}
        </div>
      </TabBlock>
    </div>
  );
}

function PurposeGroup({ label, items, icon }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: 'Be Vietnam Pro', fontWeight: 600, fontSize: 12, color: 'var(--ink)', marginBottom: 5 }}>{icon} {label}</div>
      {items.map((it, i) => (
        <div key={i} style={{ fontSize: 12.5, color: 'var(--ink-2)', paddingLeft: 14, lineHeight: 1.55, position: 'relative', marginBottom: 3 }}>
          <span style={{ position: 'absolute', left: 4, color: 'var(--bronze)' }}>·</span>{it}
        </div>
      ))}
    </div>
  );
}

// ── Tab: Thông số ──
function TabThongSo({ p, frameInfo, sizeInfo }) {
  const rows = [
    ['Chất liệu',           p.specs.material],
    ['Độ dày',              p.specs.thickness],
    ['Trọng lượng',         p.specs.weight],
    ['Kỹ thuật',            p.specs.technique],
    ['Khung',               `${frameInfo.name} — ${p.specs.frameMat}`],
    ['Kích thước đã chọn',  sizeInfo.name],
    ['Hoàn thiện',          p.specs.finish],
    ['Bảo hành',            '10 năm chống xỉn màu'],
    ['Xuất xứ',             p.specs.origin],
    ['Thời gian chế tác',   p.specs.leadTime],
  ];
  return (
    <div style={{ paddingBottom: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {rows.map(([k, v], i) => (
            <tr key={k} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(201,169,97,0.04)' }}>
              <td style={{ padding: '10px 0', fontFamily: 'Be Vietnam Pro', fontSize: 12, fontWeight: 500, color: 'var(--muted)', width: '44%', verticalAlign: 'top', borderBottom: '1px solid var(--line-2)' }}>{k}</td>
              <td style={{ padding: '10px 0 10px 10px', fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.5, borderBottom: '1px solid var(--line-2)' }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Tab: Đánh giá ──
function TabDanhGia({ p }) {
  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ display: 'flex', gap: 14, paddingBottom: 18, borderBottom: '1px solid var(--line-2)', marginBottom: 18, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 44, fontWeight: 700, color: 'var(--son)', lineHeight: 1 }}>{p.rating || '—'}</div>
          <div style={{ display: 'flex', gap: 1, justifyContent: 'center', marginTop: 4 }}>
            {[1,2,3,4,5].map(i => <IconStar key={i} size={11} color={i <= Math.round(p.rating) ? '#c9a961' : 'rgba(0,0,0,0.1)'} />)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{p.reviews} đánh giá</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[5,4,3,2,1].map(s => (
            <div key={s} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', width: 8 }}>{s}</div>
              <div style={{ flex: 1, height: 5, background: 'var(--line)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--gold)', width: s === 5 ? '80%' : s === 4 ? '15%' : '5%', borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {REVIEWS.map((r, i) => (
        <div key={i} style={{ paddingBottom: 18, marginBottom: 18, borderBottom: '1px solid var(--line-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontFamily: 'Be Vietnam Pro', fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{r.name}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{r.date}</div>
          </div>
          <div style={{ display: 'flex', gap: 1, marginBottom: 8 }}>
            {[1,2,3,4,5].map(j => <IconStar key={j} size={11} color={j <= r.rating ? '#c9a961' : 'rgba(0,0,0,0.1)'} />)}
          </div>
          <p style={{ ...bodyS, margin: 0 }}>{r.body}</p>
          {i === 0 && REVIEW_MEDIA && (
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {REVIEW_MEDIA.map((m, k) => (
                <div key={k} style={{ width: 60, height: 60, borderRadius: 5, overflow: 'hidden', border: '1px solid var(--line)', position: 'relative' }}>
                  <div className="ph" style={{ width: '100%', height: '100%', fontSize: 8, padding: 4, textAlign: 'center', lineHeight: 1.3 }}>
                    {m.type === 'video' ? '▶' : '📷'}
                  </div>
                  {m.type === 'video' && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(20,14,9,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="white"><path d="M2 1l7 4-7 4V1z"/></svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TabBlock({ eyebrow, body, children }) {
  return (
    <div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 10 }}>{eyebrow}</div>
      {body && <p style={{ ...bodyS, margin: 0 }}>{body}</p>}
      {children}
    </div>
  );
}

const bodyS = { fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 };

function CompareModal({ p, onClose, activeBg, activeFrame }) {
  const [combos, setCombos] = React.useState([
    { bg: activeBg,                          frame: activeFrame },
    { bg: p.bgTones[1] || p.bgTones[0],      frame: p.frames[1] || p.frames[0] },
    { bg: p.bgTones[2] || p.bgTones[0],      frame: p.frames[0] },
  ]);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,14,9,0.88)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--ivory)', borderBottom: '1px solid var(--line)' }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase' }}>So sánh biến thể</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 600 }}>{p.title}</div>
        </div>
        <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><IconClose size={22} /></button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 12px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {combos.map((c, i) => {
          const bi = BG_TONES.find(b => b.id === c.bg) || BG_TONES[0];
          const fi = FRAME_STYLES.find(f => f.id === c.frame) || FRAME_STYLES[0];
          return (
            <div key={i} style={{ background: '#fffdf7', borderRadius: 8, padding: 10, border: '1px solid var(--line)' }}>
              <ArtPiece bg={c.bg} frame={c.frame} label={`Phương án ${i+1}`} pad={10} aspect="4/3" />
              <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--ink-2)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{bi.name}</span><span style={{ color: 'var(--muted)' }}>·</span><span>{fi.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
                {p.bgTones.map(t => (
                  <VariantSwatch key={t} tone={t} size={16} active={t === c.bg}
                    onClick={() => setCombos(cs => cs.map((cc, j) => j === i ? { ...cc, bg: t } : cc))} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.ScreenProduct = ScreenProduct;
