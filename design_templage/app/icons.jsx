// Icons — minimal, hand-built where possible. SVG kept simple (stroke-only) per guidelines.

function IconSearch({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}
function IconMenu({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
function IconChevron({ size = 16, dir = 'right', color = 'currentColor' }) {
  const d = { right: 'M9 6l6 6-6 6', left: 'M15 6l-6 6 6 6', down: 'M6 9l6 6 6-6', up: 'M6 15l6-6 6 6' }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
function IconClose({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
function IconHeart({ size = 18, color = 'currentColor', filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.5" strokeLinejoin="round">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </svg>
  );
}
function IconStar({ size = 14, color = 'currentColor', filled = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.2">
      <path d="M12 3l2.6 5.6 6 .7-4.4 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.4 9.3l6-.7L12 3z" />
    </svg>
  );
}
function IconCompare({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="7" height="14" rx="1" />
      <rect x="14" y="5" width="7" height="14" rx="1" />
      <path d="M12 3v18" strokeDasharray="2 2" />
    </svg>
  );
}
function IconGrid({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" />
      <rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" />
    </svg>
  );
}
function IconList({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
function IconFilter({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
      <path d="M3 5h18M6 12h12M10 19h4" />
    </svg>
  );
}

// Social glyphs — simple, brand-neutral (we avoid recreating proprietary logos)
function IconZalo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="16" rx="4" fill="#0068ff" />
      <text x="12" y="15" fontFamily="Be Vietnam Pro, sans-serif" fontWeight="700" fontSize="9" fill="white" textAnchor="middle">Zalo</text>
      <path d="M9 19l-2 3v-3z" fill="#0068ff" />
    </svg>
  );
}
function IconMessenger({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#0084ff" />
      <path d="M7 14.5l3-3 2.2 2L16 10l-3 4-2.2-2L7 14.5z" fill="white" />
    </svg>
  );
}
function IconFacebook({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#1877f2" />
      <path d="M13.5 21v-7h2.2l.3-2.5h-2.5V10c0-.7.2-1.2 1.2-1.2h1.3V6.6c-.6-.1-1.3-.1-2-.1-2 0-3.3 1.2-3.3 3.4v1.6H8.5V14h2.2v7h2.8z" fill="white" />
    </svg>
  );
}
function IconTiktok({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="5" fill="#000" />
      <path d="M15.3 6c.2 1.5 1.2 2.6 2.7 2.9v2.1c-1.1 0-2-.3-2.8-.8v4.3c0 2.4-2 4.2-4.3 4.2-2.2 0-4-1.7-4-4s1.8-4 4-4c.3 0 .5 0 .8.1v2.3c-.3-.1-.5-.2-.8-.2-1 0-1.9.8-1.9 1.9 0 1 .8 1.9 1.9 1.9 1 0 2-.8 2-1.9V6h2.4z" fill="white" />
    </svg>
  );
}

// Drum-of-Dong-Son inspired logo mark (original composition, not a trademark)
function DrumMark({ size = 34, color = 'var(--son)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.4">
      <circle cx="32" cy="32" r="28" />
      <circle cx="32" cy="32" r="22" />
      <circle cx="32" cy="32" r="14" />
      <circle cx="32" cy="32" r="6" />
      {/* 8-point star at center */}
      <g transform="translate(32 32)">
        {[0,45,90,135].map(a => (
          <line key={a} x1="-5" y1="0" x2="5" y2="0" transform={`rotate(${a})`} />
        ))}
      </g>
      {/* Ray ticks between rings */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i * 360) / 16;
        return <line key={i} x1="32" y1="8" x2="32" y2="11" transform={`rotate(${a} 32 32)`} />;
      })}
    </svg>
  );
}

// A square "pattern tile" — simple Dong-Son-ish geometric motif we can repeat
function DongSonTile({ size = 20, color = 'var(--bronze)', opacity = 0.4 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="0.8" opacity={opacity}>
      <path d="M0 10h20M10 0v20" />
      <circle cx="10" cy="10" r="3" />
      <path d="M0 0l10 10M20 0L10 10M0 20l10-10M20 20L10 10" />
    </svg>
  );
}

Object.assign(window, {
  IconSearch, IconMenu, IconChevron, IconClose, IconHeart, IconStar,
  IconCompare, IconGrid, IconList, IconFilter,
  IconZalo, IconMessenger, IconFacebook, IconTiktok,
  DrumMark, DongSonTile,
});
