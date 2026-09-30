// Desktop canvas — shared board definitions + page switcher
function Measured({ id, w, onH, children }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => { const h = Math.ceil(Math.max(el.offsetHeight, el.scrollHeight)); if (h) onH(id, h + 2); };
    const ro = new ResizeObserver(fit); ro.observe(el);
    const t = [0, 200, 600, 1500, 3000].map(ms => setTimeout(fit, ms));
    requestAnimationFrame(fit); document.fonts && document.fonts.ready.then(fit);
    return () => { ro.disconnect(); t.forEach(clearTimeout); };
  }, []);
  return <VW.Provider value={w}><div ref={ref} style={{ width: w, overflow: 'hidden', display: 'flow-root' }}>{children}</div></VW.Provider>;
}


const WIDTHS = [1440, 768, 375];
const row = (sec, title, sub, key, label, mk) => ({ sec, title, sub, items: WIDTHS.map(w => [`${key}-${w}`, `${label} · ${w}`, w, mk()]) });
const DESK_PAGES = [
  { id: 'browse', file: 'Desktop - Home.html', label: 'Duyệt hàng', sub: 'Menu · Trang chủ · Danh mục · Sản phẩm · Đã lưu' },
  { id: 'buy', file: 'Desktop - Mua hang.html', label: 'Mua hàng & Đơn', sub: 'Giỏ · Đặt hàng · Tra cứu · Chi tiết đơn' },
  { id: 'content', file: 'Desktop - Noi dung.html', label: 'Nội dung', sub: 'Cẩm nang · Liên hệ · Giới thiệu · FAQ · Hướng dẫn' },
];
const DESK_GROUPS = {
  browse: [
  { sec: 'nav', title: 'Menu "Sản phẩm"', sub: 'Nhóm theo mục đích + sản phẩm nổi bật · rê chuột hoặc bấm để mở, Esc để đóng', items: [
    ['nav-grouped', 'Menu mở · 1440', 1440, <DeskHome variant="split" megaOpen />],
  ] },
  row('home', 'Trang chủ', 'Hero · cam kết · danh mục · khuyến mãi · nổi bật · câu chuyện · showroom', 'home-a', 'Trang chủ', () => <DeskHome variant="split" />),
  { sec: 'campaign', title: 'Khuyến mãi (CampaignsSection)', sub: '1 chương trình = băng ngang · 2–3 = lưới (desktop) / cuộn ngang 85% (mobile) · 0 = ẩn', items: [
    ['campaign-one-1440', '1 chương trình · 1440', 1440, <div style={{ padding: 32, background: 'var(--ivory)' }}><CampaignBlock campaigns={CAMPAIGNS.slice(0, 1)} /></div>],
    ['campaign-many-1440', '2 chương trình · 1440', 1440, <div style={{ padding: 32, background: 'var(--ivory)' }}><CampaignBlock campaigns={CAMPAIGNS} /></div>],
    ['campaign-one-375', '1 chương trình · 375', 375, <div style={{ padding: 16, background: 'var(--ivory)' }}><CampaignBlock campaigns={CAMPAIGNS.slice(0, 1)} /></div>],
    ['campaign-many-375', '2 chương trình · 375', 375, <div style={{ padding: 16, background: 'var(--ivory)', overflow: 'hidden' }}><CampaignBlock campaigns={CAMPAIGNS} /></div>],
  ] },
  row('cats', 'Danh mục (tổng)', 'Lưới ô danh mục', 'cats', 'Danh mục', () => <DeskCategories />),
  row('list', 'Danh mục / Sản phẩm', 'Sidebar lọc → nút Bộ lọc (tablet/mobile)', 'list-a', 'Listing', () => <DeskListing variant="sidebar" />),
  row('pdp', 'Chi tiết sản phẩm', 'Ảnh chính + thumbnail bên dưới · khung mua dính bên phải', 'pdp-a', 'PDP', () => <DeskPDP variant="thumbs" />),
  row('saved', 'Đã lưu', 'Cùng lưới với trang danh mục', 'saved', 'Đã lưu', () => <DeskSaved />),
  ],
  buy: [
  row('cart', 'Giỏ hàng', 'Tóm tắt bên phải → xếp dưới, thanh đặt hàng dính đáy trên mobile', 'cart', 'Giỏ', () => <DeskCart />),
  row('checkout', 'Đặt hàng', 'Form trái · tóm tắt phải', 'checkout', 'Đặt hàng', () => <DeskCheckout />),
  row('orders', 'Tra cứu đơn hàng (bảo mật)', 'Bấm thử: nhập SĐT → chọn đơn → xác minh bằng mã đơn hoặc OTP', 'orders', 'Tra cứu', () => <DeskOrderLookup />),
  { sec: 'orders-states', title: 'Tra cứu — các trạng thái', sub: 'Danh sách che thông tin · Xác minh · Khoá sau 5 lần sai · Chi tiết đã xác minh', items: [
    ['lk-list', 'Danh sách (đã che)', 1440, <DeskOrderLookup initial="list" />],
    ['lk-verify', 'Xác minh', 1440, <DeskOrderLookup initial="verify" />],
    ['lk-locked', 'Tạm khoá', 1440, <DeskOrderLookup initial="locked" />],
    ['lk-detail', 'Chi tiết', 1440, <DeskOrderLookup initial="detail" />],
  ] },
  row('order', 'Chi tiết đơn hàng', 'Tiến trình + sản phẩm · cột thanh toán', 'order', 'Chi tiết đơn', () => <DeskOrderDetail />),
  ],
  content: [
  row('blog', 'Cẩm nang', 'Bài nổi bật + lưới bài · lọc theo chủ đề', 'blog', 'Cẩm nang', () => <DeskBlog />),
  row('article', 'Bài viết', 'Cột đọc 760px · CTA Zalo · bài liên quan', 'article', 'Bài viết', () => <DeskArticle />),
  row('contact', 'Liên hệ', 'Bản đồ · thông tin · form', 'contact', 'Liên hệ', () => <DeskContact />),
  row('faq', 'Câu hỏi thường gặp', 'Cột đọc 760px', 'faq', 'FAQ', () => <DeskFAQ />),
  row('guide', 'Hướng dẫn mua hàng', 'Cột đọc 760px', 'guide', 'Hướng dẫn', () => <DeskGuide />),
  row('craft', 'Giới thiệu · Làng nghề', 'Ảnh + chữ xen kẽ', 'craft', 'Làng nghề', () => <DeskCraft />),
  ],
};

