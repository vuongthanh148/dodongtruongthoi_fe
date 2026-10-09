'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { AdminFrame } from '@/components/admin/AdminFrame'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { adminGet, adminPost, adminPut } from '@/lib/admin-api'
import { discountPercent, salePrice } from '@/lib/campaign-price'
import { formatVnd } from '@/lib/format'
import type { AdminCampaign, AdminProduct } from '@/lib/types'

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

type FieldState = 'default' | 'warn' | 'err'

const fieldBorder: Record<FieldState, string> = {
  default: 'var(--admin-border)',
  warn: 'var(--admin-warn)',
  err: 'var(--admin-danger)',
}

const fieldBg: Record<FieldState, string> = {
  default: '#fff',
  warn: 'var(--admin-warn-bg)',
  err: '#fff',
}

function Field({
  label,
  hint,
  warn,
  err,
  required,
  children,
}: {
  label: string
  hint?: string
  warn?: string
  err?: string
  required?: boolean
  children: ReactNode
}) {
  const message = err || warn || hint
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-ink-2)' }}>
        {label}
        {required && <span style={{ color: 'var(--admin-danger)' }}> *</span>}
      </span>
      {children}
      {message ? (
        <span
          style={{
            fontSize: 12.5,
            lineHeight: 1.45,
            display: 'flex',
            gap: 6,
            alignItems: 'flex-start',
            color: err ? 'var(--admin-danger)' : warn ? 'var(--admin-warn)' : 'var(--admin-muted)',
          }}
        >
          {(err || warn) && <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />}
          {message}
        </span>
      ) : null}
    </label>
  )
}

function fieldInputStyle(state: FieldState = 'default'): React.CSSProperties {
  return {
    width: '100%',
    height: 40,
    padding: '0 12px',
    border: `1px solid ${fieldBorder[state]}`,
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'inherit',
    background: fieldBg[state],
    boxSizing: 'border-box',
  }
}

