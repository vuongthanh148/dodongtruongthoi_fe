// Info pages: FAQ, Craft Story (Làng nghề), Buying Guide

function ScreenFAQ({ onBack }) {
  const [open, setOpen] = React.useState(null);
  return (
    <div data-screen-label="FAQ" className="paper" style={{ background: 'var(--ivory)', minHeight: '100%' }}>
      <TopBar title="Câu hỏi thường gặp" onBack={onBack} />
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: '#fffdf7', border: '1px solid var(--line)', borderRadius: 10, padding: 18 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.25em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 8 }}>FAQ</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2 }}>
            Giải đáp nhanh trước khi đặt hàng
          </div>
        </div>

        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <button key={i} onClick={() => setOpen(isOpen ? null : i)} style={{
              background: '#fffdf7', border: '1px solid var(--line)',
              borderRadius: 10, padding: '14px 16px',
              textAlign: 'left', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: 'var(--son)', fontFamily: 'Be Vietnam Pro', fontSize: 13, transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 200ms' }}>▶</span>
                <span style={{ fontFamily: 'Be Vietnam Pro', fontWeight: 600, fontSize: 13.5, color: 'var(--ink)' }}>{f.q}</span>
              </div>
              {isOpen && (
                <div style={{ paddingLeft: 22, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>{f.a}</div>
              )}
            </button>
          );
        })}
      </div>
      <FooterMinimal />
    </div>
  );
}

function ScreenCraft({ onBack }) {
  const c = CRAFT_STORY;
  return (
    <div data-screen-label="Craft Village" className="paper" style={{ background: 'var(--ivory)', minHeight: '100%' }}>
      <TopBar title="Câu chuyện làng nghề" onBack={onBack} />
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Card>
          <CardEyebrow>{c.intro.eyebrow}</CardEyebrow>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2, margin: '4px 0 0' }}>
            {c.intro.title}
          </h2>
        </Card>

        <Card pad={10}>
          <ArtPiece bg="bronze" frame="bronze" label="Làng nghề" pad={6} aspect="16/9" />
        </Card>

        <Card><CardEyebrow>{c.history.eyebrow}</CardEyebrow><CardBody>{c.history.body}</CardBody></Card>
        <Card><CardEyebrow>{c.artisans.eyebrow}</CardEyebrow><CardBody>{c.artisans.body}</CardBody></Card>
        <Card><CardEyebrow>{c.heritage.eyebrow}</CardEyebrow><CardBody>{c.heritage.body}</CardBody></Card>
      </div>
      <FooterMinimal />
    </div>
  );
}

function ScreenGuide({ onBack }) {
  return (
    <div data-screen-label="Buying Guide" className="paper" style={{ background: 'var(--ivory)', minHeight: '100%' }}>
      <TopBar title="Hướng dẫn mua hàng" onBack={onBack} />
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {GUIDE_STEPS.map(s => (
          <Card key={s.n}>
            <CardEyebrow>{s.n}. {s.title}</CardEyebrow>
            {s.sub && (
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.25, margin: '6px 0 8px' }}>
                {s.sub}
              </div>
            )}
            {s.body && <CardBody>{s.body}</CardBody>}
            {s.steps && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {s.steps.map((st, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'rgba(139,30,30,0.08)', color: 'var(--son)',
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600,
                    }}>{i + 1}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55 }}>{st}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
      <FooterMinimal />
    </div>
  );
}

function Card({ children, pad = 18 }) {
  return (
    <div style={{ background: '#fffdf7', border: '1px solid var(--line)', borderRadius: 10, padding: pad }}>
      {children}
    </div>
  );
}
function CardEyebrow({ children }) {
  return (
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.25em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 6 }}>{children}</div>
  );
}
function CardBody({ children }) {
  return (
    <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.65, margin: '4px 0 0' }}>{children}</p>
  );
}

window.ScreenFAQ = ScreenFAQ;
window.ScreenCraft = ScreenCraft;
window.ScreenGuide = ScreenGuide;
