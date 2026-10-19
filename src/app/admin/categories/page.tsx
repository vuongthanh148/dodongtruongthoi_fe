'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { adminDelete, adminGet, adminPost, adminPut } from '@/lib/admin-api'
import { previewSlug } from '@/lib/slug'
import type { AdminCategory } from '@/lib/types'

const emptyForm = {
  id: '',
  name: '',
  description: '',
  tone: 'gold',
  image_url: '',
  sort_order: '0',
  is_active: true,
}

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<AdminCategory[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    setLoading(true)
    const data = await adminGet<AdminCategory[]>('/categories')
    setRows(data ?? [])
    setLoading(false)
  }

  function startCreate() {
    setEditingId(null)
    setSlugTouched(false)
    setForm(emptyForm)
  }

  function startEdit(category: AdminCategory) {
    setEditingId(category.id)
    setSlugTouched(true) // editing an existing category never auto-regenerates its slug
    setForm({
      id: category.id,
      name: category.name,
      description: category.description ?? '',
      tone: category.tone,
      image_url: category.image_url ?? '',
      sort_order: String(category.sort_order),
      is_active: category.is_active,
    })
  }

  async function saveCategory() {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      tone: form.tone,
      image_url: form.image_url.trim(),
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    }

    const saved = editingId
      ? await adminPut<AdminCategory>(`/categories/${editingId}`, payload)
      : await adminPost<AdminCategory>('/categories', { id: form.id.trim(), ...payload })

    if (saved) {
      toast.success(editingId ? 'Đã cập nhật danh mục' : 'Đã tạo danh mục')
      await loadCategories()
      startCreate()
    } else {
      toast.error('Không thể lưu danh mục')
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Xóa danh mục này?')) {
      return
    }

    const ok = await adminDelete(`/categories/${id}`)
    if (ok) {
      toast.success('Đã xóa danh mục')
      await loadCategories()
    } else {
      toast.error('Không thể xóa danh mục')
    }
  }

  return (
    <AdminGuard>
      <AdminLayout title="Danh mục" subtitle="Quản lý danh mục sản phẩm">
        <section style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: 12, marginBottom: 16, display: 'grid', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            <Field label="Tên">
              <input
                value={form.name}
                onChange={(event) => {
                  const name = event.target.value
                  setForm((prev) => ({
                    ...prev,
                    name,
                    id: slugTouched || editingId ? prev.id : previewSlug(name),
                  }))
                }}
                style={inputStyle}
              />
            </Field>
            <Field label="Slug">
              <input
                value={form.id}
                onChange={(event) => {
                  setSlugTouched(event.target.value !== '')
                  setForm((prev) => ({ ...prev, id: event.target.value }))
                }}
                style={inputStyle}
                disabled={Boolean(editingId)}
              />
            </Field>
            <Field label="Kiểu">
              <select value={form.tone} onChange={(event) => setForm((prev) => ({ ...prev, tone: event.target.value }))} style={inputStyle}>
                <option value="gold">Vàng</option>
                <option value="red">Đỏ</option>
                <option value="bronze">Đồng</option>
                <option value="dark">Tối</option>
              </select>
            </Field>
            <Field label="URL hình ảnh">
              <input value={form.image_url} onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Thứ tự">
              <input type="number" value={form.sort_order} onChange={(event) => setForm((prev) => ({ ...prev, sort_order: event.target.value }))} style={inputStyle} />
            </Field>
          </div>
          <Field label="Mô tả">
            <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </Field>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={form.is_active} onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))} />
            Đang hoạt động
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={saveCategory} style={primaryBtn}>
              {editingId ? 'Cập nhật danh mục' : 'Tạo danh mục'}
            </button>
            <button type="button" onClick={startCreate} style={secondaryBtn}>
              Đặt lại
            </button>
          </div>
        </section>

        <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: 12 }}>
          {loading ? <p style={muted}>Đang tải danh mục...</p> : null}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--admin-border-soft)' }}>
                <th style={th}>Slug</th>
                <th style={th}>Tên</th>
                <th style={th}>Kiểu</th>
                <th style={th}>Trạng thái</th>
                <th style={th}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((category) => (
                <tr key={category.id}>
                  <td style={td}>{category.id}</td>
                  <td style={td}>{category.name}</td>
                  <td style={td}>{category.tone}</td>
                  <td style={td}>{category.is_active ? 'Đang hoạt động' : 'Tắt'}</td>
                  <td style={td}>
                    <button type="button" onClick={() => startEdit(category)} style={actionBtn}>
                      Chỉnh sửa
                    </button>
                    <button type="button" onClick={() => handleDelete(category.id)} style={{ ...actionBtn, marginLeft: 12 }}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 12, color: 'var(--admin-ink-2)' }
const td: React.CSSProperties = { padding: '10px 12px', borderTop: '1px solid var(--admin-border-soft)', fontSize: 14 }
const inputStyle: React.CSSProperties = { border: '1px solid var(--admin-border)', borderRadius: 6, padding: '10px 12px', fontSize: 14 }
const primaryBtn: React.CSSProperties = { border: 'none', background: 'var(--admin-primary)', color: 'white', borderRadius: 6, padding: '9px 12px', cursor: 'pointer' }
const secondaryBtn: React.CSSProperties = { border: '1px solid var(--admin-border)', background: 'var(--admin-surface)', color: 'var(--admin-ink-2)', borderRadius: 6, padding: '9px 12px', cursor: 'pointer' }
const actionBtn: React.CSSProperties = { border: 'none', background: 'transparent', color: 'var(--admin-primary)', cursor: 'pointer', padding: 0 }
const muted: React.CSSProperties = { color: 'var(--admin-muted)', margin: 0 }
