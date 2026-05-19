interface IconProps {
  size?: number
  color?: string
}

export function DrumMark({ size = 34, color = 'var(--accent)' }: IconProps) {
  const teeth: string[] = []
  const TEETH = 32
  for (let i = 0; i < TEETH; i++) {
    const a1 = (i / TEETH) * Math.PI * 2 - Math.PI / 2
    const a2 = ((i + 0.5) / TEETH) * Math.PI * 2 - Math.PI / 2
    const a3 = ((i + 1) / TEETH) * Math.PI * 2 - Math.PI / 2
    const rOut = 27, rIn = 24
    teeth.push(
      `${(32 + Math.cos(a2) * rOut).toFixed(2)},${(32 + Math.sin(a2) * rOut).toFixed(2)} ` +
      `${(32 + Math.cos(a1) * rIn).toFixed(2)},${(32 + Math.sin(a1) * rIn).toFixed(2)} ` +
      `${(32 + Math.cos(a3) * rIn).toFixed(2)},${(32 + Math.sin(a3) * rIn).toFixed(2)}`
    )
  }

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, lineHeight: 0 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color}
        style={{ position: 'absolute', inset: 0 }}>
        <circle cx="32" cy="32" r="30" strokeWidth="0.7" opacity="0.55" />
        <circle cx="32" cy="32" r="28" strokeWidth="1.4" />
        <g fill={color} stroke="none">
          {teeth.map((pts, i) => <polygon key={i} points={pts} />)}
        </g>
        <circle cx="32" cy="32" r="22" strokeWidth="0.6" opacity="0.7" />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '50%',
        height: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: color,
        WebkitMaskImage: 'url(/chim-lac.png)',
        maskImage: 'url(/chim-lac.png)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }} />
    </div>
  )
}
