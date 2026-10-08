'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { ChevronLeft, Printer } from 'lucide-react'
import { DrumMark } from '@/components/icons/DrumMark'
import {
  customerLabel,
  fetchOrder,
  lineTotal,
  orderPaymentLabel,
  orderCustomerNote,
  shortOrderCode,
  variantText,
} from '@/lib/admin-orders'
import { ADMIN_COPY } from '@/lib/content-data'
import { HOTLINE, SHOP_ADDRESS, SHOP_EMAIL, SITE_NAME } from '@/lib/constants'
import { formatPhone, formatVnd } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AdminOrder } from '@/lib/types'
import { AdminBlank, adminButtonPrimary, adminButtonSecondary, adminCard } from './OrderPrimitives'

const copy = ADMIN_COPY.invoice

function invoiceDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('vi-VN')
}

function hotlineLabel(): string {
  return HOTLINE.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3')
}

export function OrderInvoice({ id }: { id: string }) {
  const [order, setOrder] = useState<AdminOrder | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)

  const [loadToken, setLoadToken] = useState(0)

  useEffect(() => {
    let active = true
    fetchOrder(id).then((data) => {
      if (!active) return
      if (data) {
        setOrder(data)
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

  return (
    <div className="adm min-h-screen bg-admin-border pb-8 print:bg-white print:pb-0">
      {/* A4 portrait; print margins come from the page, not the sheet. */}
      <style>{'@page { size: A4; margin: 12mm; }'}</style>

      <div className="no-print flex h-14 items-center gap-2 border-b border-admin-border bg-admin-surface px-4">
        <Link
          href={`/admin/orders/${id}`}
          className={cn(adminButtonSecondary, 'h-9 border-transparent bg-transparent px-2.5 text-admin-ink-2')}
        >
          <ChevronLeft size={15} aria-hidden />
          {copy.back}
        </Link>
        <span className="flex-1" />
        <span className="hidden text-[13px] text-admin-muted sm:inline">{copy.paper}</span>
        <button type="button" onClick={() => window.print()} disabled={!order} className={cn(adminButtonPrimary, 'h-9')}>
          <Printer size={15} aria-hidden />
          {copy.print}
        </button>
      </div>

      {loadFailed ? (
        <div className="no-print mx-auto mt-6 w-[calc(100%-32px)] max-w-[794px]">
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
        </div>
      ) : !order ? (
        <div role="status" aria-label={copy.loadError} className="mx-auto mt-6 h-[1123px] w-[calc(100%-32px)] max-w-[794px] animate-pulse bg-admin-surface" />
      ) : (
        <Sheet order={order} />
      )}
    </div>
  )
}

function Sheet({ order }: { order: AdminOrder }) {
  const code = shortOrderCode(order.id)
  const items = order.items ?? []
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0)
  const payment = orderPaymentLabel(order)
  const customerNote = orderCustomerNote(order)

  return (
    <article
      className={cn(
        'mx-auto mt-6 flex min-h-[1123px] w-[calc(100%-32px)] max-w-[794px] flex-col bg-white p-6 text-print-ink shadow-[0_6px_24px_rgba(0,0,0,0.12)] sm:p-12',
        'print:mt-0 print:min-h-0 print:w-full print:max-w-none print:p-0 print:shadow-none'
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-print-ink pb-5">
        <div className="flex min-w-0 gap-3">
          <DrumMark size={44} color="var(--print-ink)" />
          <div className="min-w-0">
            <div className="font-accent text-[19px] font-bold leading-tight">{SITE_NAME}</div>
            <div className="mt-1 text-[12px] leading-[1.6] text-print-ink-2">
              {SHOP_ADDRESS}
              <br />
              {copy.hotline} {hotlineLabel()} · {SHOP_EMAIL}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-heading text-[22px] leading-tight font-semibold">{copy.title}</div>
          <div className="mt-1.5 text-[12.5px] leading-[1.7]">
            {copy.number}: <b className="tabular-nums">{code}</b>
            <br />
            {copy.date}: <span className="tabular-nums">{invoiceDate(order.created_at)}</span>
          </div>
        </div>
      </header>

      <dl className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-3 gap-y-1.5 py-4 text-[13px]">
        <dt className="text-print-muted">{copy.buyer}</dt>
        <dd className="font-semibold">{customerLabel(order)}</dd>
        <dt className="text-print-muted">{copy.phone}</dt>
        <dd className="tabular-nums">{formatPhone(order.phone)}</dd>
        <dt className="text-print-muted">{copy.address}</dt>
        <dd className="leading-normal">{order.address?.trim() || '—'}</dd>
      </dl>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b-[1.5px] border-print-ink text-[12px] font-semibold">
              <th className="hidden w-10 py-2 pr-2 font-semibold sm:table-cell">{copy.no}</th>
              <th className="py-2 pr-2 font-semibold">{copy.product}</th>
              <th className="w-12 py-2 text-center font-semibold">{copy.qty}</th>
              <th className="hidden w-28 py-2 text-right font-semibold sm:table-cell">{copy.unit}</th>
              <th className="w-28 py-2 text-right font-semibold">{copy.amount}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const variant = variantText(item)
              return (
                <tr key={`${item.product_id}-${index}`} className="border-b border-print-line align-top">
                  <td className="hidden py-2.5 pr-2 tabular-nums sm:table-cell">{index + 1}</td>
                  <td className="py-2.5 pr-2">
                    <div className="font-semibold">{item.product_title || 'Sản phẩm'}</div>
                    {variant ? <div className="mt-0.5 text-[12px] text-print-muted">{variant}</div> : null}
                  </td>
                  <td className="py-2.5 text-center tabular-nums">{item.quantity}</td>
                  <td className="hidden py-2.5 text-right tabular-nums sm:table-cell">{formatVnd(Number(item.unit_price) || 0)}</td>
                  <td className="py-2.5 text-right tabular-nums">{formatVnd(lineTotal(item))}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-6 sm:grid-cols-[minmax(0,1fr)_240px]">
        <div className="text-[12.5px] leading-[1.7] text-print-ink-2">
          <div>
            <b className="text-print-ink">{copy.payment}:</b> {payment ?? copy.paymentUnknown}
          </div>
          {customerNote ? <div>Ghi chú: {customerNote}</div> : null}
        </div>
        <div className="grid gap-1.5 text-[13px]">
          <TotalRow label={copy.subtotal}>{formatVnd(subtotal)}</TotalRow>
          <div className="mt-0.5 flex justify-between gap-3 border-t-[1.5px] border-print-ink pt-2 text-[15px] font-bold">
            <span>{copy.total}</span>
            <span className="tabular-nums">{formatVnd(order.total_amount)}</span>
          </div>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-6 text-center text-[13px]">
        <div>
          <b>{copy.buyerSign}</b>
          <div className="text-[12px] text-print-muted">{copy.signHint}</div>
        </div>
        <div>
          <b>{copy.sellerSign}</b>
          <div className="text-[12px] text-print-muted">{copy.signHint}</div>
        </div>
      </div>

      <footer className="mt-auto flex flex-wrap justify-between gap-2 border-t border-print-line pt-5 text-[12px] text-print-muted">
        <span>
          {copy.hotline}: <span className="tabular-nums">{hotlineLabel()}</span>
        </span>
        <span>{copy.thanks}</span>
      </footer>
    </article>
  )
}

function TotalRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <span>{label}</span>
      <span className="tabular-nums">{children}</span>
    </div>
  )
}
