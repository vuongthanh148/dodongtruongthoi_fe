'use client'

import { AdminFrame } from '@/components/admin/AdminFrame'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { Field } from '@/components/admin/Field'
import {
  adminGet,
  adminPost,
  adminPut,
  adminUpload,
  imageApi,
  productImageApi,
  skuApi,
} from '@/lib/admin-api'
import { DEFAULT_PLACE_LABELS, ZODIAC } from '@/lib/data'
import type {
  AdminCategory,
  AdminProduct,
  AdminProductImage,
  AdminProductSKU,
  LibraryImage,
  VariantAttr,
  VariantOption,
} from '@/lib/types'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import Select, { type StylesConfig } from 'react-select'

interface ProductFormState {
  id: string
  title: string
  subtitle: string
  category_id: string
  badge: string
  base_price: string
  description: string
  meaning: string
  zodiac_ids: string[]
  purpose_place: string[]
  purpose_use: string
  purpose_avoid: string
  specs: string
  requires_size: boolean
  is_active: boolean
  sort_order: string
}

interface SizeFormRow {
  id: string
  size_label: string
  size_code: string
  sort_order: string
}

interface SKUFormRow {
  size_code: string | null
  attrs: Record<string, string>
  price: string
}

interface VariantOptionRow {
  key: string
  label: string
  values: string // comma-separated
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
  zodiac_ids: [],
  purpose_place: [],
  purpose_use: '',
  purpose_avoid: '',
  specs: '',
  requires_size: false,
  is_active: true,
  sort_order: '0',
}

type SelectOption = {
  value: string
  label: string
}

const placeOptions: SelectOption[] = Object.entries(DEFAULT_PLACE_LABELS).map(([id, name]) => ({
  value: id,
  label: name,
}))

const selectStyles: StylesConfig<SelectOption, boolean> = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#7f1d1d' : '#d1d5db',
    boxShadow: 'none',
    minHeight: 42,
    '&:hover': { borderColor: '#7f1d1d' },
  }),
  valueContainer: (base) => ({ ...base, padding: '3px 10px' }),
  multiValue: (base) => ({ ...base, backgroundColor: '#fef2f2' }),
  multiValueLabel: (base) => ({ ...base, color: '#7f1d1d' }),
  menu: (base) => ({ ...base, zIndex: 50 }),
}

