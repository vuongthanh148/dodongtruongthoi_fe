interface MapEmbedProps {
  src: string
  title: string
  height: number | string
  radius?: number
  className?: string
}

export function MapEmbed({ src, title, height, radius = 10, className }: MapEmbedProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        height,
        borderRadius: radius,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--bg-surface-alt)',
      }}
    >
      <iframe
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
      />
    </div>
  )
}
