'use client'

import { useEffect, useRef, useState } from 'react'
import { SAVED_SYNC_COPY } from '@/lib/content-data'
import { maskPhone } from '@/lib/order-lookup'
import {
  MAX_OTP_SENDS_PER_HOUR,
  OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
  clearSyncState,
  deleteSyncedSaved,
  fetchSyncedSaved,
  mergeSavedVariants,
  normalizeVnPhone,
  otpSendsInLastHour,
  pushSyncedSaved,
  readSyncState,
  recordOtpSend,
  requestSavedOtp,
  verifySavedOtp,
  writeSyncState,
} from '@/lib/saved-sync'
import type { SavedProductVariant } from '@/lib/types'

type Stage = 'phone' | 'otp' | 'on'
type Notice = { tone: 'info' | 'error'; text: string } | null

interface SavedSyncProps {
  /** The device list. Pushed to the server copy while sync is on. */
  localVariants: SavedProductVariant[]
  /** Called with the merged list after a pull from the server. */
  onMerged: (variants: SavedProductVariant[]) => void
}

const PUSH_DEBOUNCE_MS = 800

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

// "Đồng bộ đã lưu": phone + consent, OTP, then synced. Device saving stays on whatever happens here.
export function SavedSync({ localVariants, onMerged }: SavedSyncProps) {
  const [ready, setReady] = useState(false)
  const [stage, setStage] = useState<Stage>('phone')
  const [phoneInput, setPhoneInput] = useState('')
  const [consent, setConsent] = useState(false)
  const [activePhone, setActivePhone] = useState('')
  const [code, setCode] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [turningOff, setTurningOff] = useState(false)
  const [notice, setNotice] = useState<Notice>(null)
  const [token, setToken] = useState<string | null>(null)
  const [phoneMasked, setPhoneMasked] = useState('')

  const localRef = useRef(localVariants)
  useEffect(() => {
    localRef.current = localVariants
  }, [localVariants])

  // Restore an existing sync on this device and pull the server copy once.
  useEffect(() => {
    const saved = readSyncState()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true)
    if (!saved) return
    setToken(saved.token)
    setPhoneMasked(saved.phoneMasked)
    setStage('on')
    let cancelled = false
    fetchSyncedSaved(saved.token).then((res) => {
      if (cancelled) return
      if (res.kind === 'ok') {
        onMerged(mergeSavedVariants(localRef.current, res.data))
      } else if (res.kind === 'unauthorized') {
        clearSyncState()
        setToken(null)
        setStage('phone')
        setNotice({ tone: 'error', text: SAVED_SYNC_COPY.sessionExpired })
      } else if (res.kind === 'unavailable') {
        setNotice({ tone: 'info', text: SAVED_SYNC_COPY.unavailable })
      }
    })
    return () => {
      cancelled = true
    }
    // Runs once on mount; later changes go through the push effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Resend cooldown.
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    return () => window.clearTimeout(timer)
  }, [cooldown])

  // While synced, push the device list to the server (debounced).
  useEffect(() => {
    if (stage !== 'on' || !token) return
    const timer = window.setTimeout(async () => {
      const res = await pushSyncedSaved(token, localVariants)
      if (res.kind === 'unauthorized') {
        clearSyncState()
        setToken(null)
        setStage('phone')
        setNotice({ tone: 'error', text: SAVED_SYNC_COPY.sessionExpired })
      } else if (res.kind === 'unavailable') {
        setNotice({ tone: 'info', text: SAVED_SYNC_COPY.unavailable })
      } else if (res.kind !== 'ok') {
        setNotice({ tone: 'error', text: SAVED_SYNC_COPY.error })
      }
    }, PUSH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [localVariants, stage, token])

  if (!ready) return null

  const normalized = normalizeVnPhone(phoneInput)
  const sendsThisHour = activePhone ? otpSendsInLastHour(activePhone) : 0
  const limitReached = sendsThisHour >= MAX_OTP_SENDS_PER_HOUR
  const canSend = consent && normalized !== null && !sending

  async function sendOtp(phone: string) {
    if (otpSendsInLastHour(phone) >= MAX_OTP_SENDS_PER_HOUR) {
      setNotice({ tone: 'error', text: SAVED_SYNC_COPY.limitReached })
      return
    }
    setSending(true)
    const res = await requestSavedOtp(phone)
    setSending(false)
    if (res.kind === 'ok') {
      recordOtpSend(phone)
      setActivePhone(phone)
      setStage('otp')
      setCode('')
      setCooldown(RESEND_COOLDOWN_SECONDS)
      setNotice(null)
    } else if (res.kind === 'unavailable') {
      setNotice({ tone: 'info', text: SAVED_SYNC_COPY.unavailable })
    } else if (res.kind === 'rate_limited') {
      setNotice({ tone: 'error', text: SAVED_SYNC_COPY.limitReached })
    } else {
      setNotice({ tone: 'error', text: SAVED_SYNC_COPY.error })
    }
  }

  async function submitPhone(event: React.FormEvent) {
    event.preventDefault()
    if (!canSend || normalized === null) return
    await sendOtp(normalized)
  }

  async function submitCode(event: React.FormEvent) {
    event.preventDefault()
    if (code.length !== OTP_LENGTH || verifying) return
    setVerifying(true)
    const res = await verifySavedOtp(activePhone, code)
    setVerifying(false)
    if (res.kind === 'ok') {
      const masked = maskPhone(activePhone)
      writeSyncState({ token: res.data.token, phoneMasked: masked })
      setToken(res.data.token)
      setPhoneMasked(masked)
      setStage('on')
      setNotice(null)
      const pulled = await fetchSyncedSaved(res.data.token)
      if (pulled.kind === 'ok') {
        onMerged(mergeSavedVariants(localRef.current, pulled.data))
      } else if (pulled.kind === 'unavailable') {
        setNotice({ tone: 'info', text: SAVED_SYNC_COPY.unavailable })
      }
    } else if (res.kind === 'invalid' || res.kind === 'unauthorized') {
      setNotice({ tone: 'error', text: SAVED_SYNC_COPY.otpWrong })
    } else if (res.kind === 'unavailable') {
      setNotice({ tone: 'info', text: SAVED_SYNC_COPY.unavailable })
    } else if (res.kind === 'rate_limited') {
      setNotice({ tone: 'error', text: SAVED_SYNC_COPY.limitReached })
    } else {
      setNotice({ tone: 'error', text: SAVED_SYNC_COPY.error })
    }
  }

  async function turnOff() {
    if (!token || turningOff) return
    setTurningOff(true)
    const res = await deleteSyncedSaved(token)
    setTurningOff(false)
    if (res.kind === 'ok' || res.kind === 'unavailable' || res.kind === 'unauthorized') {
      clearSyncState()
      setToken(null)
      setStage('phone')
      setPhoneInput('')
      setConsent(false)
      setNotice(res.kind === 'unavailable' ? { tone: 'info', text: SAVED_SYNC_COPY.unavailable } : null)
    } else {
      setNotice({ tone: 'error', text: SAVED_SYNC_COPY.turnOffFailed })
    }
  }

  function changePhone() {
    setStage('phone')
    setCode('')
    setNotice(null)
  }

  const noticeBox = notice && (
    <p
      role={notice.tone === 'error' ? 'alert' : 'status'}
      className={`m-0 rounded-[6px] px-3 py-2.5 text-[14px] leading-[1.5] ${
        notice.tone === 'error'
          ? 'bg-[var(--accent-subtle)] font-medium text-[var(--accent)]'
          : 'border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
      }`}
    >
      {notice.text}
    </p>
  )

  if (stage === 'on') {
    return (
      <section
        aria-label={SAVED_SYNC_COPY.eyebrow}
        className="flex flex-col gap-4 rounded-[10px] bg-[var(--color-success-subtle)] p-4 md:flex-row md:items-center md:justify-between md:p-[22px]"
      >
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="eyebrow m-0">{SAVED_SYNC_COPY.eyebrow}</p>
          <p className="m-0 font-body text-[16px] font-semibold text-[var(--text-primary)]">
            {SAVED_SYNC_COPY.onTitle(phoneMasked)}
          </p>
          <p className="m-0 text-[14.5px] leading-[1.55] text-[var(--text-secondary)]">{SAVED_SYNC_COPY.onBody}</p>
          {noticeBox}
        </div>
        <button
          type="button"
          onClick={turnOff}
          disabled={turningOff}
          className="h-10 shrink-0 rounded-[6px] border border-[var(--border)] bg-[var(--bg-card)] px-4 font-body text-[14px] font-semibold text-[var(--text-secondary)]"
        >
          {turningOff ? SAVED_SYNC_COPY.turningOff : SAVED_SYNC_COPY.turnOff}
        </button>
      </section>
    )
  }

  if (stage === 'otp') {
    const masked = maskPhone(activePhone)
    return (
      <section aria-label={SAVED_SYNC_COPY.eyebrow} className="flex flex-col gap-4 rounded-[10px] bg-[var(--bg-surface-alt)] p-4 md:p-[22px]">
        <p className="eyebrow m-0">{SAVED_SYNC_COPY.eyebrow}</p>
        <div className="flex flex-col gap-1.5">
          <p className="m-0 font-body text-[16px] font-semibold text-[var(--text-primary)]">{SAVED_SYNC_COPY.otpTitle}</p>
          <p className="m-0 text-[14.5px] leading-[1.55] text-[var(--text-secondary)]">
            {SAVED_SYNC_COPY.otpBody(masked)}{' '}
            <button type="button" onClick={changePhone} className="font-semibold text-[var(--accent)] underline">
              {SAVED_SYNC_COPY.changePhone}
            </button>
          </p>
        </div>
        <form onSubmit={submitCode} noValidate className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={OTP_LENGTH}
            aria-label={SAVED_SYNC_COPY.otpLabel}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))}
            className="h-[50px] w-full rounded-[6px] border border-[var(--border)] bg-[var(--bg-card)] px-4 text-center font-body text-[20px] font-semibold tracking-[0.4em] text-[var(--text-primary)] tabular-nums md:w-[220px]"
          />
          <button
            type="submit"
            disabled={code.length !== OTP_LENGTH || verifying}
            className="h-[50px] rounded-[6px] bg-[var(--accent)] px-6 font-body text-[15px] font-semibold text-white"
          >
            {verifying ? SAVED_SYNC_COPY.verifying : SAVED_SYNC_COPY.verify}
          </button>
        </form>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[var(--text-muted-strong)]">
          {cooldown > 0 ? (
            <span>
              {SAVED_SYNC_COPY.resendIn(formatCountdown(cooldown))} · {SAVED_SYNC_COPY.limitNote}
            </span>
          ) : limitReached ? (
            <span>{SAVED_SYNC_COPY.limitReached}</span>
          ) : (
            <>
              <button
                type="button"
                onClick={() => sendOtp(activePhone)}
                disabled={sending}
                className="font-semibold text-[var(--accent)] underline"
              >
                {SAVED_SYNC_COPY.resend}
              </button>
              <span>· {SAVED_SYNC_COPY.limitNote}</span>
            </>
          )}
        </div>
        {noticeBox}
      </section>
    )
  }

  return (
    <section aria-label={SAVED_SYNC_COPY.eyebrow} className="flex flex-col gap-4 rounded-[10px] bg-[var(--bg-surface-alt)] p-4 md:p-[22px]">
      <div className="flex flex-col gap-1.5">
        <p className="eyebrow m-0">{SAVED_SYNC_COPY.eyebrow}</p>
        <p className="m-0 font-body text-[16px] font-semibold text-[var(--text-primary)]">{SAVED_SYNC_COPY.title}</p>
        <p className="m-0 text-[14.5px] leading-[1.55] text-[var(--text-secondary)]">{SAVED_SYNC_COPY.body}</p>
      </div>
      <form onSubmit={submitPhone} noValidate className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="sr-only" htmlFor="saved-sync-phone">
            {SAVED_SYNC_COPY.phoneLabel}
          </label>
          <input
            id="saved-sync-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={SAVED_SYNC_COPY.phonePlaceholder}
            value={phoneInput}
            onChange={(e) => {
              setPhoneInput(e.target.value)
              setNotice(null)
            }}
            onBlur={() => {
              if (phoneInput.trim() && normalizeVnPhone(phoneInput) === null) {
                setNotice({ tone: 'error', text: SAVED_SYNC_COPY.phoneInvalid })
              }
            }}
            aria-invalid={phoneInput.trim() !== '' && normalized === null}
            className="h-[46px] w-full rounded-[6px] border border-[var(--border)] bg-[var(--bg-card)] px-3.5 font-body text-[15px] text-[var(--text-primary)] md:w-[260px]"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="h-[46px] rounded-[6px] bg-[var(--accent)] px-5 font-body text-[15px] font-semibold text-white"
          >
            {sending ? SAVED_SYNC_COPY.sending : SAVED_SYNC_COPY.sendOtp}
          </button>
        </div>
        <label className="flex cursor-pointer items-start gap-2.5 text-[14px] leading-[1.5] text-[var(--text-secondary)]">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-[3px] h-[18px] w-[18px] shrink-0 accent-[var(--accent)]"
          />
          <span>{SAVED_SYNC_COPY.consent}</span>
        </label>
      </form>
      {noticeBox}
    </section>
  )
}
