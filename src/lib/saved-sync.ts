// Saved-products sync by phone + OTP (HANDOFF "Decisions": option B, reuse the order-lookup
// verification). The server is the source of truth for the synced copy. The device list
// (localStorage, see storage.ts) stays the working copy and keeps working without sync.
//
// Endpoints (Phase 9, not built yet). Until they exist the calls return 'unavailable' on 404
// and the UI keeps device-only saving. Request and response shapes below are a proposal for
// the backend owner to confirm.
//   POST   /api/v1/saved/otp     { phone }             -> 2xx sent
//   POST   /api/v1/saved/verify  { phone, code }       -> { data: { token } }
//   GET    /api/v1/saved         X-Saved-Token         -> { data: { items } }
//   PUT    /api/v1/saved         X-Saved-Token, { items }
//   DELETE /api/v1/saved         X-Saved-Token         (deletes the server copy)

import { API_BASE } from '@/lib/api-config'
import type { SavedProductVariant } from '@/lib/types'

export const OTP_LENGTH = 6
export const RESEND_COOLDOWN_SECONDS = 60
export const MAX_OTP_SENDS_PER_HOUR = 5

const HOUR_MS = 60 * 60 * 1000
const OTP_LOG_KEY = 'ddtt_saved_otp_log'
const SYNC_KEY = 'ddtt_saved_sync'

export type SyncResult<T> =
  | { kind: 'ok'; data: T }
  | { kind: 'unavailable' }
  | { kind: 'invalid' }
  | { kind: 'unauthorized' }
  | { kind: 'rate_limited' }
  | { kind: 'error' }

export type SyncState = { token: string; phoneMasked: string }

/** Accepts 0xxxxxxxxx or +84xxxxxxxxx (spaces, dots and dashes ignored). Returns 0xxxxxxxxx or null. */
export function normalizeVnPhone(input: string): string | null {
  let digits = input.replace(/[\s.\-()]/g, '')
  if (digits.startsWith('+84')) digits = `0${digits.slice(3)}`
  return /^0\d{9}$/.test(digits) ? digits : null
}

type RawSavedItem = { product_id?: string; size_id?: string | null; attrs?: Record<string, string> | null }

function toVariants(items: unknown): SavedProductVariant[] {
  if (!Array.isArray(items)) return []
  return (items as RawSavedItem[])
    .filter((item) => typeof item?.product_id === 'string' && item.product_id)
    .map((item) => ({
      productId: item.product_id as string,
      sizeId: item.size_id || undefined,
      attrs: item.attrs ?? undefined,
    }))
}

function toRawItems(variants: SavedProductVariant[]) {
  return variants.map((v) => ({
    product_id: v.productId,
    size_id: v.sizeId ?? null,
    attrs: v.attrs ?? {},
  }))
}

async function call(
  path: string,
  init: { method: string; token?: string; body?: unknown }
): Promise<{ status: number; json: unknown } | null> {
  try {
    const headers: Record<string, string> = {}
    if (init.body !== undefined) headers['Content-Type'] = 'application/json'
    if (init.token) headers['X-Saved-Token'] = init.token
    const res = await fetch(`${API_BASE}${path}`, {
      method: init.method,
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: 'no-store',
    })
    const json = await res.json().catch(() => null)
    return { status: res.status, json }
  } catch {
    return null
  }
}

function statusToFailure<T>(status: number): SyncResult<T> {
  if (status === 404) return { kind: 'unavailable' }
  if (status === 429) return { kind: 'rate_limited' }
  if (status === 401) return { kind: 'unauthorized' }
  if (status === 400 || status === 422) return { kind: 'invalid' }
  return { kind: 'error' }
}

export async function requestSavedOtp(phone: string): Promise<SyncResult<null>> {
  const res = await call('/saved/otp', { method: 'POST', body: { phone } })
  if (!res) return { kind: 'error' }
  if (res.status >= 200 && res.status < 300) return { kind: 'ok', data: null }
  return statusToFailure(res.status)
}

