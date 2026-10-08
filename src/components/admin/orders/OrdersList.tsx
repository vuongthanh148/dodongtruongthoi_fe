'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Download, Loader2, Phone, Search } from 'lucide-react'
import {
  ORDER_PAGE_SIZE,
  ORDER_STATUSES,
  buildOrdersCsv,
  countByStatus,
  csvFileName,
  customerLabel,
  downloadTextFile,
  fetchOrders,
  filterOrders,
  firstItemTitle,
  orderDateLabel,
  orderStatusLabel,
  orderPaymentLabel,
  saveOrderStatus,
  shortOrderCode,
} from '@/lib/admin-orders'
import { ADMIN_COPY } from '@/lib/content-data'
import { formatPhone, formatVnd } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AdminOrder, OrderStatus } from '@/lib/types'
import {
  AdminBlank,
  Skel,
  StatusBadge,
  adminButtonPrimary,
  adminButtonSecondary,
  adminCard,
  adminInput,
} from './OrderPrimitives'

const copy = ADMIN_COPY.orders

interface BulkFailure {
  id: string
  code: string
  message: string
}

interface BulkState {
  target: OrderStatus
  total: number
  done: number
  running: boolean
  okCount: number
  failures: BulkFailure[]
}

export function OrdersList() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [status, setStatus] = useState<OrderStatus | ''>('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [selectMode, setSelectMode] = useState(false)
  const [bulkTarget, setBulkTarget] = useState<OrderStatus | ''>('')
  const [bulk, setBulk] = useState<BulkState | null>(null)
  const [exporting, setExporting] = useState(false)

  const [loadToken, setLoadToken] = useState(0)

  useEffect(() => {
    let active = true
    fetchOrders().then((data) => {
      if (!active) return
      if (data) {
        setOrders(data)
        setLoadFailed(false)
      } else {
        setLoadFailed(true)
      }
    })
    return () => {
      active = false
    }
  }, [loadToken])

  const allOrders = useMemo(() => orders ?? [], [orders])
  const filtered = useMemo(
    () => filterOrders(allOrders, { status, from, to, query }),
    [allOrders, status, from, to, query]
  )
  const counts = useMemo(() => countByStatus(allOrders), [allOrders])
  const pageCount = Math.max(1, Math.ceil(filtered.length / ORDER_PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageStart = (safePage - 1) * ORDER_PAGE_SIZE
  const pageRows = filtered.slice(pageStart, pageStart + ORDER_PAGE_SIZE)

  const selectedSet = new Set(selected)
  const selectedOrders = allOrders.filter((order) => selectedSet.has(order.id))
  const pageAllSelected = pageRows.length > 0 && pageRows.every((order) => selectedSet.has(order.id))
  const filtersActive = status !== '' || from !== '' || to !== '' || query.trim() !== ''
  const running = bulk?.running === true
  const showBulkBar = selectedOrders.length > 0 || running

  function toggleRow(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function togglePage() {
    const pageIds = pageRows.map((order) => order.id)
    setSelected((prev) => {
      if (pageAllSelected) return prev.filter((id) => !pageIds.includes(id))
      return [...prev, ...pageIds.filter((id) => !prev.includes(id))]
    })
  }

  function clearFilters() {
    setStatus('')
    setFrom('')
    setTo('')
    setQuery('')
    setPage(1)
  }

  function retry() {
    setLoadFailed(false)
    setOrders(null)
    setLoadToken((t) => t + 1)
  }

  async function runBulk() {
    if (!bulkTarget || selectedOrders.length === 0 || running) return
    if (bulkTarget === 'cancelled' && !window.confirm(copy.bulkCancelConfirm(selectedOrders.length))) return

    const targets = selectedOrders
    const target = bulkTarget
    const failures: BulkFailure[] = []
    setBulk({ target, total: targets.length, done: 0, running: true, okCount: 0, failures: [] })

    // Sequential so the progress count is honest and the server sees one write at a time.
    for (const order of targets) {
      const result = await saveOrderStatus(order.id, target, order.admin_note ?? '')
      const failure: BulkFailure | null =
        'error' in result ? { id: order.id, code: shortOrderCode(order.id), message: result.error } : null
      if (failure) failures.push(failure)
      setBulk((prev) => (prev ? { ...prev, done: prev.done + 1, okCount: prev.okCount + (failure ? 0 : 1) } : prev))
    }

    const okCount = targets.length - failures.length
    const failedIds = new Set(failures.map((f) => f.id))
    const updatedIds = new Set(targets.filter((o) => !failedIds.has(o.id)).map((o) => o.id))
    setOrders((prev) => (prev ? prev.map((o) => (updatedIds.has(o.id) ? { ...o, status: target } : o)) : prev))
    setBulk({ target, total: targets.length, done: targets.length, running: false, okCount, failures })
    setSelected(failures.map((failure) => failure.id))

    if (failures.length === 0) {
      toast.success(copy.bulkDone(okCount, targets.length, orderStatusLabel(target)))
    } else {
      toast.error(copy.bulkFailed(failures.length))
    }
  }

  function exportCsv() {
    if (filtered.length === 0 || exporting) return
    setExporting(true)
    // Yield once so the "exporting" state paints before the file is built.
    window.setTimeout(() => {
      try {
        const name = csvFileName()
        downloadTextFile(buildOrdersCsv(filtered), name)
        toast.success(copy.exported(name, filtered.length))
      } finally {
        setExporting(false)
      }
    }, 0)
  }

  const statusTabs: { id: OrderStatus | ''; label: string; count: number | null }[] = [
    { id: '', label: copy.statusAll, count: orders ? allOrders.length : null },
    ...ORDER_STATUSES.map((s) => ({ id: s, label: orderStatusLabel(s), count: orders ? counts[s] : null })),
  ]

  const showingFrom = filtered.length === 0 ? 0 : pageStart + 1
  const showingTo = Math.min(pageStart + ORDER_PAGE_SIZE, filtered.length)

  const body = (() => {
    if (orders === null && !loadFailed) return <LoadingRows />
    if (loadFailed) {
      return (
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
      )
    }
    if (allOrders.length === 0) return <AdminBlank title={copy.emptyTitle} body={copy.emptyBody} />
    if (filtered.length === 0) {
      return (
        <AdminBlank
          title={copy.noMatchTitle}
          body={copy.noMatchBody}
          action={
            filtersActive ? (
              <button type="button" onClick={clearFilters} className={adminButtonSecondary}>
                {copy.clearFilters}
              </button>
            ) : null
          }
        />
      )
    }
    return null
  })()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <label className="flex h-10 min-w-0 items-center gap-2 rounded-md border border-admin-border bg-admin-surface px-3 text-admin-muted focus-within:border-admin-primary lg:w-[380px] lg:flex-none">
          <Search size={17} aria-hidden className="shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder={copy.searchPlaceholder}
            aria-label={copy.searchLabel}
            className="min-w-0 flex-1 bg-transparent text-[14px] text-admin-ink outline-none placeholder:text-admin-muted"
          />
        </label>

        <div className="grid grid-cols-2 gap-2 lg:flex lg:items-center">
          <label className="flex min-w-0 items-center gap-2 text-[13px] text-admin-muted">
            <span className="shrink-0">{copy.dateFrom}</span>
            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(event) => {
                setFrom(event.target.value)
                setPage(1)
              }}
              className={cn(adminInput, 'w-full min-w-0 lg:w-[160px]')}
            />
          </label>
          <label className="flex min-w-0 items-center gap-2 text-[13px] text-admin-muted">
            <span className="shrink-0">{copy.dateTo}</span>
            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(event) => {
                setTo(event.target.value)
                setPage(1)
              }}
              className={cn(adminInput, 'w-full min-w-0 lg:w-[160px]')}
            />
          </label>
        </div>

        <div className="flex gap-2 lg:ml-auto">
          <button
            type="button"
            onClick={() => setSelectMode((v) => !v)}
            aria-pressed={selectMode}
            className={cn(selectMode ? adminButtonPrimary : adminButtonSecondary, 'flex-1 md:hidden')}
          >
            {selectMode ? copy.selectModeDone : copy.selectMode}
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={filtered.length === 0 || exporting}
            aria-busy={exporting}
            className={cn(adminButtonSecondary, 'flex-1 md:flex-none')}
          >
            {exporting ? (
              <>
                <Loader2 size={16} aria-hidden className="animate-spin" />
                {copy.exporting}
              </>
            ) : (
              <>
                <Download size={16} aria-hidden />
                {copy.exportCsv}
              </>
            )}
          </button>
        </div>
      </div>

      <div
        role="tablist"
        aria-label={copy.title}
        className="noscroll -mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:gap-0 md:border-b md:border-admin-border md:px-0"
      >
        {statusTabs.map((tab) => {
          const on = status === tab.id
          return (
            <button
              key={tab.id || 'all'}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => {
                setStatus(tab.id)
                setPage(1)
              }}
              className={cn(
                'inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium whitespace-nowrap md:h-11 md:rounded-none md:border-0 md:border-b-2 md:px-3.5 md:text-[14px] md:-mb-px',
                on
                  ? 'border-admin-primary bg-admin-primary text-white md:border-b-admin-primary md:bg-transparent md:font-semibold md:text-admin-primary'
                  : 'border-admin-border bg-admin-surface text-admin-ink-2 md:border-b-transparent md:bg-transparent'
              )}
            >
              {tab.label}
              {tab.count !== null ? (
                <span
                  className={cn(
                    'rounded-full px-1.5 text-[12px] tabular-nums',
                    on ? 'bg-white/20 md:bg-admin-primary-subtle md:text-admin-primary' : 'bg-admin-border-soft text-admin-muted'
                  )}
                >
                  {tab.count}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <section className={adminCard} aria-busy={orders === null && !loadFailed}>
        {showBulkBar ? (
          <div className="fixed inset-x-0 bottom-0 z-30 flex flex-wrap items-center gap-2 border-t border-admin-border bg-admin-surface px-3 py-2.5 shadow-[0_-8px_20px_-12px_rgba(0,0,0,0.25)] md:static md:shadow-none md:px-4">
            <span className="min-w-0 text-[14px] font-semibold text-admin-ink md:mr-1">
              {running && bulk
                ? copy.bulkRunning(bulk.done, bulk.total)
                : copy.selectedCount(selectedOrders.length)}
            </span>
            {running && bulk ? (
              <span className="h-1.5 w-full overflow-hidden rounded-full bg-admin-primary-subtle md:order-last md:w-[160px] md:flex-none">
                <span
                  className="block h-full bg-admin-primary transition-[width] duration-200"
                  style={{ width: `${bulk.total ? Math.round((bulk.done / bulk.total) * 100) : 0}%` }}
                />
              </span>
            ) : (
              <>
                <select
                  aria-label={copy.bulkTarget}
                  value={bulkTarget}
                  onChange={(event) => setBulkTarget(event.target.value as OrderStatus | '')}
                  className={cn(adminInput, 'min-w-0 flex-1 md:w-[180px] md:flex-none')}
                >
                  <option value="">{copy.bulkTargetPlaceholder}</option>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {orderStatusLabel(s)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={runBulk}
                  disabled={!bulkTarget || selectedOrders.length === 0}
                  className={cn(adminButtonPrimary, 'flex-1 md:flex-none')}
                >
                  {copy.bulkApply}
                </button>
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  className={cn(adminButtonSecondary, 'md:ml-auto')}
                >
                  {copy.clearSelection}
                </button>
              </>
            )}
          </div>
        ) : null}

        {bulk && !running ? (
          <div role="status" className="flex items-start gap-3 border-b border-admin-border-soft bg-admin-bg px-4 py-3 text-[14px]">
            {bulk.failures.length === 0 ? (
              <CheckCircle2 size={18} aria-hidden className="mt-0.5 shrink-0 text-admin-ok" />
            ) : (
              <AlertCircle size={18} aria-hidden className="mt-0.5 shrink-0 text-admin-warn" />
            )}
            <div className="min-w-0 flex-1">
              {bulk.okCount > 0 ? (
                <div className="font-semibold text-admin-ink">
                  {copy.bulkDone(bulk.okCount, bulk.total, orderStatusLabel(bulk.target))}
                </div>
              ) : null}
              {bulk.failures.length > 0 ? (
                <>
                  <div className="font-semibold text-admin-warn">{copy.bulkFailed(bulk.failures.length)}</div>
                  <ul className="mt-1 flex flex-col gap-0.5 text-[13px] text-admin-ink-2">
                    {bulk.failures.map((failure) => (
                      <li key={failure.id} className="break-words">
                        <span className="font-semibold tabular-nums">{failure.code}</span> — {failure.message}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-1 text-[13px] text-admin-muted">{copy.bulkFailedHint}</div>
                </>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setBulk(null)}
              className="h-8 shrink-0 cursor-pointer rounded-md px-2.5 text-[13px] font-semibold text-admin-ink-2 hover:bg-admin-border-soft"
            >
              {copy.dismiss}
            </button>
          </div>
        ) : null}

        {body ? (
          <div className="p-0">{body}</div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-admin-border bg-admin-border-soft text-[12px] font-semibold text-admin-muted">
                    <th className="w-12 px-4 py-2.5">
                      <input
                        type="checkbox"
                        checked={pageAllSelected}
                        onChange={togglePage}
                        aria-label={copy.selectAll}
                        className="h-[18px] w-[18px] cursor-pointer accent-admin-primary"
                      />
                    </th>
                    <th className="px-3 py-2.5 font-semibold">{copy.columns.code}</th>
                    <th className="px-3 py-2.5 font-semibold">{copy.columns.customer}</th>
                    <th className="hidden px-3 py-2.5 font-semibold lg:table-cell">{copy.columns.phone}</th>
                    <th className="hidden px-3 py-2.5 font-semibold lg:table-cell">{copy.columns.items}</th>
                    <th className="px-3 py-2.5 text-right font-semibold">{copy.columns.total}</th>
                    <th className="px-3 py-2.5 font-semibold">{copy.columns.status}</th>
                    <th className="hidden px-3 py-2.5 font-semibold lg:table-cell">{copy.columns.date}</th>
                    <th className="w-[1%] px-3 py-2.5">
                      <span className="sr-only">{copy.open}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((order) => {
                    const code = shortOrderCode(order.id)
                    const on = selectedSet.has(order.id)
                    const inRun = running && on
                    return (
                      <tr
                        key={order.id}
                        className={cn(
                          'border-b border-admin-border-soft align-middle hover:bg-admin-bg',
                          on && 'bg-admin-primary-subtle hover:bg-admin-primary-subtle'
                        )}
                      >
                        <td className="px-4 py-2.5">
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => toggleRow(order.id)}
                            aria-label={copy.selectRow(code)}
                            className="h-[18px] w-[18px] cursor-pointer accent-admin-primary"
                          />
                        </td>
                        <td className="px-3 py-2.5">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            title={order.id}
                            className="text-[14px] font-semibold tabular-nums text-admin-ink no-underline hover:text-admin-primary"
                          >
                            {code}
                          </Link>
                          <div className="text-[12px] text-admin-muted tabular-nums lg:hidden">
                            {orderDateLabel(order.created_at)}
                          </div>
                        </td>
                        <td className="max-w-[220px] px-3 py-2.5">
                          <div className="truncate text-[14px] text-admin-ink">{customerLabel(order)}</div>
                          <div className="text-[12.5px] text-admin-muted tabular-nums lg:hidden">
                            {formatPhone(order.phone)}
                          </div>
                        </td>
                        <td className="hidden px-3 py-2.5 text-[13.5px] text-admin-ink-2 tabular-nums lg:table-cell">
                          {formatPhone(order.phone)}
                        </td>
                        <td className="hidden max-w-[260px] px-3 py-2.5 text-[13.5px] text-admin-ink-2 lg:table-cell">
                          <div className="truncate">{firstItemTitle(order.items ?? [])}</div>
                          {(order.items?.length ?? 0) > 1 ? (
                            <div className="text-[12.5px] text-admin-muted">{copy.itemsMore((order.items?.length ?? 1) - 1)}</div>
                          ) : null}
                        </td>
                        <td className="px-3 py-2.5 text-right text-[14px] font-semibold text-admin-ink tabular-nums">
                          {formatVnd(order.total_amount)}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex flex-col items-start gap-1">
                            <StatusBadge status={order.status} />
                            {inRun ? (
                              <span className="inline-flex items-center gap-1.5 text-[12px] text-admin-muted">
                                <Loader2 size={12} aria-hidden className="animate-spin" />
                                {copy.updatingRow}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="hidden px-3 py-2.5 text-[13.5px] text-admin-muted tabular-nums lg:table-cell">
                          {orderDateLabel(order.created_at)}
                        </td>
                        <td className="px-3 py-2.5">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            aria-label={copy.openOrder(code)}
                            className={cn(adminButtonSecondary, 'h-8 px-2.5 text-[13px]')}
                          >
                            <span className="hidden lg:inline">{copy.open}</span>
                            <ChevronRight size={15} aria-hidden />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <ul className={cn('flex flex-col gap-2.5 p-3 md:hidden', showBulkBar && 'pb-24')}>
              {pageRows.map((order) => {
                const code = shortOrderCode(order.id)
                const on = selectedSet.has(order.id)
                const inRun = running && on
                const payment = orderPaymentLabel(order)
                return (
                  <li
                    key={order.id}
                    className={cn(
                      'flex gap-2.5 rounded-[8px] border bg-admin-surface p-3.5',
                      on ? 'border-admin-primary shadow-[0_0_0_1px_var(--admin-primary)]' : 'border-admin-border'
                    )}
                  >
                    {selectMode ? (
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleRow(order.id)}
                          aria-label={copy.selectRow(code)}
                          className="h-[18px] w-[18px] cursor-pointer accent-admin-primary"
                        />
                      </div>
                    ) : null}
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-[14px] font-semibold tabular-nums text-admin-ink no-underline"
                        >
                          {code}
                        </Link>
                        <StatusBadge status={order.status} />
                        {inRun ? (
                          <span className="inline-flex items-center gap-1 text-[12px] text-admin-muted">
                            <Loader2 size={12} aria-hidden className="animate-spin" />
                            {copy.updatingRow}
                          </span>
                        ) : null}
                      </div>
                      <div className="truncate text-[14px] text-admin-ink">
                        {customerLabel(order)}
                        <span className="text-admin-muted tabular-nums"> · {formatPhone(order.phone)}</span>
                      </div>
                      <div className="truncate text-[13px] text-admin-ink-2">
                        {firstItemTitle(order.items ?? [])}
                        {(order.items?.length ?? 0) > 1 ? (
                          <span className="text-admin-muted"> {copy.itemsMore((order.items?.length ?? 1) - 1)}</span>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-admin-muted">
                        <b className="text-[14px] text-admin-primary tabular-nums">{formatVnd(order.total_amount)}</b>
                        {payment ? <span>· {payment}</span> : null}
                        <span className="ml-auto tabular-nums">{orderDateLabel(order.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 self-center">
                      <a
                        href={`tel:${order.phone}`}
                        aria-label={copy.callCustomer(customerLabel(order))}
                        className="grid h-11 w-11 place-items-center rounded-full border border-admin-border text-admin-ink-2"
                      >
                        <Phone size={18} aria-hidden />
                      </a>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        aria-label={copy.openOrder(code)}
                        className="grid h-11 w-11 place-items-center rounded-full border border-admin-border text-admin-ink-2"
                      >
                        <ChevronRight size={18} aria-hidden />
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="flex flex-col gap-3 border-t border-admin-border px-4 py-3 md:flex-row md:items-center md:justify-between">
              <span className="text-[13px] text-admin-muted tabular-nums">
                {filtered.length === 0 ? '' : copy.showing(showingFrom, showingTo, filtered.length)}
              </span>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <button
                  type="button"
                  onClick={() => setPage(safePage - 1)}
                  disabled={safePage <= 1}
                  aria-label={copy.prev}
                  className={cn(adminButtonSecondary, 'h-9 w-9 px-0')}
                >
                  <ChevronLeft size={16} aria-hidden />
                </button>
                <span className="text-[13px] text-admin-ink-2 tabular-nums">{copy.pageOf(safePage, pageCount)}</span>
                <button
                  type="button"
                  onClick={() => setPage(safePage + 1)}
                  disabled={safePage >= pageCount}
                  aria-label={copy.next}
                  className={cn(adminButtonSecondary, 'h-9 w-9 px-0')}
                >
                  <ChevronRight size={16} aria-hidden />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function LoadingRows() {
  return (
    <div aria-label={copy.loading} role="status">
      <div className="hidden md:block">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex h-[60px] items-center gap-4 border-b border-admin-border-soft px-4">
            <Skel className="h-[18px] w-[18px]" />
            <Skel className="h-4 w-24" />
            <Skel className="h-4 w-2/5" />
            <Skel className="ml-auto h-4 w-20" />
            <Skel className="h-5 w-24 rounded-full" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2.5 p-3 md:hidden">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex flex-col gap-2.5 rounded-[8px] border border-admin-border p-3.5">
            <div className="flex items-center justify-between gap-3">
              <Skel className="h-4 w-28" />
              <Skel className="h-5 w-20 rounded-full" />
            </div>
            <Skel className="h-4 w-[70%]" />
            <Skel className="h-4 w-[45%]" />
          </div>
        ))}
      </div>
    </div>
  )
}
