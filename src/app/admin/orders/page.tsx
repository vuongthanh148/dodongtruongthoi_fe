'use client'

import { AdminGuard } from '@/components/admin/AdminGuard'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { OrdersList } from '@/components/admin/orders/OrdersList'
import { ADMIN_COPY } from '@/lib/content-data'

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <AdminLayout title={ADMIN_COPY.orders.title} subtitle={ADMIN_COPY.orders.sub}>
        <OrdersList />
      </AdminLayout>
    </AdminGuard>
  )
}
