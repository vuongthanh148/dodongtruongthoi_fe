'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'
import { adminGet } from '@/lib/admin-api'
import { ADMIN_COPY } from '@/lib/content-data'

interface AuditEntry {
  id: string
  entity_type: string
  entity_id: string
  action: string
  actor: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  created_at: string
}

type EntityType = 'order' | 'product' | 'campaign' | ''
type DateRange = 'all' | '7' | '30'

// Backend filters by entity_type + limit/offset only; search and date-range
// are applied client-side over one larger fetched batch.
const FETCH_LIMIT = 300

export function AuditLogList() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<EntityType>('')
  const [dateRange, setDateRange] = useState<DateRange>('all')
  const [search, setSearch] = useState('')
  const [now, setNow] = useState(0)
  const copy = ADMIN_COPY.auditLog

  useEffect(() => {
    const loadAuditLog = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        params.set('limit', FETCH_LIMIT.toString())
        params.set('offset', '0')
        if (selectedType) {
          params.set('entity_type', selectedType)
        }

        const data = await adminGet<AuditEntry[]>(`/audit-log?${params.toString()}`)
        setEntries(Array.isArray(data) ? data : [])
        setNow(Date.now())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadAuditLog()
  }, [selectedType])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      order: copy.typeOrder,
      product: copy.typeProduct,
      campaign: copy.typeCampaign,
    }
    return labels[type] || type
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      status_change: copy.actionStatusChange,
      update: copy.actionUpdate,
      create: copy.actionCreate,
    }
    return labels[action] || action
  }

  const formatChange = (before?: Record<string, unknown>, after?: Record<string, unknown>) => {
    if (!before && !after) return '—'
    try {
      return JSON.stringify({ before, after })
    } catch {
      return '—'
    }
  }

  const filtered = useMemo(() => {
    const cutoff = dateRange === '7' ? now - 7 * 86_400_000 : dateRange === '30' ? now - 30 * 86_400_000 : 0
    const q = search.trim().toLowerCase()
    return entries.filter((entry) => {
      if (cutoff && Date.parse(entry.created_at) < cutoff) return false
      if (!q) return true
      return (
        entry.actor.toLowerCase().includes(q) ||
        entry.entity_id.toLowerCase().includes(q) ||
        getActionLabel(entry.action).toLowerCase().includes(q) ||
        getEntityTypeLabel(entry.entity_type).toLowerCase().includes(q)
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, dateRange, search, now])

  function exportCsv() {
    const header = ['time', 'entity_type', 'entity_id', 'action', 'actor', 'change']
    const rows = filtered.map((e) => [
      e.created_at,
      e.entity_type,
      e.entity_id,
      e.action,
      e.actor,
      formatChange(e.before, e.after),
    ])
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const typeChips: { id: EntityType; label: string }[] = [
    { id: '', label: copy.allTypes },
    { id: 'order', label: copy.typeOrder },
    { id: 'product', label: copy.typeProduct },
    { id: 'campaign', label: copy.typeCampaign },
  ]
  const dateChips: { id: DateRange; label: string }[] = [
    { id: 'all', label: copy.dateAll },
    { id: '7', label: copy.date7 },
    { id: '30', label: copy.date30 },
  ]

  const tools = (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-bg-page px-3 text-text-muted sm:max-w-[320px] sm:flex-none">
          <Search size={16} aria-hidden />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={copy.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
          />
        </label>
        <div className="noscroll flex gap-1.5 overflow-x-auto">
          {dateChips.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDateRange(d.id)}
              className="h-9 shrink-0 whitespace-nowrap rounded-full border px-3 text-[13px] font-medium"
              style={{
                borderColor: dateRange === d.id ? 'var(--admin-primary)' : 'var(--admin-border)',
                background: dateRange === d.id ? 'var(--admin-primary)' : '#fff',
                color: dateRange === d.id ? '#fff' : 'var(--admin-ink-2)',
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="ml-auto inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-border bg-bg-page px-3 text-[13px] font-semibold text-text-primary disabled:opacity-50"
        >
          <Download size={15} aria-hidden />
          {copy.exportCsv}
        </button>
      </div>
      <div className="noscroll flex gap-1.5 overflow-x-auto">
        {typeChips.map((t) => (
          <button
            key={t.id || 'all'}
            type="button"
            onClick={() => setSelectedType(t.id)}
            className="h-9 shrink-0 whitespace-nowrap rounded-full border px-3 text-[13px] font-medium"
            style={{
              borderColor: selectedType === t.id ? 'var(--admin-primary)' : 'var(--admin-border)',
              background: selectedType === t.id ? 'var(--admin-primary)' : '#fff',
              color: selectedType === t.id ? '#fff' : 'var(--admin-ink-2)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div>
        {tools}
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-sm text-text-muted">{copy.loading}</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        {tools}
        <div className="rounded-lg border border-border bg-bg-surface p-6">
          <div className="text-center">
            <div className="text-sm font-medium text-text-primary">{copy.loadError}</div>
            <div className="mt-2 text-xs text-text-muted">{copy.loadErrorBody}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-xs font-medium text-white hover:opacity-90"
            >
              {copy.retry}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div>
        {tools}
        <div className="rounded-lg border border-border bg-bg-surface p-6">
          <div className="text-center">
            <div className="text-sm font-medium text-text-primary">{copy.empty}</div>
            <div className="mt-2 text-xs text-text-muted">{copy.emptyBody}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tools}

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border bg-bg-surface p-6">
          <div className="text-center">
            <div className="text-sm font-medium text-text-primary">{copy.noResults}</div>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setDateRange('all')
                setSelectedType('')
              }}
              className="mt-4 inline-block rounded-md border border-border bg-bg-page px-4 py-2 text-xs font-medium text-text-primary"
            >
              {copy.clearFilters}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Table for desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left font-medium text-text-muted">{copy.columns.time}</th>
                  <th className="py-3 px-4 text-left font-medium text-text-muted">{copy.columns.entity}</th>
                  <th className="py-3 px-4 text-left font-medium text-text-muted">{copy.columns.entityId}</th>
                  <th className="py-3 px-4 text-left font-medium text-text-muted">{copy.columns.action}</th>
                  <th className="py-3 px-4 text-left font-medium text-text-muted">{copy.columns.actor}</th>
                  <th className="py-3 px-4 text-left font-medium text-text-muted">{copy.columns.change}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id} className="border-b border-border hover:bg-bg-surface-alt">
                    <td className="py-3 px-4 text-xs text-text-primary">{formatDate(entry.created_at)}</td>
                    <td className="py-3 px-4 text-xs text-text-primary">{getEntityTypeLabel(entry.entity_type)}</td>
                    <td className="py-3 px-4 text-xs text-text-muted font-mono">{entry.entity_id.slice(0, 8)}</td>
                    <td className="py-3 px-4 text-xs text-text-primary">{getActionLabel(entry.action)}</td>
                    <td className="py-3 px-4 text-xs text-text-primary">{entry.actor}</td>
                    <td className="py-3 px-4 text-xs text-text-muted font-mono max-w-xs truncate">
                      {formatChange(entry.before, entry.after)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for mobile */}
          <div className="space-y-3 md:hidden">
            {filtered.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-border bg-bg-surface p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="text-xs font-medium text-text-primary">{getEntityTypeLabel(entry.entity_type)}</div>
                  <div className="text-xs text-text-muted">{formatDate(entry.created_at)}</div>
                </div>
                <div className="mb-2 text-xs text-text-muted">
                  <span className="font-mono">{entry.entity_id.slice(0, 8)}</span> · {getActionLabel(entry.action)}
                </div>
                <div className="mb-2 text-xs text-text-muted">Người: {entry.actor}</div>
                <div className="text-xs text-text-muted font-mono break-words">
                  {formatChange(entry.before, entry.after)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
