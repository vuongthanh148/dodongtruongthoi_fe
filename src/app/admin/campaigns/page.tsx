'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminFrame } from '@/components/admin/AdminFrame'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { adminGet, adminPost, adminPut } from '@/lib/admin-api'
import { formatVnd } from '@/lib/format'
import type { AdminCampaign } from '@/lib/types'

const emptyForm = {
  id: '',
  name: '',
  description: '',
  discount_type: 'percentage' as 'percentage' | 'fixed_amount',
  discount_value: '0',
  starts_at: '',
  ends_at: '',
  is_active: true,
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string>('')
  const [formWarn, setFormWarn] = useState<string>('')

  useEffect(() => {
    loadCampaigns()
  }, [])

  async function loadCampaigns() {
    setLoading(true)
    try {
      const data = await adminGet<AdminCampaign[]>('/campaigns')
      setCampaigns(data ?? [])
    } finally {
      setLoading(false)
    }
  }

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
    setFormWarn('')
  }

  function startEdit(campaign: AdminCampaign) {
    setEditingId(campaign.id)
    setForm({
      id: campaign.id,
      name: campaign.name,
      description: campaign.description ?? '',
      discount_type: campaign.discount_type,
      discount_value: String(campaign.discount_value),
      starts_at: toInputValue(campaign.starts_at),
      ends_at: toInputValue(campaign.ends_at),
      is_active: campaign.is_active,
    })
    setFormError('')
    setFormWarn('')
  }

  function validateForm(): boolean {
    setFormError('')
    setFormWarn('')

    const startDate = form.starts_at ? new Date(form.starts_at) : null
    const endDate = form.ends_at ? new Date(form.ends_at) : null

    if (!startDate || !endDate) {
      setFormError('Vui lòng chọn cả ngày bắt đầu và kết thúc')
      return false
    }

    if (endDate <= startDate) {
      setFormError('Ngày kết thúc phải sau ngày bắt đầu')
      return false
    }

    const now = new Date()
    if (startDate < now) {
      setFormWarn('Chương trình bắt đầu từ ngày hôm nay hoặc quá khứ')
    }

    const value = Number(form.discount_value)
    if (value <= 0 || (form.discount_type === 'percentage' && value > 100)) {
      setFormError('Giá trị giảm giá không hợp lệ')
      return false
    }

    return true
  }

  async function saveCampaign() {
    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        starts_at: toIso(form.starts_at),
        ends_at: toIso(form.ends_at),
        is_active: form.is_active,
      }

      const saved = editingId
        ? await adminPut<AdminCampaign>(`/campaigns/${editingId}`, payload)
        : await adminPost<AdminCampaign>('/campaigns', { id: form.id.trim(), ...payload })

      if (saved) {
        toast.success(editingId ? 'Đã cập nhật chương trình khuyến mãi' : 'Đã tạo chương trình khuyến mãi')
        await loadCampaigns()
        startCreate()
      } else {
        toast.error('Không lưu được. Thử lại sau.')
      }
    } finally {
      setSaving(false)
    }
  }

  const startDate = form.starts_at ? new Date(form.starts_at) : null
  const now = new Date()
  const isStartInPast = startDate && startDate < now
  const buttonText = isStartInPast ? 'Lưu và chạy ngay' : 'Lưu'
  const buttonDisabled = saving

  return (
    <AdminGuard>
      <AdminFrame title="Khuyến mãi" subtitle="Tạo và quản lý chương trình khuyến mãi">
        {/* Form */}
        <div
          style={{
            background: 'var(--admin-surface)',
            border: '1px solid var(--admin-border)',
            borderRadius: 8,
            padding: '20px 16px',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--admin-muted)', marginBottom: 6 }}>
                Tên chương trình
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ví dụ: Tết Nguyên Đán 2026"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 6,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--admin-muted)', marginBottom: 6 }}>
                Loại giảm giá
              </label>
              <select
                value={form.discount_type}
                onChange={(e) => {
                  const val = e.target.value as 'percentage' | 'fixed_amount'
                  setForm((prev) => ({
                    ...prev,
                    discount_type: val,
                  }))
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 6,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                <option value="percentage">Phần trăm (%)</option>
                <option value="fixed_amount">Số tiền cố định</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--admin-muted)', marginBottom: 6 }}>
                Giá trị giảm giá
              </label>
              <input
                type="number"
                value={form.discount_value}
                onChange={(e) => setForm((prev) => ({ ...prev, discount_value: e.target.value }))}
                placeholder="0"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 6,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--admin-muted)', marginBottom: 6 }}>
                Bắt đầu lúc
              </label>
              <input
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) => setForm((prev) => ({ ...prev, starts_at: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 6,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--admin-muted)', marginBottom: 6 }}>
                Kết thúc lúc
              </label>
              <input
                type="datetime-local"
                value={form.ends_at}
                onChange={(e) => setForm((prev) => ({ ...prev, ends_at: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 6,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--admin-muted)', marginBottom: 6 }}>
                Mô tả
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Thêm mô tả (tùy chọn)"
                rows={2}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 6,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {formWarn && (
            <div
              style={{
                marginBottom: 16,
                padding: '10px 12px',
                background: 'var(--admin-warn-bg)',
                color: 'var(--admin-warn)',
                borderRadius: 6,
                fontSize: 13,
              }}
            >
              ⚠️ {formWarn}
            </div>
          )}

          {formError && (
            <div
              style={{
                marginBottom: 16,
                padding: '10px 12px',
                background: 'var(--admin-primary-subtle)',
                color: 'var(--admin-danger)',
                borderRadius: 6,
                fontSize: 13,
              }}
            >
              ✕ {formError}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={saveCampaign}
              disabled={buttonDisabled}
              style={{
                height: 40,
                padding: '0 16px',
                borderRadius: 6,
                border: 'none',
                background: buttonDisabled ? 'var(--admin-border)' : 'var(--admin-primary)',
                color: buttonDisabled ? 'var(--admin-muted)' : '#fff',
                fontWeight: 600,
                fontSize: 13.5,
                cursor: buttonDisabled ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Đang lưu…' : buttonText}
            </button>
            <button
              onClick={startCreate}
              style={{
                height: 40,
                padding: '0 16px',
                borderRadius: 6,
                border: '1px solid var(--admin-border)',
                background: '#fff',
                color: 'var(--admin-ink-2)',
                fontWeight: 600,
                fontSize: 13.5,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Tạo mới
            </button>
            {editingId && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginLeft: 'auto' }}>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                  style={{ cursor: 'pointer' }}
                />
                Chương trình này đang chạy
              </label>
            )}
          </div>
        </div>

        {/* Campaigns List */}
        <div
          style={{
            background: 'var(--admin-surface)',
            border: '1px solid var(--admin-border)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div style={{ padding: 16, color: 'var(--admin-muted)', textAlign: 'center' }}>
              Đang tải danh sách chương trình…
            </div>
          ) : campaigns.length === 0 ? (
            <div style={{ padding: '56px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--admin-ink)', marginBottom: 8 }}>
                Chưa có chương trình khuyến mãi
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--admin-muted)' }}>
                Tạo chương trình đầu tiên để bắt đầu
              </div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--admin-border-soft)', borderBottom: '1px solid var(--admin-border)' }}>
                  <th style={{ ...tableHeader, textAlign: 'left' }}>Chương trình</th>
                  <th style={{ ...tableHeader, textAlign: 'left', width: 100 }}>Giảm giá</th>
                  <th style={{ ...tableHeader, textAlign: 'left' }}>Khoảng thời gian</th>
                  <th style={{ ...tableHeader, textAlign: 'left', width: 100 }}>Trạng thái</th>
                  <th style={{ width: 80 }} />
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--admin-border-soft)' }}>
                    <td style={tableCell}>
                      <div style={{ fontWeight: 600, color: 'var(--admin-ink)' }}>{c.name}</div>
                      {c.description && (
                        <div style={{ fontSize: 12, color: 'var(--admin-muted)', marginTop: 4 }}>
                          {c.description}
                        </div>
                      )}
                    </td>
                    <td style={tableCell}>
                      {c.discount_type === 'percentage' ? `${c.discount_value}%` : formatVnd(c.discount_value)}
                    </td>
                    <td style={tableCell}>
                      <div style={{ fontSize: 13, color: 'var(--admin-ink-2)' }}>
                        {new Date(c.starts_at).toLocaleDateString('vi-VN')}{' '}
                        {new Date(c.starts_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--admin-muted)', marginTop: 2 }}>
                        đến {new Date(c.ends_at).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td style={tableCell}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 999,
                          background: c.is_active ? 'var(--admin-ok-bg)' : 'var(--admin-neutral-bg)',
                          color: c.is_active ? 'var(--admin-ok)' : 'var(--admin-muted)',
                          fontSize: 12,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {c.is_active ? 'Đang chạy' : 'Tắt'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => startEdit(c)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--admin-primary)',
                          cursor: 'pointer',
                          fontSize: 13,
                          fontWeight: 600,
                          padding: 0,
                        }}
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AdminFrame>
    </AdminGuard>
  )
}

function toInputValue(value: string) {
  return value ? value.slice(0, 16) : ''
}

function toIso(value: string) {
  return value ? new Date(value).toISOString() : ''
}

const tableHeader: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--admin-muted)',
  padding: '10px 12px',
  textAlign: 'left',
}

const tableCell: React.CSSProperties = {
  padding: '12px',
  fontSize: 14,
  color: 'var(--admin-ink)',
  borderBottom: '1px solid var(--admin-border-soft)',
}
