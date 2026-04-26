const TOKEN_KEY = 'ddtt_admin_token'
const REFRESH_TOKEN_KEY = 'ddtt_admin_refresh_token'

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setAdminToken(token: string): void {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function getAdminRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setAdminRefreshToken(refreshToken: string): void {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function setAdminTokens(token: string, refreshToken?: string): void {
  setAdminToken(token)
  if (typeof refreshToken === 'string' && refreshToken.length > 0) {
    setAdminRefreshToken(refreshToken)
  }
}

export function clearAdminToken(): void {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminToken())
}
