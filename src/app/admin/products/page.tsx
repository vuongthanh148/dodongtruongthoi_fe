'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { adminDelete, adminGet } from '@/lib/admin-api'
import { formatVnd } from '@/lib/format'
import type { AdminCategory, AdminProduct } from '@/lib/types'

export default function AdminProductsPage() {
  const [rows, setRows] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    queueMicrotask(async () => {
      setLoading(true)
      try {
        const [productsData, categoriesData] = await Promise.all([
          adminGet<AdminProduct[]>('/products'),
          adminGet<AdminCategory[]>('/categories'),
        ])
        if (cancelled) {
          return
        }
        setRows(productsData ?? [])
        setCategories(categoriesData ?? [])
      } finally {
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  async function loadProducts() {
    setLoading(true)
    try {
      const [productsData, categoriesData] = await Promise.all([
        adminGet<AdminProduct[]>('/products'),
        adminGet<AdminCategory[]>('/categories'),
      ])
      setRows(productsData ?? [])
      setCategories(categoriesData ?? [])
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this product?')) {
      return
    }

    const ok = await adminDelete(`/products/${id}`)
    if (ok) {
      toast.success('Product deleted successfully')
      loadProducts()
    } else {
      toast.error('Failed to delete product')
    }
  }

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  return (
    <AdminGuard>
      <AdminLayout title="Products" subtitle="Manage catalog items, pricing, and variants">
        <div style={{ marginBottom: 10 }}>
          <Link href="/admin/products/new" style={{ textDecoration: 'none', background: '#7f1d1d', color: 'white', padding: '8px 12px', borderRadius: 6, display: 'inline-block' }}>
            Add Product
          </Link>
        </div>

        {loading ? (
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, textAlign: 'center', color: '#6b7280' }}>
            Loading products...
          </div>
        ) : rows.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, textAlign: 'center', color: '#6b7280' }}>
            No products yet. <Link href="/admin/products/new">Create one</Link>
          </div>
        ) : (
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={th}>Title</th>
                  <th style={th}>Category</th>
                  <th style={th}>Price</th>
                  <th style={th}>Status</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((product) => (
                  <tr key={product.id}>
                    <td style={td}>{product.title}</td>
                    <td style={td}>{categoryMap[product.category_id] || product.category_id}</td>
                    <td style={td}>{formatVnd(product.price ?? product.base_price)}</td>
                    <td style={td}>{product.is_active ? 'Active' : 'Inactive'}</td>
                    <td style={td}>
                      <Link href={`/admin/products/${product.id}`} style={{ color: '#7f1d1d', textDecoration: 'none' }}>
                        Edit
                      </Link>
                      <button type="button" onClick={() => handleDelete(product.id)} style={{ ...linkButton, marginLeft: 12 }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminLayout>
    </AdminGuard>
  )
}

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#374151' }
const td: React.CSSProperties = { padding: '10px 12px', borderTop: '1px solid #f3f4f6', fontSize: 14 }
const linkButton: React.CSSProperties = { border: 'none', background: 'transparent', color: '#7f1d1d', cursor: 'pointer', padding: 0 }
