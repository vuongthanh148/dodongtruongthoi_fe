// Responsive screens — Home, Listing, PDP, Cart (1440 / 768 / 375)

function HeroSplit() {
  const bp = useBp(); const b = BANNERS[0];
  const compact = bp === 'md' || bp === 'sm'; const sm = bp === 'sm';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '2fr 1fr', gap: sm ? 12 : 20 }}>
      <div className="bronze-art dark" style={{ borderRadius: sm ? 10 : 12, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: pick(bp, { xl: 48, lg: 40, md: 36, sm: 22 }), height: pick(bp, { xl: 440, lg: 380, md: 360, sm: 300 }) }}>
        <img src={SAMPLE_IMG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
        <div style={{ position: 'absolute', inset: 0, background: sm ? 'linear-gradient(0deg, rgba(20,14,9,0.9) 10%, rgba(20,14,9,0.1) 80%)' : 'linear-gradient(90deg, rgba(20,14,9,0.85) 0%, rgba(20,14,9,0.2) 70%)' }} />
        <div style={{ position: 'relative', color: 'var(--ivory)', maxWidth: 460 }}>
          <div className="label-mono" style={{ color: 'var(--gold)', fontSize: sm ? 10 : 11 }}>{b.eyebrow}</div>
          <div style={{ fontFamily: 'Lora, serif', fontSize: pick(bp, { xl: 44, lg: 38, md: 36, sm: 26 }), fontWeight: 600, lineHeight: 1.12, margin: sm ? '8px 0' : '10px 0 12px', textWrap: 'balance' }}>{b.title}</div>
          <div style={{ fontSize: sm ? 14 : 16, opacity: 0.85, marginBottom: sm ? 16 : 24 }}>{b.body}</div>
          <button style={{ ...deskBtn(true), width: 'fit-content', height: sm ? 44 : 50 }}>{b.cta} →</button>
        </div>
        <div style={{ position: 'absolute', bottom: sm ? 16 : 24, right: sm ? 18 : 32, display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(i => <span key={i} style={{ width: i === 0 ? 22 : 8, height: 8, borderRadius: 4, background: i === 0 ? 'var(--gold)' : 'rgba(244,237,224,0.4)' }} />)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr 1fr' : '1fr', gridTemplateRows: compact ? 'auto' : '1fr 1fr', gap: sm ? 12 : 20 }}>
        {BANNERS.slice(1).map(x => (
          <div key={x.id} className={`bronze-art ${x.tone === 'red' ? 'red' : ''}`} style={{ borderRadius: sm ? 10 : 12, padding: sm ? 14 : 28, minHeight: sm ? 130 : 170, color: 'var(--ivory)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div className="label-mono" style={{ color: 'var(--gold)', fontSize: sm ? 9 : 10 }}>{x.eyebrow}</div>
            <div style={{ fontFamily: 'Lora, serif', fontSize: sm ? 16 : 22, fontWeight: 600, margin: '6px 0 4px', lineHeight: 1.2 }}>{x.title}</div>
            {!sm && <div style={{ fontSize: 13, opacity: 0.85 }}>{x.body}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroFull() {
  const bp = useBp(); const b = BANNERS[0]; const sm = bp === 'sm';
  return (
    <div className="bronze-art dark" style={{ height: pick(bp, { xl: 520, lg: 420, md: 440, sm: 460 }), position: 'relative', overflow: 'hidden' }}>
      <img src={SAMPLE_IMG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
      <div style={{ position: 'absolute', inset: 0, background: sm ? 'linear-gradient(0deg, rgba(20,14,9,0.92) 15%, rgba(20,14,9,0.1) 80%)' : 'linear-gradient(90deg, rgba(20,14,9,0.88) 0%, rgba(20,14,9,0.15) 75%)' }} />
      <Wrap style={{ position: 'relative', height: '100%', display: 'flex', alignItems: sm ? 'flex-end' : 'center', paddingBottom: sm ? 48 : 0 }}>
        <div style={{ color: 'var(--ivory)', maxWidth: 520 }}>
          <div className="label-mono" style={{ color: 'var(--gold)', fontSize: sm ? 10 : 11 }}>{b.eyebrow}</div>
          <div style={{ fontFamily: 'Lora, serif', fontSize: pick(bp, { xl: 54, lg: 42, md: 42, sm: 30 }), fontWeight: 600, lineHeight: 1.08, margin: '12px 0 14px', textWrap: 'balance' }}>{b.title}</div>
          <div style={{ fontSize: sm ? 15 : 17, opacity: 0.85, marginBottom: sm ? 20 : 28 }}>{b.body}</div>
          <div style={{ display: 'flex', gap: 10, flexDirection: sm ? 'column' : 'row' }}>
            <button style={deskBtn(true)}>{b.cta} →</button>
            <button style={{ ...deskBtn(false), color: 'var(--ivory)', borderColor: 'rgba(244,237,224,0.5)' }}>Xem bộ sưu tập</button>
          </div>
        </div>
      </Wrap>
      {!sm && <CarouselArrows onPrev={() => {}} onNext={() => {}} />}
      <div style={{ position: 'absolute', bottom: sm ? 20 : 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => <span key={i} style={{ width: i === 0 ? 22 : 8, height: 8, borderRadius: 4, background: i === 0 ? 'var(--gold)' : 'rgba(244,237,224,0.4)' }} />)}
      </div>
    </div>
  );
}

function DeskHome({ variant = 'split', megaOpen = false }) {
  const bp = useBp(); const sm = bp === 'sm'; const compact = bp === 'md' || sm;
  const cols = pick(bp, { xl: 4, lg: 3, md: 3, sm: 2 });
  const featured = [...PRODUCTS, ...PRODUCTS].slice(0, cols * 2);
  const gap = pick(bp, { xl: 24, lg: 20, md: 16, sm: 12 });
  const vgap = pick(bp, { xl: 72, lg: 64, md: 56, sm: 40 });
  return (
    <DeskPage active="home" megaOpen={megaOpen}>
      {variant === 'full' && <HeroFull />}
      <Wrap style={{ paddingTop: sm ? 16 : 28 }}>
        {variant === 'split' && <HeroSplit />}
        {sm ? (
          <div className="noscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '20px -16px 36px', padding: '0 16px' }}>
            {DESK_CATS.map(c => <span key={c.id} style={{ padding: '9px 14px', borderRadius: 18, fontSize: 13.5, whiteSpace: 'nowrap', background: '#fffdf7', border: '1px solid var(--line)' }}>{c.name}</span>)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compact ? 3 : 5}, minmax(0,1fr))`, gap: compact ? 12 : 16, margin: `28px 0 ${vgap - 8}px` }}>
            {DESK_CATS.map(c => (
              <div key={c.id} style={{ ...deskCard, padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
                {bp === 'xl' && <div className={`bronze-art ${c.tone === 'bronze' ? '' : c.tone}`} style={{ width: 52, height: 52, borderRadius: 8, flexShrink: 0 }} />}
                <div>
                  <div style={{ fontFamily: 'Lora, serif', fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{c.soon ? 'Sắp ra mắt' : c.count + ' sản phẩm'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <DeskHeading eyebrow="Nổi bật" title="Sản phẩm được yêu thích" action="Xem tất cả" />
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap }}>
          {featured.map((p, i) => <ProductCard key={i} p={p} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: sm ? 14 : 24, margin: `${vgap}px 0` }}>
          {STORIES.map(s => (
            <div key={s.id} style={{ ...deskCard, overflow: 'hidden', display: 'grid', gridTemplateColumns: sm ? '1fr' : `${pick(bp, { xl: 220, lg: 150, md: 200 })}px minmax(0,1fr)` }}>
              <div className={`bronze-art ${s.tone === 'dark' ? 'dark' : ''}`} style={{ minHeight: sm ? 150 : 180 }} />
              <div style={{ padding: sm ? 18 : 28, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                <div className="label-mono" style={{ color: 'var(--bronze)', fontSize: 10 }}>{s.eyebrow}</div>
                <div style={{ fontFamily: 'Lora, serif', fontSize: sm ? 18 : 22, fontWeight: 600, lineHeight: 1.25, textWrap: 'pretty' }}>{s.title}</div>
                <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', color: 'var(--son)', fontSize: 14 }}>Đọc câu chuyện →</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compact ? 2 : 4}, minmax(0,1fr))`, borderTop: '1px solid var(--line)', marginBottom: vgap - 8 }}>
          {[['Đồng nguyên chất 99%', 'Có giấy bảo hành chất liệu'], ['Chế tác thủ công', 'Nghệ nhân làng Đại Bái'], ['Bảo hành 12 tháng', 'Bảo dưỡng trọn đời'], ['Giao & lắp đặt', 'Toàn quốc 5–7 ngày']].map(([t, s], i) => (
            <div key={t} style={{ padding: sm ? '16px 12px' : '24px 20px', borderLeft: (compact ? i % 2 : i) ? '1px solid var(--line)' : 'none', borderBottom: '1px solid var(--line)' }}>
              <div style={{ fontFamily: 'Lora, serif', fontSize: sm ? 15 : 17, fontWeight: 600 }}>{t}</div>
              <div style={{ fontSize: sm ? 12 : 13, color: 'var(--muted)', marginTop: 4 }}>{s}</div>
            </div>
          ))}
        </div>
      </Wrap>
    </DeskPage>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div style={{ padding: '18px 0', borderBottom: '1px solid var(--line-2)' }}>
      <div className="label-mono" style={{ color: 'var(--bronze)', fontSize: 10.5, marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  );
}
function Check({ on, label, count }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
      <span style={{ width: 16, height: 16, borderRadius: 3, border: on ? 'none' : '1.5px solid var(--line)', background: on ? 'var(--son)' : '#fffdf7', display: 'grid', placeItems: 'center', color: 'white', fontSize: 11 }}>{on ? '✓' : ''}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {count != null && <span style={{ fontSize: 12, color: 'var(--muted)' }}>{count}</span>}
    </label>
  );
}
function DropFilter({ label, value, icon }) {
  return <div style={{ ...deskCard, height: 40, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, whiteSpace: 'nowrap', flexShrink: 0 }}>{icon}<span style={{ color: value ? 'var(--muted)' : 'var(--ink)' }}>{label}</span>{value && <b style={{ fontWeight: 600, color: 'var(--son)' }}>{value}</b>}<IconChevron dir="down" size={13} /></div>;
}

function DeskListing({ variant = 'sidebar' }) {
  const bp = useBp(); const sm = bp === 'sm'; const compact = bp === 'md' || sm;
  const [cat, setCat] = React.useState('tranh-dong');
  const c = DESK_CATS.find(x => x.id === cat);
  const cols = compact ? (sm ? 2 : 3) : variant === 'topbar' ? (bp === 'lg' ? 3 : 4) : (bp === 'lg' ? 2 : 3);
  const list = [...PRODUCTS, ...PRODUCTS, ...PRODUCTS].slice(0, cols * (sm ? 4 : 3));
  const gap = pick(bp, { xl: 24, lg: 20, md: 16, sm: 12 });
  const chips = (
    <div className="noscroll" style={{ display: 'flex', gap: 8, marginBottom: sm ? 14 : 20, alignItems: 'center', overflowX: 'auto' }}>
      {['Dưới 3 triệu', '1.2m × 0.8m'].map(t => (
        <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 10px', borderRadius: 16, background: 'var(--ivory-2)', border: '1px solid var(--line)', whiteSpace: 'nowrap' }}>{t} <IconClose size={12} /></span>
      ))}
      <span style={{ fontSize: 13, color: 'var(--son)', marginLeft: 4, whiteSpace: 'nowrap' }}>Xóa tất cả</span>
    </div>
  );
  const grid = (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap }}>
        {list.map((p, i) => <ProductCard key={i} p={p} />)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: sm ? 28 : 40 }}>
        <button style={{ ...deskBtn(false), width: sm ? '100%' : 240 }}>Xem thêm sản phẩm</button>
      </div>
    </div>
  );
  const pills = (
    <div className="noscroll" style={{ display: 'flex', gap: 8, marginBottom: 12, paddingBottom: sm ? 12 : 16, borderBottom: '1px solid var(--line-2)', overflowX: 'auto', ...(sm ? { margin: '0 -16px 12px', padding: '0 16px 12px' } : {}) }}>
      {DESK_CATS.map(x => (
        <span key={x.id} onClick={() => setCat(x.id)} style={{ padding: '8px 14px', borderRadius: 18, fontSize: 13.5, whiteSpace: 'nowrap', cursor: 'pointer', background: x.id === cat ? 'var(--son)' : '#fffdf7', color: x.id === cat ? 'white' : 'var(--ink)', border: x.id === cat ? '1px solid var(--son)' : '1px solid var(--line)' }}>{x.name}</span>
      ))}
    </div>
  );
  return (
    <DeskPage active={cat}>
      <Wrap>
        <Crumbs items={['Trang chủ', 'Danh mục', c.name]} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: sm ? 14 : 24 }}>
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <div style={{ fontFamily: 'Lora, serif', fontSize: pick(bp, { xl: 36, lg: 34, md: 30, sm: 24 }), fontWeight: 600, lineHeight: 1.15, whiteSpace: 'nowrap' }}>{c.name}</div>
            <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>{c.soon ? 'Sắp ra mắt' : c.count + ' sản phẩm'}</div>
          </div>
          {variant === 'sidebar' && !compact && <DropFilter label="Sắp xếp:" value="Phổ biến nhất" />}
        </div>
        {compact && variant === 'sidebar' && <>
          {pills}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <button style={{ ...deskCard, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}><IconFilter size={16} /> Bộ lọc <span style={{ background: 'var(--son)', color: 'white', borderRadius: 9, fontSize: 11, padding: '1px 7px' }}>2</span></button>
            <button style={{ ...deskCard, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>Phổ biến nhất <IconChevron dir="down" size={13} /></button>
          </div>
          {chips}
          <div style={{ marginBottom: 56 }}>{grid}</div>
        </>}
        {variant === 'topbar' && <>
          {pills}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, justifyContent: 'space-between' }}>
            <div className="noscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', minWidth: 0, ...(sm ? { margin: '0 -16px', padding: '0 16px' } : {}) }}>
              <DropFilter label="Khoảng giá" value={sm ? null : 'Dưới 3tr'} />
              <DropFilter label="Kích thước" value={sm ? null : '1.2m × 0.8m'} />
              <DropFilter label="Màu nền" />
              {sm && <DropFilter label="Sắp xếp" />}
            </div>
            {!sm && <DropFilter label="Sắp xếp:" value={compact ? null : 'Phổ biến nhất'} />}
          </div>
          {chips}
          <div style={{ marginBottom: compact ? 56 : 72 }}>{grid}</div>
        </>}
        {variant === 'sidebar' && !compact && <div style={{ display: 'grid', gridTemplateColumns: `${bp === 'lg' ? 216 : 248}px minmax(0,1fr)`, gap: bp === 'lg' ? 28 : 40, alignItems: 'start', marginBottom: 72 }}>
          <aside style={{ position: 'sticky', top: 100 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 6 }}>
              <span style={{ fontFamily: 'Lora, serif', fontSize: 18, fontWeight: 600 }}>Bộ lọc</span>
              <span style={{ fontSize: 13, color: 'var(--son)' }}>Xóa tất cả</span>
            </div>
            <FilterGroup title="Danh mục">
              {DESK_CATS.map(x => (
                <div key={x.id} onClick={() => setCat(x.id)} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, cursor: 'pointer', color: x.id === cat ? 'var(--son)' : 'var(--ink)', fontWeight: x.id === cat ? 600 : 400 }}>
                  <span>{x.name}</span><span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>{x.soon ? 'Sắp có' : x.count}</span>
                </div>
              ))}
            </FilterGroup>
            <FilterGroup title="Khoảng giá">
              <Check label="Dưới 3 triệu" count={8} on />
              <Check label="3 – 10 triệu" count={11} />
              <Check label="Trên 10 triệu" count={5} />
            </FilterGroup>
            <FilterGroup title="Kích thước">
              {SIZES.map((s, i) => <Check key={s.id} label={s.name} on={i === 1} />)}
            </FilterGroup>
            <FilterGroup title="Màu nền">
              <div style={{ display: 'flex', gap: 10 }}>
                {BG_TONES.map((t, i) => <VariantSwatch key={t.id} tone={t.id} active={i === 1} size={26} />)}
              </div>
            </FilterGroup>
          </aside>
          <div>{chips}{grid}</div>
        </div>}
      </Wrap>
    </DeskPage>
  );
}

function OptRow({ label, value, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span className="label-mono" style={{ color: 'var(--bronze)', fontSize: 10.5 }}>{label}</span>
        <span style={{ color: 'var(--ink-2)' }}>{value}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>
    </div>
  );
}
const optBtn = (on) => ({ whiteSpace: 'nowrap', padding: '10px 14px', minHeight: 44, borderRadius: 6, fontFamily: 'Be Vietnam Pro', fontSize: 13.5, cursor: 'pointer', background: on ? 'rgba(139,30,30,0.06)' : '#fffdf7', border: on ? '1.5px solid var(--son)' : '1px solid var(--line)', color: on ? 'var(--son)' : 'var(--ink)', fontWeight: on ? 600 : 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 2 });

function PdpGallery({ variant, p, bg, frame }) {
  const bp = useBp(); const sm = bp === 'sm'; const compact = bp === 'md' || sm;
  const [thumb, setThumb] = React.useState(0);
  const main = (
    <div style={{ background: 'var(--ivory-2)', borderRadius: sm ? 0 : 12, padding: pick(bp, { xl: 40, lg: 24, md: 32, sm: 24 }), ...(sm ? { margin: '0 -16px' } : {}) }}>
      <ArtPiece bg={bg} frame={frame} pad={sm ? 12 : 18} aspect="4/3" imgSrc={p.image} label={p.title} />
    </div>
  );
  if (variant === 'stack') {
    const shots = ['Chi tiết chạm nổi', 'Góc nghiêng', 'Treo phòng khách', 'Mặt sau & móc treo'];
    if (sm) return (
      <div style={{ minWidth: 0 }}>
        <div className="noscroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -16px', padding: '0 16px', scrollSnapType: 'x mandatory' }}>
          <div style={{ flex: '0 0 88%', background: 'var(--ivory-2)', borderRadius: 10, padding: 20, scrollSnapAlign: 'start' }}><ArtPiece bg={bg} frame={frame} pad={12} aspect="4/3" imgSrc={p.image} /></div>
          {shots.map(c => <div key={c} style={{ flex: '0 0 88%', background: 'var(--ivory-2)', borderRadius: 10, padding: 20 }}><ArtPiece bg={bg} frame={frame} pad={12} aspect="4/3" imgSrc={p.image} /></div>)}
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>1 / 5</div>
      </div>
    );
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compact ? 4 : 2}, minmax(0,1fr))`, gap: 12 }}>
        <div style={{ gridColumn: '1 / -1' }}>{main}</div>
        {shots.map(c => (
          <div key={c} style={{ background: 'var(--ivory-2)', borderRadius: 10, padding: compact ? 10 : 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ArtPiece bg={bg} frame={frame} pad={compact ? 4 : 6} aspect="1/1" imgSrc={p.image} />
            {!compact && <span style={{ fontSize: 12, color: 'var(--muted)' }}>{c}</span>}
          </div>
        ))}
      </div>
    );
  }
  const thumbs = [0, 1, 2, 3].map(i => (
    <div key={i} onClick={() => setThumb(i)} style={{ borderRadius: 6, padding: 3, border: thumb === i ? '2px solid var(--son)' : '1px solid var(--line)', cursor: 'pointer', width: pick(bp, { xl: 88, lg: 72, md: 80, sm: 64 }) }}>
      <ArtPiece bg={bg} frame={frame} pad={3} aspect="1/1" imgSrc={p.image} />
    </div>
  ));
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>{main}<div style={{ display: 'flex', gap: 10 }}>{thumbs}</div></div>;
}

function DeskPDP({ variant = 'thumbs' }) {
  const bp = useBp(); const sm = bp === 'sm'; const compact = bp === 'md' || sm;
  const p = PRODUCTS.find(x => x.id === 'tranh-ma-dao');
  const [bg, setBg] = React.useState(p.defaultBg);
  const [frame, setFrame] = React.useState(p.defaultFrame);
  const [size, setSize] = React.useState('m');
  const [tab, setTab] = React.useState('desc');
  const s = SIZES.find(x => x.id === size), f = FRAME_STYLES.find(x => x.id === frame), t = BG_TONES.find(x => x.id === bg);
  const price = Math.round(p.price * s.priceMul / 1000) * 1000 + f.add;
  const tabs = [['desc', 'Mô tả'], ['meaning', 'Ý nghĩa'], ['specs', 'Thông số'], ['reviews', `Đánh giá (${p.reviews})`]];
  const colGap = pick(bp, { xl: 56, lg: 32, md: 28, sm: 20 });
  const bar = sm ? (
    <BottomBar>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>Tạm tính</div>
        <div className="price-num" style={{ fontSize: 18, color: 'var(--son)' }}>{fmtVND(price)}</div>
      </div>
      <button style={{ ...deskBtn(false), height: 46, padding: '0 14px', fontSize: 14 }}>Thêm giỏ</button>
      <button style={{ ...deskBtn(true), height: 46, padding: '0 16px', fontSize: 14 }}>Mua ngay</button>
    </BottomBar>
  ) : null;
  return (
    <DeskPage active="tranh-dong" bottomBar={bar}>
      <Wrap>
        <Crumbs items={['Trang chủ', 'Tranh đồng', p.title]} />
        <div style={{ display: 'grid', gridTemplateColumns: compact ? 'minmax(0,1fr)' : 'minmax(0,1.25fr) minmax(0,1fr)', gap: colGap, alignItems: 'start' }}>
          <PdpGallery variant={variant} p={p} bg={bg} frame={frame} />
          <div style={{ position: compact ? 'static' : 'sticky', top: 100, display: 'flex', flexDirection: 'column', gap: sm ? 18 : 22 }}>
            <div>
              <div className="label-mono" style={{ color: 'var(--bronze)', fontSize: sm ? 10 : 11 }}>{p.subtitle}</div>
              <h1 style={{ fontFamily: 'Lora, serif', fontSize: pick(bp, { xl: 38, lg: 32, md: 32, sm: 26 }), fontWeight: 600, margin: '8px 0 10px', lineHeight: 1.1 }}>{p.title}</h1>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--muted)' }}>
                <span style={{ display: 'flex', gap: 2 }}>{[1, 2, 3, 4, 5].map(i => <IconStar key={i} size={14} color="#c9a961" />)}</span>
                {p.rating} · {p.reviews} đánh giá
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span className="price-num" style={{ fontSize: sm ? 28 : 34, color: 'var(--son)' }}>{fmtVND(price)}</span>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Đã gồm VAT</span>
            </div>
            <div style={{ fontSize: 13, padding: '10px 14px', borderRadius: 6, background: 'var(--ivory-2)', color: 'var(--ink-2)' }}>{t.name} · {f.name} · {s.name}</div>
            <OptRow label="Kích thước" value={s.name}>
              {SIZES.map(x => <button key={x.id} onClick={() => setSize(x.id)} style={optBtn(size === x.id)}>{x.name}</button>)}
            </OptRow>
            <OptRow label="Khung" value={f.add ? `+ ${fmtVND(f.add)}` : 'Đã gồm'}>
              {p.frames.map(id => { const x = FRAME_STYLES.find(y => y.id === id); return (
                <button key={id} onClick={() => setFrame(id)} style={optBtn(frame === id)}>
                  <span>{x.name}</span><span style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 400 }}>{x.add ? `+ ${fmtVND(x.add)}` : 'Đã gồm'}</span>
                </button>); })}
            </OptRow>
            <OptRow label="Màu nền" value={`${t.name} · miễn phí`}>
              {p.bgTones.map(id => <VariantSwatch key={id} tone={id} active={bg === id} size={sm ? 36 : 32} onClick={() => setBg(id)} />)}
            </OptRow>
            {!sm && <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) 50px', gap: 10, marginTop: 4 }}>
              <button style={deskBtn(false)}>Thêm vào giỏ</button>
              <button style={deskBtn(true)}>Mua ngay</button>
              <button style={{ ...deskBtn(false), padding: 0, borderColor: 'var(--line)', color: 'var(--ink)' }}><IconHeart size={20} /></button>
            </div>}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: 'var(--ink-2)', paddingTop: 14, borderTop: '1px solid var(--line-2)', flexWrap: 'wrap' }}>
              <IconPhone size={15} color="var(--son)" /> Cần tư vấn kích thước? Gọi <b style={{ color: 'var(--son)' }}>0899 012 288</b> hoặc nhắn Zalo
            </div>
          </div>
        </div>
        <div style={{ marginTop: pick(bp, { xl: 64, lg: 56, md: 48, sm: 36 }), marginBottom: pick(bp, { xl: 72, lg: 64, md: 56, sm: 40 }), display: 'grid', gridTemplateColumns: compact ? 'minmax(0,1fr)' : 'minmax(0,1.25fr) minmax(0,1fr)', gap: colGap }}>
          <div>
            <div className="noscroll" style={{ display: 'flex', gap: sm ? 22 : 32, borderBottom: '1px solid var(--line)', marginBottom: 24, overflowX: 'auto' }}>
              {tabs.map(([id, l]) => <div key={id} onClick={() => setTab(id)} style={{ padding: '12px 0', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Lora, serif', fontSize: sm ? 15 : 17, fontWeight: tab === id ? 600 : 500, color: tab === id ? 'var(--son)' : 'var(--ink-2)', borderBottom: tab === id ? '2px solid var(--son)' : '2px solid transparent', marginBottom: -1 }}>{l}</div>)}
            </div>
            {tab === 'desc' && <p style={{ fontSize: sm ? 15 : 16, lineHeight: 1.75, maxWidth: 640, margin: 0 }}>{p.description}</p>}
            {tab === 'meaning' && <p style={{ fontSize: sm ? 15 : 16, lineHeight: 1.75, maxWidth: 640, margin: 0 }}>{p.meaning}</p>}
            {tab === 'specs' && <SpecTable p={p} />}
            {tab === 'reviews' && <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>{REVIEWS.map(r => <div key={r.name} style={{ paddingBottom: 18, borderBottom: '1px solid var(--line-2)' }}><div style={{ fontWeight: 600, fontSize: 14 }}>{r.name} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>· {r.date}</span></div><div style={{ fontSize: 15, lineHeight: 1.6, marginTop: 6 }}>{r.body}</div></div>)}</div>}
          </div>
          {!compact && <div style={{ ...deskCard, padding: 24, alignSelf: 'start' }}>
            <div className="label-mono" style={{ color: 'var(--bronze)', fontSize: 10.5, marginBottom: 12 }}>Thông số chính</div>
            <SpecTable p={p} compact />
          </div>}
        </div>
        <DeskHeading eyebrow="Gợi ý" title="Sản phẩm liên quan" action="Xem thêm" />
        {(() => { const n = pick(bp, { xl: 4, lg: 3, md: 3, sm: 2 }); return (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, minmax(0,1fr))`, gap: pick(bp, { xl: 24, lg: 20, md: 16, sm: 12 }), marginBottom: sm ? 40 : 72 }}>
            {PRODUCTS.filter(x => x.id !== p.id).slice(0, sm ? 4 : n).map(x => <ProductCard key={x.id} p={x} />)}
          </div>); })()}
      </Wrap>
    </DeskPage>
  );
}

