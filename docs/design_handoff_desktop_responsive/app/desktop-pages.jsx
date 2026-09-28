// Responsive pages — Categories index, Checkout, Orders, Order detail, Saved, FAQ, Guide, Làng nghề

function PageTitle({ title, sub }) {
  const bp = useBp(); const sm = bp === 'sm';
  return (
    <div style={{ marginBottom: sm ? 16 : 28 }}>
      <h1 style={{ fontFamily: 'Lora, serif', fontSize: pick(bp, { xl: 36, lg: 34, md: 30, sm: 24 }), fontWeight: 600, margin: 0, lineHeight: 1.15, textWrap: 'balance' }}>{title}</h1>
      {sub && <div style={{ fontSize: sm ? 14 : 15, color: 'var(--muted)', marginTop: 6, textWrap: 'pretty' }}>{sub}</div>}
    </div>
  );
}
const vpad = (bp) => pick(bp, { xl: 72, lg: 64, md: 56, sm: 40 });

function DeskCategories() {
  const bp = useBp(); const sm = bp === 'sm';
  const cols = pick(bp, { xl: 3, lg: 3, md: 2, sm: 1 });
  return (
    <DeskPage active="__cats">
      <Wrap>
        <Crumbs items={['Trang chủ', 'Danh mục']} />
        <PageTitle title="Danh mục sản phẩm" sub="Chọn theo mục đích: trang trí, thờ cúng hay làm quà tặng." />
        <div style={{ display: 'grid', gridTemplateColumns: cols === 3 ? 'repeat(6, minmax(0,1fr))' : `repeat(${cols}, minmax(0,1fr))`, gap: pick(bp, { xl: 24, lg: 20, md: 16, sm: 12 }), marginBottom: vpad(bp) }}>
          {DESK_CATS.map((c, i) => (
            <div key={c.id} style={{ ...deskCard, overflow: 'hidden', display: sm ? 'grid' : 'block', gridTemplateColumns: sm ? '110px minmax(0,1fr)' : undefined, gridColumn: cols === 3 ? `span ${i < 2 ? 3 : 2}` : (cols === 2 && i === 0 ? '1 / -1' : 'auto') }}>
              <div className={`bronze-art ${c.tone === 'bronze' ? '' : c.tone}`} style={{ aspectRatio: sm ? 'auto' : '16/10', minHeight: sm ? 96 : 0 }} />
              <div style={{ padding: sm ? 14 : 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: 'Lora, serif', fontSize: sm ? 17 : 20, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{c.soon ? 'Sắp ra mắt' : c.count + ' sản phẩm'}</div>
                </div>
                <IconChevron size={16} color="var(--son)" />
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    </DeskPage>
  );
}

function Field({ label, ph, span }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, gridColumn: span ? '1 / -1' : 'auto' }}>
      <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>{label}</span>
      <div style={{ height: 46, borderRadius: 6, border: '1px solid var(--line)', background: '#fffdf7', padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 14, color: 'var(--muted)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{ph}</div>
    </label>
  );
}

function DeskCheckout() {
  const bp = useBp(); const sm = bp === 'sm'; const compact = bp === 'md' || sm;
  const [pay, setPay] = React.useState('cod');
  const total = DESK_CART.reduce((a, it) => a + it.price * it.qty, 0);
  const sec = { ...deskCard, padding: sm ? 18 : 28 };
  const h = { fontFamily: 'Lora, serif', fontSize: sm ? 18 : 20, fontWeight: 600, marginBottom: sm ? 14 : 18 };
  const bar = sm ? <BottomBar><div style={{ flex: 1 }}><div style={{ fontSize: 11, color: 'var(--muted)' }}>Tổng cộng</div><div className="price-num" style={{ fontSize: 18, color: 'var(--son)' }}>{fmtVND(total)}</div></div><button style={{ ...deskBtn(true), height: 46, fontSize: 14 }}>Xác nhận đặt hàng</button></BottomBar> : null;
  const items = (
    <div style={{ ...deskCard, padding: sm ? 14 : 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {DESK_CART.map(it => { const p = PRODUCTS.find(x => x.id === it.pid); return (
        <div key={it.pid} style={{ display: 'grid', gridTemplateColumns: '72px minmax(0,1fr) auto', gap: 12, alignItems: 'center' }}>
          <ArtPiece bg={p.defaultBg} frame={p.defaultFrame} pad={3} aspect="4/3" imgSrc={p.image} />
          <div style={{ minWidth: 0 }}><div style={{ fontFamily: 'Lora, serif', fontSize: 15, fontWeight: 600 }}>{p.title}</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{it.opts} · x{it.qty}</div></div>
          <span className="price-num" style={{ fontSize: 14 }}>{fmtVND(it.price)}</span>
        </div>); })}
    </div>
  );
  return (
    <DeskPage bottomBar={bar}>
      <Wrap>
        <Crumbs items={['Trang chủ', 'Giỏ hàng', 'Đặt hàng']} />
        <PageTitle title="Đặt hàng" />
        <div style={{ display: 'grid', gridTemplateColumns: compact ? 'minmax(0,1fr)' : `minmax(0,1fr) ${bp === 'lg' ? 340 : 400}px`, gap: pick(bp, { xl: 40, lg: 28, md: 20, sm: 16 }), alignItems: 'start', marginBottom: vpad(bp) }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: sm ? 16 : 24 }}>
            {compact && items}
            <section style={sec}>
              <div style={h}>Thông tin người nhận</div>
              <div style={{ display: 'grid', gridTemplateColumns: sm ? 'minmax(0,1fr)' : 'repeat(2,minmax(0,1fr))', gap: 16 }}>
                <Field label="Họ và tên" ph="Nguyễn Văn A" />
                <Field label="Số điện thoại" ph="09xx xxx xxx" />
                <Field label="Địa chỉ giao hàng" ph="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" span />
                <Field label="Ghi chú" ph="Thời gian nhận, yêu cầu lắp đặt…" span />
              </div>
            </section>
            <section style={sec}>
              <div style={h}>Thanh toán</div>
              <div style={{ display: 'grid', gridTemplateColumns: sm ? 'minmax(0,1fr)' : 'repeat(3, minmax(0,1fr))', gap: 12 }}>
                {[['cod', 'Thanh toán khi nhận', 'COD'], ['bank', 'Chuyển khoản', 'Nhận STK sau khi đặt'], ['store', 'Tại showroom', 'Làng Đại Bái']].map(([id, t, s]) => (
                  <button key={id} onClick={() => setPay(id)} style={{ ...optBtn(pay === id), padding: 16 }}>
                    <span style={{ fontSize: 14.5 }}>{t}</span><span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>{s}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: compact ? 'static' : 'sticky', top: 100 }}>
            {!compact && items}
            <SummaryBox items={DESK_CART} cta="Xác nhận đặt hàng" hideCta={sm} note="Bằng việc đặt hàng, bạn đồng ý với chính sách bảo hành & đổi trả." />
          </div>
        </div>
      </Wrap>
    </DeskPage>
  );
}

function DStatus({ status, label }) {
  const c = { pending_confirm: ['rgba(201,169,97,0.18)', '#7a5c14'], shipped: ['rgba(60,140,60,0.12)', '#2d6a2d'], cancelled: ['rgba(139,30,30,0.1)', 'var(--son)'] }[status] || ['rgba(0,0,0,0.06)', 'var(--ink-2)'];
  return <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 12, background: c[0], color: c[1], fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', width: 'fit-content' }}>{label}</span>;
}

function DeskOrders() {
  const bp = useBp(); const sm = bp === 'sm'; const compact = bp === 'md' || sm;
  const cols = 'minmax(0,1.2fr) 110px minmax(0,2fr) 140px 130px';
  return (
    <DeskPage active="__orders">
      <Wrap style={{ maxWidth: 1100 }}>
        <Crumbs items={['Trang chủ', 'Tra cứu đơn hàng']} />
        <PageTitle title="Tra cứu đơn hàng" sub="Nhập số điện thoại đã dùng khi đặt hàng." />
        <div style={{ display: 'flex', gap: 10, flexDirection: sm ? 'column' : 'row', marginBottom: sm ? 20 : 32, maxWidth: 560 }}>
          <div style={{ flex: 1, height: 50, borderRadius: 6, border: '1px solid var(--line)', background: '#fffdf7', padding: '0 16px', display: 'flex', alignItems: 'center', fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>0899 012 288</div>
          <button style={deskBtn(true)}>Tra cứu</button>
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Tìm thấy {ORDERS.length} đơn hàng</div>
        <div style={{ ...deskCard, marginBottom: vpad(bp), overflow: 'hidden' }}>
          {!compact && <div className="label-mono" style={{ display: 'grid', gridTemplateColumns: cols, gap: 20, padding: '14px 24px', borderBottom: '1px solid var(--line)', color: 'var(--muted)', fontSize: 11 }}><span>Mã đơn</span><span>Ngày đặt</span><span>Sản phẩm</span><span>Trạng thái</span><span style={{ textAlign: 'right' }}>Tổng tiền</span></div>}
          {ORDERS.map(o => {
            const names = o.items.map(it => PRODUCTS.find(p => p.id === it.pid)?.title).join(', ');
            if (compact) return (
              <div key={o.id} style={{ padding: sm ? 16 : 20, borderBottom: '1px solid var(--line-2)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                  <div><div style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{o.id}</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{o.date}</div></div>
                  <DStatus status={o.status} label={o.statusLabel} />
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{names}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="price-num" style={{ color: 'var(--son)', fontSize: 16 }}>{fmtVND(o.total)}</span>
                  <span style={{ fontSize: 13, color: 'var(--son)' }}>Xem chi tiết →</span>
                </div>
              </div>);
            return (
              <div key={o.id} style={{ display: 'grid', gridTemplateColumns: cols, gap: 20, padding: '20px 24px', borderBottom: '1px solid var(--line-2)', alignItems: 'center', fontSize: 14 }}>
                <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--son)' }}>{o.id}</span>
                <span style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{o.date}</span>
                <span>{names}{o.items.length > 1 && <span style={{ color: 'var(--muted)' }}> · {o.items.length} sản phẩm</span>}</span>
                <DStatus status={o.status} label={o.statusLabel} />
                <span className="price-num" style={{ textAlign: 'right', fontSize: 16 }}>{fmtVND(o.total)}</span>
              </div>);
          })}
        </div>
      </Wrap>
    </DeskPage>
  );
}

function DeskOrderDetail() {
  const bp = useBp(); const sm = bp === 'sm'; const compact = bp === 'md' || sm;
  const o = ORDERS[1];
  const steps = ['Đã đặt', 'Đã xác nhận', 'Đang chế tác', 'Đang giao', 'Đã giao'];
  const cur = 4;
  const sec = { ...deskCard, padding: sm ? 18 : 24 };
  const h = { fontFamily: 'Lora, serif', fontSize: 18, fontWeight: 600, marginBottom: 16 };
  return (
    <DeskPage>
      <Wrap>
        <Crumbs items={['Trang chủ', 'Tra cứu đơn hàng', o.id]} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: sm ? 'flex-start' : 'center', flexDirection: sm ? 'column' : 'row', gap: 10, marginBottom: sm ? 16 : 28 }}>
          <div>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: pick(bp, { xl: 34, lg: 32, md: 28, sm: 24 }), fontWeight: 600, margin: 0, fontVariantNumeric: 'tabular-nums' }}>Đơn {o.id}</h1>
            <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>Đặt ngày {o.date}</div>
          </div>
          <DStatus status={o.status} label={o.statusLabel} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: compact ? 'minmax(0,1fr)' : `minmax(0,1fr) ${bp === 'lg' ? 320 : 380}px`, gap: pick(bp, { xl: 32, lg: 24, md: 16, sm: 14 }), alignItems: 'start', marginBottom: vpad(bp) }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: sm ? 14 : 20 }}>
            <section style={sec}>
              <div style={h}>Tiến trình</div>
              <div style={{ display: 'grid', gridTemplateColumns: sm ? '1fr' : `repeat(${steps.length}, minmax(0,1fr))`, gap: sm ? 12 : 0 }}>
                {steps.map((s, i) => (
                  <div key={s} style={{ display: 'flex', flexDirection: sm ? 'row' : 'column', alignItems: sm ? 'center' : 'flex-start', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: sm ? 'auto' : '100%' }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: i <= cur ? 'var(--son)' : 'var(--ivory-2)', border: i <= cur ? 'none' : '1px solid var(--line)', color: 'white', fontSize: 11, display: 'grid', placeItems: 'center' }}>{i <= cur ? '✓' : ''}</span>
                      {!sm && i < steps.length - 1 && <span style={{ flex: 1, height: 2, background: i < cur ? 'var(--son)' : 'var(--line)' }} />}
                    </div>
                    <span style={{ fontSize: 13, color: i <= cur ? 'var(--ink)' : 'var(--muted)', fontWeight: i === cur ? 600 : 400 }}>{s}</span>
                  </div>
                ))}
              </div>
            </section>
            <section style={sec}>
              <div style={h}>Sản phẩm</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {o.items.map(it => { const p = PRODUCTS.find(x => x.id === it.pid); return (
                  <div key={it.pid} style={{ display: 'grid', gridTemplateColumns: `${sm ? 80 : 110}px minmax(0,1fr) auto`, gap: 14, alignItems: 'center' }}>
                    <ArtPiece bg={p.defaultBg} frame={p.defaultFrame} pad={4} aspect="4/3" imgSrc={p.image} />
                    <div style={{ minWidth: 0 }}><div style={{ fontFamily: 'Lora, serif', fontSize: sm ? 15 : 17, fontWeight: 600 }}>{p.title}</div><div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3 }}>{it.sub} · x{it.qty}</div></div>
                    <span className="price-num" style={{ fontSize: sm ? 14 : 15 }}>{fmtVND(p.price)}</span>
                  </div>); })}
              </div>
            </section>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: sm ? 14 : 20, position: compact ? 'static' : 'sticky', top: 100 }}>
            <section style={sec}>
              <div style={h}>Thanh toán</div>
              {[['Tạm tính', fmtVND(o.total)], ['Phí giao hàng', 'Miễn phí'], ['Phương thức', 'COD']].map(([k, v]) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0' }}><span style={{ color: 'var(--muted)' }}>{k}</span><span>{v}</span></div>)}
              <div className="dongson-rule" style={{ margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><span style={{ fontWeight: 600 }}>Tổng cộng</span><span className="price-num" style={{ fontSize: 24, color: 'var(--son)' }}>{fmtVND(o.total)}</span></div>
            </section>
            <section style={sec}>
              <div style={h}>Giao đến</div>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>N. V. An · 0899 ••• 288<br />•• ngõ •• Láng Hạ, Đống Đa, Hà Nội</div>
            </section>
            <button style={deskBtn(false)}><IconPhone size={16} /> Liên hệ về đơn hàng</button>
          </div>
        </div>
      </Wrap>
    </DeskPage>
  );
}

function DeskSaved() {
  const bp = useBp(); const sm = bp === 'sm';
  const cols = pick(bp, { xl: 4, lg: 3, md: 3, sm: 2 });
  const list = PRODUCTS.slice(0, cols === 2 ? 4 : cols + 1);
  return (
    <DeskPage>
      <Wrap>
        <Crumbs items={['Trang chủ', 'Đã lưu']} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
          <PageTitle title="Sản phẩm đã lưu" sub={`${list.length} sản phẩm`} />
          {!sm && <div style={{ marginBottom: 28 }}><button style={{ ...deskBtn(false), height: 42 }}>Thêm tất cả vào giỏ</button></div>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: pick(bp, { xl: 24, lg: 20, md: 16, sm: 12 }), marginBottom: vpad(bp) }}>
          {list.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </Wrap>
    </DeskPage>
  );
}

function ReadCol({ children }) {
  return <div style={{ maxWidth: 760, margin: '0 auto', width: '100%' }}>{children}</div>;
}

function DeskFAQ() {
  const bp = useBp(); const sm = bp === 'sm';
  const [open, setOpen] = React.useState(0);
  return (
    <DeskPage>
      <Wrap>
        <Crumbs items={['Trang chủ', 'Câu hỏi thường gặp']} />
        <ReadCol>
          <PageTitle title="Câu hỏi thường gặp" sub="Chưa thấy câu trả lời? Gọi 0899 012 288 hoặc nhắn Zalo." />
          <div style={{ ...deskCard, marginBottom: vpad(bp) }}>
            {FAQS.map((f, i) => (
              <div key={f.q} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
                <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: '100%', minHeight: 56, padding: sm ? '14px 16px' : '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Lora, serif', fontSize: sm ? 16 : 18, fontWeight: 600 }}>
                  {f.q}<IconChevron dir={open === i ? 'up' : 'down'} size={16} color="var(--son)" />
                </button>
                {open === i && <div style={{ padding: sm ? '0 16px 16px' : '0 24px 22px', fontSize: sm ? 14.5 : 16, lineHeight: 1.7, color: 'var(--ink-2)' }}>{f.a}</div>}
              </div>
            ))}
          </div>
        </ReadCol>
      </Wrap>
    </DeskPage>
  );
}

