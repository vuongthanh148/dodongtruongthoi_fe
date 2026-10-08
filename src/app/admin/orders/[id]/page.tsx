'use client'

import { useParams } from 'next/navigation'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { OrderDetail } from '@/components/admin/orders/OrderDetail'

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  return <AdminGuard>{id ? <OrderDetail id={id} /> : null}</AdminGuard>
}
