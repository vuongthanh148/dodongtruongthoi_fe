'use client'

import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { AdminFrame } from '@/components/admin/AdminFrame'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { ADMIN_COPY } from '@/lib/content-data'

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminFrame title={ADMIN_COPY.dashboard.title} subtitle={ADMIN_COPY.dashboard.sub}>
        <AdminDashboard />
      </AdminFrame>
    </AdminGuard>
  )
}
