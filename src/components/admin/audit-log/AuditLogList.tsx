'use client'

import { useEffect, useState } from 'react'
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

export function AuditLogList() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<EntityType>('')
  const [limit] = useState(50)
  const [offset] = useState(0)

  useEffect(() => {
    const loadAuditLog = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        params.set('limit', limit.toString())
        params.set('offset', offset.toString())
        if (selectedType) {
          params.set('entity_type', selectedType)
        }

        const data = await adminGet<AuditEntry[]>(`/audit-log?${params.toString()}`)
        setEntries(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadAuditLog()
  }, [selectedType, limit, offset])

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
      order: ADMIN_COPY.auditLog.typeOrder,
      product: ADMIN_COPY.auditLog.typeProduct,
      campaign: ADMIN_COPY.auditLog.typeCampaign,
    }
    return labels[type] || type
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      status_change: ADMIN_COPY.auditLog.actionStatusChange,
      update: ADMIN_COPY.auditLog.actionUpdate,
      create: ADMIN_COPY.auditLog.actionCreate,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-sm text-text-muted">{ADMIN_COPY.auditLog.loading}</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-bg-surface p-6">
        <div className="text-center">
          <div className="text-sm font-medium text-text-primary">{ADMIN_COPY.auditLog.loadError}</div>
          <div className="mt-2 text-xs text-text-muted">{ADMIN_COPY.auditLog.loadErrorBody}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-xs font-medium text-white hover:opacity-90"
          >
            {ADMIN_COPY.auditLog.retry}
          </button>
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-bg-surface p-6">
        <div className="text-center">
          <div className="text-sm font-medium text-text-primary">{ADMIN_COPY.auditLog.empty}</div>
          <div className="mt-2 text-xs text-text-muted">{ADMIN_COPY.auditLog.emptyBody}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as EntityType)}
          className="rounded-md border border-border bg-bg-page px-3 py-2 text-sm text-text-primary"
        >
          <option value="">{ADMIN_COPY.auditLog.allTypes}</option>
          <option value="order">{ADMIN_COPY.auditLog.typeOrder}</option>
          <option value="product">{ADMIN_COPY.auditLog.typeProduct}</option>
          <option value="campaign">{ADMIN_COPY.auditLog.typeCampaign}</option>
        </select>
      </div>

      {/* Table for desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-4 text-left font-medium text-text-muted">{ADMIN_COPY.auditLog.columns.time}</th>
              <th className="py-3 px-4 text-left font-medium text-text-muted">{ADMIN_COPY.auditLog.columns.entity}</th>
              <th className="py-3 px-4 text-left font-medium text-text-muted">{ADMIN_COPY.auditLog.columns.entityId}</th>
              <th className="py-3 px-4 text-left font-medium text-text-muted">{ADMIN_COPY.auditLog.columns.action}</th>
              <th className="py-3 px-4 text-left font-medium text-text-muted">{ADMIN_COPY.auditLog.columns.actor}</th>
              <th className="py-3 px-4 text-left font-medium text-text-muted">{ADMIN_COPY.auditLog.columns.change}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
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
        {entries.map((entry) => (
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
    </div>
  )
}