const sectionCardStyle: React.CSSProperties = {
  background: 'var(--admin-surface)',
  border: '1px solid var(--admin-border)',
  borderRadius: 8,
  padding: 20,
  display: 'grid',
  gap: 16,
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([])
  const [sampleProduct, setSampleProduct] = useState<AdminProduct | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nameError, setNameError] = useState('')
  const [valueError, setValueError] = useState('')
  const [dateError, setDateError] = useState('')
  const [dateWarn, setDateWarn] = useState('')

  useEffect(() => {
    loadCampaigns()
    adminGet<AdminProduct[]>('/products').then((rows) => {
      if (rows && rows.length > 0) setSampleProduct(rows[0])
    })
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

  function clearFieldErrors() {
    setNameError('')
    setValueError('')
    setDateError('')
    setDateWarn('')
  }

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
    clearFieldErrors()
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
    clearFieldErrors()
  }

  function validateForm(): boolean {
    clearFieldErrors()
    let ok = true

    if (!form.name.trim()) {
      setNameError('Vui lòng nhập tên chương trình')
      ok = false
    }

    const value = Number(form.discount_value)
    if (value <= 0 || (form.discount_type === 'percentage' && value > 100)) {
      setValueError('Giá trị giảm giá không hợp lệ')
      ok = false
    }

    const startDate = form.starts_at ? new Date(form.starts_at) : null
    const endDate = form.ends_at ? new Date(form.ends_at) : null

    if (!startDate || !endDate) {
      setDateError('Vui lòng chọn cả ngày bắt đầu và kết thúc')
      ok = false
    } else if (endDate <= startDate) {
      setDateError('Ngày kết thúc phải sau ngày bắt đầu')
      ok = false
    } else if (startDate < new Date()) {
      setDateWarn('Ngày bắt đầu đã qua. Chương trình sẽ chạy ngay khi lưu.')
    }

    return ok
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
  const isStartInPast = startDate && startDate < new Date()
  const buttonText = isStartInPast ? 'Lưu và chạy ngay' : 'Lưu'

  const previewValue = Number(form.discount_value) || 0
  const previewCampaign = {
    id: 'preview',
    name: form.name || 'Xem trước',
    discountType: form.discount_type,
    discountValue: previewValue,
    startsAt: form.starts_at ? toIso(form.starts_at) : new Date().toISOString(),
    endsAt: form.ends_at ? toIso(form.ends_at) : new Date().toISOString(),
    isActive: true,
  }
  const previewPrice = sampleProduct && previewValue > 0 ? salePrice(sampleProduct.base_price, previewCampaign) : null
  const previewPercent =
    sampleProduct && previewValue > 0 ? discountPercent(sampleProduct.base_price, previewCampaign) : null

  return (
    <AdminGuard>
      <AdminFrame title="Khuyến mãi" subtitle="Tạo và quản lý chương trình khuyến mãi">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)',
            gap: 20,
            alignItems: 'start',
            marginBottom: 20,
          }}
          className="campaign-form-grid"
        >
          <div style={{ display: 'grid', gap: 16 }}>
            <section style={sectionCardStyle}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--admin-ink)' }}>Thông tin</div>
              <Field label="Tên chương trình" required hint="Hiện trên thẻ sản phẩm và trang chủ." err={nameError}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ví dụ: Tết Nguyên Đán 2026"
                  style={fieldInputStyle(nameError ? 'err' : 'default')}
                />
              </Field>
              <Field label="Mô tả ngắn" hint="Tuỳ chọn · 1–2 câu">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Thêm mô tả (tùy chọn)"
                  rows={2}
                  style={{ ...fieldInputStyle(), height: 64, paddingTop: 10, resize: 'vertical' }}
                />
              </Field>
            </section>

            <section style={sectionCardStyle}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--admin-ink)' }}>Mức giảm</div>
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  padding: 3,
                  background: 'var(--admin-border-soft)',
                  borderRadius: 8,
                  width: 'fit-content',
                }}
              >
                {([
                  ['percentage', 'Phần trăm'],
                  ['fixed_amount', 'Số tiền'],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, discount_type: value }))}
                    style={{
                      height: 34,
                      padding: '0 14px',
                      border: 'none',
                      borderRadius: 6,
                      background: form.discount_type === value ? '#fff' : 'transparent',
                      fontWeight: form.discount_type === value ? 600 : 500,
                      fontSize: 13.5,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      boxShadow: form.discount_type === value ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Field
                label={form.discount_type === 'percentage' ? 'Phần trăm giảm' : 'Số tiền giảm'}
                required
                hint={form.discount_type === 'percentage' ? '1–100%' : 'Số tiền giảm trên mỗi sản phẩm, đơn vị đồng'}
                err={valueError}
              >
                <div style={{ ...fieldInputStyle(valueError ? 'err' : 'default'), display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="number"
                    value={form.discount_value}
                    onChange={(e) => setForm((prev) => ({ ...prev, discount_value: e.target.value }))}
                    placeholder="0"
                    style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, fontFamily: 'inherit', background: 'transparent' }}
                  />
                  {form.discount_type === 'percentage' ? '%' : 'đ'}
                </div>
              </Field>
            </section>

            <section style={sectionCardStyle}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--admin-ink)' }}>Thời gian</div>
                <div style={{ fontSize: 13, color: 'var(--admin-muted)', marginTop: 2 }}>
                  Giờ Việt Nam (GMT+7).
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 }} className="campaign-date-grid">
                <Field label="Ngày bắt đầu" required warn={dateWarn} err={dateError && !form.starts_at ? dateError : undefined}>
                  <input
                    type="datetime-local"
                    value={form.starts_at}
                    onChange={(e) => setForm((prev) => ({ ...prev, starts_at: e.target.value }))}
                    style={fieldInputStyle(dateWarn ? 'warn' : dateError && !form.starts_at ? 'err' : 'default')}
                  />
                </Field>
                <Field
                  label="Ngày kết thúc"
                  required
                  err={dateError}
                  hint={!dateError ? 'Web hiện "kết thúc ngày …". Còn ≤ 3 ngày sẽ hiện "Còn n ngày".' : undefined}
                >
                  <input
                    type="datetime-local"
                    value={form.ends_at}
                    onChange={(e) => setForm((prev) => ({ ...prev, ends_at: e.target.value }))}
                    style={fieldInputStyle(dateError ? 'err' : 'default')}
                  />
                </Field>
              </div>
            </section>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={saveCampaign}
                disabled={saving}
                style={{
                  height: 40,
                  padding: '0 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: saving ? 'var(--admin-border)' : 'var(--admin-primary)',
                  color: saving ? 'var(--admin-muted)' : '#fff',
                  fontWeight: 600,
                  fontSize: 13.5,
                  cursor: saving ? 'not-allowed' : 'pointer',
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

          {/* Live preview */}
          <section style={{ ...sectionCardStyle, position: 'sticky', top: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--admin-ink)' }}>Xem trước trên web</div>
              <div style={{ fontSize: 13, color: 'var(--admin-muted)', marginTop: 2 }}>
                Giá tính theo sản phẩm mẫu
              </div>
            </div>
            {sampleProduct ? (
              <>
                <div style={{ ...fieldInputStyle(), display: 'flex', alignItems: 'center' }}>{sampleProduct.title}</div>
                {previewPrice !== null && previewPercent !== null ? (
                  <div style={{ display: 'grid', gap: 6, fontSize: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Giá gốc</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatVnd(sampleProduct.base_price)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--admin-ok)' }}>
                      <span>Giảm {previewPercent}%</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                        −{formatVnd(sampleProduct.base_price - previewPrice)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: 700,
                        borderTop: '1px solid var(--admin-border)',
                        paddingTop: 8,
                      }}
                    >
                      <span>Giá bán</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatVnd(previewPrice)}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 13.5, color: 'var(--admin-muted)' }}>Nhập mức giảm để xem giá dự kiến.</div>
                )}
              </>
            ) : (
              <div style={{ fontSize: 13.5, color: 'var(--admin-muted)' }}>Chưa có sản phẩm để xem trước.</div>
            )}
          </section>
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
        <style>{`
          @media (max-width: 1023px) {
            .campaign-form-grid { grid-template-columns: minmax(0,1fr) !important; }
          }
          @media (max-width: 639px) {
            .campaign-date-grid { grid-template-columns: minmax(0,1fr) !important; }
          }
        `}</style>
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
