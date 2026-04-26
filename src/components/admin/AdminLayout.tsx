'use client'

import { Toaster } from 'sonner'
import { AdminFrame } from './AdminFrame'

interface AdminLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  mobileHideSidebar?: boolean
}

export function AdminLayout({ title, subtitle, children, mobileHideSidebar = false }: AdminLayoutProps) {
  return (
    <>
      <AdminFrame title={title} subtitle={subtitle} mobileHideSidebar={mobileHideSidebar}>
        {children}
      </AdminFrame>
      <Toaster position="bottom-right" richColors closeButton />
    </>
  )
}
