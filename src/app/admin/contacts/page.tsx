'use client'

import { AdminGuard } from '@/components/admin/AdminGuard'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { adminDelete, adminGet, adminPost, adminPut } from '@/lib/admin-api'
import type { AdminContact } from '@/lib/types'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const emptyForm = {
  id: '',
  platform: 'zalo',
  label: '',
  url: '',
  sort_order: '0',
  is_active: true,
}

export default function AdminContactsPage() {
  const [rows, setRows] = useState<AdminContact[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContacts()
  }, [])

  async function loadContacts() {
    setLoading(true)
    try {
      const data = await adminGet<AdminContact[]>('/contacts')
      setRows(data ?? [])
    } finally {
      setLoading(false)
    }
  }

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
  }

  function startEdit(contact: AdminContact) {
    setEditingId(contact.id)
    setForm({
      id: contact.id,
      platform: contact.platform,
      label: contact.label,
      url: contact.url,
      sort_order: String(contact.sort_order),
      is_active: contact.is_active,
    })
  }

  async function saveContact() {
    const payload = {
      platform: form.platform.trim(),
      label: form.label.trim(),
      url: form.url.trim(),
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    }

    const saved = editingId
      ? await adminPut<AdminContact>(`/contacts/${editingId}`, payload)
      : await adminPost<AdminContact>('/contacts', { id: form.id.trim(), ...payload })

    if (saved) {
      toast.success(editingId ? 'Đã cập nhật liên hệ' : 'Đã tạo liên hệ')
      await loadContacts()
      startCreate()
    } else {
      toast.error('Không thể lưu liên hệ')
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Xóa liên hệ này?')) {
      return
    }

    const ok = await adminDelete(`/contacts/${id}`)
    if (ok) {
      toast.success('Đã xóa liên hệ')
      await loadContacts()
    } else {
      toast.error('Không thể xóa liên hệ')
    }
  }

  return (
    <AdminGuard>
      <AdminLayout title="Liên hệ" subtitle="Quản lý các liên kết mạng xã hội và kênh đường dây nóng">
        <section
          style={{
            background: 'var(--admin-surface)',
            border: '1px solid var(--admin-border)',
            borderRadius: 8,
            padding: 12,
            display: 'grid',
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}
          >
            <Field label="ID (chỉ tạo)">
              <input
                value={form.id}
                onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))}
                style={inputStyle}
                disabled={Boolean(editingId)}
              />
            </Field>
            <Field label="Nền tảng">
              <select
                value={form.platform}
                onChange={(event) => setForm((prev) => ({ ...prev, platform: event.target.value }))}
                style={inputStyle}
              >
                <option value="zalo">Zalo</option>
                <option value="messenger">Messenger</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="phone">Điện thoại</option>
                <option value="email">Email</option>
              </select>
            </Field>
            <Field label="Nhãn">
              <input
                value={form.label}
                onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
                style={inputStyle}
              />
            </Field>
            <Field label="URL">
              <input
                value={form.url}
                onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
                style={inputStyle}
              />
            </Field>
            <Field label="Thứ tự">
              <input
                type="number"
                value={form.sort_order}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, sort_order: event.target.value }))
                }
                style={inputStyle}
              />
            </Field>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, is_active: event.target.checked }))
              }
            />
            Đang hoạt động
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={saveContact} style={primaryBtn}>
              {editingId ? 'Cập nhật liên hệ' : 'Tạo liên hệ'}
            </button>
            <button type="button" onClick={startCreate} style={secondaryBtn}>
              Đặt lại
            </button>
          </div>
        </section>

        <div
          style={{
            background: 'var(--admin-surface)',
            border: '1px solid var(--admin-border)',
            borderRadius: 8,
            padding: 12,
            display: 'grid',
            gap: 8,
          }}
        >
          {loading ? <p style={{ color: 'var(--admin-muted)', margin: 0 }}>Đang tải liên hệ...</p> : null}
          {rows.map((row) => (
            <div
              key={row.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr auto auto',
                gap: 8,
                alignItems: 'center',
                border: '1px solid var(--admin-border-soft)',
                borderRadius: 8,
                padding: 8,
              }}
            >
              <strong style={{ textTransform: 'capitalize' }}>{row.platform}</strong>
              <span style={{ overflowWrap: 'anywhere' }}>{row.url}</span>
              <button type="button" onClick={() => startEdit(row)} style={actionBtn}>
                Chỉnh sửa
              </button>
              <button type="button" onClick={() => handleDelete(row.id)} style={actionBtn}>
                Xóa
              </button>
            </div>
          ))}
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 12, color: 'var(--admin-ink-2)' }}>{label}</span>
      {children}
    </label>
  )
}

const inputStyle: React.CSSProperties = {
  border: '1px solid var(--admin-border)',
  borderRadius: 6,
  padding: '10px 12px',
  fontSize: 14,
}
const primaryBtn: React.CSSProperties = {
  border: 'none',
  background: 'var(--admin-primary)',
  color: 'white',
  borderRadius: 6,
  padding: '9px 12px',
  cursor: 'pointer',
}
const secondaryBtn: React.CSSProperties = {
  border: '1px solid var(--admin-border)',
  background: 'var(--admin-surface)',
  color: 'var(--admin-ink-2)',
  borderRadius: 6,
  padding: '9px 12px',
  cursor: 'pointer',
}
const actionBtn: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'var(--admin-primary)',
  cursor: 'pointer',
  padding: 0,
}