function SpecTable({ p, compact }) {
  const sm = useBp() === 'sm';
  const rows = [['Chất liệu', p.specs.material], ['Độ dày', p.specs.thickness], ['Kỹ thuật', p.specs.technique], ['Khung', p.specs.frameMat], ['Hoàn thiện', p.specs.finish], ['Xuất xứ', p.specs.origin], ['Thời gian chế tác', p.specs.leadTime]];
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {(compact ? rows.slice(0, 5) : rows).map(([k, v]) => (
        <div key={k} style={{ display: 'grid', gridTemplateColumns: `${sm ? 110 : 140}px minmax(0,1fr)`, gap: 12, padding: '10px 0', borderBottom: '1px solid var(--line-2)', fontSize: 14 }}>
          <span style={{ color: 'var(--muted)' }}>{k}</span><span>{v}</span>
        </div>
      ))}
    </div>
  );
}

function SummaryBox({ items, cta, note, hideCta }) {
  const compact = useCompact();
  const sub = items.reduce((a, it) => a + it.price * it.qty, 0);
  return (
    <div style={{ ...deskCard, padding: compact ? 20 : 28, position: compact ? 'static' : 'sticky', top: 100, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 600 }}>Tóm tắt đơn hàng</div>
      {[['Tạm tính', fmtVND(sub)], ['Phí giao hàng', 'Miễn phí'], ['Lắp đặt', 'Miễn phí nội thành HN']].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span style={{ color: 'var(--muted)' }}>{k}</span><span>{v}</span></div>
      ))}
      <div className="dongson-rule" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontWeight: 600 }}>Tổng cộng</span>
        <span className="price-num" style={{ fontSize: 26, color: 'var(--son)' }}>{fmtVND(sub)}</span>
      </div>
      {!hideCta && <button style={deskBtn(true)}>{cta}</button>}
      {note && <div style={{ fontSize: 12.5, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5 }}>{note}</div>}
    </div>
  );
}

