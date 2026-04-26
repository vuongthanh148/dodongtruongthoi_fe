'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminFrame } from '@/components/admin/AdminFrame'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { adminDelete, adminGet, adminPost, adminPut, adminUpload } from '@/lib/admin-api'
import type { AdminCategory, AdminProduct, AdminProductImage, AdminProductSize } from '@/lib/types'

interface ProductFormState {
  id: string
  title: string
  subtitle: string
  category_id: string
  badge: string
  base_price: string
  description: string
  meaning: string
  default_bg: string
  default_frame: string
  bg_tones: string
  frames: string
  zodiac_ids: string
  purpose_place: string
  purpose_use: string
  purpose_avoid: string
  specs: string
  requires_bg_tone: boolean
  requires_frame: boolean
  requires_size: boolean
  is_active: boolean
  sort_order: string
}

interface SizeFormRow {
  id: string
  size_label: string
  size_code: string
  price: string
  sort_order: string
}

const emptyForm: ProductFormState = {
  id: '',
  title: '',
  subtitle: '',
  category_id: '',
  badge: '',
  base_price: '0',
  description: '',
  meaning: '',
  default_bg: 'gold',
  default_frame: 'bronze',
  bg_tones: '',
  frames: '',
  zodiac_ids: '',
  purpose_place: '',
  purpose_use: '',
  purpose_avoid: '',
  specs: '',
  requires_bg_tone: false,
  requires_frame: false,
  requires_size: false,
  is_active: true,
  sort_order: '0',
}