function DeskGuide() {
  const bp = useBp(); const sm = bp === 'sm';
  return (
    <DeskPage active="__guide">
      <Wrap>
        <Crumbs items={['Trang chủ', 'Hướng dẫn mua hàng']} />
        <ReadCol>
          <PageTitle title="Hướng dẫn mua hàng" sub="Bốn bước để chọn đúng tác phẩm cho không gian của bạn." />
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: vpad(bp) }}>
            {GUIDE_STEPS.map((g, i) => (
              <div key={g.n} style={{ display: 'grid', gridTemplateColumns: `${sm ? 40 : 56}px minmax(0,1fr)`, gap: sm ? 14 : 20, padding: sm ? '20px 0' : '28px 0', borderTop: i ? '1px solid var(--line)' : 'none' }}>
                <div style={{ fontFamily: 'Lora, serif', fontSize: sm ? 28 : 36, fontWeight: 600, color: 'var(--gold-2)', lineHeight: 1 }}>{g.n}</div>
                <div>
                  <h2 style={{ fontFamily: 'Lora, serif', fontSize: sm ? 19 : 22, fontWeight: 600, margin: 0 }}>{g.title}</h2>
                  {g.sub && <div style={{ fontSize: 14, color: 'var(--bronze)', marginTop: 4 }}>{g.sub}</div>}
                  {g.body && <p style={{ fontSize: sm ? 15 : 16, lineHeight: 1.75, margin: '10px 0 0', color: 'var(--ink-2)', textWrap: 'pretty' }}>{g.body}</p>}
                  {g.steps && <ol style={{ margin: '12px 0 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: sm ? 15 : 16, lineHeight: 1.6, color: 'var(--ink-2)' }}>{g.steps.map(s => <li key={s}>{s}</li>)}</ol>}
                </div>
              </div>
            ))}
          </div>
        </ReadCol>
      </Wrap>
    </DeskPage>
  );
}

function DeskCraft() {
  const bp = useBp(); const sm = bp === 'sm'; const compact = bp === 'md' || sm;
  const c = CRAFT_STORY;
  const blocks = [c.history, c.artisans, c.heritage];
  return (
    <DeskPage active="__craft">
      <div className="bronze-art dark" style={{ position: 'relative', height: pick(bp, { xl: 480, lg: 420, md: 380, sm: 320 }), overflow: 'hidden' }}>
        <img src={SAMPLE_IMG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(20,14,9,0.9) 5%, rgba(20,14,9,0.1) 75%)' }} />
        <Wrap style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: sm ? 28 : 56 }}>
          <div style={{ color: 'var(--ivory)', maxWidth: 720 }}>
            <div className="label-mono" style={{ color: 'var(--gold)', fontSize: 11 }}>{c.intro.eyebrow}</div>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: pick(bp, { xl: 52, lg: 44, md: 40, sm: 28 }), fontWeight: 600, lineHeight: 1.1, margin: '10px 0 0', textWrap: 'balance' }}>{c.intro.title}</h1>
          </div>
        </Wrap>
      </div>
      <Wrap style={{ paddingTop: vpad(bp), paddingBottom: vpad(bp), display: 'flex', flexDirection: 'column', gap: pick(bp, { xl: 72, lg: 56, md: 48, sm: 36 }) }}>
        {blocks.map((b, i) => (
          <section key={b.eyebrow} style={{ display: 'grid', gridTemplateColumns: compact ? 'minmax(0,1fr)' : '1fr 1fr', gap: pick(bp, { xl: 64, lg: 40, md: 24, sm: 18 }), alignItems: 'center' }}>
            <div className={`bronze-art ${i === 1 ? 'dark' : i === 2 ? 'red' : ''}`} style={{ aspectRatio: compact ? '16/9' : '4/3', borderRadius: 12, order: !compact && i % 2 ? 2 : 0 }} />
            <div style={{ maxWidth: 520 }}>
              <div className="label-mono" style={{ color: 'var(--bronze)', fontSize: 11, marginBottom: 10 }}>{String(i + 1).padStart(2, '0')} · {b.eyebrow}</div>
              <p style={{ fontFamily: 'Lora, serif', fontSize: pick(bp, { xl: 22, lg: 20, md: 19, sm: 17 }), lineHeight: 1.6, margin: 0, textWrap: 'pretty' }}>{b.body}</p>
            </div>
          </section>
        ))}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div className="dongson-rule" style={{ width: '100%' }} />
          <div style={{ fontFamily: 'Lora, serif', fontSize: sm ? 20 : 26, fontWeight: 600, marginTop: 16 }}>Ghé xưởng tại làng Đại Bái</div>
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>{STORES[0].addr} · {STORES[0].hours}</div>
          <button style={{ ...deskBtn(true), width: sm ? '100%' : 'auto' }}>Xem sản phẩm</button>
        </div>
      </Wrap>
    </DeskPage>
  );
}

Object.assign(window, { DeskCategories, DeskCheckout, DeskOrders, DeskOrderDetail, DeskSaved, DeskFAQ, DeskGuide, DeskCraft });
