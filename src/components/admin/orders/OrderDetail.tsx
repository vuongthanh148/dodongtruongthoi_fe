'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Check, ChevronLeft, ChevronRight, Copy, Loader2, Phone, Printer } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import {
  CANCELLABLE_STATUSES,
  NEXT_STATUS,
  ORDER_FLOW,
  fetchOrder,
  lineTotal,
  orderDateLabel,
  orderStatusLabel,
  orderPaymentLabel,
  orderCustomerNote,
  saveOrderStatus,
  shortOrderCode,
  customerLabel,
  variantText,
} from '@/lib/admin-orders'
import { ADMIN_COPY } from '@/lib/content-data'
import { formatPhone, formatVnd } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AdminOrder, OrderStatus } from '@/lib/types'
import { AdminBlank, StatusBadge, adminButtonDanger, adminButtonPrimary, adminButtonSecondary, adminCard } from './OrderPrimitives'

const copy = ADMIN_COPY.orderDetail

type Busy = 'status' | 'cancel' | 'note' | null

export function OrderDetail({ id }: { id: string }) {
  const [order, setOrder] = useState<AdminOrder | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [draftNote, setDraftNote] = useState('')
  const [busy, setBusy] = useState<Busy>(null)
  const [error, setError] = useState<string | null>(null)

  const [loadToken, setLoadToken] = useState(0)

  useEffect(() => {
    let active = true
    fetchOrder(id).then((data) => {
      if (!active) return
      if (data) {
        setOrder(data)
        setDraftNote(data.admin_note ?? '')
        setLoadFailed(false)
      } else {
        setLoadFailed(true)
      }
    })
    return () => {
      active = false
    }
  }, [id, loadToken])

  function retry() {
    setLoadFailed(false)
    setOrder(null)
    setLoadToken((t) => t + 1)
  }

  // Status and internal note travel in one PUT. The status change is shown at once and rolled back on failure.
  async function applyChange(target: OrderStatus, kind: Exclude<Busy, null>) {
    if (!order || busy) return
    const previous = order
    const note = draftNote
    setBusy(kind)
    setError(null)
    setOrder({ ...order, status: target, admin_note: note })

    const result = await saveOrderStatus(order.id, target, note)
    if ('error' in result) {
      setOrder(previous)
      setError(`${copy.updateFailed} ${result.error}`)
      toast.error(copy.updateFailed)
    } else {
      const saved = result.data?.id ? result.data : { ...previous, status: target, admin_note: note }
      setOrder(saved)
      setDraftNote(saved.admin_note ?? '')
      toast.success(kind === 'note' ? copy.notesSaved : copy.updated)
    }
    setBusy(null)
  }

  function advance() {
    if (!order) return
    const next = NEXT_STATUS[order.status]
    if (next) void applyChange(next, 'status')
  }

  function cancelOrder() {
    if (!order || !window.confirm(copy.cancelConfirm(shortOrderCode(order.id)))) return
    void applyChange('cancelled', 'cancel')
  }

  async function copyPhone(phone: string) {
    try {
      await navigator.clipboard.writeText(phone)
      toast.success(copy.phoneCopied)
    } catch {
      toast.error(copy.phoneCopyFailed)
    }
  }

  if (loadFailed) {
    return (
      <AdminLayout title={copy.back}>
        <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-1 text-[13px] text-admin-muted no-underline">
          <ChevronLeft size={14} aria-hidden />
          {copy.back}
        </Link>
        <div className={adminCard}>
          <AdminBlank
            tone="err"
            title={copy.loadError}
            body={copy.loadErrorBody}
            action={
              <button type="button" onClick={retry} className={adminButtonSecondary}>
                {copy.retry}
              </button>
            }
          />
        </div>
      </AdminLayout>
    )
  }

  if (!order) {
    return (
      <AdminLayout title={copy.back}>
        <div role="status" aria-label={copy.loading} className="grid gap-4">
          <div className={cn(adminCard, 'h-[120px] animate-pulse bg-admin-surface')} />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className={cn(adminCard, 'h-[220px] animate-pulse')} />
            <div className={cn(adminCard, 'h-[220px] animate-pulse')} />
          </div>
        </div>
      </AdminLayout>
    )
  }

  const code = shortOrderCode(order.id)
  const payment = orderPaymentLabel(order)
  const customerNote = orderCustomerNote(order)
  const items = order.items ?? []
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0)
  const next = NEXT_STATUS[order.status]
  const cancellable = CANCELLABLE_STATUSES.includes(order.status)
  const curIdx = ORDER_FLOW.indexOf(order.status)
  const dirtyNote = draftNote !== (order.admin_note ?? '')

  return (
    <AdminLayout title={code}>
      <div className="flex flex-col gap-4">
        <Link href="/admin/orders" className="inline-flex w-fit items-center gap-1 text-[13px] text-admin-muted no-underline hover:text-admin-ink">
          <ChevronLeft size={14} aria-hidden />
          {copy.back}
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={order.status} />
          <span className="text-[13px] text-admin-muted tabular-nums">{copy.placedAt(orderDateLabel(order.created_at))}</span>
          <div className="flex flex-wrap gap-2 md:ml-auto">
            <Link href={`/admin/orders/${order.id}/invoice`} className={adminButtonSecondary}>
              <Printer size={16} aria-hidden />
              {copy.print}
            </Link>
            {cancellable ? (
              <button type="button" onClick={cancelOrder} disabled={busy !== null} className={adminButtonDanger}>
                {busy === 'cancel' ? <Loader2 size={16} aria-hidden className="animate-spin" /> : null}
                {copy.cancel}
              </button>
            ) : null}
          </div>
        </div>

        {error ? (
          <div role="alert" className="rounded-md border border-admin-primary-line bg-admin-primary-subtle px-4 py-3 text-[14px] text-admin-danger">
            {error}
          </div>
        ) : null}

        {order.status === 'cancelled' ? (
          <div className="rounded-md bg-admin-neutral-bg px-4 py-3 text-[14px] font-semibold text-admin-muted">
            {copy.cancelledBanner}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-4 rounded-[8px] border border-admin-primary-line bg-admin-primary-subtle p-4">
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-admin-primary">{copy.nextLabel}</div>
            {next ? (
              <>
                <div className="mt-0.5 text-[15px] font-semibold text-admin-ink">{copy.next[order.status]}</div>
                <div className="mt-0.5 text-[13.5px] text-admin-ink-2">{copy.hints[order.status]}</div>
              </>
            ) : (
              <div className="mt-0.5 text-[14px] text-admin-ink-2">{copy.finished}</div>
            )}
          </div>
          {next ? (
            <button
              type="button"
              onClick={advance}
              disabled={busy !== null}
              aria-busy={busy === 'status'}
              className={cn(adminButtonPrimary, 'w-full min-w-[180px] sm:w-auto')}
            >
              {busy === 'status' ? (
                <>
                  <Loader2 size={15} aria-hidden className="animate-spin" />
                  {copy.updating}
                </>
              ) : (
                <>
                  {copy.next[order.status]}
                  <ChevronRight size={15} aria-hidden />
                </>
              )}
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="order-2 flex min-w-0 flex-col gap-4 lg:order-1">
            <Card title={copy.items(items.length)}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[300px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-admin-border text-[12px] font-semibold text-admin-muted">
                      <th className="pb-2 font-semibold">{copy.lineHeaders.product}</th>
                      <th className="w-12 pb-2 text-center font-semibold">{copy.lineHeaders.qty}</th>
                      <th className="hidden pb-2 text-right font-semibold md:table-cell">{copy.lineHeaders.unit}</th>
                      <th className="pb-2 text-right font-semibold">{copy.lineHeaders.total}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      const variant = variantText(item)
                      return (
                        <tr key={`${item.product_id}-${index}`} className="border-b border-admin-border-soft align-top last:border-b-0">
                          <td className="py-3 pr-3">
                            <div className="text-[14px] font-semibold text-admin-ink">{item.product_title || 'Sản phẩm'}</div>
                            {variant ? <div className="mt-0.5 text-[12.5px] text-admin-muted">{variant}</div> : null}
                          </td>
                          <td className="py-3 text-center text-[14px] tabular-nums">{item.quantity}</td>
                          <td className="hidden py-3 text-right text-[14px] tabular-nums md:table-cell">
                            {formatVnd(Number(item.unit_price) || 0)}
                          </td>
                          <td className="py-3 text-right text-[14px] font-semibold tabular-nums">{formatVnd(lineTotal(item))}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 grid gap-1.5 border-t border-admin-border-soft pt-3 text-[13.5px]">
                <div className="flex justify-between gap-3 text-admin-ink-2">
                  <span>{copy.subtotal}</span>
                  <span className="tabular-nums">{formatVnd(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-3 text-[15px] font-bold text-admin-ink">
                  <span>{copy.total}</span>
                  <span className="text-admin-primary tabular-nums">{formatVnd(order.total_amount)}</span>
                </div>
              </div>
            </Card>

            <Card title={copy.progress}>
              <ol className="flex flex-col">
                {ORDER_FLOW.map((step, index) => {
                  const done = curIdx >= 0 && index <= curIdx
                  const current = curIdx >= 0 && index === curIdx + 1
                  const last = index === ORDER_FLOW.length - 1
                  return (
                    <li key={step} className="relative grid grid-cols-[24px_minmax(0,1fr)] gap-3 pb-4 last:pb-0">
                      {!last ? (
                        <span
                          aria-hidden
                          className={cn('absolute top-6 bottom-0 left-[11px] w-0.5', index < curIdx ? 'bg-admin-primary' : 'bg-admin-border')}
                        />
                      ) : null}
                      <span
                        className={cn(
                          'z-10 grid h-6 w-6 place-items-center rounded-full border-2',
                          done || current ? 'border-admin-primary' : 'border-admin-border',
                          done ? 'bg-admin-primary text-white' : 'bg-admin-surface'
                        )}
                      >
                        {done ? <Check size={13} aria-hidden strokeWidth={2.6} /> : null}
                      </span>
                      <div className="pt-0.5">
                        <div
                          className={cn(
                            'text-[14px]',
                            done ? 'font-semibold text-admin-ink' : current ? 'font-semibold text-admin-primary' : 'text-admin-muted'
                          )}
                        >
                          {orderStatusLabel(step)}
                          {current ? <span className="text-[12.5px] font-normal"> · {copy.progressNext}</span> : null}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </Card>

            <Card title={copy.notes} right={<span className="text-[12.5px] text-admin-muted">{copy.notesHint}</span>}>
              {order.admin_note ? null : <p className="mb-3 text-[13.5px] text-admin-muted">{copy.noNotes}</p>}
              <label className="sr-only" htmlFor="admin-order-note">
                {copy.notes}
              </label>
              <textarea
                id="admin-order-note"
                value={draftNote}
                onChange={(event) => setDraftNote(event.target.value)}
                placeholder={copy.notesPlaceholder}
                rows={3}
                className="w-full resize-y rounded-md border border-admin-border bg-admin-surface p-3 text-[14px] leading-normal text-admin-ink placeholder:text-admin-muted"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => applyChange(order.status, 'note')}
                  disabled={!dirtyNote || busy !== null}
                  className={adminButtonSecondary}
                >
                  {busy === 'note' ? <Loader2 size={15} aria-hidden className="animate-spin" /> : null}
                  {busy === 'note' ? copy.savingNotes : copy.saveNotes}
                </button>
              </div>
            </Card>
          </div>

          <div className="order-1 flex min-w-0 flex-col gap-4 lg:order-2">
            <Card title={copy.customerSection}>
              <div className="text-[15px] font-semibold text-admin-ink">{customerLabel(order)}</div>
              <div className="mt-1 text-[14px] text-admin-ink-2 tabular-nums">{formatPhone(order.phone)}</div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <a href={`tel:${order.phone}`} className={cn(adminButtonSecondary, 'px-2')}>
                  <Phone size={15} aria-hidden />
                  {copy.call}
                </a>
                <a
                  href={`https://zalo.me/${order.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(adminButtonSecondary, 'px-2')}
                >
                  {copy.zalo}
                </a>
                <button type="button" onClick={() => copyPhone(order.phone)} className={cn(adminButtonSecondary, 'px-2')}>
                  <Copy size={15} aria-hidden />
                  {copy.copyPhone}
                </button>
              </div>
              <div className="mt-4 grid gap-3 border-t border-admin-border-soft pt-4">
                <Field label={copy.address}>{order.address?.trim() || copy.noAddress}</Field>
                <Field label={copy.customerNote}>
                  <span
                    className={cn('block rounded-md px-2.5 py-2', customerNote ? 'bg-admin-warn-bg' : '')}
                    style={customerNote ? undefined : { color: 'var(--admin-muted)' }}
                  >
                    {customerNote || copy.noCustomerNote}
                  </span>
                </Field>
              </div>
            </Card>

            <Card title={copy.payment}>
              <div className="grid gap-2.5 text-[13.5px]">
                <div className="flex justify-between gap-3">
                  <span className="text-admin-muted">{copy.paymentMethod}</span>
                  <b className="text-right text-admin-ink">{payment ?? copy.paymentUnknown}</b>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-admin-muted">{copy.total}</span>
                  <b className="text-admin-primary tabular-nums">{formatVnd(order.total_amount)}</b>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function Card({ title, right, children }: { title: string; right?: ReactNode; children: ReactNode }) {
  return (
    <section className={adminCard}>
      <header className="flex items-center justify-between gap-3 border-b border-admin-border-soft px-4 py-3">
        <h2 className="font-body text-[15px] font-semibold text-admin-ink">{title}</h2>
        {right}
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[12.5px] text-admin-muted">{label}</div>
      <div className="mt-0.5 text-[13.5px] leading-normal text-admin-ink">{children}</div>
    </div>
  )
}
