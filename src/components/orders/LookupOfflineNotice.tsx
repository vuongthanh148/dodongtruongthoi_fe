'use client'

import { useState } from 'react'
import { IconBox } from '@/components/icons'
import { ORDER_LOOKUP_COPY } from '@/lib/content-data'
import { ContactActions } from './ContactActions'

// Board st-lookup-offline: the API could not be reached. Orders are not affected; retry or call.
export function LookupOfflineNotice({ onRetry }: { onRetry: () => void | Promise<void> }) {
  const [retrying, setRetrying] = useState(false)

  async function retry() {
    setRetrying(true)
    try {
      await onRetry()
    } finally {
      setRetrying(false)
    }
  }

  return (
    <div role="alert" className="max-w-[760px] rounded-[10px] border p-5 md:p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--accent)' }}>
      <div className="flex gap-4">
        <span
          aria-hidden
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full"
          style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
        >
          <IconBox size={22} color="var(--accent)" />
        </span>
        <div className="flex min-w-0 flex-col gap-2.5">
          <div className="font-heading text-[20px] font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {ORDER_LOOKUP_COPY.offlineTitle}
          </div>
          <div className="text-[15px] leading-[1.6]" style={{ color: 'var(--text-secondary)' }}>
            {ORDER_LOOKUP_COPY.offlineBody}
          </div>
          <div>
            <button
              type="button"
              onClick={retry}
              disabled={retrying}
              className="h-11 rounded-md px-5 text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-45"
              style={{ background: 'var(--accent)', color: 'var(--primitive-white)' }}
            >
              {retrying ? ORDER_LOOKUP_COPY.offlineRetrying : ORDER_LOOKUP_COPY.offlineRetry}
            </button>
          </div>
          <div className="text-[14px]" style={{ color: 'var(--text-muted-strong)' }}>
            {ORDER_LOOKUP_COPY.offlineContact}
          </div>
          <ContactActions className="mt-1" />
        </div>
      </div>
    </div>
  )
}
