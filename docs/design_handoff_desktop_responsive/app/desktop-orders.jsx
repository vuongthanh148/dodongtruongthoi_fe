// Secure order lookup — phone → masked list → verify (mã đơn / OTP) → detail

const maskName = (n) => n.split(' ').map((w, i, a) => i === a.length - 1 ? w : w[0] + '.').join(' ');
const LOOKUP_PHONE = '0899 012 288';
const maskPhone = (p) => p.slice(0, 4) + ' ••• ' + p.slice(-3);

function StepDots({ step }) {
  const labels = ['Số điện thoại', 'Chọn đơn', 'Xác minh', 'Chi tiết'];
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
      {labels.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <span style={{ width: 20, height: 1, background: 'var(--line)' }} />}
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: i <= step ? 'var(--ink)' : 'var(--muted)', fontWeight: i === step ? 600 : 400 }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 11, background: i < step ? 'var(--son)' : i === step ? 'rgba(139,30,30,0.1)' : 'var(--ivory-2)', color: i < step ? 'white' : i === step ? 'var(--son)' : 'var(--muted)', border: i === step ? '1px solid var(--son)' : 'none' }}>{i < step ? '✓' : i + 1}</span>
            {l}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

function Input({ value, onChange, ph, mono, big, autoFocus, maxLength }) {
  return <input autoFocus={autoFocus} value={value} maxLength={maxLength} onChange={e => onChange(e.target.value)} placeholder={ph} style={{ flex: '1 1 auto', minWidth: 0, width: '100%', height: big ? 56 : 50, boxSizing: 'border-box', borderRadius: 6, border: '1px solid var(--line)', background: '#fffdf7', padding: '0 16px', fontSize: big ? 22 : 15, letterSpacing: big ? '0.4em' : 0, textAlign: big ? 'center' : 'left', fontFamily: mono ? 'ui-monospace, Menlo, monospace' : 'Be Vietnam Pro', color: 'var(--ink)', outline: 'none' }} />;
}

function VerifyPanel({ order, onOk, onBack, onLocked, attempts, setAttempts }) {
  const sm = useBp() === 'sm';
  const [mode, setMode] = React.useState('code');
  const [val, setVal] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [cd, setCd] = React.useState(0);
  const [err, setErr] = React.useState('');
  React.useEffect(() => { if (cd <= 0) return; const t = setTimeout(() => setCd(cd - 1), 1000); return () => clearTimeout(t); }, [cd]);
  const left = 5 - attempts;
  const submit = () => {
    const ok = mode === 'code' ? val.trim().toUpperCase() === order.id.toUpperCase() : val === '123456';
    if (ok) return onOk();
    const n = attempts + 1; setAttempts(n);
    if (n >= 5) return onLocked();
    setErr(mode === 'code' ? 'Mã đơn không khớp với số điện thoại này.' : 'Mã OTP chưa đúng.');
  };
  const tab = (id, l) => <button onClick={() => { setMode(id); setVal(''); setErr(''); }} style={{ flex: 1, height: 42, border: 'none', borderBottom: mode === id ? '2px solid var(--son)' : '2px solid transparent', background: 'transparent', cursor: 'pointer', fontFamily: 'Be Vietnam Pro', fontSize: 14, fontWeight: mode === id ? 600 : 400, color: mode === id ? 'var(--son)' : 'var(--ink-2)' }}>{l}</button>;
  return (
    <div className="lk-in" style={{ ...deskCard, padding: sm ? 18 : 28, maxWidth: 520 }}>
      <div style={{ fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 600 }}>Xác minh để xem đơn {order.id}</div>
      <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6, lineHeight: 1.55 }}>Để bảo vệ địa chỉ và thông tin của bạn, vui lòng xác minh bằng một trong hai cách.</div>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', margin: '18px 0 18px' }}>{tab('code', 'Nhập mã đơn')}{tab('otp', 'Nhận mã OTP')}</div>
      {mode === 'code' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Input value={val} onChange={v => { setVal(v); setErr(''); }} ph="VD: TT-24815" mono autoFocus />
          <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Mã đơn có trong tin nhắn SMS/Zalo xác nhận đặt hàng. <span style={{ color: 'var(--bronze)' }}>(Thử: {order.id})</span></div>
        </div>
      ) : !sent ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 14 }}>Gửi mã 6 số tới <b style={{ fontVariantNumeric: 'tabular-nums' }}>{maskPhone(LOOKUP_PHONE)}</b> qua:</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={() => { setSent('zalo'); setCd(60); }} style={{ ...deskBtn(true), height: 46 }}><IconZalo size={20} /> Zalo</button>
            <button onClick={() => { setSent('sms'); setCd(60); }} style={{ ...deskBtn(false), height: 46 }}>SMS</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 14 }}>Đã gửi mã qua {sent === 'zalo' ? 'Zalo' : 'SMS'} tới {maskPhone(LOOKUP_PHONE)}.</div>
          <Input value={val} onChange={v => { setVal(v.replace(/\D/g, '')); setErr(''); }} ph="••••••" big maxLength={6} autoFocus />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--muted)' }}>
            <span style={{ color: 'var(--bronze)' }}>(Thử: 123456)</span>
            {cd > 0 ? <span style={{ fontVariantNumeric: 'tabular-nums' }}>Gửi lại sau {cd}s</span> : <span onClick={() => setCd(60)} style={{ color: 'var(--son)', cursor: 'pointer' }}>Gửi lại mã</span>}
          </div>
        </div>
      )}
      {err && <div className="lk-shake" style={{ marginTop: 12, fontSize: 13.5, color: 'var(--son)', background: 'rgba(139,30,30,0.06)', padding: '10px 12px', borderRadius: 6 }}>{err} Còn {left} lần thử.</div>}
      {(mode === 'code' || sent) && <button onClick={submit} disabled={!val} style={{ ...deskBtn(true), width: '100%', marginTop: 16, opacity: val ? 1 : 0.45 }}>Xem chi tiết đơn</button>}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 13 }}>
        <span onClick={onBack} style={{ color: 'var(--ink-2)', cursor: 'pointer' }}>← Chọn đơn khác</span>
        <span style={{ color: 'var(--son)', cursor: 'pointer' }}>Quên mã? Gọi 0899 012 288</span>
      </div>
    </div>
  );
}

