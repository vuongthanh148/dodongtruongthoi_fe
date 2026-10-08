'use client'

import { AdminGuard } from '@/components/admin/AdminGuard'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AuditLogList } from '@/components/admin/audit-log/AuditLogList'
import { ADMIN_COPY } from '@/lib/content-data'

export default function AdminAuditLogPage() {
  return (
    <AdminGuard>
      <AdminLayout title={ADMIN_COPY.auditLog.title} subtitle={ADMIN_COPY.auditLog.subtitle}>
        <AuditLogList />
      </AdminLayout>
    </AdminGuard>
  )
}
