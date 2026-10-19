'use client'

import { AdminGuard } from '@/components/admin/AdminGuard'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { adminDelete, adminGet, adminPut, adminUpload } from '@/lib/admin-api'
import type { AdminCustomerPhoto } from '@/lib/types'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const emptyForm = {
  caption: '',
  sort_order: '0',
  is_active: true,
}

export default function AdminCustomerPhotosPage() {
  const [rows, setRows] = useState<AdminCustomerPhoto[]>([])
  const [editingPhoto, setEditingPhoto] = useState<AdminCustomerPhoto | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [editFile, setEditFile] = useState<File | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadCaption, setUploadCaption] = useState('')
  const [uploadSortOrder, setUploadSortOrder] = useState('0')
  const [uploadActive, setUploadActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPhotos()
  }, [])

  async function loadPhotos() {
    setLoading(true)
    try {
      const data = await adminGet<AdminCustomerPhoto[]>('/customer-photos')
      setRows(data ?? [])
    } finally {
      setLoading(false)
    }
  }

  function startEdit(photo: AdminCustomerPhoto) {
    setEditingPhoto(photo)
    setForm({
      caption: photo.caption ?? '',
      sort_order: String(photo.sort_order),
      is_active: photo.is_active,
    })
    setEditFile(null)
  }

  function resetEdit() {
    setEditingPhoto(null)
    setForm(emptyForm)
    setEditFile(null)
  }

  async function uploadPhoto() {
    if (!uploadFile) {
      toast.error('Hãy chọn một tệp hình ảnh trước')
      return
    }

    const formData = new FormData()
    formData.append('file', uploadFile)
    formData.append('caption', uploadCaption)
    formData.append('sortOrder', uploadSortOrder)
    formData.append('isActive', String(uploadActive))

    const uploaded = await adminUpload<AdminCustomerPhoto>('/customer-photos', formData)
    if (uploaded) {
      toast.success('Đã tải lên ảnh')
      setUploadFile(null)
      setUploadCaption('')
      setUploadSortOrder('0')
      setUploadActive(true)
      await loadPhotos()
    } else {
      toast.error('Không thể tải lên ảnh')
    }
  }

  async function savePhoto() {
    if (!editingPhoto || saving) {
      return
    }

    setSaving(true)

    const payload = {
      caption: form.caption.trim(),
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    }

    if (editFile) {
      const replacementData = new FormData()
      replacementData.append('file', editFile)
      replacementData.append('caption', payload.caption)
      replacementData.append('sortOrder', String(payload.sort_order))
      replacementData.append('isActive', String(payload.is_active))

      const uploaded = await adminUpload<AdminCustomerPhoto>('/customer-photos', replacementData)
      if (!uploaded) {
        toast.error('Không thể tải lên ảnh thay thế')
        setSaving(false)
        return
      }

      const deleted = await adminDelete(`/customer-photos/${editingPhoto.id}`)
      if (!deleted) {
        toast.error('Đã tải lên ảnh mới nhưng không thể xóa ảnh cũ')
        await loadPhotos()
        resetEdit()
        setSaving(false)
        return
      }

      toast.success('Đã cập nhật ảnh')
      await loadPhotos()
      resetEdit()
      setSaving(false)
      return
    }

    const updated = await adminPut<AdminCustomerPhoto>(
      `/customer-photos/${editingPhoto.id}`,
      payload
    )
    if (updated) {
      toast.success('Đã cập nhật ảnh')
      await loadPhotos()
      resetEdit()
    } else {
      toast.error('Không thể cập nhật ảnh')
    }

    setSaving(false)
  }

  async function toggleVisibility(photo: AdminCustomerPhoto, isActive: boolean) {
    const updated = await adminPut<AdminCustomerPhoto>(`/customer-photos/${photo.id}`, {
      caption: (photo.caption ?? '').trim(),
      sort_order: photo.sort_order,
      is_active: isActive,
    })

    if (!updated) {
      toast.error('Không thể cập nhật hiển thị')
      return
    }

    setRows((prev) =>
      prev.map((row) => (row.id === photo.id ? { ...row, is_active: isActive } : row))
    )
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Xóa ảnh khách hàng này?')) {
      return
    }

    const ok = await adminDelete(`/customer-photos/${id}`)
    if (ok) {
      toast.success('Đã xóa ảnh')
      await loadPhotos()
    } else {
      toast.error('Không thể xóa ảnh')
    }
  }

  return (
    <AdminGuard>
      <AdminLayout title="Ảnh khách hàng" subtitle="Quản lý ảnh phòng khách của khách hàng cho thư viện trang chủ">
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
          <h3 style={{ margin: 0, fontSize: 16 }}>Tải lên ảnh mới</h3>
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}
          >
            <Field label="Tệp hình ảnh">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                style={inputStyle}
              />
            </Field>
            <Field label="Chú thích (tuỳ chọn)">
              <input
                value={uploadCaption}
                onChange={(event) => setUploadCaption(event.target.value)}
                style={inputStyle}
                placeholder="Hà Nội · Phòng khách"
              />
            </Field>
            <Field label="Thứ tự">
              <input
                type="number"
                value={uploadSortOrder}
                onChange={(event) => setUploadSortOrder(event.target.value)}
                style={inputStyle}
              />
            </Field>
            <label
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginTop: 22 }}
            >
              <input
                type="checkbox"
                checked={uploadActive}
                onChange={(event) => setUploadActive(event.target.checked)}
              />
              Đang hoạt động
            </label>
          </div>
          <div>
            <button type="button" onClick={uploadPhoto} style={primaryBtn}>
              Tải lên lên Cloudinary
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
            gap: 10,
          }}
        >
          {loading ? <p style={{ color: 'var(--admin-muted)', margin: 0 }}>Đang tải ảnh...</p> : null}
          {!loading && rows.length === 0 ? (
            <p style={{ color: 'var(--admin-muted)', margin: 0 }}>Không tìm thấy ảnh.</p>
          ) : null}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 10,
            }}
          >
            {rows.map((photo) => (
              <article
                key={photo.id}
                style={{
                  border: '1px solid var(--admin-border-soft)',
                  borderRadius: 8,
                  padding: 10,
                  display: 'grid',
                  gap: 8,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.image_url}
                  alt={photo.caption || 'Ảnh khách hàng'}
                  style={{
                    width: '100%',
                    aspectRatio: '4 / 3',
                    objectFit: 'cover',
                    borderRadius: 6,
                  }}
                />

                <div style={{ display: 'grid', gap: 2 }}>
                  <strong style={{ fontSize: 13 }}>{photo.caption || 'Không có chú thích'}</strong>
                  <span style={{ fontSize: 12, color: 'var(--admin-muted)' }}>Thứ tự: {photo.sort_order}</span>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={photo.is_active}
                    onChange={(event) => toggleVisibility(photo, event.target.checked)}
                  />
                  Hiển thị
                </label>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <button type="button" onClick={() => startEdit(photo)} style={actionBtn}>
                    Chỉnh sửa
                  </button>
                  <button type="button" onClick={() => handleDelete(photo.id)} style={actionBtn}>
                    Xóa
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {editingPhoto ? (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(17, 24, 39, 0.5)',
              display: 'grid',
              placeItems: 'center',
              zIndex: 1000,
              padding: 16,
            }}
          >
            <div
              style={{
                width: 'min(760px, 100%)',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'var(--admin-surface)',
                borderRadius: 10,
                border: '1px solid var(--admin-border)',
                padding: 14,
                display: 'grid',
                gap: 12,
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <h3 style={{ margin: 0, fontSize: 16 }}>Chỉnh sửa ảnh khách hàng</h3>
                <button type="button" onClick={resetEdit} style={secondaryBtn}>
                  Đóng
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--admin-ink-2)' }}>Ảnh hiện tại</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editingPhoto.image_url}
                    alt={editingPhoto.caption || 'Ảnh hiện tại'}
                    style={{
                      width: '100%',
                      aspectRatio: '4 / 3',
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--admin-ink-2)' }}>Thay thế ảnh (tuỳ chọn)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setEditFile(event.target.files?.[0] ?? null)}
                    style={inputStyle}
                  />
                  <span style={{ fontSize: 12, color: 'var(--admin-muted)' }}>
                    Nếu bạn chọn một tệp, lưu sẽ tải lên ảnh mới và xóa ảnh cũ.
                  </span>
                  {editFile ? (
                    <span style={{ fontSize: 12, color: 'var(--admin-ok)' }}>
                      Đã chọn: {editFile.name}
                    </span>
                  ) : null}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 10,
                }}
              >
                <Field label="Chú thích">
                  <input
                    value={form.caption}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, caption: event.target.value }))
                    }
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
                Hiển thị
              </label>

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={savePhoto} style={primaryBtn} disabled={saving}>
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                <button type="button" onClick={resetEdit} style={secondaryBtn} disabled={saving}>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        ) : null}
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
