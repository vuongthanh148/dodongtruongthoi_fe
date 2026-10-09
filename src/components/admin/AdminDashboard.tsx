'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AlertCircle, CheckCircle2, ChevronRight, Inbox } from 'lucide-react'
import { adminGet } from '@/lib/admin-api'
import { ADMIN_COPY } from '@/lib/content-data'
import { formatVnd } from '@/lib/format'
import type { AdminOrder, AdminReview } from '@/lib/types'

type Status = 'loading' | 'ready' | 'error'

interface ContactMessageRow {
  id: string
  created_at: string
}

// Each card reads its own endpoint, so one failure leaves the rest of the dashboard working.
// Non-array or failed responses resolve to null, which the card shows as an error.
function list<T>(path: string): () => Promise<T[] | null> {
  return async () => {
    const data = await adminGet<T[]>(path)
    return Array.isArray(data) ? data : null
  }
}

const loaders = {
  pendingOrders: list<AdminOrder>('/orders?status=pending_confirm'),
  recentOrders: list<AdminOrder>('/orders'),
  unhandledMessages: list<ContactMessageRow>('/contact-messages?handled=false'),
  pendingReviews: list<AdminReview>('/reviews?approved=false'),
}

interface Resource<T> {
  status: Status
  data: T[]
  loadedAt: number
  reload: () => void
}

function useResource<T>(load: () => Promise<T[] | null>): Resource<T> {
  const [state, setState] = useState<{ status: Status; data: T[]; loadedAt: number }>({
    status: 'loading',
    data: [],
    loadedAt: 0,
  })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    load().then((rows) => {
      if (!active) return
      setState(
        rows
          ? { status: 'ready', data: rows, loadedAt: Date.now() }
          : { status: 'error', data: [], loadedAt: Date.now() }
      )
    })
    return () => {
      active = false
    }
  }, [load, version])

  const reload = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'loading' }))
    setVersion((v) => v + 1)
  }, [])

  return { ...state, reload }
}

const ORDER_STATUS_TONE: Record<string, { bg: string; fg: string }> = {
  pending_confirm: { bg: 'var(--admin-warn-bg)', fg: 'var(--admin-warn)' },
  confirmed: { bg: 'var(--admin-info-bg)', fg: 'var(--admin-info)' },
  processing: { bg: 'var(--admin-indigo-bg)', fg: 'var(--admin-indigo)' },
  shipped: { bg: 'var(--admin-violet-bg)', fg: 'var(--admin-violet)' },
  completed: { bg: 'var(--admin-ok-bg)', fg: 'var(--admin-ok)' },
  cancelled: { bg: 'var(--admin-neutral-bg)', fg: 'var(--admin-muted)' },
}

function oldestHint(rows: { created_at: string }[], now: number): string | null {
  const times = rows.map((row) => Date.parse(row.created_at)).filter((t) => Number.isFinite(t))
  if (times.length === 0) return null
  const hours = (now - Math.min(...times)) / 3_600_000
  const copy = ADMIN_COPY.dashboard
  if (hours < 1) return copy.oldestLessThanHour
  if (hours < 24) return copy.oldestHours(Math.floor(hours))
  return copy.oldestDays(Math.floor(hours / 24))
}

const cardClass =
  'overflow-hidden rounded-[8px] border border-admin-border bg-admin-surface'
const retryClass =
  'inline-flex h-9 items-center rounded-md border border-admin-border bg-admin-surface px-3.5 text-[13px] font-semibold text-admin-ink cursor-pointer'

