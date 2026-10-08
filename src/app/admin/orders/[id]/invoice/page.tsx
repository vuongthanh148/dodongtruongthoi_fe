'use client'

import { useParams } from 'next/navigation'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { OrderInvoice } from '@/components/admin/orders/OrderInvoice'

// Print view: no admin shell, so the sheet prints on its own.
export default function AdminOrderInvoicePage() {
  const { id } = useParams<{ id: string }>()
  return <AdminGuard>{id ? <OrderInvoice id={id} /> : null}</AdminGuard>
}
