// Responsive shell — header, breadcrumbs, footer. Breakpoints driven by artboard width via VW context.

const DW = 1344;
const VW = React.createContext(1440);
// xl ≥1200 · lg ≥1000 · md ≥700 (tablet) · sm (mobile)
const useBp = () => { const w = React.useContext(VW); return w >= 1200 ? 'xl' : w >= 1000 ? 'lg' : w >= 700 ? 'md' : 'sm'; };
const useNarrow = () => useBp() !== 'xl';
const useCompact = () => { const b = useBp(); return b === 'md' || b === 'sm'; };
const pick = (bp, m) => m[bp] ?? m.md ?? m.lg ?? m.xl;

function Wrap({ children, style = {} }) {
  const bp = useBp();
  const pad = pick(bp, { xl: 32, lg: 32, md: 24, sm: 16 });
  return <div style={{ maxWidth: DW, margin: '0 auto', padding: `0 ${pad}px`, width: '100%', ...style }}>{children}</div>;
}

function Logo({ size = 40, sub = true, fs = 20 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
      <DrumMark size={size} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'Lora, serif', fontWeight: 600, fontSize: fs, color: 'var(--son)', lineHeight: 1, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>Đồ Đồng Trường Thơi</div>
        {sub && <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 11.5, color: 'var(--bronze)', letterSpacing: '0.08em', marginTop: 3 }}>tinh hoa làng nghề Việt</div>}
      </div>
    </div>
  );
}

function IcoBtn({ Ic, count, label }) {
  return (
    <button aria-label={label} style={{ position: 'relative', width: 40, height: 40, display: 'grid', placeItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink)' }}>
      <Ic size={22} />
      {count > 0 && <span style={{ position: 'absolute', top: 3, right: 1, minWidth: 16, height: 16, padding: '0 4px', background: 'var(--son)', color: 'white', borderRadius: 8, fontSize: 10, fontWeight: 700, display: 'grid', placeItems: 'center' }}>{count}</span>}
    </button>
  );
}

function SearchBox({ w, ph }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, width: w, background: '#fffdf7', border: '1px solid var(--line)', borderRadius: 20, padding: '0 14px', minWidth: 0 }}>
      <IconSearch size={16} color="var(--muted)" />
      <span style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ph}</span>
    </div>
  );
}

const DESK_CATS = [
  { id: 'tranh-dong', name: 'Tranh đồng', count: 42, tone: 'gold' },
  { id: 'mat-trong', name: 'Mặt trống đồng', count: 12, tone: 'bronze' },
  { id: 'qua-trong', name: 'Quả trống đồng', count: 8, tone: 'dark' },
  { id: 'dinh-dong-tho-cung', name: 'Đồ thờ cúng', count: 18, tone: 'red' },
  { id: 'qua-tang', name: 'Quà tặng', count: 0, tone: 'bronze', soon: true },
];
const MENU_GROUPS = [
  { t: 'Tranh đồng', all: 'Tất cả tranh đồng', items: [['tranh-phong-thuy', 'Tranh phong thủy'], ['tranh-tu-quy', 'Tranh tứ quý'], ['tranh-chu', 'Tranh chữ thư pháp'], ['tranh-coi-nguon', 'Cội nguồn quê hương']] },
  { t: 'Trống đồng', all: 'Tất cả trống đồng', items: [['mat-trong', 'Mặt trống đồng'], ['qua-trong', 'Quả trống đồng']] },
  { t: 'Đồ thờ cúng', all: 'Tất cả đồ thờ', items: [['dinh-dong-tho-cung', 'Đỉnh đồng'], ['tam-ngu-su', 'Bộ tam sự · ngũ sự'], ['hoanh-phi', 'Hoành phi câu đối']] },
  { t: 'Quà tặng', badge: 'Sắp có', all: 'Xem bộ sưu tập quà', items: [['qua-de-ban', 'Quà để bàn'], ['linh-vat', 'Linh vật phong thủy'], ['qua-doanh-nghiep', 'Quà tặng doanh nghiệp']], note: 'Đặt số lượng · khắc logo · hộp quà' },
];

