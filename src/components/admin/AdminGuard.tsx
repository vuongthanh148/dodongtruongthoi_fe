'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    setMounted(true)
    const authenticated = isAdminAuthenticated()
    setIsAuth(authenticated)
    if (!authenticated) {
      router.replace('/admin/login')
    }
  }, [router])

  // Suppress hydration mismatch by not rendering anything until mounted on client
  if (!mounted) {
    return null
  }

  if (!isAuth) {
    return <div style={{ padding: 24 }}>Redirecting to login...</div>
  }

  return <>{children}</>
}
