'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const authenticated = isAdminAuthenticated()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuth(authenticated)
    if (!authenticated) {
      router.replace('/admin/login')
    }
  }, [router])

  if (!isAuth) {
    return <div style={{ padding: 24 }}>Redirecting to login...</div>
  }

  return <>{children}</>
}