const DESK_CART = [
  { pid: 'tranh-ma-dao', qty: 1, opts: 'Nền Đỏ · Khung Vàng Antique · 1.2m × 0.8m', price: 16_000_000 },
  { pid: 'dinh-dong-3-chan', qty: 1, opts: 'Bộ Tam Sự · cao 60cm', price: 4_500_000 },
];

function Qty({ q, onDec, onInc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: 6, width: 'fit-content', background: 'white' }}>
      <button onClick={onDec} aria-label="Giảm" style={{ width: 40, height: 40, border: 'none', background: 'transparent', cursor: 'pointer' }}><IconMinus /></button>
      <span style={{ width: 28, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{q}</span>
      <button onClick={onInc} aria-label="Tăng" style={{ width: 40, height: 40, border: 'none', background: 'transparent', cursor: 'pointer' }}><IconPlus /></button>
    </div>
  );
}

function DeskCart() {
  const bp = useBp(); const sm = bp === 'sm'; const compact = bp === 'md' || sm;
  const [items, setItems] = React.useState(DESK_CART);
  const setQty = (pid, q) => setItems(xs => q < 1 ? xs.filter(x => x.pid !== pid) : xs.map(x => x.pid === pid ? { ...x, qty: q } : x));
  const total = items.reduce((a, it) => a + it.price * it.qty, 0);
  const cols = bp === 'lg' ? 'minmax(0,1fr) 120px 130px 28px' : 'minmax(0,1fr) 140px 150px 40px';
  const bar = sm ? (
    <BottomBar>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>Tổng cộng</div>
        <div className="price-num" style={{ fontSize: 18, color: 'var(--son)' }}>{fmtVND(total)}</div>
      </div>
      <button style={{ ...deskBtn(true), height: 46, fontSize: 14 }}>Tiến hành đặt hàng</button>
    </BottomBar>
  ) : null;
  const rowCompact = (it, p) => (
    <div key={it.pid} style={{ display: 'grid', gridTemplateColumns: `${sm ? 96 : 140}px minmax(0,1fr)`, gap: sm ? 12 : 18, padding: sm ? 14 : 20, borderBottom: '1px solid var(--line-2)' }}>
      <ArtPiece bg={p.defaultBg} frame={p.defaultFrame} pad={sm ? 4 : 5} aspect="4/3" imgSrc={p.image} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontFamily: 'Lora, serif', fontSize: sm ? 16 : 18, fontWeight: 600, lineHeight: 1.2 }}>{p.title}</div>
          <button onClick={() => setQty(it.pid, 0)} aria-label="Xóa" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--muted)', padding: 0, width: 28, height: 28, flexShrink: 0 }}><IconClose size={18} /></button>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.4 }}>{it.opts}</div>
        <div style={{ fontSize: 13, color: 'var(--son)' }}>Đổi tùy chọn</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <Qty q={it.qty} onDec={() => setQty(it.pid, it.qty - 1)} onInc={() => setQty(it.pid, it.qty + 1)} />
          <span className="price-num" style={{ fontSize: sm ? 16 : 18, color: 'var(--son)' }}>{fmtVND(it.price * it.qty)}</span>
        </div>
      </div>
    </div>
  );
  return (
    <DeskPage bottomBar={bar}>
      <Wrap>
        <Crumbs items={['Trang chủ', 'Giỏ hàng']} />
        <div style={{ fontFamily: 'Lora, serif', fontSize: pick(bp, { xl: 36, lg: 34, md: 30, sm: 24 }), fontWeight: 600, marginBottom: sm ? 14 : 24 }}>Giỏ hàng <span style={{ fontSize: sm ? 15 : 18, color: 'var(--muted)', fontWeight: 400 }}>({items.length} sản phẩm)</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : `minmax(0,1fr) ${bp === 'lg' ? 320 : 400}px`, gap: pick(bp, { xl: 40, lg: 28, md: 20, sm: 16 }), alignItems: 'start', marginBottom: sm ? 40 : 72 }}>
          <div style={{ ...deskCard }}>
            {!compact && <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 20, padding: '14px 24px', borderBottom: '1px solid var(--line)', fontSize: 12, color: 'var(--muted)' }} className="label-mono">
              <span>Sản phẩm</span><span>Số lượng</span><span style={{ textAlign: 'right' }}>Thành tiền</span><span></span>
            </div>}
            {items.map(it => { const p = PRODUCTS.find(x => x.id === it.pid); if (compact) return rowCompact(it, p); return (
              <div key={it.pid} style={{ display: 'grid', gridTemplateColumns: cols, gap: bp === 'lg' ? 14 : 20, padding: 24, alignItems: 'center', borderBottom: '1px solid var(--line-2)' }}>
                <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                  <div style={{ width: bp === 'lg' ? 96 : 120, flexShrink: 0 }}><ArtPiece bg={p.defaultBg} frame={p.defaultFrame} pad={5} aspect="4/3" imgSrc={p.image} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Lora, serif', fontSize: 18, fontWeight: 600, lineHeight: 1.25 }}>{p.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{it.opts}</div>
                    <div style={{ fontSize: 13, color: 'var(--son)', marginTop: 8, cursor: 'pointer' }}>Đổi tùy chọn</div>
                  </div>
                </div>
                <Qty q={it.qty} onDec={() => setQty(it.pid, it.qty - 1)} onInc={() => setQty(it.pid, it.qty + 1)} />
                <div className="price-num" style={{ textAlign: 'right', fontSize: 18, color: 'var(--son)' }}>{fmtVND(it.price * it.qty)}</div>
                <button onClick={() => setQty(it.pid, 0)} aria-label="Xóa" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--muted)' }}><IconClose size={18} /></button>
              </div>); })}
            <div style={{ padding: sm ? '14px' : '18px 24px', fontFamily: 'Lora, serif', fontStyle: 'italic', color: 'var(--son)', fontSize: 15 }}>← Tiếp tục mua sắm</div>
          </div>
          <SummaryBox items={items} cta="Tiến hành đặt hàng" hideCta={sm} note="Nhân viên sẽ gọi xác nhận đơn trong 30 phút (giờ hành chính)." />
        </div>
      </Wrap>
    </DeskPage>
  );
}

Object.assign(window, { DeskHome, DeskListing, DeskPDP, DeskCart, SummaryBox, Qty, OptRow, optBtn, DESK_CART, FilterGroup, Check });