function DeskOrderLookup({ initial = 'phone' }) {
  const bp = useBp(); const sm = bp === 'sm'; const compact = bp === 'md' || sm;
  const [step, setStep] = React.useState(initial);
  const [phone, setPhone] = React.useState(initial === 'phone' ? '' : LOOKUP_PHONE);
  const [sel, setSel] = React.useState(initial === 'verify' || initial === 'detail' ? ORDERS[1] : null);
  const [attempts, setAttempts] = React.useState(initial === 'locked' ? 5 : 0);
  const idx = { phone: 0, list: 1, verify: 2, locked: 2, detail: 3 }[step];
  const cols = 'minmax(0,1fr) 110px minmax(0,2fr) 140px 130px';
  const names = (o) => o.items.map(it => PRODUCTS.find(p => p.id === it.pid)?.title).join(', ');
  return (
    <DeskPage active="__orders">
      <Wrap style={{ maxWidth: 1100 }}>
        <Crumbs items={['Trang chủ', 'Tra cứu đơn hàng']} />
        <PageTitle title="Tra cứu đơn hàng" sub={step === 'phone' ? 'Nhập số điện thoại đã dùng khi đặt hàng.' : null} />
        {!sm && <StepDots step={idx} />}
        <div key={step} className="lk-in" style={{ marginBottom: vpad(bp) }}>
          {step === 'phone' && (
            <div style={{ maxWidth: 560 }}>
              <div style={{ display: 'flex', gap: 10, flexDirection: sm ? 'column' : 'row' }}>
                <Input value={phone} onChange={setPhone} ph="09xx xxx xxx" autoFocus />
                <button onClick={() => phone.replace(/\D/g, '').length >= 9 && setStep('list')} style={{ ...deskBtn(true), opacity: phone.replace(/\D/g, '').length >= 9 ? 1 : 0.45 }}>Tra cứu</button>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14, fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                <IconBox size={16} color="var(--bronze)" />
                <span>Chỉ hiện thông tin tóm tắt. Để xem địa chỉ và chi tiết, bạn cần mã đơn hoặc mã OTP. <span onClick={() => setPhone(LOOKUP_PHONE)} style={{ color: 'var(--son)', cursor: 'pointer' }}>Dùng số mẫu</span></span>
              </div>
            </div>
          )}
          {step === 'list' && <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, fontSize: 13, color: 'var(--muted)', gap: 10, flexWrap: 'wrap' }}>
              <span>{ORDERS.length} đơn hàng của <b style={{ color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{maskPhone(phone)}</b></span>
              <span onClick={() => { setStep('phone'); setPhone(''); }} style={{ color: 'var(--son)', cursor: 'pointer' }}>Đổi số</span>
            </div>
            <div style={{ ...deskCard, overflow: 'hidden' }}>
              {!compact && <div className="label-mono" style={{ display: 'grid', gridTemplateColumns: cols, gap: 20, padding: '14px 24px', borderBottom: '1px solid var(--line)', color: 'var(--muted)', fontSize: 11 }}><span>Mã đơn</span><span>Ngày đặt</span><span>Sản phẩm</span><span>Trạng thái</span><span></span></div>}
              {ORDERS.map(o => {
                const act = <button onClick={() => { setSel(o); setStep(attempts >= 5 ? 'locked' : 'verify'); }} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--son)', fontFamily: 'Be Vietnam Pro', fontSize: 13.5, fontWeight: 500, justifyContent: 'flex-end', padding: 0, whiteSpace: 'nowrap' }}>Xem chi tiết →</button>;
                const masked = <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{o.id.slice(0, 4)}•••{o.id.slice(-2)}</span>;
                if (compact) return (
                  <div key={o.id} style={{ padding: sm ? 16 : 20, borderBottom: '1px solid var(--line-2)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                      <div>{masked}<div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{o.date}</div></div>
                      <DStatus status={o.status} label={o.statusLabel} />
                    </div>
                    <div style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{names(o)}</div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{act}</div>
                  </div>);
                return (
                  <div key={o.id} style={{ display: 'grid', gridTemplateColumns: cols, gap: 20, padding: '18px 24px', borderBottom: '1px solid var(--line-2)', alignItems: 'center', fontSize: 14 }}>
                    {masked}
                    <span style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{o.date}</span>
                    <span>{names(o)}</span>
                    <DStatus status={o.status} label={o.statusLabel} />
                    {act}
                  </div>);
              })}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 12 }}>Giá tiền, địa chỉ và tên người nhận được ẩn cho tới khi xác minh.</div>
          </>}
          {step === 'verify' && sel && <VerifyPanel order={sel} attempts={attempts} setAttempts={setAttempts} onOk={() => setStep('detail')} onBack={() => setStep('list')} onLocked={() => setStep('locked')} />}
          {step === 'locked' && (
            <div style={{ ...deskCard, padding: sm ? 18 : 28, maxWidth: 520 }}>
              <div style={{ fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 600, color: 'var(--son)' }}>Tạm khoá tra cứu 15 phút</div>
              <div style={{ fontSize: 14.5, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.6 }}>Bạn đã nhập sai quá 5 lần. Để bảo vệ thông tin khách hàng, việc tra cứu cho số {maskPhone(LOOKUP_PHONE)} tạm dừng. Nếu cần gấp, hãy liên hệ trực tiếp.</div>
              <div style={{ display: 'grid', gridTemplateColumns: sm ? '1fr' : '1fr 1fr', gap: 10, marginTop: 18 }}>
                <button style={deskBtn(true)}><IconPhone size={16} /> Gọi 0899 012 288</button>
                <button style={deskBtn(false)}><IconZalo size={18} /> Nhắn Zalo</button>
              </div>
              <div onClick={() => { setAttempts(0); setStep('list'); }} style={{ marginTop: 14, fontSize: 12.5, color: 'var(--muted)', cursor: 'pointer' }}>(Mockup: bấm để đặt lại)</div>
            </div>
          )}
          {step === 'detail' && sel && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 6, background: 'rgba(60,140,60,0.1)', color: '#2d6a2d', fontSize: 13.5, marginBottom: 16, width: 'fit-content' }}>✓ Đã xác minh · phiên xem hết hạn sau 15 phút</div>
              <div style={{ display: 'grid', gridTemplateColumns: compact ? 'minmax(0,1fr)' : 'minmax(0,1fr) 340px', gap: 20, alignItems: 'start' }}>
                <div style={{ ...deskCard, padding: sm ? 18 : 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 10 }}>
                    <span style={{ fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>Đơn {sel.id}</span>
                    <DStatus status={sel.status} label={sel.statusLabel} />
                  </div>
                  {sel.items.map(it => { const p = PRODUCTS.find(x => x.id === it.pid); return (
                    <div key={it.pid} style={{ display: 'grid', gridTemplateColumns: `${sm ? 80 : 100}px minmax(0,1fr) auto`, gap: 14, alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--line-2)' }}>
                      <ArtPiece bg={p.defaultBg} frame={p.defaultFrame} pad={4} aspect="4/3" imgSrc={p.image} />
                      <div style={{ minWidth: 0 }}><div style={{ fontFamily: 'Lora, serif', fontSize: 16, fontWeight: 600 }}>{p.title}</div><div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3 }}>{it.sub} · x{it.qty}</div></div>
                      <span className="price-num" style={{ fontSize: 15 }}>{fmtVND(p.price)}</span>
                    </div>); })}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 14, borderTop: '1px solid var(--line)' }}><span style={{ fontWeight: 600 }}>Tổng cộng</span><span className="price-num" style={{ fontSize: 22, color: 'var(--son)' }}>{fmtVND(sel.total)}</span></div>
                </div>
                <div style={{ ...deskCard, padding: sm ? 18 : 24 }}>
                  <div style={{ fontFamily: 'Lora, serif', fontSize: 17, fontWeight: 600, marginBottom: 10 }}>Giao đến</div>
                  <div style={{ fontSize: 14, lineHeight: 1.7 }}>{maskName('Nguyễn Văn An')} · {maskPhone(LOOKUP_PHONE)}<br />•• ngõ •• Láng Hạ, Đống Đa, Hà Nội</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 10, lineHeight: 1.5 }}>Địa chỉ được che một phần kể cả sau khi xác minh.</div>
                  <button style={{ ...deskBtn(false), width: '100%', marginTop: 16, height: 44 }}><IconPhone size={16} /> Liên hệ về đơn này</button>
                </div>
              </div>
              <div onClick={() => setStep('list')} style={{ marginTop: 16, fontSize: 13.5, color: 'var(--son)', cursor: 'pointer' }}>← Về danh sách đơn</div>
            </div>
          )}
        </div>
      </Wrap>
    </DeskPage>
  );
}

Object.assign(window, { DeskOrderLookup });