export default function AdminProductEditPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const productId = typeof params.id === 'string' ? params.id : 'new'
  const isNew = productId === 'new'

  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [form, setForm] = useState<ProductFormState>(emptyForm)
  const [sizes, setSizes] = useState<SizeFormRow[]>([])
  const [images, setImages] = useState<AdminProductImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedProductId, setSavedProductId] = useState<string>('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadBgTone, setUploadBgTone] = useState('')
  const [uploadFrame, setUploadFrame] = useState('')

  const effectiveProductId = savedProductId || (isNew ? '' : productId)

  useEffect(() => {
    loadPage()
  }, [productId])

  async function loadPage() {
    setLoading(true)

    const categoryData = await adminGet<AdminCategory[]>('/categories')
    setCategories(categoryData ?? [])

    if (isNew) {
      setForm((prev) => ({ ...emptyForm, category_id: categoryData?.[0]?.id ?? '', id: prev.id }))
      setSizes([])
      setImages([])
      setSavedProductId('')
      setLoading(false)
      return
    }

    const product = await adminGet<AdminProduct>(`/products/${productId}`)
    if (!product) {
      setLoading(false)
      return
    }

    setSavedProductId(product.id)
    setForm({
      id: product.id,
      title: product.title,
      subtitle: product.subtitle ?? '',
      category_id: product.category_id,
      badge: product.badge ?? '',
      base_price: String(product.base_price ?? product.price ?? 0),
      description: product.description ?? '',
      meaning: product.meaning ?? '',
      default_bg: product.default_bg,
      default_frame: product.default_frame,
      bg_tones: joinList(product.bg_tones),
      frames: joinList(product.frames),
      zodiac_ids: joinList(product.zodiac_ids),
      purpose_place: joinList(product.purpose_place),
      purpose_use: joinList(product.purpose_use),
      purpose_avoid: joinList(product.purpose_avoid),
      specs: stringifySpecs(product.specs),
      requires_bg_tone: product.requires_bg_tone,
      requires_frame: product.requires_frame,
      requires_size: product.requires_size,
      is_active: product.is_active,
      sort_order: String(product.sort_order),
    })

    setSizes(
      (product.sizes ?? []).map((size) => ({
        id: size.id,
        size_label: size.size_label,
        size_code: size.size_code,
        price: String(size.price),
        sort_order: String(size.sort_order),
      }))
    )
    setImages(product.images ?? [])
    setLoading(false)
  }

  function addSizeRow() {
    setSizes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        size_label: '',
        size_code: '',
        price: '0',
        sort_order: String(prev.length),
      },
    ])
  }

  function updateSizeRow(index: number, patch: Partial<SizeFormRow>) {
    setSizes((prev) => prev.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)))
  }

  function removeSizeRow(index: number) {
    setSizes((prev) => prev.filter((_, rowIndex) => rowIndex !== index))
  }

  async function saveProduct() {
    const payload = {
      id: form.id.trim(),
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      category_id: form.category_id,
      badge: form.badge.trim(),
      base_price: Number(form.base_price) || 0,
      description: form.description.trim(),
      meaning: form.meaning.trim(),
      default_bg: form.default_bg.trim(),
      default_frame: form.default_frame.trim(),
      bg_tones: splitList(form.bg_tones),
      frames: splitList(form.frames),
      zodiac_ids: splitList(form.zodiac_ids),
      purpose_place: splitList(form.purpose_place),
      purpose_use: splitList(form.purpose_use),
      purpose_avoid: splitList(form.purpose_avoid),
      specs: parseSpecs(form.specs),
      requires_bg_tone: form.requires_bg_tone,
      requires_frame: form.requires_frame,
      requires_size: form.requires_size,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
    }

    if (!payload.id || !payload.title || !payload.category_id) {
      return
    }

    setSaving(true)
    const saved = isNew
      ? await adminPost<AdminProduct>('/products', payload)
      : await adminPut<AdminProduct>(`/products/${effectiveProductId}`, payload)

    if (!saved) {
      setSaving(false)
      return
    }

    setSavedProductId(saved.id)
    await adminPut(`/products/${saved.id}/sizes`, {
      sizes: sizes.map((row, index) => ({
        id: row.id,
        product_id: saved.id,
        size_label: row.size_label,
        size_code: row.size_code,
        price: Number(row.price) || 0,
        sort_order: Number(row.sort_order) || index,
      })),
    })

    if (isNew) {
      router.replace(`/admin/products/${saved.id}`)
    } else {
      await loadPage()
    }

    setSaving(false)
  }

  async function uploadImage() {
    if (!effectiveProductId || !uploadFile) {
      return
    }

    const formData = new FormData()
    formData.append('file', uploadFile)
    if (uploadBgTone) {
      formData.append('bgTone', uploadBgTone)
    }
    if (uploadFrame) {
      formData.append('frame', uploadFrame)
    }

    const uploaded = await adminUpload<AdminProductImage>(`/products/${effectiveProductId}/images`, formData)
    if (uploaded) {
      setUploadFile(null)
      setUploadBgTone('')
      setUploadFrame('')
      await loadPage()
    }
  }

  async function deleteImage(imageId: string) {
    if (!effectiveProductId) {
      return
    }

    const ok = await adminDelete(`/products/${effectiveProductId}/images/${imageId}`)
    if (ok) {
      await loadPage()
    }
  }

  if (loading) {
    return (
      <AdminGuard>
        <AdminFrame title="Product" subtitle="Loading product...">
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </AdminFrame>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <AdminFrame title={isNew ? 'Add Product' : 'Edit Product'} subtitle="Update content and variant options">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            saveProduct()
          }}
          style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 14, display: 'grid', gap: 12 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <Field label="ID (create only)">
              <input value={form.id} onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))} style={inputStyle} disabled={!isNew} />
            </Field>
            <Field label="Category">
              <select value={form.category_id} onChange={(event) => setForm((prev) => ({ ...prev, category_id: event.target.value }))} style={inputStyle}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Title">
              <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Subtitle">
              <input value={form.subtitle} onChange={(event) => setForm((prev) => ({ ...prev, subtitle: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Badge">
              <input value={form.badge} onChange={(event) => setForm((prev) => ({ ...prev, badge: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Base price">
              <input type="number" value={form.base_price} onChange={(event) => setForm((prev) => ({ ...prev, base_price: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Default background">
              <input value={form.default_bg} onChange={(event) => setForm((prev) => ({ ...prev, default_bg: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Default frame">
              <input value={form.default_frame} onChange={(event) => setForm((prev) => ({ ...prev, default_frame: event.target.value }))} style={inputStyle} />
            </Field>
          </div>

          <Field label="Description">
            <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </Field>
          <Field label="Meaning">
            <textarea value={form.meaning} onChange={(event) => setForm((prev) => ({ ...prev, meaning: event.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <Field label="Background tones (comma separated)">
              <input value={form.bg_tones} onChange={(event) => setForm((prev) => ({ ...prev, bg_tones: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Frames (comma separated)">
              <input value={form.frames} onChange={(event) => setForm((prev) => ({ ...prev, frames: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Zodiac IDs (comma separated)">
              <input value={form.zodiac_ids} onChange={(event) => setForm((prev) => ({ ...prev, zodiac_ids: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Purpose place (comma separated)">
              <input value={form.purpose_place} onChange={(event) => setForm((prev) => ({ ...prev, purpose_place: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Purpose use (comma separated)">
              <input value={form.purpose_use} onChange={(event) => setForm((prev) => ({ ...prev, purpose_use: event.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Purpose avoid (comma separated)">
              <input value={form.purpose_avoid} onChange={(event) => setForm((prev) => ({ ...prev, purpose_avoid: event.target.value }))} style={inputStyle} />
            </Field>
          </div>

          <Field label="Specs (one key: value per line)">
            <textarea value={form.specs} onChange={(event) => setForm((prev) => ({ ...prev, specs: event.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
            <label style={checkboxLabel}>
              <input type="checkbox" checked={form.requires_bg_tone} onChange={(event) => setForm((prev) => ({ ...prev, requires_bg_tone: event.target.checked }))} />
              Requires bg tone
            </label>
            <label style={checkboxLabel}>
              <input type="checkbox" checked={form.requires_frame} onChange={(event) => setForm((prev) => ({ ...prev, requires_frame: event.target.checked }))} />
              Requires frame
            </label>
            <label style={checkboxLabel}>
              <input type="checkbox" checked={form.requires_size} onChange={(event) => setForm((prev) => ({ ...prev, requires_size: event.target.checked }))} />
              Requires size
            </label>
            <label style={checkboxLabel}>
              <input type="checkbox" checked={form.is_active} onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))} />
              Active
            </label>
          </div>

          <Field label="Sort order">
            <input type="number" value={form.sort_order} onChange={(event) => setForm((prev) => ({ ...prev, sort_order: event.target.value }))} style={inputStyle} />
          </Field>

          <section style={sectionStyle}>
            <div style={sectionHeader}>
              <h2 style={sectionTitle}>Sizes</h2>
              <button type="button" onClick={addSizeRow} style={secondaryBtn}>
                Add size row
              </button>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {sizes.map((row, index) => (
                <div key={row.id} style={gridRow}>
                  <input placeholder="Size label" value={row.size_label} onChange={(event) => updateSizeRow(index, { size_label: event.target.value })} style={inputStyle} />
                  <input placeholder="Size code" value={row.size_code} onChange={(event) => updateSizeRow(index, { size_code: event.target.value })} style={inputStyle} />
                  <input type="number" placeholder="Price" value={row.price} onChange={(event) => updateSizeRow(index, { price: event.target.value })} style={inputStyle} />
                  <input type="number" placeholder="Sort" value={row.sort_order} onChange={(event) => updateSizeRow(index, { sort_order: event.target.value })} style={inputStyle} />
                  <button type="button" onClick={() => removeSizeRow(index)} style={secondaryBtn}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section style={sectionStyle}>
            <div style={sectionHeader}>
              <h2 style={sectionTitle}>Images</h2>
              <span style={{ color: '#6b7280', fontSize: 13 }}>{effectiveProductId ? effectiveProductId : 'Save the product first to upload images'}</span>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {images.map((image) => (
                <div key={image.id} style={imageRow}>
                  <div style={{ display: 'grid', gap: 4 }}>
                    <strong style={{ overflowWrap: 'anywhere' }}>{image.url}</strong>
                    <span style={{ color: '#6b7280', fontSize: 13 }}>
                      bg tone: {image.bg_tone ?? '-'} | frame: {image.frame ?? '-'}
                    </span>
                  </div>
                  <button type="button" onClick={() => deleteImage(image.id)} style={secondaryBtn}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
              <input type="file" onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                <input placeholder="bgTone" value={uploadBgTone} onChange={(event) => setUploadBgTone(event.target.value)} style={inputStyle} />
                <input placeholder="frame" value={uploadFrame} onChange={(event) => setUploadFrame(event.target.value)} style={inputStyle} />
                <button type="button" onClick={uploadImage} disabled={!effectiveProductId || !uploadFile} style={primaryBtn}>
                  Upload image
                </button>
              </div>
            </div>
          </section>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={saving} style={primaryBtn}>
              {saving ? 'Saving...' : 'Save Product'}
            </button>
            <button type="button" onClick={() => router.push('/admin/products')} style={secondaryBtn}>
              Cancel
            </button>
          </div>
        </form>
      </AdminFrame>
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

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function joinList(items: string[]): string {
  return items.join(', ')
}

function parseSpecs(value: string): Record<string, string> | null {
  const entries = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(':'))
    .map(([key, ...rest]) => [key?.trim(), rest.join(':').trim()])
    .filter(([key, specValue]) => Boolean(key) && Boolean(specValue)) as Array<[string, string]>

  if (entries.length === 0) {
    return null
  }

  return Object.fromEntries(entries)
}

function stringifySpecs(specs: Record<string, string> | null | undefined): string {
  if (!specs) {
    return ''
  }

  return Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
}

const inputStyle: React.CSSProperties = { border: '1px solid #d1d5db', borderRadius: 6, padding: '10px 12px', fontSize: 14, width: '100%' }
const primaryBtn: React.CSSProperties = { border: 'none', background: '#7f1d1d', color: 'white', borderRadius: 6, padding: '9px 12px', cursor: 'pointer' }
const secondaryBtn: React.CSSProperties = { border: '1px solid #d1d5db', background: 'white', color: '#374151', borderRadius: 6, padding: '9px 12px', cursor: 'pointer' }
const sectionStyle: React.CSSProperties = { border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, display: 'grid', gap: 12 }
const sectionHeader: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }
const sectionTitle: React.CSSProperties = { margin: 0, fontSize: 18, fontWeight: 700 }
const gridRow: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr auto', gap: 8, alignItems: 'center' }
const imageRow: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, border: '1px solid #f3f4f6', borderRadius: 8, padding: 10 }
const checkboxLabel: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }
