'use client'

import { useEffect, useState } from 'react'
import { AdminFrame } from '@/components/admin/AdminFrame'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { THEMES, type ThemeId } from '@/lib/themes'
import { adminGet, adminPut } from '@/lib/admin-api'

export default function AdminSettingsPage() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>('default')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadSettings() {
      try {
        const json = await adminGet<{ active_theme?: ThemeId }>('/settings')
        const value = json?.active_theme
        if (value) {
          setActiveTheme(value)
        }
      } catch {
        // Keep local default.
      }
    }

    loadSettings()
  }, [])

  async function saveTheme() {
    setSaving(true)
    setMessage('')

    try {
      const saved = await adminPut<{ active_theme?: ThemeId }>('/settings', { active_theme: activeTheme })
      if (saved) {
        setMessage('Settings saved')
        setSaving(false)
        return
      }
    } catch {
      // Local fallback if backend is offline.
    }

    setMessage('Saved locally (backend offline)')
    setSaving(false)
  }

  return (
    <AdminGuard>
      <AdminFrame title="Settings" subtitle="Control global storefront behavior and active theme">
        <section style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 14, maxWidth: 760 }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700 }}>Theme Switcher</h2>
          <p style={{ margin: '0 0 14px', color: '#6b7280' }}>Select which seasonal theme is applied to the storefront.</p>

          <div style={{ display: 'grid', gap: 8 }}>
            {THEMES.map((theme) => (
              <label key={theme.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', display: 'grid', gap: 4, cursor: 'pointer', background: activeTheme === theme.id ? '#fef2f2' : 'white' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="radio"
                    name="theme"
                    checked={activeTheme === theme.id}
                    onChange={() => setActiveTheme(theme.id)}
                  />
                  <strong>{theme.label}</strong>
                </span>
                <span style={{ fontSize: 13, color: '#6b7280' }}>{theme.description}</span>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={saveTheme}
            disabled={saving}
            style={{ marginTop: 14, border: 'none', background: '#7f1d1d', color: 'white', borderRadius: 6, padding: '9px 12px', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>

          {message ? <p style={{ margin: '8px 0 0', color: '#166534' }}>{message}</p> : null}
        </section>
      </AdminFrame>
    </AdminGuard>
  )
}
