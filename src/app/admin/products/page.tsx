'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AdminFrame } from '@/components/admin/AdminFrame'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { adminGet, adminPutResult } from '@/lib/admin-api'
import { formatVnd } from '@/lib/format'
import type { AdminCategory, AdminProduct } from '@/lib/types'

interface ProductWithOptimistic extends AdminProduct {
  is_active_optimistic?: boolean
  toggling?: boolean
  toggleError?: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithOptimistic[]>([])
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory] = useState<string>('')

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    setError(false)
    try {
      const [productsData, categoriesData] = await Promise.all([
        adminGet<AdminProduct[]>('/products'),
        adminGet<AdminCategory[]>('/categories'),
      ])
      setProducts(productsData ?? [])
      setCategories(categoriesData ?? [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories]
  )

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || p.category_id === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, selectedCategory])

  const handleToggleActive = async (id: string, currentValue: boolean) => {
    const newValue = !currentValue

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, is_active_optimistic: newValue, toggling: true, toggleError: false }
          : p
      )
    )

    const product = products.find((p) => p.id === id)
    if (!product) return

    // Find the product to get full data for PUT request
    const fullBody = {
      title: product.title,
      subtitle: product.subtitle,
      category_id: product.category_id,
      badge: product.badge,
      base_price: product.base_price,
      description: product.description,
      meaning: product.meaning,
      variant_options: product.variant_options,
      default_variant: product.default_variant,
      zodiac_ids: product.zodiac_ids,
      purpose_place: product.purpose_place,
      purpose_use: product.purpose_use,
      purpose_avoid: product.purpose_avoid,
      specs: product.specs,
      requires_size: product.requires_size,
      is_active: newValue,
      sort_order: product.sort_order,
    }

    const result = await adminPutResult<AdminProduct>(`/products/${id}`, fullBody)

    if ('data' in result) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                is_active: newValue,
                is_active_optimistic: undefined,
                toggling: false,
                toggleError: false,
              }
            : p
        )
      )

      // Show success toast with undo
      toast.custom(
        (t) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 8,
              background: 'var(--admin-ink)',
              color: '#fff',
              fontSize: 13.5,
              boxShadow: '0 12px 32px -12px rgba(0,0,0,0.45)',
            }}
          >
            <span>Đã cập nhật · </span>
            <button
              onClick={() => {
                handleToggleActive(id, currentValue)
                toast.dismiss(t)
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fca5a5',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Hoàn tác
            </button>
          </div>
        ),
        { duration: 5000 }
      )
    } else {
      // Revert on error
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                is_active_optimistic: undefined,
                toggling: false,
                toggleError: true,
              }
            : p
        )
      )

      toast.custom(
        (t) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 8,
              background: 'var(--admin-ink)',
              color: '#fff',
              fontSize: 13.5,
              boxShadow: '0 12px 32px -12px rgba(0,0,0,0.45)',
            }}
          >
            <span>Không lưu được · </span>
            <button
              onClick={() => {
                handleToggleActive(id, currentValue)
                toast.dismiss(t)
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fca5a5',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Thử lại
            </button>
          </div>
        ),
        { duration: 5000 }
      )
    }
  }

  const isSmall = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <AdminGuard>
      <AdminFrame
        title="Sản phẩm"
        subtitle={`${products.length} sản phẩm · ${products.filter((p) => p.is_active_optimistic ?? p.is_active).length} đang bán`}
      >
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              height: 40,
              flex: 1,
              minWidth: isSmall ? undefined : 360,
              padding: '0 12px',
              borderRadius: 6,
              border: '1px solid var(--admin-border)',
              background: '#fff',
              color: 'var(--admin-muted)',
            }}
          >
            <span style={{ fontSize: 17 }}>🔍</span>
            <input
              type="text"
              placeholder="Tìm tên sản phẩm hoặc mã SKU"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontSize: 14,
                color: searchTerm ? 'var(--admin-ink)' : 'var(--admin-muted)',
                outline: 'none',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--admin-muted)',
                  fontSize: 15,
                  padding: 0,
                }}
              >
                ✕
              </button>
            )}
          </div>
          <button
            style={{
              height: 40,
              padding: '0 12px',
              borderRadius: 6,
              border: '1px solid var(--admin-border)',
              background: '#fff',
              color: 'var(--admin-ink-2)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {isSmall ? 'Danh mục' : `Danh mục: ${selectedCategory ? categoryMap[selectedCategory] || 'Tất cả' : 'Tất cả'}`}
            <span>▼</span>
          </button>
          <button
            style={{
              height: 40,
              padding: '0 12px',
              borderRadius: 6,
              border: '1px solid var(--admin-border)',
              background: '#fff',
              color: 'var(--admin-ink-2)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {isSmall ? 'Hiển thị' : 'Hiển thị: Tất cả'}
            <span>▼</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: 'var(--admin-surface)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 8,
                  padding: 12,
                  display: 'flex',
                  gap: 12,
                  animation: 'pulse 2s infinite',
                }}
              >
                <div
                  style={{
                    width: isSmall ? 64 : 56,
                    height: isSmall ? 64 : 56,
                    borderRadius: 6,
                    background: 'var(--admin-border-soft)',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, display: 'grid', gap: 8 }}>
                  <div
                    style={{
                      height: 14,
                      borderRadius: 4,
                      background: 'var(--admin-border-soft)',
                      width: '70%',
                    }}
                  />
                  <div
                    style={{
                      height: 12,
                      borderRadius: 4,
                      background: 'var(--admin-border-soft)',
                      width: '40%',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div
            style={{
              background: 'var(--admin-surface)',
              border: '1px solid var(--admin-border)',
              borderRadius: 8,
              padding: '56px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: 'var(--admin-primary-subtle)',
                color: 'var(--admin-danger)',
                fontSize: 22,
              }}
            >
              ⚠️
            </span>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--admin-ink)' }}>Không tải được danh sách sản phẩm</div>
            <div style={{ fontSize: 13.5, color: 'var(--admin-muted)', maxWidth: 360 }}>
              Kiểm tra kết nối mạng rồi thử lại.
            </div>
            <button
              onClick={loadProducts}
              style={{
                height: 36,
                padding: '0 14px',
                borderRadius: 6,
                border: '1px solid var(--admin-border)',
                background: '#fff',
                color: 'var(--admin-ink-2)',
                fontWeight: 600,
                fontSize: 13.5,
                cursor: 'pointer',
                marginTop: 6,
              }}
            >
              Thử lại
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            style={{
              background: 'var(--admin-surface)',
              border: '1px solid var(--admin-border)',
              borderRadius: 8,
              padding: '56px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: 'var(--admin-border-soft)',
                color: 'var(--admin-muted)',
                fontSize: 22,
              }}
            >
              🔍
            </span>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--admin-ink)' }}>Chưa có sản phẩm</div>
            <div style={{ fontSize: 13.5, color: 'var(--admin-muted)', maxWidth: 360 }}>
              {searchTerm || selectedCategory
                ? 'Không tìm thấy sản phẩm khớp với bộ lọc. Thử bỏ bớt tìm kiếm.'
                : 'Bắt đầu bằng cách thêm sản phẩm đầu tiên.'}
            </div>
            <Link
              href="/admin/products/new"
              style={{
                height: 36,
                padding: '0 14px',
                borderRadius: 6,
                border: 'none',
                background: 'var(--admin-primary)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 13.5,
                cursor: 'pointer',
                marginTop: 6,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Thêm sản phẩm
            </Link>
          </div>
        ) : isSmall ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredProducts.map((p) => (
              <article
                key={p.id}
                style={{
                  background: 'var(--admin-surface)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 8,
                  padding: 12,
                  display: 'grid',
                  gridTemplateColumns: '64px minmax(0,1fr) auto',
                  gap: 12,
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 6,
                    overflow: 'hidden',
                    border: '1px solid var(--admin-border)',
                    opacity: p.is_active_optimistic ?? p.is_active ? 1 : 0.55,
                    background: 'var(--admin-border-soft)',
                  }}
                />
                <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--admin-ink)' }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--admin-muted)' }}>
                    {p.category_id} · {categoryMap[p.category_id] || ''}
                  </div>
                  <div style={{ fontSize: 13, display: 'flex', gap: 8 }}>
                    <b style={{ fontVariantNumeric: 'tabular-nums' }}>{formatVnd(p.base_price)}</b>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => handleToggleActive(p.id, p.is_active_optimistic ?? p.is_active)}
                    style={{
                      width: 40,
                      height: 24,
                      borderRadius: 12,
                      border: 'none',
                      padding: 2,
                      cursor: p.toggling ? 'not-allowed' : 'pointer',
                      background: (p.is_active_optimistic ?? p.is_active)
                        ? 'var(--admin-ok)'
                        : 'var(--admin-border-strong)',
                      display: 'flex',
                      justifyContent: (p.is_active_optimistic ?? p.is_active) ? 'flex-end' : 'flex-start',
                      opacity: p.toggling ? 0.6 : 1,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: 'var(--admin-surface)',
              border: '1px solid var(--admin-border)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--admin-border-soft)', borderBottom: '1px solid var(--admin-border)' }}>
                  <th style={{ ...tableHeader, minWidth: 56, width: 56 }}>Ảnh</th>
                  <th style={{ ...tableHeader, textAlign: 'left' }}>Sản phẩm</th>
                  <th style={{ ...tableHeader, textAlign: 'left', width: 140 }}>Danh mục</th>
                  <th style={{ ...tableHeader, textAlign: 'right', width: 130 }}>Giá</th>
                  <th style={{ ...tableHeader, textAlign: 'right', width: 80 }}>Kho</th>
                  <th style={{ ...tableHeader, width: 90 }}>Cập nhật</th>
                  <th style={{ ...tableHeader, width: 150 }}>Hiển thị</th>
                  <th style={{ width: 28 }} />
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--admin-border-soft)' }}>
                    <td style={tableCell}>
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 6,
                          overflow: 'hidden',
                          border: '1px solid var(--admin-border)',
                          opacity: p.is_active_optimistic ?? p.is_active ? 1 : 0.55,
                          background: 'var(--admin-border-soft)',
                        }}
                      />
                    </td>
                    <td style={tableCell}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: (p.is_active_optimistic ?? p.is_active) ? 'var(--admin-ink)' : 'var(--admin-muted)' }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--admin-muted)', marginTop: 2 }}>
                        {p.id}
                      </div>
                    </td>
                    <td style={tableCell}>
                      <span style={{ fontSize: 13.5, color: 'var(--admin-ink-2)' }}>
                        {categoryMap[p.category_id] || ''}
                      </span>
                    </td>
                    <td style={{ ...tableCell, textAlign: 'right' }}>
                      <b style={{ fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
                        {formatVnd(p.base_price)}
                      </b>
                    </td>
                    <td style={{ ...tableCell, textAlign: 'right', color: 'var(--admin-ink-2)' }}>
                      <span style={{ fontSize: 13.5, fontVariantNumeric: 'tabular-nums' }}>0</span>
                    </td>
                    <td style={tableCell}>
                      <span style={{ fontSize: 13, color: 'var(--admin-muted)' }}>05/10</span>
                    </td>
                    <td style={tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          onClick={() => handleToggleActive(p.id, p.is_active_optimistic ?? p.is_active)}
                          style={{
                            width: 40,
                            height: 24,
                            borderRadius: 12,
                            border: 'none',
                            padding: 2,
                            cursor: p.toggling ? 'not-allowed' : 'pointer',
                            background: (p.is_active_optimistic ?? p.is_active)
                              ? 'var(--admin-ok)'
                              : 'var(--admin-border-strong)',
                            display: 'flex',
                            justifyContent: (p.is_active_optimistic ?? p.is_active) ? 'flex-end' : 'flex-start',
                            opacity: p.toggling ? 0.6 : 1,
                            flexShrink: 0,
                          }}
                        >
                          <span
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: '#fff',
                              display: 'grid',
                              placeItems: 'center',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                            }}
                          />
                        </button>
                        {!p.toggling && (
                          <span
                            style={{
                              fontSize: 12.5,
                              color: p.toggleError ? 'var(--admin-danger)' : p.is_active_optimistic ?? p.is_active ? 'var(--admin-ok)' : 'var(--admin-muted)',
                              fontWeight: 600,
                            }}
                          >
                            {p.toggleError ? 'Lỗi' : p.is_active_optimistic ?? p.is_active ? 'Đang bán' : 'Đã ẩn'}
                          </span>
                        )}
                        {p.toggling && (
                          <span style={{ fontSize: 12.5, color: 'var(--admin-muted)', fontWeight: 600 }}>
                            Đang lưu…
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={tableCell}>
                      <Link
                        href={`/admin/products/${p.id}`}
                        style={{ color: 'var(--admin-muted)', textDecoration: 'none', fontSize: 16 }}
                      >
                        →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminFrame>
    </AdminGuard>
  )
}

const tableHeader: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--admin-muted)',
  padding: '10px 12px',
  textAlign: 'left',
}

const tableCell: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: 14,
  color: 'var(--admin-ink)',
}
