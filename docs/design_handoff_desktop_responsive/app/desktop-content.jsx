// Cẩm nang (list + article) and Liên hệ

const POSTS = [
  { id: 'chon-tranh-theo-menh', tag: 'Phong thủy', title: 'Chọn tranh đồng theo tuổi và mệnh gia chủ', date: '24/09/2026', read: 6, ex: 'Mỗi mệnh hợp một nhóm đề tài và màu nền khác nhau. Bài viết tổng hợp cách chọn nhanh cho phòng khách.' },
  { id: 'kich-thuoc-tranh', tag: 'Hướng dẫn', title: 'Kích thước tranh đồng nào hợp với phòng khách của bạn?', date: '18/09/2026', read: 4, ex: 'Quy tắc 2/3 chiều dài sofa và những kích thước phổ biến nhất: 1.2m, 1.55m, 1.97m.' },
  { id: 'bay-dinh-dong', tag: 'Thờ cúng', title: 'Cách bày đỉnh đồng và bộ tam sự đúng trên ban thờ', date: '10/09/2026', read: 5, ex: 'Vị trí đỉnh, hạc, chân nến theo lối bày truyền thống miền Bắc.' },
  { id: 'bao-quan-do-dong', tag: 'Bảo quản', title: 'Lau chùi và bảo quản đồ đồng để luôn sáng đẹp', date: '02/09/2026', read: 3, ex: 'Những việc nên và không nên làm để lớp hoàn thiện giả cổ không bị mất.' },
  { id: 'y-nghia-mat-trong', tag: 'Văn hoá', title: 'Ý nghĩa hoa văn trên mặt trống đồng Đông Sơn', date: '26/08/2026', read: 7, ex: 'Ngôi sao 14 cánh, chim Lạc và vòng hoa văn kể lại đời sống người Việt cổ.' },
  { id: 'qua-tang-tan-gia', tag: 'Quà tặng', title: 'Gợi ý quà tân gia bằng đồng theo ngân sách', date: '19/08/2026', read: 4, ex: 'Từ vài trăm nghìn tới vài triệu: những món nhỏ để bàn mà vẫn trang trọng.' },
];
const TAGS = ['Tất cả', 'Phong thủy', 'Hướng dẫn', 'Thờ cúng', 'Bảo quản', 'Văn hoá', 'Quà tặng'];

function PostCard({ p, big }) {
  const bp = useBp(); const sm = bp === 'sm'; const wide = big && (bp === 'xl' || bp === 'lg');
  return (
    <div className="mm-tile" style={{ display: wide ? 'grid' : 'flex', gridTemplateColumns: wide ? 'minmax(0,1.35fr) minmax(0,1fr)' : undefined, alignItems: wide ? 'center' : undefined, flexDirection: 'column', gap: wide ? 40 : 12, cursor: 'pointer', minWidth: 0 }}>
      <div style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: big ? '16/10' : '4/3' }}><div className="mm-img bronze-art dark" style={{ width: '100%', height: '100%' }}></div></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
      <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--muted)' }}><span style={{ color: 'var(--bronze)', fontWeight: 600 }}>{p.tag}</span><span>{p.date}</span><span>{p.read} phút đọc</span></div>
      <div style={{ fontFamily: 'Lora, serif', fontSize: big ? (sm ? 22 : 28) : 18, fontWeight: 600, lineHeight: 1.25, textWrap: 'pretty' }}>{p.title}</div>
      <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>{p.ex}</div>
      {wide && <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', color: 'var(--son)', fontSize: 15, marginTop: 4 }}>Đọc bài →</div>}
      </div>
    </div>
  );
}

