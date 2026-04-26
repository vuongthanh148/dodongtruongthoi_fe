'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { adminDelete, adminGet, adminPost, adminPut } from '@/lib/admin-api'
import type { AdminContact } from '@/lib/types'

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
      toast.success(editingId ? 'Contact updated' : 'Contact created')
      await loadContacts()
      startCreate()
    } else {
      toast.error('Failed to save contact')
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this contact?')) {
      return
    }

    const ok = await adminDelete(`/contacts/${id}`)
    if (ok) {
      toast.success('Contact deleted')
      await loadContacts()
    } else {
      toast.error('Failed to delete contact')
    }
  }

  return (
    <AdminGuard>
      <AdminLayout title="Contacts" subtitle="Manage floating social links and hotline channels">
        <div style={{ marginBottom: 10 }}>
          <button type="button" onClick={startCreate} style={primaryBtn}>
            New Contact
          </button>
        </div>

        <section style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, display: 'grid', gap: 10, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            <Field label="ID (create only)">
              <input value={form.id} onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))} style={inputStyle} disabled={Boolean(editingId)} />
            </Field>
            <Field label="Platform">
              <select value={form.platform} onChange={(event) => setForm((prev) => ({ ...prev, platform: event.target.value }))} style={inputStyle}>
                <option value="zalo">zalo</option>
                <option value="messenger">messenger</option>
                <option value="facebook">facebook</option>
                <option value="tiktok">tiktok</option>
                <option value="phone">phone</option>
                <option value="email">email</option>
              </select>
            </Field>
            <Field label="Label">
              <input value={form.label} onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="URL">
              <input value={form.url} onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Sort order">
              <input type="number" value={form.sort_order} onChange={(event) => setForm((prev) => ({ ...prev, sort_order: event.target.value }))} style={inputStyle} />
            </Field>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={form.is_active} onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))} />
            Active
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={saveContact} style={primaryBtn}>
              {editingId ? 'Update Contact' : 'Create Contact'}
            </button>
            <button type="button" onClick={startCreate} style={secondaryBtn}>
              Reset
            </button>
          </div>
        </section>

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, display: 'grid', gap: 8 }}>
          {loading ? <p style={{ color: '#6b7280', margin: 0 }}>Loading contacts...</p> : null}
          {rows.map((row) => (
            <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto auto', gap: 8, alignItems: 'center', border: '1px solid #f3f4f6', borderRadius: 8, padding: 8 }}>
              <strong style={{ textTransform: 'capitalize' }}>{row.platform}</strong>
              <span style={{ overflowWrap: 'anywhere' }}>{row.url}</span>
              <button type="button" onClick={() => startEdit(row)} style={actionBtn}>
                Edit
              </button>
              <button type="button" onClick={() => handleDelete(row.id)} style={actionBtn}>
                Delete
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
      <span style={{ fontSize: 12, color: '#374151' }}>{label}</span>
      {children}
    </label>
  )
}

const inputStyle: React.CSSProperties = { border: '1px solid #d1d5db', borderRadius: 6, padding: '10px 12px', fontSize: 14 }
const primaryBtn: React.CSSProperties = { border: 'none', background: '#7f1d1d', color: 'white', borderRadius: 6, padding: '9px 12px', cursor: 'pointer' }
const secondaryBtn: React.CSSProperties = { border: '1px solid #d1d5db', background: 'white', color: '#374151', borderRadius: 6, padding: '9px 12px', cursor: 'pointer' }
const actionBtn: React.CSSProperties = { border: 'none', background: 'transparent', color: '#7f1d1d', cursor: 'pointer', padding: 0 }
