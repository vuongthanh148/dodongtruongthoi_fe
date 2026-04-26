'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { adminDelete, adminGet, adminPost, adminPut } from '@/lib/admin-api'
import type { AdminCampaign, AdminProduct } from '@/lib/types'

const emptyForm = {
  id: '',
  name: '',
  description: '',
  discount_type: 'percentage',
  discount_value: '0',
  starts_at: '',
  ends_at: '',
  is_active: true,
}

export default function AdminCampaignsPage() {
  const [rows, setRows] = useState<AdminCampaign[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [manageProductsCampaignId, setManageProductsCampaignId] = useState<string | null>(null)
  const [allProducts, setAllProducts] = useState<AdminProduct[]>([])
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set())
  const [productsLoading, setProductsLoading] = useState(false)

  useEffect(() => {
    loadCampaigns()
  }, [])

  async function loadCampaigns() {
    setLoading(true)
    try {
      const data = await adminGet<AdminCampaign[]>('/campaigns')
      setRows(data ?? [])
    } finally {
      setLoading(false)
    }
  }

  async function loadProductsForCampaign(campaignId: string) {
    setManageProductsCampaignId(campaignId)
    setProductsLoading(true)
    try {
      const products = await adminGet<AdminProduct[]>('/products')
      setAllProducts(products ?? [])
      // In a real scenario, we'd fetch which products are already assigned
      // For now, start with empty selection
      setSelectedProductIds(new Set())
    } finally {
      setProductsLoading(false)
    }
  }

  async function saveProductsToCampaign() {
    if (!manageProductsCampaignId) return

    const ok = await adminPut<void>(`/campaigns/${manageProductsCampaignId}/products`, {
      product_ids: Array.from(selectedProductIds),
    })

    if (ok) {
      toast.success('Campaign products updated')
      setManageProductsCampaignId(null)
    } else {
      toast.error('Failed to update campaign products')
    }
  }

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
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
  }

  async function saveCampaign() {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value) || 0,
      starts_at: toIso(form.starts_at),
      ends_at: toIso(form.ends_at),
      is_active: form.is_active,
    }

    const saved = editingId
      ? await adminPut<AdminCampaign>(`/campaigns/${editingId}`, payload)
      : await adminPost<AdminCampaign>('/campaigns', { id: form.id.trim(), ...payload })

    if (saved) {
      toast.success(editingId ? 'Campaign updated' : 'Campaign created')
      await loadCampaigns()
      startCreate()
    } else {
      toast.error('Failed to save campaign')
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this campaign?')) {
      return
    }

    const ok = await adminDelete(`/campaigns/${id}`)
    if (ok) {
      toast.success('Campaign deleted')
      await loadCampaigns()
    } else {
      toast.error('Failed to delete campaign')
    }
  }

  return (
    <AdminGuard>
      <AdminLayout title="Campaigns" subtitle="Set discount windows and product promotion strategy">
        <div style={{ marginBottom: 10 }}>
          <button type="button" onClick={startCreate} style={primaryBtn}>
            New Campaign
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
            <Field label="Discount type">
              <select value={form.discount_type} onChange={(event) => setForm((prev) => ({ ...prev, discount_type: event.target.value }))} style={inputStyle}>
                <option value="percentage">percentage</option>
                <option value="fixed_amount">fixed_amount</option>
              </select>
            </Field>
            <Field label="Discount value">
              <input type="number" value={form.discount_value} onChange={(event) => setForm((prev) => ({ ...prev, discount_value: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Starts at">
              <input type="datetime-local" value={form.starts_at} onChange={(event) => setForm((prev) => ({ ...prev, starts_at: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Ends at">
              <input type="datetime-local" value={form.ends_at} onChange={(event) => setForm((prev) => ({ ...prev, ends_at: event.target.value }))} style={inputStyle} />
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
            <button type="button" onClick={saveCampaign} style={primaryBtn}>
              {editingId ? 'Update Campaign' : 'Create Campaign'}
            </button>
            <button type="button" onClick={startCreate} style={secondaryBtn}>
              Reset
            </button>
          </div>
        </section>

        {manageProductsCampaignId && (
          <section style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Manage Campaign Products</h3>
              <button type="button" onClick={() => setManageProductsCampaignId(null)} style={{ border: 'none', background: 'transparent', color: '#7f1d1d', cursor: 'pointer', fontSize: 14 }}>
                Close
              </button>
            </div>

            {productsLoading ? (
              <p style={{ color: '#6b7280' }}>Loading products...</p>
            ) : (
              <>
                <div style={{ display: 'grid', gap: 8, maxHeight: '400px', overflowY: 'auto', marginBottom: 12 }}>
                  {allProducts.map((product) => (
                    <label key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: '1px solid #f3f4f6', borderRadius: 6 }}>
                      <input
                        type="checkbox"
                        checked={selectedProductIds.has(product.id)}
                        onChange={(e) => {
                          const newSet = new Set(selectedProductIds)
                          if (e.target.checked) {
                            newSet.add(product.id)
                          } else {
                            newSet.delete(product.id)
                          }
                          setSelectedProductIds(newSet)
                        }}
                      />
                      <span style={{ fontSize: 14 }}>{product.title}</span>
                    </label>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={saveProductsToCampaign} style={primaryBtn}>
                    Save Products ({selectedProductIds.size})
                  </button>
                  <button type="button" onClick={() => setManageProductsCampaignId(null)} style={secondaryBtn}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 16, color: '#6b7280' }}>Loading campaigns...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={th}>Name</th>
                  <th style={th}>Type</th>
                  <th style={th}>Value</th>
                  <th style={th}>Duration</th>
                  <th style={th}>Status</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td style={td}>{row.name}</td>
                    <td style={td}>{row.discount_type}</td>
                    <td style={td}>{row.discount_type === 'percentage' ? `${row.discount_value}%` : row.discount_value}</td>
                    <td style={td}>{row.starts_at} - {row.ends_at}</td>
                    <td style={td}>{row.is_active ? 'Active' : 'Inactive'}</td>
                    <td style={td}>
                      <button type="button" onClick={() => startEdit(row)} style={actionBtn}>
                        Edit
                      </button>
                      <button type="button" onClick={() => loadProductsForCampaign(row.id)} style={{ ...actionBtn, marginLeft: 12 }}>
                        Products
                      </button>
                      <button type="button" onClick={() => handleDelete(row.id)} style={{ ...actionBtn, marginLeft: 12 }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

function toInputValue(value: string) {
  return value ? value.slice(0, 16) : ''
}

function toIso(value: string) {
  return value ? new Date(value).toISOString() : ''
}

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#374151' }
const td: React.CSSProperties = { padding: '10px 12px', borderTop: '1px solid #f3f4f6', fontSize: 14 }
const inputStyle: React.CSSProperties = { border: '1px solid #d1d5db', borderRadius: 6, padding: '10px 12px', fontSize: 14 }
const primaryBtn: React.CSSProperties = { border: 'none', background: '#7f1d1d', color: 'white', borderRadius: 6, padding: '9px 12px', cursor: 'pointer' }
const secondaryBtn: React.CSSProperties = { border: '1px solid #d1d5db', background: 'white', color: '#374151', borderRadius: 6, padding: '9px 12px', cursor: 'pointer' }
const actionBtn: React.CSSProperties = { border: 'none', background: 'transparent', color: '#7f1d1d', cursor: 'pointer', padding: 0 }