export function AdminDashboard() {
  const copy = ADMIN_COPY.dashboard
  const pendingOrders = useResource(loaders.pendingOrders)
  const recentOrders = useResource(loaders.recentOrders)
  const messages = useResource(loaders.unhandledMessages)
  const reviews = useResource(loaders.pendingReviews)

  const queueSettled = [pendingOrders, messages, reviews].every((r) => r.status === 'ready')
  const bankTransferPending = pendingOrders.data.filter((order) => order.payment_method === 'transfer')
  const queueClear =
    queueSettled &&
    pendingOrders.data.length + messages.data.length + reviews.data.length + bankTransferPending.length === 0
  const recent = [...recentOrders.data]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5)

  const cutoff = recentOrders.loadedAt - 30 * 24 * 3_600_000
  const ordersInWindow = recentOrders.data.filter((o) => Date.parse(o.created_at) >= cutoff)
  const completedInWindow = ordersInWindow.filter((o) => o.status === 'completed')
  const revenue = completedInWindow.reduce((sum, o) => sum + o.total_amount, 0)
  const aov = completedInWindow.length > 0 ? Math.round(revenue / completedInWindow.length) : 0

  const kpis = [
    {
      key: 'revenue',
      label: copy.kpi.revenue,
      hint: copy.kpiHint.revenue,
      href: '/admin/orders',
      res: recentOrders,
      value: revenue,
      money: true,
    },
    {
      key: 'newOrders',
      label: copy.kpi.newOrders,
      hint: copy.kpiHint.newOrders,
      href: '/admin/orders',
      res: recentOrders,
      value: ordersInWindow.length,
      money: false,
    },
    {
      key: 'aov',
      label: copy.kpi.aov,
      hint: copy.kpiHint.aov,
      href: '/admin/orders',
      res: recentOrders,
      value: aov,
      money: true,
    },
    {
      key: 'messages',
      label: copy.kpi.messages,
      hint: copy.kpiHint.messages,
      href: '/admin/contact-messages',
      res: messages,
      value: messages.data.length,
      money: false,
    },
  ]

  const queue = [
    {
      key: 'pendingOrders',
      label: copy.queue.pendingOrders,
      href: '/admin/orders',
      res: pendingOrders,
      hintRows: pendingOrders.data,
      count: pendingOrders.data.length,
      warn: true,
    },
    {
      key: 'unhandled',
      label: copy.queue.unhandled,
      href: '/admin/contact-messages',
      res: messages,
      hintRows: messages.data,
      count: messages.data.length,
      warn: false,
    },
    {
      key: 'pendingReviews',
      label: copy.queue.pendingReviews,
      href: '/admin/reviews',
      res: reviews,
      hintRows: reviews.data,
      count: reviews.data.length,
      warn: false,
    },
    {
      key: 'bankTransfer',
      label: copy.queue.bankTransfer,
      href: '/admin/orders',
      res: pendingOrders,
      hintRows: bankTransferPending,
      count: bankTransferPending.length,
      warn: false,
    },
  ]

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <section>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.key}
              className="flex flex-col rounded-[8px] border border-admin-border bg-admin-surface transition-colors hover:border-admin-border-strong"
            >
              <Link
                href={kpi.href}
                className="flex flex-1 flex-col gap-2 rounded-[8px] p-3.5 text-admin-ink no-underline lg:p-4"
              >
                <span className="flex items-center justify-between gap-2 text-[13px] font-medium text-admin-muted">
                  {kpi.label}
                  <ChevronRight size={14} aria-hidden />
                </span>
                {kpi.res.status === 'loading' ? (
                  <span className="skel-a block h-[26px] w-3/5 rounded" aria-label={copy.loading} />
                ) : kpi.res.status === 'error' ? (
                  <span className="flex min-h-[26px] items-center gap-1.5 text-[13px] text-admin-danger">
                    <AlertCircle size={14} aria-hidden />
                    {copy.loadError}
                  </span>
                ) : (
                  <span className="text-[22px] leading-none font-bold tabular-nums lg:text-[26px]">
                    {kpi.money ? formatVnd(kpi.value) : kpi.value}
                  </span>
                )}
                <span className="text-[12.5px] leading-snug text-admin-muted">{kpi.hint}</span>
              </Link>
              {kpi.res.status === 'error' ? (
                <div className="px-3.5 pb-3 lg:px-4">
                  <button type="button" onClick={kpi.res.reload} className={retryClass}>
                    {copy.retry}
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-5">
        <section className="order-2 flex min-w-0 flex-col gap-3 lg:order-1" aria-labelledby="dash-recent">
          <div className="flex items-center justify-between gap-3">
            <h2 id="dash-recent" className="eyebrow">
              {copy.recentTitle}
            </h2>
            <Link href="/admin/orders" className="text-[13px] font-semibold text-admin-primary no-underline">
              {copy.viewAllOrders}
            </Link>
          </div>
          <div className={cardClass} aria-busy={recentOrders.status === 'loading'}>
            {recentOrders.status === 'loading' ? (
              Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-admin-border-soft px-4 py-3.5">
                  <span className="skel-a h-4 w-2/5 rounded" />
                  <span className="ml-auto skel-a h-5 w-20 rounded-full" />
                </div>
              ))
            ) : recentOrders.status === 'error' ? (
              <Blank
                tone="err"
                icon={<AlertCircle size={22} aria-hidden />}
                title={copy.recentLoadError}
                body={copy.recentLoadErrorBody}
                action={
                  <button type="button" onClick={recentOrders.reload} className={retryClass}>
                    {copy.retry}
                  </button>
                }
              />
            ) : recent.length === 0 ? (
              <Blank
                icon={<Inbox size={22} aria-hidden />}
                title={copy.emptyTitle}
                body={copy.emptyBody}
                action={
                  <Link href="/admin/campaigns" className={`${retryClass} no-underline`}>
                    {copy.emptyCta}
                  </Link>
                }
              />
            ) : (
              recent.map((order) => {
                const tone = ORDER_STATUS_TONE[order.status] ?? ORDER_STATUS_TONE.cancelled
                return (
                  <Link
                    key={order.id}
                    href="/admin/orders"
                    className="flex min-h-[56px] items-center gap-3 border-b border-admin-border-soft px-4 py-3 text-admin-ink no-underline transition-colors hover:bg-admin-bg last:border-b-0 lg:grid lg:grid-cols-[112px_minmax(0,1fr)_120px_128px_16px] lg:gap-4"
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5 lg:contents">
                      <span className="truncate text-[14px] font-semibold tabular-nums">{order.id}</span>
                      <span className="truncate text-[13px] text-admin-muted lg:text-[14px] lg:text-admin-ink">
                        {order.customer_name || copy.customerFallback}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1 lg:contents">
                      <span className="text-[14px] font-semibold tabular-nums lg:text-right">
                        {formatVnd(order.total_amount)}
                      </span>
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold whitespace-nowrap"
                        style={{ background: tone.bg, color: tone.fg }}
                      >
                        {ADMIN_COPY.orderStatus[order.status] ?? order.status}
                      </span>
                    </span>
                    <ChevronRight size={16} aria-hidden className="shrink-0 text-admin-muted" />
                  </Link>
                )
              })
            )}
          </div>
        </section>

        <section className="order-1 flex min-w-0 flex-col gap-3 lg:order-2" aria-labelledby="dash-queue">
          <h2 id="dash-queue" className="eyebrow">
            {copy.queueTitle}
          </h2>
          <div className={cardClass} aria-busy={!queueSettled}>
            {queueClear ? (
              <Blank
                tone="ok"
                icon={<CheckCircle2 size={22} aria-hidden />}
                title={copy.clearTitle}
                body={copy.clearBody}
              />
            ) : (
              queue.map((item) => {
                if (item.res.status === 'loading') {
                  return (
                    <div
                      key={item.key}
                      className="flex min-h-[60px] flex-col justify-center gap-2 border-b border-admin-border-soft px-4 py-3 last:border-b-0"
                    >
                      <span className="skel-a h-4 w-3/5 rounded" />
                      <span className="skel-a h-3 w-2/5 rounded" />
                    </div>
                  )
                }
                const failed = item.res.status === 'error'
                const hint = failed
                  ? copy.loadError
                  : oldestHint(item.hintRows, item.res.loadedAt)
                const badgeTone = item.warn
                  ? { background: 'var(--admin-warn-bg)', color: 'var(--admin-warn)' }
                  : { background: 'var(--admin-primary-subtle)', color: 'var(--admin-primary)' }
                return (
                  <div
                    key={item.key}
                    className="flex items-center border-b border-admin-border-soft last:border-b-0 hover:bg-admin-bg"
                  >
                    <Link
                      href={item.href}
                      className="flex min-h-[60px] min-w-0 flex-1 items-center gap-3 px-4 py-3 text-admin-ink no-underline"
                    >
                      <span
                        className="grid h-8 min-w-8 shrink-0 place-items-center rounded-full px-2 text-[14px] font-bold tabular-nums"
                        style={failed ? { background: 'var(--admin-border-soft)', color: 'var(--admin-muted)' } : badgeTone}
                      >
                        {failed ? '—' : item.count}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-semibold">{item.label}</span>
                        <span
                          className="mt-0.5 block text-[12.5px] leading-snug"
                          style={{ color: failed ? 'var(--admin-danger)' : 'var(--admin-muted)' }}
                        >
                          {hint ?? ''}
                        </span>
                      </span>
                      <ChevronRight size={16} aria-hidden className="shrink-0 text-admin-muted" />
                    </Link>
                    {failed ? (
                      <button type="button" onClick={item.res.reload} className={`${retryClass} mr-3 shrink-0`}>
                        {copy.retry}
                      </button>
                    ) : null}
                  </div>
                )
              })
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function Blank({
  icon,
  title,
  body,
  action,
  tone,
}: {
  icon: ReactNode
  title: string
  body: string
  action?: ReactNode
  tone?: 'err' | 'ok'
}) {
  const iconStyle =
    tone === 'err'
      ? { background: 'var(--admin-primary-subtle)', color: 'var(--admin-danger)' }
      : tone === 'ok'
        ? { background: 'var(--admin-ok-bg)', color: 'var(--admin-ok)' }
        : { background: 'var(--admin-border-soft)', color: 'var(--admin-muted)' }
  return (
    <div className="flex flex-col items-center gap-2.5 px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full" style={iconStyle}>
        {icon}
      </span>
      <div className="text-[16px] font-semibold text-admin-ink">{title}</div>
      <p className="max-w-[360px] text-[14px] leading-normal text-admin-muted">{body}</p>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
