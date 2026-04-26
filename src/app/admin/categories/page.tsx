'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { adminDelete, adminGet, adminPost, adminPut } from '@/lib/admin-api'
import type { AdminCategory } from '@/lib/types'

const emptyForm = {
  id: '',
  name: '',
  slug: '',
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
    setForm(emptyForm)
  }

  function startEdit(category: AdminCategory) {
    setEditingId(category.id)
    setForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
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
      slug: form.slug.trim(),
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
      toast.success(editingId ? 'Category updated' : 'Category created')
      await loadCategories()
      startCreate()
    } else {
      toast.error('Failed to save category')
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this category?')) {
      return
    }

    const ok = await adminDelete(`/categories/${id}`)
    if (ok) {
      toast.success('Category deleted')
      await loadCategories()
    } else {
      toast.error('Failed to delete category')
    }
  }

  return (
    <AdminGuard>
      <AdminLayout title="Categories" subtitle="Manage storefront category taxonomy">
        <div style={{ marginBottom: 10 }}>
          <button type="button" onClick={startCreate} style={primaryBtn}>
            New Category
          </button>
        </div>

        <section style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 16, display: 'grid', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            <Field label="ID (create only)">
              <input value={form.id} onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))} style={inputStyle} disabled={Boolean(editingId)} />
            </Field>
            <Field label="Name">
              <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Slug">
              <input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Tone">
              <select value={form.tone} onChange={(event) => setForm((prev) => ({ ...prev, tone: event.target.value }))} style={inputStyle}>
                <option value="gold">gold</option>
                <option value="red">red</option>
                <option value="bronze">bronze</option>
                <option value="dark">dark</option>
              </select>
            </Field>
            <Field label="Image URL">
              <input value={form.image_url} onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Sort order">
              <input type="number" value={form.sort_order} onChange={(event) => setForm((prev) => ({ ...prev, sort_order: event.target.value }))} style={inputStyle} />
            </Field>
          </div>
          <Field label="Description">
            <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </Field>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={form.is_active} onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))} />
            Active
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={saveCategory} style={primaryBtn}>
              {editingId ? 'Update Category' : 'Create Category'}
            </button>
            <button type="button" onClick={startCreate} style={secondaryBtn}>
              Reset
            </button>
          </div>
        </section>

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
          {loading ? <p style={muted}>Loading categories...</p> : null}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={th}>ID</th>
                <th style={th}>Name</th>
                <th style={th}>Tone</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((category) => (
                <tr key={category.id}>
                  <td style={td}>{category.id}</td>
                  <td style={td}>{category.name}</td>
                  <td style={td}>{category.tone}</td>
                  <td style={td}>{category.is_active ? 'Active' : 'Inactive'}</td>
                  <td style={td}>
                    <button type="button" onClick={() => startEdit(category)} style={actionBtn}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(category.id)} style={{ ...actionBtn, marginLeft: 12 }}>
                      Delete
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
      <span style={{ fontSize: 12, color: '#374151' }}>{label}</span>
      {children}
    </label>
  )
}

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#374151' }
const td: React.CSSProperties = { padding: '10px 12px', borderTop: '1px solid #f3f4f6', fontSize: 14 }
const inputStyle: React.CSSProperties = { border: '1px solid #d1d5db', borderRadius: 6, padding: '10px 12px', fontSize: 14 }
const primaryBtn: React.CSSProperties = { border: 'none', background: '#7f1d1d', color: 'white', borderRadius: 6, padding: '9px 12px', cursor: 'pointer' }
const secondaryBtn: React.CSSProperties = { border: '1px solid #d1d5db', background: 'white', color: '#374151', borderRadius: 6, padding: '9px 12px', cursor: 'pointer' }
const actionBtn: React.CSSProperties = { border: 'none', background: 'transparent', color: '#7f1d1d', cursor: 'pointer', padding: 0 }
const muted: React.CSSProperties = { color: '#6b7280', margin: 0 }