function DeskBlog() {
  const bp = useBp(); const sm = bp === 'sm'; const compact = bp === 'md' || sm;
  const [tag, setTag] = React.useState('Tất cả');
  const list = POSTS.filter(p => tag === 'Tất cả' || p.tag === tag);
  const [first, ...rest] = list.length ? list : POSTS;
  return (
    <DeskPage active="__blog">
      <Wrap>
        <Crumbs items={['Trang chủ', 'Cẩm nang']} />
        <PageTitle title="Cẩm nang đồ đồng" sub="Kiến thức chọn, bày và giữ gìn đồ đồng cho gia đình." />
        <div className="noscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: blk(bp), ...(sm ? { margin: `0 -16px ${blk(bp)}px`, padding: '0 16px' } : {}) }}>
          {TAGS.map(t => <span key={t} onClick={() => setTag(t)} style={{ padding: '8px 14px', borderRadius: 18, fontSize: 13.5, whiteSpace: 'nowrap', cursor: 'pointer', background: t === tag ? 'var(--son)' : '#fffdf7', color: t === tag ? 'white' : 'var(--ink)', border: t === tag ? '1px solid var(--son)' : '1px solid var(--line)' }}>{t}</span>)}
        </div>
        <div style={{ marginBottom: sm ? 32 : 48 }}><PostCard p={first} big /></div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${pick(bp, { xl: 3, lg: 3, md: 2, sm: 1 })}, minmax(0,1fr))`, gap: sm ? 28 : 32, marginBottom: vpad(bp) }}>
          {rest.map(p => <PostCard key={p.id} p={p} />)}
        </div>
      </Wrap>
    </DeskPage>
  );
}

function DeskArticle() {
  const bp = useBp(); const sm = bp === 'sm'; const compact = bp === 'md' || sm;
  const p = POSTS[1];
  const para = { fontSize: sm ? 16 : 17.5, lineHeight: 1.8, color: 'var(--ink-2)', margin: '0 0 20px', textWrap: 'pretty' };
  const h2 = { fontFamily: 'Lora, serif', fontSize: sm ? 21 : 25, fontWeight: 600, margin: '36px 0 12px' };
  return (
    <DeskPage active="__blog">
      <Wrap>
        <Crumbs items={['Trang chủ', 'Cẩm nang', p.tag]} />
        <ReadCol>
          <div style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}><span style={{ color: 'var(--bronze)', fontWeight: 600 }}>{p.tag}</span><span>{p.date}</span><span>{p.read} phút đọc</span></div>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: pick(bp, { xl: 42, lg: 38, md: 34, sm: 27 }), fontWeight: 600, lineHeight: 1.15, margin: 0, textWrap: 'balance' }}>{p.title}</h1>
        </ReadCol>
        <div style={{ height: sm ? 20 : 28 }}></div>
        <div className="bronze-art dark" style={{ maxWidth: 1000, margin: '0 auto 36px', aspectRatio: '16/8', borderRadius: sm ? 8 : 12 }}></div>
        <ReadCol>
          <p style={{ ...para, fontSize: sm ? 17 : 19, color: 'var(--ink)' }}>{p.ex}</p>
          <h2 style={h2}>Quy tắc 2/3</h2>
          <p style={para}>Chiều ngang tranh nên bằng khoảng hai phần ba chiều dài sofa hoặc kệ bên dưới. Sofa 1.8m hợp với tranh khoảng 1.2m; sofa 2.4m hợp với tranh 1.55m.</p>
          <div style={{ ...deskCard, padding: sm ? 16 : 22, margin: '28px 0' }}>
            <div className="label-mono" style={{ color: 'var(--bronze)', fontSize: 10.5, marginBottom: 12 }}>Kích thước phổ biến</div>
            {[['1.2m × 0.8m', 'Phòng khách 15–20m²'], ['1.55m × 0.95m', 'Phòng khách 20–30m²'], ['1.97m × 1.1m', 'Sảnh, phòng lớn trên 30m²']].map(([k, v]) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderTop: '1px solid var(--line-2)', fontSize: 15 }}><b style={{ fontWeight: 600 }}>{k}</b><span style={{ color: 'var(--muted)' }}>{v}</span></div>)}
          </div>
          <h2 style={h2}>Độ cao treo</h2>
          <p style={para}>Tâm tranh đặt ngang tầm mắt người đứng, khoảng 1.5–1.6m tính từ sàn. Khi treo trên sofa, mép dưới tranh cách lưng ghế 20–30cm.</p>
          <div style={{ display: 'flex', flexDirection: sm ? 'column' : 'row', gap: 12, alignItems: sm ? 'stretch' : 'center', justifyContent: 'space-between', padding: sm ? 18 : 24, borderRadius: 10, background: 'var(--ivory-2)', margin: '36px 0 0' }}>
            <div><div style={{ fontFamily: 'Lora, serif', fontSize: 18, fontWeight: 600 }}>Chưa chắc kích thước?</div><div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 4 }}>Gửi ảnh bức tường qua Zalo, nghệ nhân sẽ tư vấn miễn phí.</div></div>
            <button style={deskBtn(true)}><IconZalo size={18} /> Nhắn Zalo</button>
          </div>
        </ReadCol>
        <div style={{ margin: `${vpad(bp)}px 0` }}>
          <DeskHeading eyebrow="Đọc tiếp" title="Bài viết liên quan" />
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compact ? (sm ? 1 : 2) : 3}, minmax(0,1fr))`, gap: sm ? 28 : 32 }}>
            {POSTS.filter(x => x.id !== p.id).slice(0, compact && !sm ? 2 : 3).map(x => <PostCard key={x.id} p={x} />)}
          </div>
        </div>
      </Wrap>
    </DeskPage>
  );
}