function MegaMenu({ active, open, onEnter, onLeave }) {
  const narrow = useBp() === 'lg';
  const stag = (i) => ({ opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(6px)', transition: `opacity 260ms ease ${open ? 50 + i * 40 : 0}ms, transform 320ms cubic-bezier(.2,.8,.2,1) ${open ? 50 + i * 40 : 0}ms` });
  const shell = { position: 'absolute', left: 0, right: 0, top: '100%', background: 'var(--ivory)', borderTop: '1px solid var(--line-2)', borderBottom: '1px solid var(--line)', boxShadow: '0 28px 40px -28px rgba(42,31,26,0.45)', zIndex: 50, clipPath: open ? 'inset(0 0 -60px 0)' : 'inset(0 0 100% 0)', visibility: open ? 'visible' : 'hidden', pointerEvents: open ? 'auto' : 'none', transition: open ? 'clip-path 340ms cubic-bezier(.2,.8,.2,1), visibility 0s' : 'clip-path 200ms ease, visibility 0s 200ms' };
  const feat = PRODUCTS.slice(0, narrow ? 0 : 2);
  return (
    <div onMouseEnter={onEnter} onMouseLeave={onLeave} style={shell}>
      <Wrap style={{ display: 'grid', gridTemplateColumns: `repeat(4, minmax(0,1fr))${feat.length ? ' minmax(0,1.6fr)' : ''}`, gap: narrow ? 24 : 36, padding: '26px 32px 28px', alignItems: 'stretch' }}>
        {MENU_GROUPS.map((g, gi) => (
          <div key={g.t} style={{ ...stag(gi), display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, alignSelf: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 30, marginBottom: 6, borderBottom: '1px solid var(--line)', boxSizing: 'border-box', paddingBottom: 8 }}>
              <span className="label-mono" style={{ color: 'var(--bronze)', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{g.t}</span>
              {g.badge && <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--son)', background: 'rgba(139,30,30,0.08)', padding: '2px 6px', borderRadius: 8, whiteSpace: 'nowrap', flexShrink: 0 }}>{g.badge}</span>}
            </div>
            {g.items.map(([id, name]) => (
              <div key={id} className="mm-link" style={{ fontFamily: 'Lora, serif', fontSize: 15, padding: '6px 0', cursor: 'pointer', color: active === id ? 'var(--son)' : 'var(--ink)', fontWeight: active === id ? 600 : 500 }}>{name}</div>
            ))}
            {g.note && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.45 }}>{g.note}</div>}
            <div className="mm-link" style={{ fontSize: 13, color: 'var(--son)', marginTop: 'auto', paddingTop: 12, cursor: 'pointer', fontWeight: 500 }}>{g.all} →</div>
          </div>
        ))}
        {feat.length > 0 && <div style={{ ...stag(4), display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
          <div className="label-mono" style={{ color: 'var(--bronze)', fontSize: 10, height: 30, display: 'flex', alignItems: 'center', boxSizing: 'border-box', paddingBottom: 8, borderBottom: '1px solid var(--line)', marginBottom: -4 }}>Bán chạy</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {feat.map(p => (
              <div key={p.id} className="mm-tile" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
                <div style={{ borderRadius: 8, overflow: 'hidden', background: 'var(--ivory-2)', padding: 10 }}><div className="mm-img"><ArtPiece bg={p.defaultBg} frame={p.defaultFrame} pad={4} aspect="4/3" imgSrc={p.image} /></div></div>
                <span style={{ fontFamily: 'Lora, serif', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</span>
                <span className="price-num" style={{ fontSize: 13, color: 'var(--son)', marginTop: -4 }}>từ {fmtVND(p.price)}</span>
              </div>
            ))}
          </div>
        </div>}
      </Wrap>
    </div>
  );
}

function DeskHeader({ active, cartCount = 2, savedCount = 2, megaOpen: megaInit = false }) {
  const [megaOpen, setMega] = React.useState(megaInit);
  const tm = React.useRef();
  const enter = () => { clearTimeout(tm.current); setMega(true); };
  const leave = () => { clearTimeout(tm.current); tm.current = setTimeout(() => setMega(false), 180); };
  React.useEffect(() => { if (!megaOpen) return; const k = e => e.key === 'Escape' && setMega(false); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [megaOpen]);
  const bp = useBp();
  if (bp === 'md' || bp === 'sm') {
    const sm = bp === 'sm';
    return (
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'var(--ivory)', borderBottom: '1px solid var(--line)' }}>
        <Wrap style={{ display: 'grid', gridTemplateColumns: sm ? '40px minmax(0,1fr) auto' : 'auto minmax(0,1fr) auto', gap: sm ? 8 : 16, alignItems: 'center', height: sm ? 56 : 64 }}>
          <IcoBtn Ic={IconMenu} label="Menu" />
          <div style={{ display: 'flex', justifyContent: sm ? 'center' : 'flex-start', minWidth: 0 }}><Logo size={sm ? 28 : 34} sub={!sm} fs={sm ? 16 : 18} /></div>
          <div style={{ display: 'flex', gap: 2 }}>
            {sm && <IcoBtn Ic={IconSearch} label="Tìm kiếm" />}
            {!sm && <IcoBtn Ic={IconBox} label="Tra cứu đơn hàng" />}
            {!sm && <IcoBtn Ic={IconHeart} count={savedCount} label="Đã lưu" />}
            <IcoBtn Ic={IconCart} count={cartCount} label="Giỏ hàng" />
          </div>
        </Wrap>
        {!sm && <Wrap style={{ paddingBottom: 12 }}><SearchBox w="100%" ph="Tìm tranh đồng, đỉnh đồng, tượng đồng…" /></Wrap>}
      </header>
    );
  }
  const narrow = bp === 'lg';
  const isCat = active === '__cats' || DESK_CATS.some(c => c.id === active);
  const links = [
    { id: 'products', name: 'Sản phẩm', on: isCat || megaOpen, drop: true },
    { id: 'craft', name: 'Giới thiệu', on: active === '__craft' },
    { id: 'blog', name: 'Cẩm nang', on: active === '__blog' },
    { id: 'contact', name: 'Liên hệ', on: active === '__contact' },
  ];
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'var(--ivory)', borderBottom: '1px solid var(--line)' }}>
      <Wrap style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr) auto', gap: narrow ? 20 : 36, alignItems: 'stretch', height: 76 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}><Logo size={narrow ? 34 : 40} sub={!narrow} fs={narrow ? 17 : 20} /></div>
        <nav style={{ display: 'flex', gap: narrow ? 20 : 28, justifyContent: 'flex-start', alignItems: 'stretch', minWidth: 0, overflow: 'hidden', paddingLeft: narrow ? 8 : 24 }}>
          {links.map(c => (
            <div key={c.id} {...(c.drop ? { onMouseEnter: enter, onMouseLeave: leave, onClick: () => setMega(m => !m), role: 'button', 'aria-expanded': megaOpen } : {})} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', fontFamily: 'Lora, serif', fontSize: narrow ? 14 : 15, fontWeight: 500, color: c.on ? 'var(--son)' : 'var(--ink)', borderBottom: c.on ? '2px solid var(--son)' : '2px solid transparent', marginBottom: -1, cursor: 'pointer' }}><span style={{ display: 'inline-grid' }}><span style={{ gridArea: '1/1', fontWeight: c.on ? 600 : 500 }}>{c.name}</span><span aria-hidden="true" style={{ gridArea: '1/1', fontWeight: 600, visibility: 'hidden' }}>{c.name}</span></span>{c.drop && <span style={{ display: 'inline-flex', transition: 'transform 220ms ease', transform: megaOpen ? 'rotate(180deg)' : 'none' }}><IconChevron dir="down" size={13} /></span>}</div>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: narrow ? 8 : 12 }}>
          <SearchBox w={narrow ? 170 : 220} ph={narrow ? 'Tìm sản phẩm…' : 'Tìm tranh đồng, đỉnh đồng…'} />
          <button className="nav-link" aria-label="Tra cứu đơn hàng" style={{ display: 'flex', alignItems: 'center', gap: 6, height: 40, padding: narrow ? '0 8px' : '0 12px', borderRadius: 20, border: '1px solid ' + (active === '__orders' ? 'var(--son)' : 'var(--line)'), background: 'transparent', cursor: 'pointer', fontFamily: 'Be Vietnam Pro', fontSize: 13, fontWeight: 500, color: active === '__orders' ? 'var(--son)' : 'var(--ink)', whiteSpace: 'nowrap' }}><IconBox size={18} />{!narrow && 'Tra cứu đơn'}</button>
          <IcoBtn Ic={IconHeart} count={savedCount} label="Đã lưu" />
          <IcoBtn Ic={IconCart} count={cartCount} label="Giỏ hàng" />
        </div>
      </Wrap>
      <MegaMenu active={active} open={megaOpen} onEnter={enter} onLeave={leave} />
    </header>
  );
}

// Spacing system: section = gap between page sections; block = title/toolbar → content; grid = card gaps
const vpad = (bp) => pick(bp, { xl: 72, lg: 64, md: 56, sm: 40 });
const blk = (bp) => pick(bp, { xl: 32, lg: 28, md: 24, sm: 20 });
const ggap = (bp) => pick(bp, { xl: 24, lg: 20, md: 16, sm: 12 });

function Crumbs({ items }) {
  const bp = useBp();
  if (bp === 'sm') return <div style={{ height: 16 }} />;
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--muted)', padding: bp === 'md' ? '16px 0' : '20px 0', flexWrap: 'wrap' }}>
      {items.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && <IconChevron size={12} color="var(--muted)" />}
          <span style={{ color: i === items.length - 1 ? 'var(--ink)' : 'var(--muted)' }}>{t}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function DeskHeading({ eyebrow, title, action }) {
  const sm = useBp() === 'sm';
  return (
    <div style={{ marginBottom: sm ? 16 : 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
        <div>
          {eyebrow && <div className="label-mono" style={{ color: 'var(--bronze)', fontSize: sm ? 10 : 11, marginBottom: 6 }}>{eyebrow}</div>}
          <div style={{ fontFamily: 'Lora, serif', fontSize: sm ? 22 : 32, fontWeight: 600, lineHeight: 1.15 }}>{title}</div>
        </div>
        {action && <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', color: 'var(--son)', fontSize: sm ? 13 : 15, display: 'flex', gap: 4, alignItems: 'center', whiteSpace: 'nowrap' }}>{action} <IconChevron size={13} color="var(--son)" /></div>}
      </div>
      <div className="dongson-rule" style={{ marginTop: sm ? 10 : 14 }} />
    </div>
  );
}

function DeskFooter() {
  const bp = useBp(); const sm = bp === 'sm'; const md = bp === 'md'; const stack = sm || md;
  const fs = stack ? 13.5 : 14;
  const col = { display: 'flex', flexDirection: 'column', gap: stack ? 8 : 10, fontSize: fs, minWidth: 0 };
  const h = { className: 'label-mono', style: { color: 'var(--gold)', fontSize: 10.5, marginBottom: 4 } };
  const px = pick(bp, { xl: 32, lg: 32, md: 24, sm: 16 });
  const socials = (
    <div style={{ display: 'flex', gap: 8 }}>
      {[IconZalo, IconMessenger, IconFacebook, IconTiktok].map((Ic, i) => (
        <div key={i} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(244,237,224,0.18)', display: 'grid', placeItems: 'center' }}><Ic size={20} /></div>
      ))}
    </div>
  );
  const brand = (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <DrumMark size={stack ? 36 : 44} color="var(--gold)" />
      <div>
        <div style={{ fontFamily: 'Lora, serif', fontWeight: 600, fontSize: stack ? 17 : 20, color: 'var(--gold)', lineHeight: 1 }}>Đồ Đồng Trường Thơi</div>
        <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 12, marginTop: 4 }}>tinh hoa làng nghề Việt</div>
      </div>
    </div>
  );
  const cols = [
    <div key="p" style={col}><div {...h}>Sản phẩm</div>{MENU_GROUPS.map(g => <span key={g.t}>{g.t}</span>)}</div>,
    <div key="s" style={col}><div {...h}>Hỗ trợ</div><span>Tra cứu đơn hàng</span><span>Hướng dẫn mua hàng</span><span>Câu hỏi thường gặp</span><span>Cẩm nang</span></div>,
    <div key="c" style={col}><div {...h}>Chính sách</div><span>Đổi trả</span><span>Vận chuyển & lắp đặt</span><span>Bảo hành</span><span>Thanh toán</span></div>,
  ];
  return (
    <footer style={{ background: 'var(--ink)', color: 'rgba(244,237,224,0.78)', marginTop: 'auto' }}>
      {stack ? (
        <Wrap style={{ padding: `${sm ? 32 : 36}px ${px}px ${sm ? 24 : 28}px`, display: 'flex', flexDirection: 'column', gap: sm ? 24 : 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', paddingBottom: sm ? 20 : 24, borderBottom: '1px solid rgba(244,237,224,0.1)' }}>{brand}{socials}</div>
          <div style={{ display: 'grid', gridTemplateColumns: sm ? 'repeat(2, minmax(0,1fr))' : 'repeat(3, minmax(0,1fr))', gap: sm ? '24px 16px' : 24 }}>{cols}</div>
        </Wrap>
      ) : (
        <Wrap style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) repeat(3, minmax(0,1fr))', gap: bp === 'lg' ? 24 : 40, padding: `52px ${px}px 40px` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {brand}
            <div style={{ fontSize: 13.5, lineHeight: 1.7, maxWidth: 320 }}>Tranh đồng, trống đồng và đồ thờ chế tác thủ công bởi nghệ nhân làng Đại Bái.</div>
            {socials}
          </div>
          {cols}
        </Wrap>
      )}
      <div style={{ borderTop: '1px solid rgba(244,237,224,0.1)' }}>
        <Wrap style={{ display: 'flex', flexDirection: sm ? 'column' : 'row', gap: 6, justifyContent: 'space-between', padding: `14px ${px}px`, fontSize: 12, color: 'rgba(244,237,224,0.6)' }}>
          <span>Công ty TNHH Đồ Đồng Trường Thơi · MST: Chưa cập nhật</span>
          <span>© 2026 Đồ Đồng Trường Thơi</span>
        </Wrap>
      </div>
    </footer>
  );
}

const SHOP = { name: 'Đồ Đồng Trường Thơi', address: 'Làng Đại Bái, Gia Bình, Bắc Ninh', phone: '0899 012 288', tel: '+84899012288', email: 'dodongtruongthoi@gmail.com', hours: 'T2–CN: 7:30 – 18:00', mapQ: 'Làng nghề đúc đồng Đại Bái, Gia Bình, Bắc Ninh' };
const mapEmbed = (z = 15) => 'https://maps.google.com/maps?q=' + encodeURIComponent(SHOP.mapQ) + '&z=' + z + '&hl=vi&output=embed';
const mapDir = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(SHOP.mapQ);
function MapEmbed({ height, radius = 10, z }) {
  return (
    <div style={{ position: 'relative', height, borderRadius: radius, overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--ivory-2)' }}>
      <iframe title={'Bản đồ ' + SHOP.name} src={mapEmbed(z)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}></iframe>
    </div>
  );
}

function VisitBlock() {
  const bp = useBp(); const sm = bp === 'sm'; const stack = sm || bp === 'md';
  const line = (Ic, children) => <div style={{ display: 'grid', gridTemplateColumns: '22px minmax(0,1fr)', gap: 10, alignItems: 'center' }}><Ic size={18} color="var(--bronze)" />{children}</div>;
  return (
    <section style={{ background: 'var(--ivory-2)', borderTop: '1px solid var(--line)' }}>
      <Wrap style={{ display: 'grid', gridTemplateColumns: stack ? 'minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,1.15fr)', gap: sm ? 20 : 40, alignItems: 'center', padding: `${sm ? 28 : 40}px ${pick(bp, { xl: 32, lg: 32, md: 24, sm: 16 })}px` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--bronze)', fontSize: 11 }}>Showroom & xưởng</div>
            <div style={{ fontFamily: 'Lora, serif', fontSize: pick(bp, { xl: 26, lg: 24, md: 24, sm: 22 }), fontWeight: 600, marginTop: 6, lineHeight: 1.2 }}>Xưởng sản xuất & Showroom</div>
          </div>
          <div style={{ display: 'flex', flexDirection: sm ? 'column' : 'row', flexWrap: 'wrap', gap: sm ? 10 : '10px 32px', fontSize: 15 }}>
            {line(IconPin, <span style={{ whiteSpace: sm ? 'normal' : 'nowrap' }}>{SHOP.address}</span>)}
            {line(IconPhone, <span style={{ fontFamily: 'Lora, serif', fontSize: 19, fontWeight: 700, color: 'var(--son)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{SHOP.phone}</span>)}
            {line(IconBox, <span style={{ color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>{SHOP.hours}</span>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: stack ? 'none' : 380, marginTop: 6 }}>
            <a href={'tel:' + SHOP.tel} style={{ ...deskBtn(true), textDecoration: 'none' }}><IconPhone size={16} color="white" /> Gọi ngay</a>
            <a href={mapDir} target="_blank" rel="noopener" style={{ ...deskBtn(false), background: '#fffdf7', textDecoration: 'none' }}><IconPin size={16} /> Chỉ đường</a>
          </div>
        </div>
        <MapEmbed height={pick(bp, { xl: 240, lg: 220, md: 240, sm: 200 })} />
      </Wrap>
    </section>
  );
}

function DeskPage({ active, children, bottomBar, megaOpen, noVisit }) {
  return (
    <div className="paper" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <DeskHeader active={active} megaOpen={megaOpen} />
      {children}
      {!noVisit && <VisitBlock />}
      <DeskFooter />
      {bottomBar}
    </div>
  );
}

// Mobile-only sticky action bar (mirrors repo's fixed bottom CTA)
function BottomBar({ children }) {
  return (
    <div style={{ position: 'sticky', bottom: 0, zIndex: 30, background: 'var(--ivory)', borderTop: '1px solid var(--line)', padding: '10px 16px 14px', display: 'flex', gap: 10, alignItems: 'center', boxShadow: '0 -8px 20px -12px rgba(0,0,0,0.25)' }}>{children}</div>
  );
}

const deskBtn = (primary) => ({ height: 50, padding: '0 22px', borderRadius: 6, fontFamily: 'Be Vietnam Pro', fontSize: 15, fontWeight: 600, cursor: 'pointer', border: primary ? 'none' : '1.5px solid var(--son)', background: primary ? 'var(--son)' : 'transparent', color: primary ? 'white' : 'var(--son)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, whiteSpace: 'nowrap' });
const deskCard = { background: '#fffdf7', border: '1px solid var(--line)', borderRadius: 10 };

Object.assign(window, { vpad, blk, ggap, SHOP, mapDir, MapEmbed, VisitBlock, DESK_CATS, MENU_GROUPS, MegaMenu, VW, useBp, useNarrow, useCompact, pick, Wrap, Logo, IcoBtn, SearchBox, DeskHeader, Crumbs, DeskHeading, DeskFooter, DeskPage, BottomBar, deskBtn, deskCard });
