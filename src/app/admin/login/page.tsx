'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setAdminTokens } from '@/lib/admin-auth'
import { adminPost } from '@/lib/admin-api'

function AdminLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function resolveNextPath(): string {
    const next = searchParams.get('next')
    if (!next) {
      return '/admin'
    }
    if (!next.startsWith('/admin') || next.startsWith('/admin/login')) {
      return '/admin'
    }
    return next
  }

  async function handleLogin() {
    setError('')

    const json = await adminPost<{ token?: string; refresh_token?: string }>('/login', { username, password })
    if (!json?.token) {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác')
      return
    }

    setAdminTokens(json.token, json.refresh_token)
    router.push(resolveNextPath())
  }

  return (
    <div className="adm" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--admin-bg)' }}>
      <div style={{ width: 360, background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 10, padding: 20 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--admin-ink)' }}>Đăng nhập quản trị</h1>
        <p style={{ color: 'var(--admin-muted)', marginTop: 4 }}>Đăng nhập để quản lý sản phẩm và cài đặt storefront.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 12, color: 'var(--admin-ink-2)' }}>Tên đăng nhập</span>
            <input value={username} onChange={(event) => setUsername(event.target.value)} style={{ border: '1px solid var(--admin-border)', borderRadius: 6, padding: '10px 12px' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 12, color: 'var(--admin-ink-2)' }}>Mật khẩu</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={{ border: '1px solid var(--admin-border)', borderRadius: 6, padding: '10px 12px' }} />
          </label>
          <button type="button" onClick={handleLogin} style={{ border: 'none', background: 'var(--admin-primary)', color: 'white', borderRadius: 6, padding: '10px 12px', fontWeight: 600, cursor: 'pointer' }}>
            Đăng nhập
          </button>
          {error ? <p style={{ color: 'var(--admin-danger)', margin: 0 }}>{error}</p> : null}
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginContent />
    </Suspense>
  )
}
