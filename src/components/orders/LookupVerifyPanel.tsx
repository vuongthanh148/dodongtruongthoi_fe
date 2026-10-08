'use client'

import { useState, type ReactNode } from 'react'
import { ORDER_LOOKUP_COPY } from '@/lib/content-data'
import { LOOKUP_CODE_LENGTH } from '@/lib/order-lookup'

export type VerifyFeedback = {
  message: string
  remaining: number | null
  // Changes on every failed attempt so the error box re-runs its shake animation.
  key: number
} | null

type Props = {
  title: string
  // Phone is asked here (order detail page) or already known (lookup flow).
  askPhone: boolean
  knownPhone?: string
  busy: boolean
  feedback: VerifyFeedback
  onSubmit: (phone: string, code: string) => void
  footer?: ReactNode
}

// Verify step: 6-character lookup code. The OTP tab is shown disabled because the board shows it
// and no OTP endpoint exists yet.
export function LookupVerifyPanel({ title, askPhone, knownPhone, busy, feedback, onSubmit, footer }: Props) {
  const [phoneInput, setPhoneInput] = useState('')
  const [code, setCode] = useState('')

  const phoneDigits = (askPhone ? phoneInput : knownPhone ?? '').replace(/\D/g, '')
  const phoneOk = phoneDigits.length >= 9
  const codeOk = code.length === LOOKUP_CODE_LENGTH
  const canSubmit = !busy && codeOk && (!askPhone || phoneOk)

  return (
    <div className="max-w-[560px] rounded-[10px] border p-6 md:p-7" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <h2 className="font-heading text-[22px] font-semibold leading-tight md:text-[24px]" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <p className="mt-2 text-[15px] leading-[1.55]" style={{ color: 'var(--text-muted-strong)' }}>
        {ORDER_LOOKUP_COPY.verifyBody}
      </p>

      <div role="tablist" className="mt-5 flex border-b" style={{ borderColor: 'var(--border)' }}>
        <button
          type="button"
          role="tab"
          aria-selected="true"
          className="h-11 flex-1 border-b-2 text-[15px] font-semibold"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
        >
          {ORDER_LOOKUP_COPY.tabCode}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected="false"
          disabled
          className="flex h-11 flex-1 items-center justify-center gap-2 border-b-2 border-transparent text-[15px] font-normal disabled:cursor-not-allowed disabled:opacity-45"
          style={{ color: 'var(--text-secondary)' }}
        >
          {ORDER_LOOKUP_COPY.tabOtp}
          <span className="rounded-full px-2 py-0.5 text-[12px] font-medium" style={{ background: 'var(--bg-surface-alt)', color: 'var(--text-muted-strong)' }}>
            {ORDER_LOOKUP_COPY.otpSoon}
          </span>
        </button>
      </div>

      <form
        className="mt-5 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (canSubmit) onSubmit(phoneDigits, code)
        }}
      >
        {askPhone ? (
          <label className="flex flex-col gap-1.5 text-[14px]" style={{ color: 'var(--text-secondary)' }}>
            {ORDER_LOOKUP_COPY.verifyPhoneLabel}
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder={ORDER_LOOKUP_COPY.phonePlaceholder}
              className="brand-focus h-12 w-full rounded-md border px-4 text-[15px] outline-none"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            />
          </label>
        ) : null}
        <label className="flex flex-col gap-1.5 text-[14px]" style={{ color: 'var(--text-secondary)' }}>
          {ORDER_LOOKUP_COPY.codeLabel}
          <input
            autoFocus
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            inputMode="text"
            maxLength={LOOKUP_CODE_LENGTH}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, LOOKUP_CODE_LENGTH))}
            placeholder={ORDER_LOOKUP_COPY.codePlaceholder}
            className="brand-focus h-14 w-full rounded-md border px-4 text-center text-[20px] font-semibold uppercase outline-none"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)', letterSpacing: '0.35em' }}
          />
        </label>
        <div className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
          {ORDER_LOOKUP_COPY.codeHint}
        </div>

        {feedback ? (
          <div
            key={feedback.key}
            role="alert"
            className="lk-shake rounded-md px-3.5 py-2.5 text-[14px]"
            style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
          >
            {feedback.message}
            {feedback.remaining !== null ? ` ${ORDER_LOOKUP_COPY.remaining(feedback.remaining)}` : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-2 h-12 w-full rounded-md text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-45"
          style={{ background: 'var(--accent)', color: 'var(--primitive-white)' }}
        >
          {busy ? ORDER_LOOKUP_COPY.verifying : ORDER_LOOKUP_COPY.verifySubmit}
        </button>
      </form>

      {footer ? <div className="mt-4 flex flex-wrap justify-between gap-3 text-[14px]">{footer}</div> : null}
    </div>
  )
}
