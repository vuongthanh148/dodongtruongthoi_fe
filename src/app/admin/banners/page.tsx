'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { adminDelete, adminGet, adminPost, adminPut } from '@/lib/admin-api'
import type { AdminBanner } from '@/lib/types'

const emptyForm = {
  id: '',
  title: '',
  subtitle: '',
  image_url: '',
  link_url: '',
  sort_order: '0',
  is_active: true,
}

export default function AdminBannersPage() {
  const [rows, setRows] = useState<AdminBanner[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBanners()
  }, [])

  async function loadBanners() {
    setLoading(true)
    try {
      const data = await adminGet<AdminBanner[]>('/banners')
      setRows(data ?? [])
    } finally {
      setLoading(false)
    }
  }

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
  }

  function startEdit(banner: AdminBanner) {
    setEditingId(banner.id)
    setForm({
      id: banner.id,
      title: banner.title ?? '',
      subtitle: banner.subtitle ?? '',
      image_url: banner.image_url ?? '',
      link_url: banner.link_url ?? '',
      sort_order: String(banner.sort_order),
      is_active: banner.is_active,
    })
  }

  async function saveBanner() {
    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      image_url: form.image_url.trim(),
      link_url: form.link_url.trim(),
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    }

    const saved = editingId
      ? await adminPut<AdminBanner>(`/banners/${editingId}`, payload)
      : await adminPost<AdminBanner>('/banners', { id: form.id.trim(), ...payload })

    if (saved) {
      toast.success(editingId ? 'Đã cập nhật banner' : 'Đã tạo banner')
      await loadBanners()
      startCreate()
    } else {
      toast.error('Không thể lưu banner')
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Xóa banner này?')) {
      return
    }

    const ok = await adminDelete(`/banners/${id}`)
    if (ok) {
      toast.success('Đã xóa banner')
      await loadBanners()
    } else {
      toast.error('Không thể xóa banner')
    }
  }

  return (
    <AdminGuard>
      <AdminLayout title="Banner" subtitle="Quản lý banner trang chủ và khuyến mãi">
        <section style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: 12, display: 'grid', gap: 10, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            <Field label="ID (chỉ tạo)">
              <input value={form.id} onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))} style={inputStyle} disabled={Boolean(editingId)} />
            </Field>
            <Field label="Tiêu đề">
              <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Phụ đề">
              <input value={form.subtitle} onChange={(event) => setForm((prev) => ({ ...prev, subtitle: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="URL hình ảnh">
              <input value={form.image_url} onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="URL liên kết">
              <input value={form.link_url} onChange={(event) => setForm((prev) => ({ ...prev, link_url: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Thứ tự">
              <input type="number" value={form.sort_order} onChange={(event) => setForm((prev) => ({ ...prev, sort_order: event.target.value }))} style={inputStyle} />
            </Field>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={form.is_active} onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))} />
            Đang hoạt động
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={saveBanner} style={primaryBtn}>
              {editingId ? 'Cập nhật banner' : 'Tạo banner'}
            </button>
            <button type="button" onClick={startCreate} style={secondaryBtn}>
              Đặt lại
            </button>
          </div>
        </section>

        <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: 12, display: 'grid', gap: 10 }}>
          {loading ? <p style={{ color: 'var(--admin-muted)', margin: 0 }}>Đang tải banner...</p> : null}
          {rows.map((banner) => (
            <article key={banner.id} style={{ border: '1px solid var(--admin-border-soft)', borderRadius: 8, padding: 10, display: 'grid', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <strong>{banner.title ?? banner.id}</strong>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" onClick={() => startEdit(banner)} style={actionBtn}>
                    Chỉnh sửa
                  </button>
                  <button type="button" onClick={() => handleDelete(banner.id)} style={actionBtn}>
                    Xóa
                  </button>
                </div>
              </div>
              <span style={{ color: 'var(--admin-muted)', fontSize: 13 }}>{banner.subtitle ?? 'Không có phụ đề'}</span>
              <code style={{ fontSize: 12 }}>{banner.image_url ?? '-'}</code>
              <span style={{ color: banner.is_active ? 'var(--admin-ok)' : 'var(--admin-warn)', fontSize: 12 }}>{banner.is_active ? 'Đang hoạt động' : 'Tắt'}</span>
            </article>
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

const inputStyle: React.CSSProperties = { border: '1px solid var(--admin-border)', borderRadius: 6, padding: '10px 12px', fontSize: 14 }
const primaryBtn: React.CSSProperties = { border: 'none', background: 'var(--admin-primary)', color: 'white', borderRadius: 6, padding: '9px 12px', cursor: 'pointer' }
const secondaryBtn: React.CSSProperties = { border: '1px solid var(--admin-border)', background: 'var(--admin-surface)', color: 'var(--admin-ink-2)', borderRadius: 6, padding: '9px 12px', cursor: 'pointer' }
const actionBtn: React.CSSProperties = { border: 'none', background: 'transparent', color: 'var(--admin-primary)', cursor: 'pointer', padding: 0 }
