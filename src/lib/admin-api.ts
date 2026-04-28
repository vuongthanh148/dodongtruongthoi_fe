import {
  clearAdminToken,
  getAdminRefreshToken,
  getAdminToken,
  setAdminTokens,
} from '@/lib/admin-auth'
import { ADMIN_API_BASE } from '@/lib/api-config'

const ADMIN_BASE = ADMIN_API_BASE
let refreshPromise: Promise<boolean> | null = null

function handleUnauthorized(path: string, status: number): void {
  if (status !== 401 || path === '/login' || path === '/refresh') {
    return
  }
  if (typeof window === 'undefined') {
    return
  }

  clearAdminToken()
  if (window.location.pathname !== '/admin/login') {
    const currentPath = `${window.location.pathname}${window.location.search}`
    const next = encodeURIComponent(currentPath)
    window.location.replace(`/admin/login?next=${next}`)
  }
}

async function tryRefreshToken(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    const refreshToken = getAdminRefreshToken()
    if (!refreshToken) {
      return false
    }

    try {
      const response = await fetch(`${ADMIN_BASE}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) {
        return false
      }

      const json = (await response.json()) as {
        data?: { token?: string; refresh_token?: string }
        token?: string
        refresh_token?: string
      }

      const data = json.data ?? json
      if (!data?.token) {
        return false
      }

      setAdminTokens(data.token, data.refresh_token)
      return true
    } catch {
      return false
    }
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

async function adminFetch(path: string, init?: RequestInit) {
  const token = getAdminToken()

  const buildHeaders = (accessToken: string | null): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...init?.headers,
  })

  const response = await fetch(`${ADMIN_BASE}${path}`, {
    ...init,
    headers: buildHeaders(token),
  })

  if (response.status === 401 && path !== '/login' && path !== '/refresh') {
    const refreshed = await tryRefreshToken()
    if (refreshed) {
      const retryToken = getAdminToken()
      const retryResponse = await fetch(`${ADMIN_BASE}${path}`, {
        ...init,
        headers: buildHeaders(retryToken),
      })

      if (retryResponse.status === 401) {
        handleUnauthorized(path, retryResponse.status)
      }
      return retryResponse
    }
  }

  handleUnauthorized(path, response.status)
  return response
}

async function unwrap<T>(response: Response): Promise<T | null> {
  if (!response.ok) {
    return null
  }

  const json = (await response.json()) as { data?: T }
  return (json.data ?? json) as T
}

export async function adminGet<T>(path: string): Promise<T | null> {
  try {
    return await unwrap<T>(await adminFetch(path, { cache: 'no-store' } as RequestInit))
  } catch {
    return null
  }
}

export async function adminPost<T>(path: string, body: unknown): Promise<T | null> {
  try {
    return await unwrap<T>(await adminFetch(path, { method: 'POST', body: JSON.stringify(body) }))
  } catch {
    return null
  }
}

export async function adminPut<T>(path: string, body: unknown): Promise<T | null> {
  try {
    return await unwrap<T>(await adminFetch(path, { method: 'PUT', body: JSON.stringify(body) }))
  } catch {
    return null
  }
}

export async function adminDelete(path: string): Promise<boolean> {
  try {
    const response = await adminFetch(path, { method: 'DELETE' })
    return response.ok
  } catch {
    return false
  }
}

export async function adminUpload<T>(path: string, formData: FormData): Promise<T | null> {
  try {
    const send = async (token: string | null) => fetch(`${ADMIN_BASE}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })

    const response = await send(getAdminToken())

    if (response.status === 401) {
      const refreshed = await tryRefreshToken()
      if (refreshed) {
        const retryResponse = await send(getAdminToken())
        if (retryResponse.status === 401) {
          handleUnauthorized(path, retryResponse.status)
        }
        return await unwrap<T>(retryResponse)
      }
    }

    handleUnauthorized(path, response.status)

    return await unwrap<T>(response)
  } catch {
    return null
  }
}