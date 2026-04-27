'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { adminDelete, adminGet, adminPut, adminUpload } from '@/lib/admin-api'
import type { AdminCustomerPhoto } from '@/lib/types'

const emptyForm = {
  caption: '',
  sort_order: '0',
  is_active: true,
}

export default function AdminCustomerPhotosPage() {
  const [rows, setRows] = useState<AdminCustomerPhoto[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadCaption, setUploadCaption] = useState('')
  const [uploadSortOrder, setUploadSortOrder] = useState('0')
  const [uploadActive, setUploadActive] = useState(true)
  const [loading, setLoading] = useState(true)

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
    setEditingId(photo.id)
    setForm({
      caption: photo.caption ?? '',
      sort_order: String(photo.sort_order),
      is_active: photo.is_active,
    })
  }

  function resetEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function uploadPhoto() {
    if (!uploadFile) {
      toast.error('Please choose an image file first')
      return
    }

    const formData = new FormData()
    formData.append('file', uploadFile)
    formData.append('caption', uploadCaption)
    formData.append('sortOrder', uploadSortOrder)
    formData.append('isActive', String(uploadActive))

    const uploaded = await adminUpload<AdminCustomerPhoto>('/customer-photos', formData)
    if (uploaded) {
      toast.success('Photo uploaded')
      setUploadFile(null)
      setUploadCaption('')
      setUploadSortOrder('0')
      setUploadActive(true)
      await loadPhotos()
    } else {
      toast.error('Failed to upload photo')
    }
  }

  async function savePhoto() {
    if (!editingId) {
      return
    }

    const payload = {
      caption: form.caption.trim(),
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    }

    const updated = await adminPut<AdminCustomerPhoto>(`/customer-photos/${editingId}`, payload)
    if (updated) {
      toast.success('Photo updated')
      await loadPhotos()
      resetEdit()
    } else {
      toast.error('Failed to update photo')
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this customer photo?')) {
      return
    }

    const ok = await adminDelete(`/customer-photos/${id}`)
    if (ok) {
      toast.success('Photo deleted')
      await loadPhotos()
    } else {
      toast.error('Failed to delete photo')
    }
  }

  return (
    <AdminGuard>
      <AdminLayout title="Customer Photos" subtitle="Manage real-home photos for homepage gallery">
        <section
          style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 12,
            display: 'grid',
            gap: 10,
            marginBottom: 16,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16 }}>Upload New Photo</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            <Field label="Image file">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                style={inputStyle}
              />
            </Field>
            <Field label="Caption (optional)">
              <input
                value={uploadCaption}
                onChange={(event) => setUploadCaption(event.target.value)}
                style={inputStyle}
                placeholder="Hà Nội · Phòng khách"
              />
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                value={uploadSortOrder}
                onChange={(event) => setUploadSortOrder(event.target.value)}
                style={inputStyle}
              />
            </Field>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginTop: 22 }}>
              <input
                type="checkbox"
                checked={uploadActive}
                onChange={(event) => setUploadActive(event.target.checked)}
              />
              Active
            </label>
          </div>
          <div>
            <button type="button" onClick={uploadPhoto} style={primaryBtn}>
              Upload to Cloudinary
            </button>
          </div>
        </section>

        {editingId ? (
          <section
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 12,
              display: 'grid',
              gap: 10,
              marginBottom: 16,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16 }}>Edit Photo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
              <Field label="Caption">
                <input
                  value={form.caption}
                  onChange={(event) => setForm((prev) => ({ ...prev, caption: event.target.value }))}
                  style={inputStyle}
                />
              </Field>
              <Field label="Sort order">
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(event) => setForm((prev) => ({ ...prev, sort_order: event.target.value }))}
                  style={inputStyle}
                />
              </Field>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))}
              />
              Active
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={savePhoto} style={primaryBtn}>
                Save Changes
              </button>
              <button type="button" onClick={resetEdit} style={secondaryBtn}>
                Cancel
              </button>
            </div>
          </section>
        ) : null}

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, display: 'grid', gap: 10 }}>
          {loading ? <p style={{ color: '#6b7280', margin: 0 }}>Loading photos...</p> : null}
          {rows.map((photo) => (
            <article
              key={photo.id}
              style={{
                border: '1px solid #f3f4f6',
                borderRadius: 8,
                padding: 10,
                display: 'grid',
                gap: 8,
              }}
            >
              <img
                src={photo.image_url}
                alt={photo.caption || 'Customer photo'}
                style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 6 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                <div style={{ display: 'grid', gap: 2 }}>
                  <strong style={{ fontSize: 14 }}>{photo.caption || 'No caption'}</strong>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>Sort: {photo.sort_order}</span>
                  <span style={{ color: photo.is_active ? '#166534' : '#9a3412', fontSize: 12 }}>
                    {photo.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" onClick={() => startEdit(photo)} style={actionBtn}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(photo.id)} style={actionBtn}>
                    Delete
                  </button>
                </div>
              </div>
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
      <span style={{ fontSize: 12, color: '#374151' }}>{label}</span>
      {children}
    </label>
  )
}

const inputStyle: React.CSSProperties = {
  border: '1px solid #d1d5db',
  borderRadius: 6,
  padding: '10px 12px',
  fontSize: 14,
}
const primaryBtn: React.CSSProperties = {
  border: 'none',
  background: '#7f1d1d',
  color: 'white',
  borderRadius: 6,
  padding: '9px 12px',
  cursor: 'pointer',
}
const secondaryBtn: React.CSSProperties = {
  border: '1px solid #d1d5db',
  background: 'white',
  color: '#374151',
  borderRadius: 6,
  padding: '9px 12px',
  cursor: 'pointer',
}
const actionBtn: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: '#7f1d1d',
  cursor: 'pointer',
  padding: 0,
}
