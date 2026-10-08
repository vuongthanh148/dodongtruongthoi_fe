'use client'

import { useEffect, useRef, useState } from 'react'
import { IconClose, IconFacebook, IconMessenger, IconZalo } from '@/components/icons'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { SHARE_COPY } from '@/lib/content-data'
import { facebookShareUrl, messengerShareUrl, zaloShareUrl } from '@/lib/product-links'

type ShareStatus = 'idle' | 'opening' | 'copied' | 'error'
type ArtBg = 'gold' | 'red' | 'bronze' | 'dark'
type ArtFrame = 'bronze' | 'gold' | 'dark' | 'carved'

interface ShareSheetProps {
  title: string
  /** Product page path with the chosen size and options, e.g. /products/x?sizeId=... */
  path: string
  /** Shown in the sheet header next to the title. */
  image?: string | null
  bg?: ArtBg
  frame?: ArtFrame
  /** One-line summary of the chosen options. */
  summary?: string
}

const ZALO_OPEN_MS = 1400

// Share trigger (44px circle) and its panel. Panel is a popover from md up and a bottom
// sheet below md. Render it inside a positioned parent; the trigger sits at its top-right.
export function ShareSheet({ title, path, image, bg = 'gold', frame = 'bronze', summary }: ShareSheetProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<ShareStatus>('idle')
  const [url, setUrl] = useState('')
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const linkRef = useRef<HTMLInputElement | null>(null)

  function openSheet() {
    setUrl(`${window.location.origin}${path}`)
    setStatus('idle')
    setOpen(true)
  }

  function closeSheet() {
    setOpen(false)
    setStatus('idle')
    triggerRef.current?.focus()
  }

  // Focus the panel when it opens; Esc closes; a click outside closes (popover layout).
  useEffect(() => {
    if (!open) return
    dialogRef.current?.focus()

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') closeSheet()
    }
    function onPointer(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [open])

  // Zalo tile shows "opening" briefly, then returns to idle.
  useEffect(() => {
    if (status !== 'opening') return
    const timer = window.setTimeout(() => setStatus((s) => (s === 'opening' ? 'idle' : s)), ZALO_OPEN_MS)
    return () => window.clearTimeout(timer)
  }, [status])

  function shareZalo() {
    setStatus('opening')
    window.open(zaloShareUrl(url || `${window.location.origin}${path}`), '_blank', 'noopener,noreferrer')
  }

  function shareFacebook() {
    window.open(
      facebookShareUrl(url || `${window.location.origin}${path}`),
      '_blank',
      'noopener,noreferrer,width=640,height=560'
    )
  }

  function shareMessenger() {
    window.location.href = messengerShareUrl(url || `${window.location.origin}${path}`)
  }

  async function copyLink() {
    const text = url || `${window.location.origin}${path}`
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      setStatus('error')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch {
      setStatus('error')
    }
  }

  async function shareNative() {
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return
    try {
      await navigator.share({ title, url: url || `${window.location.origin}${path}` })
      closeSheet()
    } catch {
      // user dismissed the native sheet
    }
  }

  function selectLink() {
    linkRef.current?.select()
  }

  const canNativeShare = open && typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  const copied = status === 'copied'
  const zaloBusy = status === 'opening'

  return (
    <div ref={wrapRef} className="absolute top-0 right-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? closeSheet() : openSheet())}
        aria-label={SHARE_COPY.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`grid h-11 w-11 place-items-center rounded-full border bg-[var(--bg-card)] transition-colors ${
          open ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-primary)]'
        }`}
      >
        <ShareGlyph />
      </button>

      {open && (
        <>
          <div
            onClick={closeSheet}
            aria-hidden="true"
            className="fixed inset-0 z-[60] bg-[rgba(20,14,9,0.45)] md:hidden"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="false"
            aria-label={SHARE_COPY.title}
            tabIndex={-1}
            className="sheet-in fixed inset-x-0 bottom-0 z-[61] flex max-h-[85vh] flex-col gap-4 overflow-y-auto rounded-t-[16px] border-t border-[var(--border)] bg-[var(--bg-card)] px-4 pt-2 pb-6 shadow-[0_-12px_32px_-12px_rgba(0,0,0,0.3)] outline-none md:absolute md:inset-x-auto md:top-[54px] md:right-0 md:bottom-auto md:w-[344px] md:max-h-none md:rounded-[12px] md:border md:p-4 md:shadow-[0_24px_48px_-20px_rgba(42,31,26,0.45)]"
          >
            <span className="mx-auto h-1 w-10 rounded-full bg-[var(--border)] md:hidden" />

            <div className="flex items-center justify-between gap-3">
              <span className="font-body text-[17px] font-semibold text-[var(--text-primary)]">{SHARE_COPY.title}</span>
              <button
                type="button"
                onClick={closeSheet}
                aria-label={SHARE_COPY.close}
                className="grid h-10 w-10 place-items-center text-[var(--text-muted-strong)]"
              >
                <IconClose size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 rounded-[8px] bg-[var(--bg-surface-alt)] p-2.5">
              <span className="block w-16 shrink-0">
                <ArtPiece bg={bg} frame={frame} pad={3} aspect="4/3" imgSrc={image ?? null} label={image ? title : ''} />
              </span>
              <div className="min-w-0">
                <div className="truncate font-body text-[15px] font-semibold text-[var(--text-primary)]">{title}</div>
                {summary && <div className="mt-0.5 truncate text-[12px] text-[var(--text-muted-strong)]">{summary}</div>}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <ShareTile label={SHARE_COPY.targets.zalo} busyLabel={SHARE_COPY.targets.zaloOpening} busy={zaloBusy} onClick={shareZalo}>
                <IconZalo size={28} />
              </ShareTile>
              <ShareTile label={SHARE_COPY.targets.facebook} onClick={shareFacebook}>
                <IconFacebook size={28} />
              </ShareTile>
              <ShareTile label={SHARE_COPY.targets.messenger} onClick={shareMessenger}>
                <IconMessenger size={28} />
              </ShareTile>
              <ShareTile
                label={copied ? SHARE_COPY.targets.copied : SHARE_COPY.targets.copy}
                done={copied}
                onClick={copyLink}
              >
                {copied ? <CheckGlyph /> : <LinkGlyph />}
              </ShareTile>
            </div>

            {copied && (
              <p role="status" className="m-0 text-[13px] font-medium text-[var(--color-success)]">
                {SHARE_COPY.copiedLine}
              </p>
            )}

            {status === 'error' && (
              <div className="flex flex-col gap-2 rounded-[8px] border border-[rgba(139,30,30,0.2)] bg-[var(--accent-subtle)] p-3">
                <p role="alert" className="m-0 text-[13px] leading-[1.5] font-medium text-[var(--accent)]">
                  {SHARE_COPY.fallbackTitle}
                </p>
                <input
                  ref={linkRef}
                  readOnly
                  value={url}
                  onFocus={selectLink}
                  onClick={selectLink}
                  aria-label={SHARE_COPY.linkLabel}
                  className="h-10 w-full min-w-0 rounded-[6px] border border-[var(--border)] bg-[var(--bg-card)] px-2.5 font-body text-[13px] text-[var(--text-primary)]"
                />
              </div>
            )}

            {canNativeShare && (
              <button
                type="button"
                onClick={shareNative}
                className="h-11 rounded-[6px] border border-[var(--accent)] bg-transparent font-body text-[14px] font-semibold text-[var(--accent)]"
              >
                {SHARE_COPY.targets.nativeShare}
              </button>
            )}

            <p className="m-0 text-[12px] leading-[1.5] text-[var(--text-muted-strong)]">{SHARE_COPY.note}</p>

            <button
              type="button"
              onClick={closeSheet}
              className="h-12 rounded-[6px] border border-[var(--border)] bg-transparent font-body text-[15px] font-semibold text-[var(--text-primary)] md:hidden"
            >
              {SHARE_COPY.close}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function ShareTile({
  label,
  busyLabel,
  busy = false,
  done = false,
  onClick,
  children,
}: {
  label: string
  busyLabel?: string
  busy?: boolean
  done?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={busy && busyLabel ? busyLabel : label}
      className="flex min-h-[92px] flex-col items-center justify-start gap-2 rounded-[8px] px-1 py-1"
    >
      <span
        className={`grid h-14 w-14 place-items-center rounded-full border transition-colors ${
          done
            ? 'border-[rgba(45,106,45,0.3)] bg-[var(--color-success-subtle)] text-[var(--color-success)]'
            : 'border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)]'
        }`}
      >
        {busy ? <Spinner /> : children}
      </span>
      <span
        className={`text-center text-[12.5px] leading-[1.3] font-medium ${
          done ? 'text-[var(--color-success)]' : 'text-[var(--text-primary)]'
        }`}
      >
        {busy && busyLabel ? busyLabel : label}
      </span>
    </button>
  )
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="block h-5 w-5 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]"
    />
  )
}

function ShareGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  )
}

function LinkGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.5-1.5" />
    </svg>
  )
}

function CheckGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}