export async function verifySavedOtp(phone: string, code: string): Promise<SyncResult<{ token: string }>> {
  const res = await call('/saved/verify', { method: 'POST', body: { phone, code } })
  if (!res) return { kind: 'error' }
  if (res.status >= 200 && res.status < 300) {
    const body = res.json as { data?: { token?: unknown } } | null
    const token = body?.data?.token
    if (typeof token === 'string' && token) return { kind: 'ok', data: { token } }
    return { kind: 'error' }
  }
  return statusToFailure(res.status)
}

export async function fetchSyncedSaved(token: string): Promise<SyncResult<SavedProductVariant[]>> {
  const res = await call('/saved', { method: 'GET', token })
  if (!res) return { kind: 'error' }
  if (res.status >= 200 && res.status < 300) {
    const body = res.json as { data?: { items?: unknown } } | null
    return { kind: 'ok', data: toVariants(body?.data?.items) }
  }
  return statusToFailure(res.status)
}

export async function pushSyncedSaved(token: string, variants: SavedProductVariant[]): Promise<SyncResult<null>> {
  const res = await call('/saved', { method: 'PUT', token, body: { items: toRawItems(variants) } })
  if (!res) return { kind: 'error' }
  if (res.status >= 200 && res.status < 300) return { kind: 'ok', data: null }
  return statusToFailure(res.status)
}

export async function deleteSyncedSaved(token: string): Promise<SyncResult<null>> {
  const res = await call('/saved', { method: 'DELETE', token })
  if (!res) return { kind: 'error' }
  if (res.status >= 200 && res.status < 300) return { kind: 'ok', data: null }
  return statusToFailure(res.status)
}

/** Union by product id. Local entries come first, so nothing saved on this device is lost. */
export function mergeSavedVariants(
  local: SavedProductVariant[],
  remote: SavedProductVariant[]
): SavedProductVariant[] {
  const seen = new Set<string>()
  const out: SavedProductVariant[] = []
  for (const item of [...local, ...remote]) {
    if (seen.has(item.productId)) continue
    seen.add(item.productId)
    out.push(item)
  }
  return out
}

// ── Device-side bookkeeping. Every access is guarded: blocked storage must not break the page.

export function readSyncState(): SyncState | null {
  try {
    const raw = window.localStorage.getItem(SYNC_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<SyncState>
    if (typeof parsed.token !== 'string' || typeof parsed.phoneMasked !== 'string') return null
    return { token: parsed.token, phoneMasked: parsed.phoneMasked }
  } catch {
    return null
  }
}

export function writeSyncState(state: SyncState): void {
  try {
    window.localStorage.setItem(SYNC_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable: sync still works for this page view
  }
}

export function clearSyncState(): void {
  try {
    window.localStorage.removeItem(SYNC_KEY)
  } catch {
    // storage unavailable
  }
}

type OtpLog = Record<string, number[]>

function readOtpLog(): OtpLog {
  try {
    const raw = window.localStorage.getItem(OTP_LOG_KEY)
    return raw ? (JSON.parse(raw) as OtpLog) : {}
  } catch {
    return {}
  }
}

/** OTP sends for this number in the last hour (device-side guard; the server enforces the real limit). */
export function otpSendsInLastHour(phone: string, now: number = Date.now()): number {
  const times = readOtpLog()[phone] ?? []
  return times.filter((t) => now - t < HOUR_MS).length
}

export function recordOtpSend(phone: string, now: number = Date.now()): void {
  try {
    const log = readOtpLog()
    const times = (log[phone] ?? []).filter((t) => now - t < HOUR_MS)
    log[phone] = [...times, now]
    window.localStorage.setItem(OTP_LOG_KEY, JSON.stringify(log))
  } catch {
    // storage unavailable
  }
}