export default function AdminProductEditPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const productId = typeof params.id === 'string' ? params.id : 'new'
  const isNew = productId === 'new'

  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [form, setForm] = useState<ProductFormState>(emptyForm)
  const [variantOptions, setVariantOptions] = useState<VariantOptionRow[]>([])
  const [defaultVariant, setDefaultVariant] = useState<Record<string, string>>({})
  const [sizes, setSizes] = useState<SizeFormRow[]>([])
  const [skus, setSkus] = useState<SKUFormRow[]>([])
  const [images, setImages] = useState<AdminProductImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedProductId, setSavedProductId] = useState<string>('')

  // Image library + attach state
  const [libraryImages, setLibraryImages] = useState<LibraryImage[]>([])
  const [imageTab, setImageTab] = useState<'attached' | 'library' | 'upload'>('attached')
  const [attachAttrs, setAttachAttrs] = useState<Record<string, string>>({})
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadName, setUploadName] = useState('')
  const [uploadAttrs, setUploadAttrs] = useState<Record<string, string>>({})

  const effectiveProductId = savedProductId || (isNew ? '' : productId)

  const parsedVariantOptions: VariantOption[] = variantOptions.map((row) => ({
    key: row.key.trim(),
    label: row.label.trim(),
    values: row.values
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean),
  }))

  const loadPage = useCallback(async () => {
    setLoading(true)

    const categoryData = await adminGet<AdminCategory[]>('/categories')
    setCategories(categoryData ?? [])

    const libData = await imageApi.list()
    setLibraryImages(libData ?? [])

    if (isNew) {
      setForm((prev) => ({ ...emptyForm, category_id: categoryData?.[0]?.id ?? '', id: prev.id }))
      setVariantOptions([])
      setDefaultVariant({})
      setSizes([])
      setSkus([])
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
      zodiac_ids: product.zodiac_ids ?? [],
      purpose_place: product.purpose_place ?? [],
      purpose_use: joinList(product.purpose_use),
      purpose_avoid: joinList(product.purpose_avoid),
      specs: stringifySpecs(product.specs),
      requires_size: product.requires_size,
      is_active: product.is_active,
      sort_order: String(product.sort_order),
    })

    setVariantOptions(
      (product.variant_options ?? []).map((opt) => ({
        key: opt.key,
        label: opt.label,
        values: opt.values.join(', '),
      }))
    )
    setDefaultVariant(product.default_variant ?? {})

    setSizes(
      (product.sizes ?? []).map((size) => ({
        id: size.id,
        size_label: size.size_label,
        size_code: size.size_code,
        sort_order: String(size.sort_order),
      }))
    )

    const skuData = await skuApi.list(product.id)
    setSkus(
      (skuData ?? []).map((s: AdminProductSKU) => ({
        size_code: s.size_code,
        attrs: s.attrs || {},
        price: String(s.price),
      }))
    )

    const imgData = await productImageApi.list(product.id)
    setImages(imgData ?? [])
    setLoading(false)
  }, [productId, isNew])

  useEffect(() => {
    ;(async () => {
      await loadPage()
    })()
  }, [loadPage])

  function addVariantOptionRow() {
    setVariantOptions((prev) => [...prev, { key: '', label: '', values: '' }])
  }

  function updateVariantOptionRow(index: number, patch: Partial<VariantOptionRow>) {
    setVariantOptions((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  function removeVariantOptionRow(index: number) {
    setVariantOptions((prev) => prev.filter((_, i) => i !== index))
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
    setSizes((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  function removeSizeRow(index: number) {
    setSizes((prev) => prev.filter((_, i) => i !== index))
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
      variant_options: parsedVariantOptions,
      default_variant: defaultVariant,
      zodiac_ids: form.zodiac_ids,
      purpose_place: form.purpose_place,
      purpose_use: splitList(form.purpose_use),
      purpose_avoid: splitList(form.purpose_avoid),
      specs: parseSpecs(form.specs),
      requires_size: form.requires_size,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
    }

    if (!payload.id || !payload.title || !payload.category_id) return

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
        price: 0,
        sort_order: Number(row.sort_order) || index,
      })),
    })

    await skuApi.set(
      saved.id,
      skus.map((row) => ({
        size_code: row.size_code,
        attrs: row.attrs,
        price: Number(row.price) || 0,
        sort_order: 0,
      }))
    )

    if (isNew) {
      router.replace(`/admin/products/${saved.id}`)
    } else {
      await loadPage()
    }

    setSaving(false)
  }

  async function handleAttachImage(imageId: string) {
    if (!effectiveProductId) return
    const attrs: VariantAttr[] = Object.entries(attachAttrs)
      .filter(([, v]) => v)
      .map(([key, value]) => ({ key, value }))
    await productImageApi.attach(effectiveProductId, imageId, attrs)
    setAttachAttrs({})
    const imgData = await productImageApi.list(effectiveProductId)
    setImages(imgData ?? [])
    setImageTab('attached')
  }

  async function handleUploadImage() {
    if (!effectiveProductId || !uploadFile) return
    const fd = new FormData()
    fd.append('file', uploadFile)
    fd.append('name', uploadName || uploadFile.name)
    const attrs: VariantAttr[] = Object.entries(uploadAttrs)
      .filter(([, v]) => v)
      .map(([key, value]) => ({ key, value }))
    fd.append('attrs_json', JSON.stringify(attrs))
    await adminUpload<AdminProductImage>(`/products/${effectiveProductId}/images`, fd)
    setUploadFile(null)
    setUploadName('')
    setUploadAttrs({})
    const [imgData, libData] = await Promise.all([
      productImageApi.list(effectiveProductId),
      imageApi.list(),
    ])
    setImages(imgData ?? [])
    setLibraryImages(libData ?? [])
    setImageTab('attached')
  }

  async function handleDetachImage(productImageId: string) {
    if (!effectiveProductId) return
    await productImageApi.detach(effectiveProductId, productImageId)
    const imgData = await productImageApi.list(effectiveProductId)
    setImages(imgData ?? [])
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
      <AdminFrame
        title={isNew ? 'Add Product' : 'Edit Product'}
        subtitle="Update content and variant options"
      >
        <div style={{ marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: 13,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            ← Back
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            saveProduct()
          }}
          style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 14,
            display: 'grid',
            gap: 12,
          }}
        >
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}
          >
            <Field label="ID (create only)">
              <input
                value={form.id}
                onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))}
                style={inputStyle}
                disabled={!isNew}
              />
            </Field>
            <Field label="Category">
              <select
                value={form.category_id}
                onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
                style={inputStyle}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Title">
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                style={inputStyle}
              />
            </Field>
            <Field label="Subtitle">
              <input
                value={form.subtitle}
                onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                style={inputStyle}
              />
            </Field>
            <Field label="Badge">
              <input
                value={form.badge}
                onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                style={inputStyle}
              />
            </Field>
            <Field label="Base price">
              <input
                type="number"
                value={form.base_price}
                onChange={(e) => setForm((p) => ({ ...p, base_price: e.target.value }))}
                style={inputStyle}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>
          <Field label="Meaning">
            <textarea
              value={form.meaning}
              onChange={(e) => setForm((p) => ({ ...p, meaning: e.target.value }))}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>

          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}
          >
            <Field label="Zodiac">
              <Select<SelectOption, true>
                isMulti
                options={ZODIAC.map((z) => ({ value: z.id, label: `${z.name} (${z.years})` }))}
                value={ZODIAC.filter((z) => form.zodiac_ids.includes(z.id)).map((z) => ({
                  value: z.id,
                  label: `${z.name} (${z.years})`,
                }))}
                onChange={(sel) => setForm((p) => ({ ...p, zodiac_ids: sel.map((o) => o.value) }))}
                styles={selectStyles}
              />
            </Field>
            <Field label="Purpose place">
              <Select<SelectOption, true>
                isMulti
                options={placeOptions}
                value={placeOptions.filter((o) => form.purpose_place.includes(o.value))}
                onChange={(sel) =>
                  setForm((p) => ({ ...p, purpose_place: sel.map((o) => o.value) }))
                }
                styles={selectStyles}
              />
            </Field>
            <Field label="Purpose use (comma separated)">
              <input
                value={form.purpose_use}
                onChange={(e) => setForm((p) => ({ ...p, purpose_use: e.target.value }))}
                style={inputStyle}
              />
            </Field>
            <Field label="Purpose avoid (comma separated)">
              <input
                value={form.purpose_avoid}
                onChange={(e) => setForm((p) => ({ ...p, purpose_avoid: e.target.value }))}
                style={inputStyle}
              />
            </Field>
          </div>

          <Field label="Specs (one key: value per line)">
            <textarea
              value={form.specs}
              onChange={(e) => setForm((p) => ({ ...p, specs: e.target.value }))}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>

          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}
          >
            <label style={checkboxLabel}>
              <input
                type="checkbox"
                checked={form.requires_size}
                onChange={(e) => setForm((p) => ({ ...p, requires_size: e.target.checked }))}
              />
              Requires size
            </label>
            <label style={checkboxLabel}>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
              />
              Active
            </label>
            <Field label="Sort order">
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: e.target.value }))}
                style={inputStyle}
              />
            </Field>
          </div>

          {/* Variant Options */}
          <section style={sectionStyle}>
            <div style={sectionHeader}>
              <h2 style={sectionTitle}>Variant Options</h2>
              <button type="button" onClick={addVariantOptionRow} style={secondaryBtn}>
                Add option
              </button>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {variantOptions.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 2fr auto',
                    gap: 8,
                    alignItems: 'start',
                  }}
                >
                  <input
                    placeholder="key (e.g. bg_tone)"
                    value={row.key}
                    onChange={(e) => updateVariantOptionRow(i, { key: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    placeholder="label (e.g. Màu nền)"
                    value={row.label}
                    onChange={(e) => updateVariantOptionRow(i, { label: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    placeholder="values (comma sep, e.g. gold,red,bronze)"
                    value={row.values}
                    onChange={(e) => updateVariantOptionRow(i, { values: e.target.value })}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => removeVariantOptionRow(i)}
                    style={secondaryBtn}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            {parsedVariantOptions.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
                  Default variant (shown by default)
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 8,
                  }}
                >
                  {parsedVariantOptions.map((opt) => (
                    <Field key={opt.key} label={`Default ${opt.label || opt.key}`}>
                      <select
                        value={defaultVariant[opt.key] ?? ''}
                        onChange={(e) =>
                          setDefaultVariant((prev) => ({ ...prev, [opt.key]: e.target.value }))
                        }
                        style={inputStyle}
                      >
                        <option value="">—</option>
                        {opt.values.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </Field>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Sizes */}
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
                  <input
                    placeholder="Size label"
                    value={row.size_label}
                    onChange={(e) => updateSizeRow(index, { size_label: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    placeholder="Size code"
                    value={row.size_code}
                    onChange={(e) => updateSizeRow(index, { size_code: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    placeholder="Sort"
                    value={row.sort_order}
                    onChange={(e) => updateSizeRow(index, { sort_order: e.target.value })}
                    style={inputStyle}
                  />
                  <button type="button" onClick={() => removeSizeRow(index)} style={secondaryBtn}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* SKU Pricing Matrix */}
          <SKUMatrix
            sizes={sizes}
            variantOptions={parsedVariantOptions}
            skus={skus}
            onSkusChange={setSkus}
          />

          {/* Images */}
          <section style={sectionStyle}>
            <div style={sectionHeader}>
              <h2 style={sectionTitle}>Images</h2>
              {!effectiveProductId && (
                <span style={{ color: '#6b7280', fontSize: 13 }}>Save product first</span>
              )}
            </div>

            {effectiveProductId && (
              <>
                {/* Tab bar */}
                <div
                  style={{
                    display: 'flex',
                    gap: 0,
                    borderBottom: '1px solid #e5e7eb',
                    marginBottom: 12,
                  }}
                >
                  {(['attached', 'library', 'upload'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setImageTab(tab)}
                      style={{
                        padding: '8px 16px',
                        fontSize: 13,
                        border: 'none',
                        borderBottom:
                          imageTab === tab ? '2px solid #7f1d1d' : '2px solid transparent',
                        background: 'none',
                        color: imageTab === tab ? '#7f1d1d' : '#6b7280',
                        cursor: 'pointer',
                        fontWeight: imageTab === tab ? 600 : 400,
                      }}
                    >
                      {tab === 'attached'
                        ? `Attached (${images.length})`
                        : tab === 'library'
                          ? 'From library'
                          : 'Upload new'}
                    </button>
                  ))}
                </div>

                {/* Attached tab */}
                {imageTab === 'attached' && (
                  <div style={{ display: 'grid', gap: 10 }}>
                    {images.length === 0 && (
                      <p style={{ color: '#6b7280', fontSize: 13 }}>No images attached.</p>
                    )}
                    {images.map((image) => (
                      <div
                        key={image.id}
                        style={{ ...imageRow, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.url}
                          alt=""
                          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }}
                        />
                        <div style={{ display: 'grid', gap: 4, flex: 1 }}>
                          <strong style={{ overflowWrap: 'anywhere', fontSize: 13 }}>
                            {image.name || image.url}
                          </strong>
                          <span style={{ color: '#6b7280', fontSize: 12 }}>
                            {(image.attrs ?? []).length > 0
                              ? (image.attrs ?? []).map((a) => `${a.key}=${a.value}`).join(' · ')
                              : 'no attrs'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDetachImage(image.id)}
                          style={secondaryBtn}
                        >
                          Detach
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Library tab */}
                {imageTab === 'library' && (
                  <div>
                    {parsedVariantOptions.length > 0 && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                          gap: 8,
                          marginBottom: 12,
                        }}
                      >
                        {parsedVariantOptions.map((opt) => (
                          <Field key={opt.key} label={opt.label || opt.key}>
                            <select
                              value={attachAttrs[opt.key] ?? ''}
                              onChange={(e) =>
                                setAttachAttrs((prev) => ({ ...prev, [opt.key]: e.target.value }))
                              }
                              style={inputStyle}
                            >
                              <option value="">—</option>
                              {opt.values.map((v) => (
                                <option key={v} value={v}>
                                  {v}
                                </option>
                              ))}
                            </select>
                          </Field>
                        ))}
                      </div>
                    )}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: 8,
                      }}
                    >
                      {libraryImages.map((img) => (
                        <div
                          key={img.id}
                          style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: 6,
                            overflow: 'hidden',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleAttachImage(img.id)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.name}
                            style={{
                              width: '100%',
                              aspectRatio: '1',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                          <div
                            style={{
                              padding: '4px 6px',
                              fontSize: 11,
                              color: '#374151',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {img.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload tab */}
                {imageTab === 'upload' && (
                  <div style={{ display: 'grid', gap: 10 }}>
                    <Field label="File">
                      <input
                        type="file"
                        onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                      />
                    </Field>
                    <Field label="Name">
                      <input
                        placeholder="Image name"
                        value={uploadName}
                        onChange={(e) => setUploadName(e.target.value)}
                        style={inputStyle}
                      />
                    </Field>
                    {parsedVariantOptions.length > 0 && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                          gap: 8,
                        }}
                      >
                        {parsedVariantOptions.map((opt) => (
                          <Field key={opt.key} label={opt.label || opt.key}>
                            <select
                              value={uploadAttrs[opt.key] ?? ''}
                              onChange={(e) =>
                                setUploadAttrs((prev) => ({ ...prev, [opt.key]: e.target.value }))
                              }
                              style={inputStyle}
                            >
                              <option value="">—</option>
                              {opt.values.map((v) => (
                                <option key={v} value={v}>
                                  {v}
                                </option>
                              ))}
                            </select>
                          </Field>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleUploadImage}
                      disabled={!uploadFile}
                      style={primaryBtn}
                    >
                      Upload & attach
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={saving} style={primaryBtn}>
              {saving ? 'Saving...' : 'Save Product'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              style={secondaryBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminFrame>
    </AdminGuard>
  )
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function joinList(items: string[] | null | undefined): string {
  return items?.join(', ') ?? ''
}

function parseSpecs(value: string): Record<string, string> | null {
  const entries = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(':'))
    .map(([key, ...rest]) => [key?.trim(), rest.join(':').trim()])
    .filter(([key, specValue]) => Boolean(key) && Boolean(specValue)) as Array<[string, string]>
  if (entries.length === 0) return null
  return Object.fromEntries(entries)
}

function stringifySpecs(specs: Record<string, string> | null | undefined): string {
  if (!specs) return ''
  return Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
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

const checkboxLabel: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 14,
  color: '#374151',
  cursor: 'pointer',
}

const sectionStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: 14,
}

const sectionHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: '#111827',
  margin: 0,
}

const gridRow: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr auto',
  gap: 8,
  alignItems: 'start',
}

const imageRow: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

// ─── SKU Matrix Component ──────────────────────────────────────────────────

function cartesian(arrays: string[][]): string[][] {
  if (arrays.length === 0) return [[]]
  return arrays.reduce<string[][]>(
    (acc, arr) => {
      return acc.flatMap((prev) => arr.map((v) => [...prev, v]))
    },
    [[]]
  )
}

interface SKUMatrixProps {
  sizes: SizeFormRow[]
  variantOptions: VariantOption[]
  skus: SKUFormRow[]
  onSkusChange: (skus: SKUFormRow[]) => void
}

function SKUMatrix({ sizes, variantOptions, skus, onSkusChange }: SKUMatrixProps) {
  // SKUs only store price-affecting attrs (e.g. khung) — display-only options
  // like chất liệu are intentionally excluded. If SKUs already exist, restrict
  // the grid to the attr keys actually present on them, otherwise every combo
  // fails to match its existing price and silently resets to 0.
  const existingAttrKeys = new Set(skus.flatMap((s) => Object.keys(s.attrs)))
  const priceAffectingOptions =
    skus.length > 0
      ? variantOptions.filter((o) => existingAttrKeys.has(o.key))
      : variantOptions
  const attrKeys = priceAffectingOptions.map((o) => o.key)
  const attrValueArrays = priceAffectingOptions.map((o) => o.values)
  const attrCombos = cartesian(attrValueArrays) // e.g. [["gold","bronze"],["gold","gold"],...]
  const sizeEntries =
    sizes.length > 0 ? sizes : [{ size_code: null as unknown as string, size_label: '(no size)' }]

  // Build expected rows: one per (size × attrCombo)
  const expectedRows: SKUFormRow[] = sizeEntries.flatMap((size) =>
    attrCombos.map((combo) => {
      const attrs: Record<string, string> = {}
      attrKeys.forEach((k, i) => {
        attrs[k] = combo[i] ?? ''
      })
      const sizeCode = size.size_code || null
      // Try to find existing sku to preserve price
      const existing = skus.find(
        (s) => s.size_code === sizeCode && attrKeys.every((k) => s.attrs[k] === attrs[k])
      )
      return { size_code: sizeCode, attrs, price: existing?.price ?? '0' }
    })
  )

  // If no sizes and no variants: single row
  const rows =
    expectedRows.length > 0
      ? expectedRows
      : [{ size_code: null, attrs: {}, price: skus[0]?.price ?? '0' }]

  // Sync rows → skus whenever they change (avoid infinite loop by comparing lengths/keys)
  const rowsKey = JSON.stringify(rows.map((r) => ({ ...r, price: undefined })))
  const skusKey = JSON.stringify(skus.map((s) => ({ ...s, price: undefined })))
  if (rowsKey !== skusKey) {
    // schedule update outside render
    setTimeout(() => onSkusChange(rows), 0)
  }

  function updatePrice(idx: number, price: string) {
    const next = [...rows]
    next[idx] = { ...next[idx], price }
    onSkusChange(next)
  }

  return (
    <section style={sectionStyle}>
      <div style={sectionHeader}>
        <h2 style={sectionTitle}>Pricing (SKUs)</h2>
        <span style={{ fontSize: 12, color: '#6b7280' }}>Price per size × variant combo</span>
      </div>
      {rows.length === 0 ? (
        <p style={{ color: '#6b7280', fontSize: 13 }}>
          Add sizes or variant options above to configure pricing.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {sizes.length > 0 && <th style={thStyle}>Size</th>}
                {attrKeys.map((k) => (
                  <th key={k} style={thStyle}>
                    {k}
                  </th>
                ))}
                <th style={thStyle}>Price (VND)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {sizes.length > 0 && (
                    <td style={tdStyle}>
                      {sizeEntries.find((s) => (s.size_code || null) === row.size_code)
                        ?.size_label ??
                        row.size_code ??
                        '—'}
                    </td>
                  )}
                  {attrKeys.map((k) => (
                    <td key={k} style={tdStyle}>
                      {row.attrs[k] || '—'}
                    </td>
                  ))}
                  <td style={tdStyle}>
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => updatePrice(idx, e.target.value)}
                      style={{ ...inputStyle, width: 140 }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

const thStyle: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
  fontWeight: 600,
  color: '#374151',
  whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '6px 12px',
  color: '#374151',
  whiteSpace: 'nowrap',
}
