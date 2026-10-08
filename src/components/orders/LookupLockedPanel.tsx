'use client'

import { useEffect, useState } from 'react'
import { ORDER_LOOKUP_COPY } from '@/lib/content-data'
import { ContactActions } from './ContactActions'

function mmss(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Lock screen. lockedUntil is the server's 429 locked_until; the countdown only displays it.
export function LookupLockedPanel({ lockedUntil, onExpired }: { lockedUntil: number | null; onExpired: () => void }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (lockedUntil === null) return
    const t = setInterval(() => {
      const current = Date.now()
      setNow(current)
      if (current >= lockedUntil) {
        clearInterval(t)
        onExpired()
      }
    }, 1000)
    return () => clearInterval(t)
  }, [lockedUntil, onExpired])

  const remainingS = lockedUntil === null ? 0 : Math.max(0, Math.ceil((lockedUntil - now) / 1000))

  return (
    <div className="max-w-[560px] rounded-[10px] border p-6 md:p-7" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <h2 className="text-[24px] font-medium leading-tight" style={{ color: 'var(--accent)' }}>
        {ORDER_LOOKUP_COPY.lockTitle}
      </h2>
      {lockedUntil !== null && remainingS > 0 ? (
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-[14px]" style={{ color: 'var(--text-muted-strong)' }}>
            {ORDER_LOOKUP_COPY.unlockIn}
          </span>
          <span className="text-[24px] font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {mmss(remainingS)}
          </span>
        </div>
      ) : null}
      <p className="mt-3 text-[15px] leading-[1.6]" style={{ color: 'var(--text-secondary)' }}>
        {ORDER_LOOKUP_COPY.lockBody}
      </p>
      {lockedUntil === null ? (
        <p className="mt-2 text-[14px]" style={{ color: 'var(--text-muted-strong)' }}>
          {ORDER_LOOKUP_COPY.lockUnknownTime}
        </p>
      ) : null}
      <ContactActions className="mt-5" />
    </div>
  )
}
