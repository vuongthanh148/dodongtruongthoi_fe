'use client'

import { useEffect, useState } from 'react'
import { AdminFrame } from '@/components/admin/AdminFrame'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { adminGet } from '@/lib/admin-api'
import type { AdminCampaign, AdminCategory, AdminOrder, AdminProduct } from '@/lib/types'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0, pendingOrders: 0, activeCampaigns: 0 })

  useEffect(() => {
    async function load() {
      const [products, categories, orders, campaigns] = await Promise.all([
        adminGet<AdminProduct[]>('/products'),
        adminGet<AdminCategory[]>('/categories'),
        adminGet<AdminOrder[]>('/orders?status=pending_confirm'),
        adminGet<AdminCampaign[]>('/campaigns'),
      ])

      setStats({
        products: products?.length ?? 0,
        categories: categories?.length ?? 0,
        pendingOrders: orders?.length ?? 0,
        activeCampaigns: campaigns?.filter((campaign) => campaign.is_active).length ?? 0,
      })
    }

    load()
  }, [])

  return (
    <AdminGuard>
      <AdminFrame title="Dashboard" subtitle="Storefront overview and quick stats">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
          <StatCard label="Products" value={String(stats.products)} />
          <StatCard label="Categories" value={String(stats.categories)} />
          <StatCard label="Pending Orders" value={String(stats.pendingOrders)} />
          <StatCard label="Active Campaigns" value={String(stats.activeCampaigns)} />
        </div>
      </AdminFrame>
    </AdminGuard>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 14 }}>
      <div style={{ color: '#6b7280', fontSize: 12 }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 28, fontWeight: 700, color: '#111827' }}>{value}</div>
    </div>
  )
}
