// Shared UI building blocks

const fmtVND = (n) => n.toLocaleString('vi-VN') + 'đ';

// ─── Bronze artwork placeholder with frame ───
function ArtPiece({ bg = 'gold', frame = 'bronze', label = 'Tranh đồng', pad = 10, aspect = '16 / 9', style = {} }) {
  const frameCls = {
    bronze: 'frame-bronze', gold: 'frame-gold', dark: 'frame-dark', carved: 'frame-carved'
  }[frame];
  const bgCls = {
    gold: 'bronze-art gold', red: 'bronze-art red', bronze: 'bronze-art', dark: 'bronze-art dark'
  }[bg];
  return (
    <div className={`art-frame ${frameCls}`} style={{ '--p': `${pad}px`, aspectRatio: aspect, ...style }}>
      <div className={bgCls} style={{
        width: '100%', height: '100%', position: 'relative',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.25)',
      }}>
        {/* engraved motif — circular rings suggest drum art without recreating anything branded */}
        <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.45, mixBlendMode: 'overlay' }}>
          <g fill="none" stroke="rgba(255,220,140,0.9)" strokeWidth="0.4">
            <circle cx="40" cy="45" r="22" />
            <circle cx="40" cy="45" r="16" />
            <circle cx="40" cy="45" r="10" />
            <path d="M14 60 Q 30 50, 50 62 T 88 60" />
            <path d="M90 70 Q 110 58, 130 68 T 158 66" />
            <path d="M100 30 q 6 -10 16 -6 q 10 4 4 14" />
            <path d="M120 40 q 4 -6 10 -4 q 6 2 2 8" />
          </g>
          <g fill="rgba(255,220,140,0.5)">
            <circle cx="40" cy="45" r="2" />
            <circle cx="120" cy="22" r="1" />
            <circle cx="132" cy="18" r="0.8" />
          </g>
        </svg>
        <div style={{
          position: 'absolute', left: 8, bottom: 6,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          color: 'rgba(255,220,140,0.7)', letterSpacing: '0.08em',
        }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// ─── Small swatch — used in product cards & detail ───
function VariantSwatch({ tone, active, onClick, size = 22 }) {
  const t = BG_TONES.find(b => b.id === tone) || BG_TONES[0];
  return (
    <button onClick={onClick} aria-label={t.name} style={{
      width: size, height: size, borderRadius: '50%',
      background: t.hex,
      border: active ? '2px solid var(--son)' : '1.5px solid rgba(42,31,26,0.2)',
      padding: 0, cursor: 'pointer',
      boxShadow: active ? '0 0 0 2px rgba(139,30,30,0.15)' : 'inset 0 1px 2px rgba(0,0,0,0.25)',
      transition: 'all 150ms ease',
    }} />
  );
}

// ─── Product card ───
function ProductCard({ p, onOpen, compact = false }) {
  const [bg, setBg] = React.useState(p.defaultBg);
  return (
    <div onClick={onOpen} style={{
      background: '#fffdf7',
      border: '1px solid var(--line)',
      borderRadius: 10,
      overflow: 'hidden',
      cursor: 'pointer',
      display: 'flex', flexDirection: 'column',
      transition: 'transform 180ms ease, box-shadow 180ms ease',
    }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.985)'}
      onMouseUp={(e) => e.currentTarget.style.transform = ''}
      onMouseLeave={(e) => e.currentTarget.style.transform = ''}
    >
      <div style={{ padding: 8, background: 'var(--ivory-2)' }}>
        <ArtPiece bg={bg} frame={p.defaultFrame} label={p.title} pad={6} aspect="4/3" />
      </div>
      <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {p.badge && (
          <span style={{
            alignSelf: 'flex-start',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9, letterSpacing: '0.12em',
            color: 'var(--son)', textTransform: 'uppercase',
            background: 'rgba(139,30,30,0.08)',
            padding: '2px 6px', borderRadius: 3,
          }}>{p.badge}</span>
        )}
        <div style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 600,
          color: 'var(--ink)', lineHeight: 1.2,
        }}>{p.title}</div>
        {!compact && (
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>{p.subtitle}</div>
        )}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 2 }}>
          {p.bgTones.slice(0, 4).map(t => (
            <VariantSwatch key={t} tone={t} active={bg === t} size={14}
              onClick={(e) => { e.stopPropagation(); setBg(t); }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--son)', fontWeight: 700, fontSize: 15 }}>
            {fmtVND(p.price)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', display: 'flex', gap: 2, alignItems: 'center' }}>
            <IconStar size={10} color="#c9a961" /> {p.rating}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Floating contact bubbles (Zalo, Messenger, FB, TikTok) ───
function ContactBubbles() {
  const [open, setOpen] = React.useState(false);
  const items = [
    { Icon: IconZalo,      label: 'Zalo'      },
    { Icon: IconMessenger, label: 'Messenger' },
    { Icon: IconFacebook,  label: 'Facebook'  },
    { Icon: IconTiktok,    label: 'TikTok'    },
  ];
  return (
    <div style={{
      position: 'absolute', right: 10, bottom: 100,
      display: 'flex', flexDirection: 'column', gap: 7, zIndex: 50,
      alignItems: 'flex-end',
    }}>
      {open && items.map(({ Icon, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 10, color: 'white',
            background: 'rgba(20,14,9,0.75)', backdropFilter: 'blur(6px)',
            padding: '3px 7px', borderRadius: 10,
            fontFamily: 'Be Vietnam Pro',
          }}>{label}</span>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#fffdf7',
            boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={22} />
          </div>
        </div>
      ))}
      <button onClick={() => setOpen(o => !o)} style={{
        width: 44, height: 44, borderRadius: '50%',
        background: open ? 'var(--ink)' : 'var(--son)', border: 'none', color: 'white',
        boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}>
        {open
          ? <IconClose size={18} color="white" />
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a8 8 0 1 1-3.2-6.4L21 4v5h-5" />
            </svg>}
      </button>
    </div>
  );
}

// ─── Header / top bar ───
function TopBar({ title, onBack, onMenu, onOpenSaved, savedCount = 0, showLogo = false }) {
  return (
    <div style={{
      padding: '56px 14px 12px', display: 'flex', alignItems: 'center', gap: 10,
      background: 'var(--ivory)',
      borderBottom: '1px solid var(--line-2)',
      position: 'relative',
    }}>
      {onBack ? (
        <button onClick={onBack} style={{
          border: 'none', background: 'transparent', padding: 4, cursor: 'pointer',
          display: 'flex', alignItems: 'center', color: 'var(--ink)',
        }}><IconChevron dir="left" size={22} /></button>
      ) : (
        <button onClick={onMenu} style={{
          border: 'none', background: 'transparent', padding: 4, cursor: 'pointer',
          display: 'flex', alignItems: 'center', color: 'var(--ink)',
        }}><IconMenu size={22} /></button>
      )}
      {showLogo ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }}>
          <DrumMark size={26} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 16, letterSpacing: '0.03em', color: 'var(--son)', lineHeight: 1 }}>
              Đồ Đồng Trường Thơi
            </div>
            <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 9, color: 'var(--bronze)', letterSpacing: '0.1em' }}>
              tinh hoa làng nghề Việt
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          flex: 1, fontFamily: 'Cormorant Garamond, serif',
          fontSize: 18, fontWeight: 600, textAlign: 'center',
          color: 'var(--ink)',
        }}>{title}</div>
      )}
      <button style={{
        border: 'none', background: 'transparent', padding: 4, cursor: 'pointer',
        color: 'var(--ink)', display: 'flex',
      }}><IconSearch size={20} /></button>
      {onOpenSaved && (
        <button onClick={onOpenSaved} style={{
          border: 'none', background: 'transparent', padding: 4, cursor: 'pointer',
          color: 'var(--ink)', display: 'flex', position: 'relative',
        }}>
          <IconHeart size={20} />
          {savedCount > 0 && (
            <span style={{
              position: 'absolute', top: 0, right: 0,
              minWidth: 14, height: 14, padding: '0 3px',
              background: 'var(--son)', color: 'white',
              borderRadius: 7, fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}>{savedCount}</span>
          )}
        </button>
      )}
    </div>
  );
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div style={{ padding: '0 16px', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          {eyebrow && (
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase',
              marginBottom: 4,
            }}>{eyebrow}</div>
          )}
          <div style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 600,
            color: 'var(--ink)', lineHeight: 1.1,
          }}>{title}</div>
        </div>
        {action && (
          <button style={{
            background: 'transparent', border: 'none', color: 'var(--son)',
            fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3,
          }}>{action} <IconChevron size={12} color="var(--son)" /></button>
        )}
      </div>
      <div className="dongson-rule" style={{ marginTop: 10 }} />
    </div>
  );
}

Object.assign(window, {
  fmtVND, ArtPiece, VariantSwatch, ProductCard,
  ContactBubbles, TopBar, SectionHeading,
});