function DeskContact() {
  const bp = useBp(); const sm = bp === 'sm'; const compact = bp === 'md' || sm;
  const [sent, setSent] = React.useState(false);
  const row = (Ic, k, v, strong) => <div style={{ display: 'grid', gridTemplateColumns: '28px minmax(0,1fr)', gap: 10, padding: '14px 0', borderTop: '1px solid var(--line-2)' }}><Ic size={18} color="var(--son)" /><div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{k}</div><div style={{ fontSize: strong ? 20 : 15, fontFamily: strong ? 'Lora, serif' : 'inherit', fontWeight: strong ? 700 : 400, color: strong ? 'var(--son)' : 'var(--ink)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{v}</div></div></div>;
  return (
    <DeskPage active="__contact" noVisit>
      <Wrap>
        <Crumbs items={['Trang chủ', 'Liên hệ']} />
        <PageTitle title="Liên hệ" sub="Ghé xưởng tại làng Đại Bái hoặc nhắn cho chúng tôi, phản hồi trong giờ hành chính." />
        <div style={{ position: 'relative', marginBottom: blk(bp) }}>
          <MapEmbed height={pick(bp, { xl: 380, lg: 340, md: 300, sm: 240 })} radius={sm ? 8 : 12} z={14} />
          <a href={mapDir} target="_blank" rel="noopener" style={{ ...deskBtn(true), position: 'absolute', right: 12, bottom: 12, height: 40, fontSize: 13, textDecoration: 'none', boxShadow: '0 6px 16px -8px rgba(0,0,0,0.4)' }}>Chỉ đường →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: compact ? 'minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,1.3fr)', gap: pick(bp, { xl: 48, lg: 32, md: 24, sm: 20 }), alignItems: 'start', marginBottom: vpad(bp) }}>
          <div>
            <div style={{ fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Thông tin</div>
            {row(IconPhone, 'Hotline · Zalo', SHOP.phone, true)}
            {row(IconPin, 'Xưởng & showroom', SHOP.address)}
            {row(IconBox, 'Giờ mở cửa', SHOP.hours)}
            {row(IconMail, 'Email', SHOP.email)}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
              <a href={'tel:' + SHOP.tel} style={{ ...deskBtn(true), textDecoration: 'none' }}><IconPhone size={16} /> Gọi ngay</a>
              <button style={deskBtn(false)}><IconZalo size={18} /> Zalo</button>
            </div>
          </div>
          <div style={{ ...deskCard, padding: sm ? 18 : 28 }}>
            {sent ? (
              <div className="lk-in" style={{ padding: '24px 0', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Lora, serif', fontSize: 22, fontWeight: 600 }}>Đã nhận tin nhắn</div>
                <div style={{ fontSize: 14.5, color: 'var(--ink-2)', marginTop: 8 }}>Chúng tôi sẽ gọi lại trong vòng 2 giờ làm việc.</div>
                <div onClick={() => setSent(false)} style={{ fontSize: 13, color: 'var(--son)', marginTop: 16, cursor: 'pointer' }}>Gửi tin khác</div>
              </div>
            ) : <>
              <div style={{ fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Gửi tin nhắn</div>
              <div style={{ display: 'grid', gridTemplateColumns: sm ? 'minmax(0,1fr)' : 'repeat(2,minmax(0,1fr))', gap: 14 }}>
                <Field label="Họ và tên" ph="Nguyễn Văn A" />
                <Field label="Số điện thoại" ph="09xx xxx xxx" />
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1 / -1' }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>Nội dung</span>
                  <div style={{ height: 110, borderRadius: 6, border: '1px solid var(--line)', background: '#fffdf7', padding: 14, fontSize: 14, color: 'var(--muted)' }}>Bạn cần tư vấn sản phẩm nào, kích thước, ngân sách…</div>
                </label>
              </div>
              <button onClick={() => setSent(true)} style={{ ...deskBtn(true), width: sm ? '100%' : 'auto', marginTop: 18 }}>Gửi tin nhắn</button>
            </>}
          </div>
        </div>
      </Wrap>
    </DeskPage>
  );
}

Object.assign(window, { DeskBlog, DeskArticle, DeskContact });