function PageSwitch() {
  const cur = window.DESK_PAGE || 'browse';
  return (
    <nav style={{ position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', gap: 4, padding: 4, background: 'rgba(42,31,26,0.92)', borderRadius: 999, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', fontFamily: 'Be Vietnam Pro' }}>
      {DESK_PAGES.map(p => (
        <a key={p.id} href={encodeURI(p.file)} title={p.sub} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', background: p.id === cur ? 'var(--gold)' : 'transparent', color: p.id === cur ? 'var(--ink)' : 'var(--ivory)' }}>{p.label}</a>
      ))}
    </nav>
  );
}

addEventListener('hashchange', () => location.reload());
function Solo({ item }) { const [, , w, el] = item; return <div style={{ zoom: Math.min(1, innerWidth / w), width: w, background: '#fff' }}><VW.Provider value={w}><div style={{ width: w }}>{el}</div></VW.Provider></div>; }
function Root() {
  const solo = location.hash.slice(1);
  let soloItem = null; [].concat(...Object.values(DESK_GROUPS)).forEach(s => s.items.forEach(it => { if (it[0] === solo) soloItem = it; }));
  return soloItem ? <Solo item={soloItem} /> : <CanvasRoot />;
}
function CanvasRoot() {
  const BOARDS = DESK_GROUPS[window.DESK_PAGE] || DESK_GROUPS.browse;
  const [hs, setHs] = React.useState({});
  const onH = React.useCallback((id, h) => setHs(m => m[id] === h ? m : { ...m, [id]: h }), []);
  return (
    <>
    <PageSwitch />
    <DesignCanvas>
      {BOARDS.map(s => (
        <DCSection key={s.sec} id={s.sec} title={s.title} subtitle={s.sub}>
          {s.items.map(([id, label, w, el]) => (
            <DCArtboard key={id} id={id} label={label} width={w} height={hs[id] || 1800}>
              <Measured id={id} w={w} onH={onH}>{el}</Measured>
            </DCArtboard>
          ))}
        </DCSection>
      ))}
    </DesignCanvas>
    </>
  );
}


Object.assign(window, { Root, DESK_PAGES });
