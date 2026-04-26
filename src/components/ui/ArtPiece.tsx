import { memo } from 'react'

interface ArtPieceProps {
  bg?: 'gold' | 'red' | 'bronze' | 'dark'
  frame?: 'bronze' | 'gold' | 'dark' | 'carved'
  label?: string
  pad?: number
  aspect?: string
  className?: string
}

const frameClassMap: Record<NonNullable<ArtPieceProps['frame']>, string> = {
  bronze: 'frame-bronze',
  gold: 'frame-gold',
  dark: 'frame-dark',
  carved: 'frame-carved',
}

const bgClassMap: Record<NonNullable<ArtPieceProps['bg']>, string> = {
  gold: 'bronze-art gold',
  red: 'bronze-art red',
  bronze: 'bronze-art',
  dark: 'bronze-art dark',
}

export const ArtPiece = memo(function ArtPiece({
  bg = 'gold',
  frame = 'bronze',
  label = 'Tranh dong',
  pad = 10,
  aspect = '16 / 9',
  className,
}: ArtPieceProps) {
  return (
    <div
      className={`art-frame ${frameClassMap[frame]} ${className ?? ''}`.trim()}
      style={{ ['--p' as string]: `${pad}px`, aspectRatio: aspect }}
    >
      <div
        className={bgClassMap[bg]}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.25)',
        }}
      >
        <svg
          viewBox="0 0 160 90"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.45,
            mixBlendMode: 'overlay',
          }}
        >
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
        <div
          style={{
            position: 'absolute',
            left: 8,
            bottom: 6,
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 9,
            color: 'rgba(255,220,140,0.7)',
            letterSpacing: '0.08em',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  )
})
