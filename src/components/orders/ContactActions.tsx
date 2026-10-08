import { IconPhone, IconZalo } from '@/components/icons'
import { HOTLINE, HOTLINE_TEL, SOCIAL_LINKS } from '@/lib/constants'

const HOTLINE_DISPLAY = HOTLINE.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
import { ORDER_LOOKUP_COPY } from '@/lib/content-data'

// Gọi / Zalo pair used on the lock screen, the offline notice and the order detail.
export function ContactActions({ className }: { className?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-2.5 sm:grid-cols-2 ${className ?? ''}`}>
      <a
        href={HOTLINE_TEL}
        className="flex h-12 items-center justify-center gap-2 rounded-md text-[15px] font-semibold no-underline"
        style={{ background: 'var(--accent)', color: 'var(--primitive-white)' }}
      >
        <IconPhone size={16} color="var(--primitive-white)" />
        {ORDER_LOOKUP_COPY.callLabel(HOTLINE_DISPLAY)}
      </a>
      <a
        href={SOCIAL_LINKS.zalo}
        target="_blank"
        rel="noreferrer"
        className="flex h-12 items-center justify-center gap-2 rounded-md text-[15px] font-semibold no-underline"
        style={{ border: '1.5px solid var(--accent)', color: 'var(--accent)' }}
      >
        <IconZalo size={18} />
        {ORDER_LOOKUP_COPY.zaloLabel}
      </a>
    </div>
  )
}
