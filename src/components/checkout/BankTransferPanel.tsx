'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { BANK_ACCOUNT, BANK_COPY } from '@/lib/content-data'
import { HOTLINE, HOTLINE_TEL, SOCIAL_LINKS } from '@/lib/constants'
import { formatVnd } from '@/lib/format'
import { loadSettings } from '@/lib/storefront-api'
import { SWR_KEYS } from '@/lib/swr-keys'
import { cn } from '@/lib/utils'

const COPY_FEEDBACK_MS = 1500

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), COPY_FEEDBACK_MS)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // Clipboard can be blocked (permissions, insecure context). Nothing else to do.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={BANK_COPY.copyAria(label)}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--bg-card)] px-3 font-body text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:border-[var(--accent)] focus-visible:shadow-[0_0_0_3px_var(--accent-subtle)] focus-visible:outline-none"
    >
      {copied ? (
        BANK_COPY.copied
      ) : (
        <>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {BANK_COPY.copy}
        </>
      )}
    </button>
  )
}

interface BankTransferPanelProps {
  /** checkout: before the order exists. confirm: after the order is created. */
  mode: 'checkout' | 'confirm'
  /** Order total in VND. */
  amount: number
  /** Transfer memo (the order lookup code). Null before the order is created. */
  memo: string | null
}

/**
 * Bank transfer details for the chosen "Chuyển khoản" payment method.
 * Account values come from BANK_ACCOUNT (placeholders). The settings request is only a
 * reachability check: when it fails, the panel shows the hotline and Zalo instead.
 */
export function BankTransferPanel({ mode, amount, memo }: BankTransferPanelProps) {
  const { data: settings, error, isLoading, mutate } = useSWR(SWR_KEYS.bankSettings, loadSettings, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })
  const [paid, setPaid] = useState(false)
  const account = {
    bankName: settings?.bank_name || BANK_ACCOUNT.bankName,
    accountName: settings?.bank_account_name || BANK_ACCOUNT.accountName,
    accountNumber: settings?.bank_account_number || BANK_ACCOUNT.accountNumber,
  }

  const shell = 'flex flex-col gap-4 rounded-[10px] border border-[var(--border)] bg-[var(--bg-card)] p-5 md:p-6'
  const header = (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--bg-surface-alt)] text-[var(--bronze)]" aria-hidden="true">
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10h18M5 10V19M9 10V19M15 10V19M19 10V19M2 21h20M12 3 2 8h20z" />
        </svg>
      </span>
      <h3 className="font-body text-[18px] font-semibold leading-[1.25] text-[var(--text-primary)]">{BANK_COPY.title}</h3>
    </div>
  )

  if (error) {
    return (
      <section aria-live="polite" className={shell}>
        {header}
        <div className="flex gap-3 rounded-[8px] border border-[var(--accent-subtle)] bg-[var(--accent-subtle)] p-3.5 text-[14px] leading-[1.55] text-[var(--text-secondary)]">
          <span className="font-bold text-[var(--accent)]" aria-hidden="true">!</span>
          <p>{BANK_COPY.errorBody}</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => mutate()}
            className="inline-flex h-[44px] flex-1 items-center justify-center rounded-[6px] border-[1.5px] border-[var(--accent)] px-5 font-body text-[14px] font-semibold text-[var(--accent)] md:flex-none"
          >
            {BANK_COPY.retry}
          </button>
          <a
            href={HOTLINE_TEL}
            className="inline-flex h-[44px] flex-1 items-center justify-center rounded-[6px] bg-[var(--accent)] px-5 font-body text-[14px] font-semibold text-white no-underline md:flex-none"
          >
            {BANK_COPY.callShop} {HOTLINE}
          </a>
          <a
            href={SOCIAL_LINKS.zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[44px] flex-1 items-center justify-center rounded-[6px] border-[1.5px] border-[var(--accent)] px-5 font-body text-[14px] font-semibold text-[var(--accent)] no-underline md:flex-none"
          >
            {BANK_COPY.zalo}
          </a>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section aria-busy="true" className={shell}>
        {header}
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-5 w-full animate-pulse rounded-[4px] bg-[var(--bg-surface-alt)]" />
          ))}
        </div>
        <p className="text-[13px] text-[var(--text-muted-strong)]">{BANK_COPY.loading}</p>
      </section>
    )
  }

  const rows: { label: string; value: string; copyable: boolean }[] = [
    { label: BANK_COPY.bankLabel, value: account.bankName, copyable: true },
    { label: BANK_COPY.accountNameLabel, value: account.accountName, copyable: true },
    { label: BANK_COPY.accountNumberLabel, value: account.accountNumber, copyable: true },
  ]

  return (
    <section className={shell}>
      {header}
      {mode === 'checkout' && (
        <p className="text-[14px] leading-[1.55] text-[var(--text-secondary)]">{BANK_COPY.checkoutIntro}</p>
      )}

      <dl className="flex flex-col">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[var(--border-soft)] py-3">
            <dt className="text-[13px] text-[var(--text-muted-strong)]">{row.label}</dt>
            <dd className="flex min-w-0 items-center gap-3">
              <span className="min-w-0 break-words text-right font-body text-[15px] font-semibold text-[var(--text-primary)] tabular-nums">{row.value}</span>
              {row.copyable && <CopyButton text={row.value} label={row.label} />}
            </dd>
          </div>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[var(--border-soft)] py-3">
          <dt className="text-[13px] text-[var(--text-muted-strong)]">{BANK_COPY.amountLabel}</dt>
          <dd className="price-num text-[18px]">{formatVnd(amount)}</dd>
        </div>
        <div
          className={cn(
            'mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[8px] border border-dashed border-[var(--accent)] bg-[var(--accent-subtle)] p-3.5',
          )}
        >
          <dt className="text-[13px] text-[var(--text-muted-strong)]">{BANK_COPY.memoLabel}</dt>
          <dd className="flex min-w-0 items-center gap-3">
            {memo ? (
              <>
                <span className="font-body text-[18px] font-bold tracking-[0.12em] text-[var(--accent)] tabular-nums">{memo}</span>
                <CopyButton text={memo} label={BANK_COPY.memoLabel} />
              </>
            ) : (
              <span className="text-[14px] italic text-[var(--text-muted-strong)]">{BANK_COPY.memoPending}</span>
            )}
          </dd>
        </div>
      </dl>

      {mode === 'confirm' && memo && (
        <p className="text-[13px] font-medium text-[var(--accent)]">{BANK_COPY.memoHint}</p>
      )}

      <p className="flex gap-2.5 rounded-[8px] bg-[var(--bg-surface-alt)] p-3.5 text-[14px] leading-[1.55] text-[var(--text-secondary)]">
        <span className="text-[var(--bronze)]" aria-hidden="true">●</span>
        <span>{BANK_COPY.staffNote}</span>
      </p>

      {mode === 'confirm' &&
        (paid ? (
          <div role="status" className="rounded-[8px] bg-[var(--color-success-subtle)] p-3.5">
            <p className="font-body text-[15px] font-semibold text-[var(--color-success)]">{BANK_COPY.paidTitle}</p>
            <p className="mt-1 text-[13px] leading-[1.5] text-[var(--text-secondary)]">{BANK_COPY.paidBody}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPaid(true)}
            className="inline-flex h-[46px] items-center justify-center rounded-[6px] border-[1.5px] border-[var(--accent)] px-5 font-body text-[15px] font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent-subtle)]"
          >
            {BANK_COPY.paidButton}
          </button>
        ))}
    </section>
  )
}
