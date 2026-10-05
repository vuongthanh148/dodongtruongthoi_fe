'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Field } from '@/components/admin/Field'
import { adminGet, adminPostResult } from '@/lib/admin-api'
import { previewSlug } from '@/lib/slug'
import type { AdminCategory, AdminProduct } from '@/lib/types'

interface CreateFormState {
  title: string
  id: string
  subtitle: string
  category_id: string
  base_price: string
}

interface CreateFormErrors {
  title?: string
  id?: string
  category_id?: string
  base_price?: string
}

const emptyForm: CreateFormState = {
  title: '',
  id: '',
  subtitle: '',
  category_id: '',
  base_price: '',
}

export default function AdminProductCreatePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [form, setForm] = useState<CreateFormState>(emptyForm)
  const [slugTouched, setSlugTouched] = useState(false)
  const [errors, setErrors] = useState<CreateFormErrors>({})
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    queueMicrotask(async () => {
      const data = await adminGet<AdminCategory[]>('/categories')
      if (!cancelled) setCategories(data ?? [])
    })
    return () => {
      cancelled = true
    }
  }, [])

  function validate(id: string): CreateFormErrors {
    const next: CreateFormErrors = {}
    if (!form.title.trim()) next.title = 'Vui lòng nhập tên sản phẩm'
    if (!id) next.id = 'Vui lòng nhập mã sản phẩm (slug)'
    if (!form.category_id) next.category_id = 'Vui lòng chọn danh mục'
    const price = Number(form.base_price)
    if (!form.base_price.trim() || !Number.isFinite(price) || price <= 0) {
      next.base_price = 'Giá gốc phải lớn hơn 0'
    } else if (!Number.isInteger(price)) {
      next.base_price = 'Giá gốc phải là số nguyên (VND)'
    }
    return next
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return

    // Normalize the slug the same way the auto-suggestion does, so a hand-typed slug
    // cannot introduce spaces or accents into the product id.
    const id = previewSlug(form.id.trim())
    const nextErrors = validate(id)
    setErrors(nextErrors)
    setServerError('')
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    const result = await adminPostResult<AdminProduct>('/products', {
      id,
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      category_id: form.category_id,
      base_price: Number(form.base_price),
    })

    if ('error' in result) {
      setServerError(result.error)
      setSaving(false)
      return
    }

    router.replace(`/admin/products/${result.data?.id || id}`)
  }

  return (
    <AdminGuard>
      <AdminLayout
        title="Add Product"
        subtitle="Create the product, then add SKUs and images on the next screen"
        mobileHideSidebar
      >
        <div style={{ marginBottom: 12 }}>
          <button type="button" onClick={() => router.back()} style={backBtn}>
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate style={formStyle}>
          <div style={gridStyle}>
            <Field label="Title *">
              <input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value
                  setForm((prev) => ({
                    ...prev,
                    title,
                    id: slugTouched ? prev.id : previewSlug(title),
                  }))
                }}
                style={inputStyle(Boolean(errors.title))}
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title && <span style={errorText}>{errors.title}</span>}
            </Field>

            <Field label="Slug / ID *">
              <input
                value={form.id}
                onChange={(e) => {
                  setSlugTouched(e.target.value !== '')
                  setForm((prev) => ({ ...prev, id: e.target.value }))
                }}
                style={inputStyle(Boolean(errors.id))}
                aria-invalid={Boolean(errors.id)}
              />
              {errors.id && <span style={errorText}>{errors.id}</span>}
            </Field>

            <Field label="Subtitle">
              <input
                value={form.subtitle}
                onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                style={inputStyle(false)}
              />
            </Field>

            <Field label="Category *">
              <select
                value={form.category_id}
                onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))}
                style={inputStyle(Boolean(errors.category_id))}
                aria-invalid={Boolean(errors.category_id)}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <span style={errorText}>{errors.category_id}</span>}
              {categories.length === 0 && (
                <span style={hintText}>Chưa có danh mục nào. Hãy tạo danh mục trước.</span>
              )}
            </Field>

            <Field label="Base price (VND) *">
              <input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={form.base_price}
                onChange={(e) => setForm((prev) => ({ ...prev, base_price: e.target.value }))}
                style={inputStyle(Boolean(errors.base_price))}
                aria-invalid={Boolean(errors.base_price)}
              />
              {errors.base_price && <span style={errorText}>{errors.base_price}</span>}
            </Field>
          </div>

          {serverError && (
            <p role="alert" style={serverErrorBox}>
              {serverError}
            </p>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={saving} style={primaryBtn}>
              {saving ? 'Creating...' : 'Create product'}
            </button>
            <button type="button" onClick={() => router.push('/admin/products')} style={secondaryBtn}>
              Cancel
            </button>
          </div>
        </form>
      </AdminLayout>
    </AdminGuard>
  )
}

const formStyle: React.CSSProperties = {
  background: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: 14,
  display: 'grid',
  gap: 12,
  maxWidth: 820,
  boxSizing: 'border-box',
}

// minmax(0, 1fr) keeps the columns from forcing horizontal overflow on narrow screens.
const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
  gap: 12,
}

function inputStyle(invalid: boolean): React.CSSProperties {
  return {
    width: '100%',
    minWidth: 0,
    padding: '9px 12px',
    border: `1px solid ${invalid ? '#b91c1c' : '#d1d5db'}`,
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    background: 'white',
  }
}

const errorText: React.CSSProperties = { fontSize: 12, color: '#b91c1c' }
const hintText: React.CSSProperties = { fontSize: 12, color: '#6b7280' }

const serverErrorBox: React.CSSProperties = {
  margin: 0,
  padding: '8px 12px',
  borderRadius: 6,
  background: '#fef2f2',
  color: '#b91c1c',
  fontSize: 13,
}

const primaryBtn: React.CSSProperties = {
  padding: '10px 20px',
  background: '#7f1d1d',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  fontSize: 14,
  cursor: 'pointer',
  fontWeight: 500,
}

const secondaryBtn: React.CSSProperties = {
  padding: '8px 14px',
  background: 'white',
  color: '#374151',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 13,
  cursor: 'pointer',
}

const backBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#6b7280',
  cursor: 'pointer',
  fontSize: 13,
  padding: 0,
}
