// @ts-nocheck

// Product detail — tabs: Mô tả / Hướng dẫn / Thông số / Đánh giá

function ScreenProduct({ productId, onBack, recentIds = [], onOpenProduct, onOpenCategory, onOpenSaved, isSaved = false, onToggleSave, savedCount = 0 }) {
  const p = PRODUCTS.find(x => x.id === productId) || PRODUCTS[0];
  const [bg, setBg] = React.useState(p.defaultBg);
  const [frame, setFrame] = React.useState(p.defaultFrame);
  const [size, setSize] = React.useState(SIZES[2].id);
  const [tab, setTab] = React.useState('mota');
  const [compare, setCompare] = React.useState(false);

  React.useEffect(() => {
    setBg(p.defaultBg); setFrame(p.defaultFrame); setSize(SIZES[2].id); setTab('mota');
  }, [p.id]);

  const bgInfo = BG_TONES.find(b => b.id === bg);
  const frameInfo = FRAME_STYLES.find(f => f.id === frame);
  const sizeInfo = SIZES.find(s => s.id === size);
  const cat = CATEGORIES.find(c => c.id === p.categoryId);

  const recents = (recentIds || [])
    .filter(id => id !== p.id)
    .map(id => PRODUCTS.find(x => x.id === id))
    .filter(Boolean)
    .slice(0, 8);

  const tabs = [
    { id: 'mota',     label: 'Mô tả' },
    { id: 'huongdan', label: 'Hướng dẫn' },
    { id: 'thongso',  label: 'Thông số' },
    { id: 'danhgia',  label: 'Đánh giá' },
  ];

  return (
    <div data-screen-label="03 Product" className="paper" style={{ background: 'var(--ivory)', minHeight: '100%' }}>
      <TopBar title="Chi tiết sản phẩm" onBack={onBack} onOpenSaved={onOpenSaved} savedCount={savedCount} />

      {/* Hero art */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ background: '#fffdf7', border: '1px solid var(--line)', borderRadius: 10, padding: 12 }}>
          <ArtPiece bg={bg} frame={frame} label={p.title} pad={12} aspect="4/3" />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i === 0 ? 'var(--son)' : 'var(--line)' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Title block */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {cat && (
            <button onClick={() => onOpenCategory && onOpenCategory(cat.id)} style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.15em',
              color: 'var(--bronze)', textTransform: 'uppercase',
              background: 'rgba(107,68,35,0.08)', padding: '3px 8px', borderRadius: 3,
              border: '1px solid rgba(107,68,35,0.15)', cursor: 'pointer',
            }}>◦ {cat.name}</button>
          )}
          {p.badge && (
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.15em',
              color: 'var(--son)', textTransform: 'uppercase',
              background: 'rgba(139,30,30,0.08)', padding: '3px 7px', borderRadius: 3,
            }}>{p.badge}</span>
          )}
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 26, margin: '10px 0 6px', color: 'var(--ink)', lineHeight: 1.15 }}>{p.title}</h1>
        <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 13, color: 'var(--bronze)' }}>{p.subtitle}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <div style={{ display: 'flex', gap: 1 }}>{[1,2,3,4,5].map(i => <IconStar key={i} size={12} color="#c9a961" />)}</div>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{p.rating} · {p.reviews} đánh giá</span>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 10, paddingBottom: 14, borderBottom: '1px solid var(--line-2)' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 28 }}>{fmtVND(sizeInfo.price)}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>(đã bao gồm lắp đặt)</div>
        </div>
      </div>

      {/* Nền */}
      <div style={{ padding: '18px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase' }}>Chọn nền tranh</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 600, marginTop: 2 }}>{bgInfo.name}</div>
          </div>
          <button onClick={() => setCompare(true)} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'transparent', border: '1px solid var(--line)', borderRadius: 100,
            padding: '6px 10px', color: 'var(--ink)', fontSize: 11, cursor: 'pointer',
          }}><IconCompare size={12} /> So sánh</button>
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 0 4px' }} className="noscroll">
          {p.bgTones.map(t => {
            const info = BG_TONES.find(b => b.id === t); const on = t === bg;
            return (
              <button key={t} onClick={() => setBg(t)} style={{
                flexShrink: 0, padding: '6px 10px 6px 6px', borderRadius: 100,
                display: 'flex', alignItems: 'center', gap: 7,
                border: on ? '1.5px solid var(--son)' : '1px solid var(--line)',
                background: on ? 'rgba(139,30,30,0.06)' : '#fffdf7', cursor: 'pointer',
              }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: info.hex, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)' }} />
                <span style={{ fontSize: 11.5, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{info.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Khung */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase' }}>Chọn khung</div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 600, margin: '2px 0 10px' }}>{frameInfo.name}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 7 }}>
          {p.frames.map(f => {
            const info = FRAME_STYLES.find(x => x.id === f); const on = f === frame;
            return (
              <button key={f} onClick={() => setFrame(f)} style={{
                padding: 4, borderRadius: 6, cursor: 'pointer',
                border: on ? '1.5px solid var(--son)' : '1px solid var(--line)',
                background: on ? 'rgba(139,30,30,0.06)' : '#fffdf7',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <div className={`art-frame ${info.cls}`} style={{ '--p': '3px', width: '100%', aspectRatio: '1/1' }}>
                  <div className={`bronze-art ${bg}`} style={{ width: '100%', height: '100%' }} />
                </div>
                <div style={{ fontSize: 9, color: on ? 'var(--son)' : 'var(--muted)', textAlign: 'center', lineHeight: 1.2, height: 22 }}>{info.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase' }}>Kích thước</div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 600, margin: '2px 0 0' }}>{sizeInfo.name}</div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>
          {SIZES.map(s => {
            const on = s.id === size;
            return (
              <button key={s.id} onClick={() => setSize(s.id)} style={{
                padding: '8px 12px', borderRadius: 4,
                border: on ? '1.5px solid var(--son)' : '1px solid var(--line)',
                background: on ? 'rgba(139,30,30,0.06)' : '#fffdf7',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
              }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{s.name}</span>
                <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{fmtVND(s.price)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginTop: 24, borderTop: '1px solid var(--line-2)' }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line-2)', padding: '0 8px', overflowX: 'auto' }} className="noscroll">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: '1 0 auto', padding: '12px 14px', minWidth: 90,
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'Cormorant Garamond, serif', fontSize: 14, fontWeight: 600,
              color: tab === t.id ? 'var(--son)' : 'var(--muted)',
              borderBottom: tab === t.id ? '2px solid var(--son)' : '2px solid transparent',
              marginBottom: -1, whiteSpace: 'nowrap',
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ padding: '16px 18px' }}>
          {tab === 'mota' && <TabMota p={p} />}
          {tab === 'huongdan' && <TabHuongDan p={p} />}
          {tab === 'thongso' && <TabThongSo p={p} frameInfo={frameInfo} sizeInfo={sizeInfo} />}
          {tab === 'danhgia' && <TabDanhGia p={p} />}
        </div>
      </div>

      {/* Trust row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '18px 14px', margin: '12px 0 0', background: 'var(--ivory-2)', gap: 8 }}>
        {[{ t: 'Bảo hành', s: '10 năm' },{ t: 'Giao lắp', s: 'toàn quốc' },{ t: 'Đổi trả', s: '7 ngày' }].map(x => (
          <div key={x.t} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 14, color: 'var(--son)' }}>{x.s}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{x.t}</div>
          </div>
        ))}
      </div>

      {recents.length > 0 && (
        <div style={{ padding: '28px 0 0' }}>
          <SectionHeading eyebrow="Gợi nhớ" title="Đã xem gần đây" />
          <div style={{ overflowX: 'auto', padding: '0 0 8px' }} className="noscroll">
            <div style={{ display: 'flex', gap: 10, padding: '0 16px' }}>
              {recents.map(rp => (
                <div key={rp.id} onClick={() => onOpenProduct && onOpenProduct(rp.id)} style={{
                  flexShrink: 0, width: 150, background: '#fffdf7', border: '1px solid var(--line)',
                  borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
                }}>
                  <div style={{ padding: 6, background: 'var(--ivory-2)' }}>
                    <ArtPiece bg={rp.defaultBg} frame={rp.defaultFrame} label={rp.title} pad={4} aspect="4/3" />
                  </div>
                  <div style={{ padding: '8px 10px 10px' }}>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 13.5, fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rp.title}</div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{fmtVND(rp.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ height: 140 }} />

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'rgba(255, 253, 247, 0.92)', backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--line)', padding: '12px 14px 22px',
        display: 'flex', gap: 8, zIndex: 20,
      }}>
        <button onClick={() => onToggleSave && onToggleSave(p.id)} style={{
          padding: '12px 14px', borderRadius: 4,
          border: isSaved ? '1px solid var(--son)' : '1px solid var(--ink)',
          background: isSaved ? 'rgba(139,30,30,0.08)' : 'transparent',
          color: isSaved ? 'var(--son)' : 'var(--ink)',
          fontSize: 12, letterSpacing: '0.05em',
          display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
        }}><IconHeart size={14} color={isSaved ? 'var(--son)' : 'currentColor'} filled={isSaved} /> {isSaved ? 'Đã lưu' : 'Lưu'}</button>
        <button style={{
          flex: 1, padding: '12px 14px', borderRadius: 4, border: 'none',
          background: 'var(--son)', color: 'white', fontWeight: 500, fontSize: 13,
          letterSpacing: '0.05em', cursor: 'pointer', textTransform: 'uppercase',
        }}>Chat Zalo để chốt đơn</button>
      </div>

      {compare && <CompareModal p={p} onClose={() => setCompare(false)} activeBg={bg} activeFrame={frame} />}
    </div>
  );
}

// ── Tab: Mô tả (gộp cả ý nghĩa + giải thích tranh) ──
function TabMota({ p }) {
  return (
    <div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 6 }}>
        Về tác phẩm
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink-2)', margin: '0 0 14px' }}>{p.description}</p>

      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 6 }}>
        Ý nghĩa phong thủy
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink-2)', margin: '0 0 14px' }}>{p.meaning}</p>

      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 6 }}>
        Giải thích chi tiết
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink-2)', margin: '0 0 14px' }}>
        Mỗi chi tiết trên bức tranh đều được người nghệ nhân gửi gắm ý niệm riêng. Nét chạm nổi trung tâm là điểm nhấn, các hoa văn viền mang hơi hướm Đông Sơn, kết hợp cùng phông nền đồng được đánh bóng tạo nên chiều sâu thị giác.
      </p>

      <div style={{ marginTop: 8, padding: '12px 14px', background: 'rgba(201,169,97,0.1)', borderLeft: '2px solid var(--gold)', fontSize: 12.5, lineHeight: 1.6, color: 'var(--bronze)', fontFamily: 'Lora, serif', fontStyle: 'italic' }}>
        "Chúng tôi gò từng đường nét bằng tay, không dùng máy dập. Mỗi bức tranh vì thế là một bản độc nhất."
        <div style={{ marginTop: 6, fontSize: 10, fontStyle: 'normal', letterSpacing: '0.1em', color: 'var(--bronze-2)' }}>— NGHỆ NHÂN LÊ VĂN TRƯỜNG</div>
      </div>
    </div>
  );
}

// ── Tab: Hướng dẫn (mục đích + con giáp hợp) ──
function TabHuongDan({ p }) {
  const matchedZ = p.zodiac.map(id => ZODIAC.find(z => z.id === id)).filter(Boolean);
  return (
    <div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 8 }}>
        Mục đích sử dụng
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {p.purpose.place.map(x => (
          <span key={x} style={{ fontSize: 11.5, padding: '5px 10px', background: '#fffdf7', border: '1px solid var(--line)', borderRadius: 100, color: 'var(--ink-2)' }}>◦ {x}</span>
        ))}
      </div>

      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 8 }}>
        Trường hợp dùng
      </div>
      <ul style={{ margin: '0 0 16px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {p.purpose.use.map(x => (
          <li key={x} style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5, paddingLeft: 14, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, top: 5, width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }} />{x}
          </li>
        ))}
      </ul>

      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 8 }}>
        Lưu ý khi treo
      </div>
      <ul style={{ margin: '0 0 18px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {p.purpose.avoid.map(x => (
          <li key={x} style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5, paddingLeft: 14, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, top: 4, color: 'var(--son)', fontSize: 14, lineHeight: 1 }}>×</span>{x}
          </li>
        ))}
      </ul>

      {/* Con giáp hợp */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(139,30,30,0.04), rgba(201,169,97,0.08))',
        border: '1px solid rgba(139,30,30,0.15)',
        borderRadius: 8, padding: '14px 14px 10px', marginTop: 4,
      }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--son)', textTransform: 'uppercase', marginBottom: 4 }}>
          Hợp với tuổi
        </div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 600, marginBottom: 10, color: 'var(--ink)' }}>
          12 con giáp — {matchedZ.map(z => z.name).join(' · ')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {ZODIAC.map(z => {
            const on = p.zodiac.includes(z.id);
            return (
              <div key={z.id} style={{
                padding: '7px 4px', textAlign: 'center', borderRadius: 4,
                background: on ? 'var(--son)' : '#fffdf7',
                color: on ? 'white' : 'var(--muted)',
                border: on ? '1px solid var(--son)' : '1px solid var(--line)',
                opacity: on ? 1 : 0.55,
              }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 13, fontWeight: 600 }}>{z.name}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
          Người sinh vào các năm: <i>{matchedZ.map(z => z.years).join('; ')}</i> được cho là rất hợp với tác phẩm này.
        </div>
      </div>
    </div>
  );
}

// ── Tab: Thông số ──
function TabThongSo({ p, frameInfo, sizeInfo }) {
  const rows = [
    ['Chất liệu',    p.specs.material],
    ['Độ dày đồng',  p.specs.thickness],
    ['Cân nặng',     p.specs.weight],
    ['Kỹ thuật',     p.specs.technique],
    ['Khung',        `${frameInfo.name} — ${p.specs.frameMat}`],
    ['Kích thước',   sizeInfo.name],
    ['Hoàn thiện',   p.specs.finish],
    ['Bảo hành',     '10 năm chống xỉn màu'],
    ['Xuất xứ',      p.specs.origin],
    ['Thời gian làm', p.specs.leadTime],
  ];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 0, fontSize: 12.5 }}>
        {rows.map(([k, v], i) => (
          <React.Fragment key={k}>
            <div style={{ padding: '10px 0', color: 'var(--muted)', borderBottom: i < rows.length - 1 ? '1px solid var(--line-2)' : 'none' }}>{k}</div>
            <div style={{ padding: '10px 0', color: 'var(--ink)', borderBottom: i < rows.length - 1 ? '1px solid var(--line-2)' : 'none' }}>{v}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Đánh giá với ảnh/video ──
function TabDanhGia({ p }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 14, borderBottom: '1px solid var(--line-2)' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 600, color: 'var(--son)', lineHeight: 1 }}>{p.rating}</div>
        <div>
          <div style={{ display: 'flex', gap: 1 }}>{[1,2,3,4,5].map(i => <IconStar key={i} size={13} color="#c9a961" />)}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{p.reviews} lượt đánh giá</div>
        </div>
      </div>

      {/* Media từ người mua */}
      <div style={{ paddingTop: 14 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 8 }}>
          Ảnh / Video từ khách ({REVIEW_MEDIA.length})
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
          {REVIEW_MEDIA.map((m, i) => (
            <div key={i} style={{
              aspectRatio: '1/1', borderRadius: 4, overflow: 'hidden', position: 'relative',
              background:
                'repeating-linear-gradient(45deg, rgba(107,68,35,0.15) 0 5px, rgba(107,68,35,0.06) 5px 10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: 'var(--bronze)',
              padding: 4, textAlign: 'center', lineHeight: 1.2,
            }}>
              {m.type === 'video' && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(20,14,9,0.8)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              )}
              <span style={{ position: 'absolute', left: 3, bottom: 3, fontSize: 7, color: 'var(--bronze)' }}>{m.caption}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review list */}
      <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {REVIEWS.map((r, i) => (
          <div key={i} style={{ padding: '12px 0', borderBottom: i < REVIEWS.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: 12.5, color: 'var(--ink)' }}>{r.name}</strong>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>{r.date}</span>
            </div>
            <div style={{ display: 'flex', gap: 1, margin: '4px 0' }}>
              {Array.from({ length: r.rating }).map((_, j) => <IconStar key={j} size={10} color="#c9a961" />)}
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: '0 0 6px', lineHeight: 1.5 }}>{r.body}</p>
            {i === 0 && (
              <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                {[0,1,2].map(k => (
                  <div key={k} style={{
                    width: 54, height: 54, borderRadius: 4,
                    background: 'repeating-linear-gradient(45deg, rgba(107,68,35,0.18) 0 5px, rgba(107,68,35,0.06) 5px 10px)',
                    border: '1px solid var(--line)',
                    position: 'relative',
                  }}>
                    {k === 0 && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(20,14,9,0.7)"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareModal({ p, onClose, activeBg, activeFrame }) {
  const [combos, setCombos] = React.useState(() => ([
    { bg: activeBg, frame: activeFrame },
    { bg: p.bgTones[1] || p.bgTones[0], frame: p.frames[1] || p.frames[0] },
    { bg: p.bgTones[2] || p.bgTones[0], frame: p.frames[0] },
  ]));
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,14,9,0.72)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--ivory)' }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase' }}>So sánh biến thể</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 600 }}>{p.title}</div>
        </div>
        <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink)' }}><IconClose size={22} /></button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 12px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {combos.map((c, i) => {
          const bi = BG_TONES.find(b => b.id === c.bg); const fi = FRAME_STYLES.find(f => f.id === c.frame);
          return (
            <div key={i} style={{ background: '#fffdf7', borderRadius: 8, padding: 10, border: '1px solid var(--line)' }}>
              <ArtPiece bg={c.bg} frame={c.frame} label={`Phương án ${i+1}`} pad={10} aspect="4/3" />
              <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--ink-2)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{bi.name}</span><span style={{ color: 'var(--muted)' }}>·</span><span>{fi.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {p.bgTones.map(t => (
                  <VariantSwatch key={t} tone={t} size={14} active={t === c.bg}
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
