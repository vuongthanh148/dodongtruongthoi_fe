'use client'

import { AdminGuard } from '@/components/admin/AdminGuard'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { adminGet, adminPut } from '@/lib/admin-api'
import { ADMIN_COPY } from '@/lib/content-data'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Phone, Search } from 'lucide-react'
import { toast } from 'sonner'

// Zalo's open-chat-by-phone deep link needs international format (84…,
// no leading 0, no spaces/dashes).
function zaloHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  const intl = digits.startsWith('0') ? `84${digits.slice(1)}` : digits
  return `https://zalo.me/${intl}`
}

type ContactMessage = {
  id: string
  name: string
  phone: string
  message: string
  handled: boolean
  created_at: string
}

type FilterMode = 'all' | 'unhandled' | 'handled'

const FILTER_PATHS: Record<FilterMode, string> = {
  all: '/contact-messages',
  unhandled: '/contact-messages?handled=false',
  handled: '/contact-messages?handled=true',
}

const FILTER_LABELS: Record<FilterMode, string> = {
  all: 'Tất cả',
  unhandled: 'Chưa xử lý',
  handled: 'Đã xử lý',
}

export default function AdminContactMessagesPage() {
  const [filter, setFilter] = useState<FilterMode>('all')
  const [rows, setRows] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [toastId, setToastId] = useState<string | null>(null)
  const [loadToken, setLoadToken] = useState(0)
  const [search, setSearch] = useState('')

  const loadMessages = useCallback(async () => {
    setLoading(true)
    setLoadError(false)
    try {
      const data = await adminGet<ContactMessage[]>(FILTER_PATHS[filter])
      setRows(data ?? [])
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    let active = true
    ;(async () => {
      await loadMessages()
      if (!active) return
    })()
    return () => {
      active = false
    }
  }, [loadToken, loadMessages])

  async function handleToggle(row: ContactMessage) {
    setBusyId(row.id)
    try {
      const saved = await adminPut<ContactMessage>(`/contact-messages/${row.id}`, {
        handled: !row.handled,
      })
      setBusyId(null)
      if (saved === null) {
        toast.error(ADMIN_COPY.inbox.updateError)
        return
      }
      setToastId(row.id)
      toast.success(row.handled ? ADMIN_COPY.inbox.markedUnhandled : ADMIN_COPY.inbox.markedHandled)
      setLoadToken((t) => t + 1)
      setTimeout(() => setToastId(null), 3000)
    } catch {
      setBusyId(null)
      toast.error(ADMIN_COPY.inbox.updateError)
    }
  }

  const allMessages = rows
  const filteredMessages = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allMessages.filter((m) => {
      if (filter === 'unhandled' && m.handled) return false
      if (filter === 'handled' && !m.handled) return false
      if (!q) return true
      return m.name.toLowerCase().includes(q) || m.phone.includes(q) || m.message.toLowerCase().includes(q)
    })
  }, [allMessages, filter, search])

  const counts = {
    unhandled: allMessages.filter((m) => !m.handled).length,
    handled: allMessages.filter((m) => m.handled).length,
    all: allMessages.length,
  }

  return (
    <AdminGuard>
      <AdminLayout
        title={ADMIN_COPY.inbox.title}
        subtitle={ADMIN_COPY.inbox.subtitle}
        mobileHideSidebar
      >
        {/* Search */}
        <label
          className="adm mb-4 flex h-10 max-w-[360px] items-center gap-2 rounded-md border px-3"
          style={{ borderColor: 'var(--admin-border)', background: '#fff', color: 'var(--admin-muted)' }}
        >
          <Search size={16} aria-hidden />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={ADMIN_COPY.inbox.searchPlaceholder}
            className="adm min-w-0 flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--admin-ink)' }}
          />
        </label>

        {/* Filter tabs */}
        <div
          role="tablist"
          className="adm mb-5 flex gap-0 border-b"
          style={{ borderBottomColor: 'var(--admin-border)' }}
        >
          {(['unhandled', 'handled', 'all'] as const).map((mode) => (
            <button
              key={mode}
              role="tab"
              aria-selected={filter === mode}
              onClick={() => setFilter(mode)}
              className="adm flex h-11 flex-none items-center gap-2 border-b-2 px-3 text-sm font-medium transition-colors"
              style={{
                borderBottomColor: filter === mode ? 'var(--admin-primary)' : 'transparent',
                color: filter === mode ? 'var(--admin-primary)' : 'var(--admin-ink-2)',
                background: 'transparent',
                cursor: 'pointer',
                marginBottom: -1,
                whiteSpace: 'nowrap',
              }}
            >
              <span>{FILTER_LABELS[mode]}</span>
              <span
                className="adm inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  background: filter === mode ? 'var(--admin-primary-subtle)' : 'var(--admin-border-soft)',
                  color: filter === mode ? 'var(--admin-primary)' : 'var(--admin-ink-2)',
                }}
              >
                {counts[mode]}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="adm flex flex-col gap-3 md:gap-4">
          {loading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {!loading && loadError && (
            <div
              className="adm rounded-lg border p-5 md:p-6"
              style={{
                borderColor: 'var(--admin-border)',
                background: 'var(--admin-surface)',
              }}
            >
              <div
                className="adm flex flex-col gap-2"
                style={{ color: 'var(--admin-ink)' }}
              >
                <div className="adm text-sm font-semibold" style={{ color: 'var(--admin-danger)' }}>
                  {ADMIN_COPY.inbox.loadError}
                </div>
                <div className="adm text-sm" style={{ color: 'var(--admin-muted)' }}>
                  {ADMIN_COPY.inbox.loadErrorBody}
                </div>
                <button
                  type="button"
                  onClick={() => loadMessages()}
                  className="adm mt-2 w-fit rounded px-3 py-2 text-sm font-medium"
                  style={{
                    background: 'var(--admin-primary)',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {ADMIN_COPY.inbox.retry}
                </button>
              </div>
            </div>
          )}

          {!loading && !loadError && filteredMessages.length === 0 && (
            <div
              className="adm rounded-lg border p-8 text-center md:p-12"
              style={{
                borderColor: 'var(--admin-border)',
                background: 'var(--admin-surface)',
              }}
            >
              <div className="adm text-sm font-medium" style={{ color: 'var(--admin-ink)' }}>
                {ADMIN_COPY.inbox.empty}
              </div>
              <div className="adm mt-1 text-sm" style={{ color: 'var(--admin-muted)' }}>
                {ADMIN_COPY.inbox.emptyBody}
              </div>
            </div>
          )}

          {!loading && !loadError && filteredMessages.map((msg) => (
            <MessageCard
              key={msg.id}
              message={msg}
              busy={busyId === msg.id}
              onToggle={() => handleToggle(msg)}
              toast={toastId === msg.id}
            />
          ))}
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}

interface MessageCardProps {
  message: ContactMessage
  busy: boolean
  onToggle: () => void
  toast: boolean
}

function MessageCard({ message, busy, onToggle, toast }: MessageCardProps) {
  const timeAgo = getTimeAgo(message.created_at)

  return (
    <article
      className="adm rounded-lg border p-4 md:p-5"
      style={{
        borderColor: 'var(--admin-border)',
        background: 'var(--admin-surface)',
        opacity: busy ? 0.6 : 1,
        transition: 'opacity 150ms',
      }}
    >
      {/* Header: Name, phone, badge, date */}
      <div className="adm mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-3">
        <div className="adm min-w-0">
          <div className="adm font-semibold" style={{ fontSize: '15px', color: 'var(--admin-ink)' }}>
            {message.name}
          </div>
          <div className="adm mt-0.5 text-sm" style={{ color: 'var(--admin-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {message.phone}
          </div>
        </div>

        <div className="adm flex flex-shrink-0 items-center gap-2">
          <span
            className="adm inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
              background: message.handled ? 'var(--admin-ok-bg)' : 'var(--admin-warn-bg)',
              color: message.handled ? 'var(--admin-ok)' : 'var(--admin-warn)',
            }}
          >
            {message.handled ? ADMIN_COPY.inbox.handled : ADMIN_COPY.inbox.unhandled}
          </span>
          <span className="adm text-xs" style={{ color: 'var(--admin-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {formatDateTime(message.created_at)}
            {timeAgo && <>, {timeAgo}</>}
          </span>
        </div>
      </div>

      {/* Message text */}
      <p
        className="adm mb-4 text-sm leading-relaxed"
        style={{
          color: 'var(--admin-ink)',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          margin: 0,
        }}
      >
        {message.message}
      </p>

      {/* Actions */}
      <div className="adm flex flex-col gap-2 sm:flex-row sm:items-center">
        <a
          href={`tel:${message.phone}`}
          className="adm inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors"
          style={{
            background: '#fff',
            color: 'var(--admin-ink)',
            border: '1px solid',
            borderColor: 'var(--admin-border)',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <Phone size={16} />
          <span>{ADMIN_COPY.inbox.call}</span>
        </a>

        <a
          href={zaloHref(message.phone)}
          target="_blank"
          rel="noreferrer"
          className="adm inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors"
          style={{
            background: '#fff',
            color: 'var(--admin-ink)',
            border: '1px solid',
            borderColor: 'var(--admin-border)',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <span>{ADMIN_COPY.inbox.zalo}</span>
        </a>

        <button
          type="button"
          disabled={busy}
          onClick={onToggle}
          className="adm inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: message.handled ? '#fff' : 'var(--admin-primary)',
            color: message.handled ? 'var(--admin-ink)' : '#fff',
            border: '1px solid',
            borderColor: message.handled ? 'var(--admin-border)' : 'var(--admin-primary)',
            cursor: busy ? 'not-allowed' : 'pointer',
          }}
        >
          {busy ? (
            <>
              <span className="adm inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              <span>{ADMIN_COPY.inbox.marking}</span>
            </>
          ) : message.handled ? (
            ADMIN_COPY.inbox.undo
          ) : (
            ADMIN_COPY.inbox.markHandled
          )}
        </button>

        {toast && (
          <div
            className="adm text-xs"
            style={{ color: 'var(--admin-ok)', fontWeight: 600 }}
          >
            ✓ {message.handled ? ADMIN_COPY.inbox.markedUnhandled : ADMIN_COPY.inbox.markedHandled}
          </div>
        )}
      </div>
    </article>
  )
}

function SkeletonCard() {
  return (
    <div
      className="adm animate-pulse rounded-lg border p-4 md:p-5"
      style={{
        borderColor: 'var(--admin-border)',
        background: 'var(--admin-surface)',
      }}
    >
      <div className="adm mb-3 flex justify-between gap-3">
        <div className="adm min-w-0 flex-1">
          <div className="adm h-4 w-32 rounded bg-gray-300"></div>
          <div className="adm mt-2 h-3 w-24 rounded bg-gray-200"></div>
        </div>
        <div className="adm h-5 w-16 rounded-full bg-gray-300"></div>
      </div>
      <div className="adm mb-4 space-y-2">
        <div className="adm h-3 w-full rounded bg-gray-300"></div>
        <div className="adm h-3 w-5/6 rounded bg-gray-300"></div>
      </div>
      <div className="adm flex gap-2">
        <div className="adm h-9 w-24 rounded bg-gray-300"></div>
        <div className="adm h-9 w-32 rounded bg-gray-300"></div>
      </div>
    </div>
  )
}

function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
}

function getTimeAgo(created_at: string): string | null {
  const date = new Date(created_at)
  if (Number.isNaN(date.getTime())) return null

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'vừa xong'
  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays === 1) return 'hôm qua'
  if (diffDays < 7) return `${diffDays} ngày trước`
  return null
}
