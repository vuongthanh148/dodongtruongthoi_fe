'use client'

import { IconMapPin, IconPhone, IconZalo } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { ReadColumn } from '@/components/layout/ReadColumn'
import { ContentPageShell } from '@/components/content/ContentPageShell'
import { Skeleton } from '@/components/ui/Skeleton'
import { HOTLINE, HOTLINE_TEL, SHOP_ADDRESS, SOCIAL_LINKS } from '@/lib/constants'
import { CONTENT_PAGE_META, CONTENT_STATE_COPY, type ContentKind } from '@/lib/content-data'

interface ContentStateProps {
  kind: ContentKind
  state: 'loading' | 'error'
  onRetry?: () => void
}

const pageClass = 'w-full pb-10 pt-4 md:pb-14 md:pt-6 lg:pb-16 xl:pb-[72px]'

function LoadingBody({ kind }: { kind: ContentKind }) {
  if (kind === 'blog') {
    return (
      <div aria-hidden="true" className="flex flex-col gap-10 md:gap-14">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
          <Skeleton className="w-full rounded-[10px]" style={{ aspectRatio: '16/10' }} />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-7 w-11/12" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="w-full rounded-[10px]" style={{ aspectRatio: '4/3' }} />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (kind === 'article') {
    return (
      <ReadColumn>
        <div aria-hidden="true" className="flex flex-col gap-4">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-9 w-11/12" />
          <Skeleton className="h-9 w-2/3" />
        </div>
        <Skeleton className="mx-auto mb-9 mt-7 w-full rounded-lg md:rounded-xl" style={{ maxWidth: 1000, aspectRatio: '16/8' }} />
        <div aria-hidden="true" className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
          <Skeleton className="h-4 w-4/5" />
        </div>
      </ReadColumn>
    )
  }

  if (kind === 'contact') {
    return (
      <div aria-hidden="true" className="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1fr)_1.3fr] md:gap-6 lg:gap-12">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-1/3" />
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
        <div className="flex flex-col gap-3.5 rounded-[10px] p-4 md:p-7" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    )
  }

  if (kind === 'faq') {
    return (
      <ReadColumn>
        <div aria-hidden="true" className="rounded-[10px] p-5" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="py-3.5" style={{ borderTop: i ? '1px solid var(--border-soft)' : 'none' }}>
              <Skeleton className="h-5" style={{ width: `${60 + ((i * 7) % 30)}%` }} />
            </div>
          ))}
        </div>
      </ReadColumn>
    )
  }

  if (kind === 'guide') {
    return (
      <ReadColumn>
        <div aria-hidden="true" className="flex flex-col">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-[40px_minmax(0,1fr)] gap-4 py-5 md:grid-cols-[56px_minmax(0,1fr)] md:gap-5 md:py-7" style={{ borderTop: i ? '1px solid var(--border)' : 'none' }}>
              <Skeleton className="h-8 w-8" />
              <div className="flex flex-col gap-2.5">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </ReadColumn>
    )
  }

  // craft
  return (
    <div aria-hidden="true" className="flex flex-col gap-12 md:gap-14">
      <Skeleton className="w-full rounded-none" style={{ height: 320 }} />
      {[0, 1].map((i) => (
        <div key={i} className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-16">
          <Skeleton className="w-full rounded-[12px]" style={{ aspectRatio: '4/3' }} />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorBody({ kind, onRetry }: { kind: ContentKind; onRetry?: () => void }) {
  const isContact = kind === 'contact'
  const buttonBase = { height: 50, padding: '0 22px', borderRadius: 6, fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 } as const

  return (
    <div
      role="alert"
      className="mx-auto flex max-w-[640px] flex-col items-center gap-3 rounded-[10px] px-5 py-10 text-center md:px-8 md:py-14"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <span
        className="grid h-14 w-14 place-items-center rounded-full"
        style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
        aria-hidden="true"
      >
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 9v4M12 16.5v.01M12 3.5l9 16.5H3z" />
        </svg>
      </span>
      <h2 className="text-[22px] md:text-[26px]" style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, lineHeight: 1.2, margin: '4px 0 0' }}>
        {isContact ? CONTENT_STATE_COPY.contactErrorTitle : CONTENT_STATE_COPY.errorTitle}
      </h2>
      <p className="max-w-[480px] text-[15px]" style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, textWrap: 'pretty' }}>
        {isContact ? CONTENT_STATE_COPY.contactErrorBody : CONTENT_STATE_COPY.errorBody}
      </p>

      <div className="mt-3 flex w-full flex-col justify-center gap-2.5 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          style={{ ...buttonBase, border: 'none', background: 'var(--accent)', color: 'var(--primitive-white)', cursor: 'pointer' }}
        >
          {CONTENT_STATE_COPY.retry}
        </button>
        <a href={HOTLINE_TEL} style={{ ...buttonBase, border: '1.5px solid var(--accent)', color: 'var(--accent)' }}>
          <IconPhone size={16} color="currentColor" /> {CONTENT_STATE_COPY.call}
        </a>
        <a href={SOCIAL_LINKS.zalo} target="_blank" rel="noreferrer" style={{ ...buttonBase, border: '1.5px solid var(--accent)', color: 'var(--accent)' }}>
          <IconZalo size={18} /> {CONTENT_STATE_COPY.zalo}
        </a>
      </div>

      {isContact ? (
        <div className="mt-4 flex w-full max-w-[420px] flex-col gap-2 text-left" style={{ fontSize: 15, color: 'var(--text-primary)' }}>
          <div className="flex items-start gap-2.5">
            <IconPhone size={18} color="var(--accent)" />
            <span style={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--accent)' }}>
              {HOTLINE.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <IconMapPin size={18} color="var(--accent)" />
            <span>{SHOP_ADDRESS}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

// Loading (skeleton that keeps the page layout) and error (message, retry, hotline and Zalo)
// for one content page. Route loading.tsx / error.tsx render this; boards cs-<page>-loading|error.
export function ContentState({ kind, state, onRetry }: ContentStateProps) {
  const meta = CONTENT_PAGE_META[kind]
  const body = state === 'loading' ? <LoadingBody kind={kind} /> : <ErrorBody kind={kind} onRetry={onRetry} />

  return (
    <ContentPageShell topTitle={meta.topTitle} crumbs={meta.crumbs} withVisit={meta.withVisit}>
      <Container className={pageClass} aria-busy={state === 'loading' ? true : undefined}>
        {state === 'loading' ? <span className="sr-only">{CONTENT_STATE_COPY.loading}</span> : null}
        {body}
      </Container>
    </ContentPageShell>
  )
}
