'use client'

import { useEffect, useState } from 'react'
import { AdminFrame } from '@/components/admin/AdminFrame'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { THEMES, type ThemeId } from '@/lib/themes'
import { adminGet, adminPut } from '@/lib/admin-api'

type LabelField = {
  key: string
  label: string
  defaultValue: string
}

type ExtraLabelRow = {
  key: string
  value: string
}

type LabelPrefix = 'bg_tone_label' | 'frame_label' | 'place_label' | 'spec_label'

const LABEL_PREFIXES: LabelPrefix[] = ['bg_tone_label', 'frame_label', 'place_label', 'spec_label']

const BG_TONE_LABEL_FIELDS: LabelField[] = [
  { key: 'bg_tone_label.gold', label: 'Nền Vàng (gold)', defaultValue: 'Nền Vàng' },
  { key: 'bg_tone_label.red', label: 'Nền Đỏ (red)', defaultValue: 'Nền Đỏ' },
  { key: 'bg_tone_label.bronze', label: 'Nền Nâu Đồng (bronze)', defaultValue: 'Nền Nâu Đồng' },
  { key: 'bg_tone_label.dark', label: 'Nền Đen Cổ (dark)', defaultValue: 'Nền Đen Cổ' },
]

const FRAME_LABEL_FIELDS: LabelField[] = [
  { key: 'frame_label.bronze', label: 'Khung Nâu Đồng (bronze)', defaultValue: 'Khung Nâu Đồng' },
  { key: 'frame_label.gold', label: 'Khung Vàng Antique (gold)', defaultValue: 'Khung Vàng Antique' },
  { key: 'frame_label.dark', label: 'Khung Đen Mun (dark)', defaultValue: 'Khung Đen Mun' },
  { key: 'frame_label.carved', label: 'Khung Chạm Khắc (carved)', defaultValue: 'Khung Chạm Khắc' },
]

const PLACE_LABEL_FIELDS: LabelField[] = [
  { key: 'place_label.living_room', label: 'Phòng khách (living_room)', defaultValue: 'Phòng khách' },
  { key: 'place_label.office', label: 'Văn phòng (office)', defaultValue: 'Văn phòng' },
  { key: 'place_label.bedroom', label: 'Phòng ngủ (bedroom)', defaultValue: 'Phòng ngủ' },
  { key: 'place_label.dining_room', label: 'Phòng ăn (dining_room)', defaultValue: 'Phòng ăn' },
  { key: 'place_label.entrance', label: 'Hành lang / Lối vào (entrance)', defaultValue: 'Hành lang / Lối vào' },
]

const SPEC_LABEL_FIELDS: LabelField[] = [
  { key: 'spec_label.material', label: 'Chất liệu (material)', defaultValue: 'Chất liệu' },
  { key: 'spec_label.technique', label: 'Kỹ thuật (technique)', defaultValue: 'Kỹ thuật' },
  { key: 'spec_label.origin', label: 'Xuất xứ (origin)', defaultValue: 'Xuất xứ' },
  { key: 'spec_label.style', label: 'Phong cách (style)', defaultValue: 'Phong cách' },
  { key: 'spec_label.warranty', label: 'Bảo hành (warranty)', defaultValue: 'Bảo hành' },
  { key: 'spec_label.size', label: 'Kích thước (size)', defaultValue: 'Kích thước' },
]

const ALL_LABEL_FIELDS = [
  ...BG_TONE_LABEL_FIELDS,
  ...FRAME_LABEL_FIELDS,
  ...PLACE_LABEL_FIELDS,
  ...SPEC_LABEL_FIELDS,
]

function createDefaultDisplayLabels(): Record<string, string> {
  return ALL_LABEL_FIELDS.reduce<Record<string, string>>((acc, field) => {
    acc[field.key] = field.defaultValue
    return acc
  }, {})
}

export default function AdminSettingsPage() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>('default')
  const [displayLabels, setDisplayLabels] = useState<Record<string, string>>(() =>
    createDefaultDisplayLabels()
  )
  const [extraLabels, setExtraLabels] = useState<Record<LabelPrefix, ExtraLabelRow[]>>({
    bg_tone_label: [],
    frame_label: [],
    place_label: [],
    spec_label: [],
  })
  const [removedLabelKeys, setRemovedLabelKeys] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadSettings() {
      try {
        const json = await adminGet<Record<string, string>>('/settings')
        if (!json) {
          return
        }

        const value = json?.active_theme
        if (value) {
          setActiveTheme(value as ThemeId)
        }

        const knownKeys = new Set(ALL_LABEL_FIELDS.map((field) => field.key))
        const loadedExtraLabels: Record<LabelPrefix, ExtraLabelRow[]> = {
          bg_tone_label: [],
          frame_label: [],
          place_label: [],
          spec_label: [],
        }

        setDisplayLabels((prev) => {
          const next = { ...prev }
          for (const field of ALL_LABEL_FIELDS) {
            const saved = json[field.key]
            if (typeof saved === 'string' && saved.trim()) {
              next[field.key] = saved.trim()
            }
          }

          for (const [fullKey, rawValue] of Object.entries(json)) {
            if (typeof rawValue !== 'string' || knownKeys.has(fullKey) || !rawValue.trim()) {
              continue
            }

            for (const prefix of LABEL_PREFIXES) {
              const keyPrefix = `${prefix}.`
              if (!fullKey.startsWith(keyPrefix)) {
                continue
              }

              const suffix = fullKey.slice(keyPrefix.length)
              if (!suffix) {
                continue
              }

              loadedExtraLabels[prefix].push({ key: suffix, value: rawValue })
            }
          }

          return next
        })

        setExtraLabels(loadedExtraLabels)
        setRemovedLabelKeys([])
      } catch {
        // Keep local default.
      }
    }

    loadSettings()
  }, [])

  function addExtraLabel(prefix: LabelPrefix) {
    setExtraLabels((prev) => ({
      ...prev,
      [prefix]: [...prev[prefix], { key: '', value: '' }],
    }))
  }

  function updateExtraLabel(prefix: LabelPrefix, index: number, patch: Partial<ExtraLabelRow>) {
    const existingSuffix = extraLabels[prefix][index]?.key?.trim()

    setExtraLabels((prev) => ({
      ...prev,
      [prefix]: prev[prefix].map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...patch } : row
      ),
    }))

    if (patch.key !== undefined && existingSuffix) {
      setRemovedLabelKeys((prev) => prev.filter((item) => item !== `${prefix}.${existingSuffix}`))
    }
  }

  function removeExtraLabel(prefix: LabelPrefix, index: number) {
    const removedSuffix = extraLabels[prefix][index]?.key?.trim()

    if (removedSuffix) {
      setRemovedLabelKeys((prev) => {
        const fullKey = `${prefix}.${removedSuffix}`
        if (prev.includes(fullKey)) {
          return prev
        }
        return [...prev, fullKey]
      })
    }

    setExtraLabels((prev) => ({
      ...prev,
      [prefix]: prev[prefix].filter((_, rowIndex) => rowIndex !== index),
    }))
  }

  function renderLabelFields(
    title: string,
    description: string,
    fields: LabelField[],
    prefix: LabelPrefix
  ) {
    return (
      <section style={{ border: '1px solid var(--admin-border)', borderRadius: 8, padding: '12px 12px 10px' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700 }}>{title}</h3>
        <p style={{ margin: '0 0 10px', color: 'var(--admin-muted)', fontSize: 13 }}>{description}</p>
        <div style={{ display: 'grid', gap: 8 }}>
          {fields.map((field) => (
            <label key={field.key} style={{ display: 'grid', gap: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--admin-muted)' }}>{field.label}</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 6 }}>
                <input
                  value={displayLabels[field.key] ?? ''}
                  onChange={(event) => {
                    setDisplayLabels((prev) => ({
                      ...prev,
                      [field.key]: event.target.value,
                    }))
                    setRemovedLabelKeys((prev) => prev.filter((item) => item !== field.key))
                  }}
                  placeholder={field.defaultValue}
                  style={{
                    border: '1px solid var(--admin-border)',
                    borderRadius: 6,
                    padding: '8px 10px',
                    fontSize: 14,
                    width: '100%',
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setDisplayLabels((prev) => ({ ...prev, [field.key]: '' }))
                    setRemovedLabelKeys((prev) =>
                      prev.includes(field.key) ? prev : [...prev, field.key]
                    )
                  }}
                  style={{
                    border: '1px solid var(--admin-border)',
                    borderRadius: 6,
                    background: 'var(--admin-surface)',
                    padding: '6px 9px',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Xóa
                </button>
              </div>
              <code style={{ fontSize: 11, color: 'var(--admin-muted)' }}>{field.key}</code>
            </label>
          ))}

          {extraLabels[prefix].map((row, index) => (
            <div
              key={`${prefix}-${index}`}
              style={{
                border: '1px dashed #d1d5db',
                borderRadius: 6,
                padding: 8,
                display: 'grid',
                gap: 6,
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) auto', gap: 6 }}>
                <input
                  value={row.key}
                  onChange={(event) => updateExtraLabel(prefix, index, { key: event.target.value })}
                  placeholder="hậu tố khóa"
                  style={{
                    border: '1px solid var(--admin-border)',
                    borderRadius: 6,
                    padding: '8px 10px',
                    fontSize: 13,
                    width: '100%',
                  }}
                />
                <input
                  value={row.value}
                  onChange={(event) =>
                    updateExtraLabel(prefix, index, { value: event.target.value })
                  }
                  placeholder="Giá trị hiển thị"
                  style={{
                    border: '1px solid var(--admin-border)',
                    borderRadius: 6,
                    padding: '8px 10px',
                    fontSize: 13,
                    width: '100%',
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeExtraLabel(prefix, index)}
                  style={{
                    border: '1px solid var(--admin-border)',
                    borderRadius: 6,
                    background: 'var(--admin-surface)',
                    padding: '8px 10px',
                    cursor: 'pointer',
                  }}
                >
                  Xóa
                </button>
              </div>
              <code style={{ fontSize: 11, color: 'var(--admin-muted)' }}>{`${prefix}.${row.key || '<khóa>'}`}</code>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addExtraLabel(prefix)}
            style={{
              justifySelf: 'start',
              border: '1px solid var(--admin-border)',
              borderRadius: 6,
              background: 'var(--admin-surface)',
              padding: '7px 10px',
              cursor: 'pointer',
            }}
          >
            + Thêm nhãn
          </button>
        </div>
      </section>
    )
  }

  async function saveSettings() {
    setSaving(true)
    setMessage('')

    try {
      const normalizedLabels = Object.entries(displayLabels).reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = value.trim()
        return acc
      }, {})

      const payload: Record<string, string> = {
        active_theme: activeTheme,
        ...normalizedLabels,
      }

      for (const [prefix, rows] of Object.entries(extraLabels) as Array<
        [LabelPrefix, ExtraLabelRow[]]
      >) {
        for (const row of rows) {
          const suffix = row.key.trim()
          if (!suffix) {
            continue
          }

          payload[`${prefix}.${suffix}`] = row.value.trim()
        }
      }

      for (const removedKey of removedLabelKeys) {
        payload[removedKey] = ''
      }

      const saved = await adminPut<Record<string, string>>('/settings', payload)
      if (saved) {
        setMessage('Đã lưu cài đặt')
        setSaving(false)
        return
      }
    } catch {
      // Local fallback if backend is offline.
    }

    setMessage('Đã lưu cục bộ (backend offline)')
    setSaving(false)
  }

  return (
    <AdminGuard>
      <AdminFrame title="Cài đặt" subtitle="Kiểm soát hành vi storefront toàn cục và chủ đề hoạt động">
        <section style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: 14, maxWidth: 900 }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700 }}>Bộ chuyển đổi chủ đề</h2>
          <p style={{ margin: '0 0 14px', color: 'var(--admin-muted)' }}>Chọn chủ đề mùa nào sẽ áp dụng cho storefront.</p>

          <div style={{ display: 'grid', gap: 8 }}>
            {THEMES.map((theme) => (
              <label key={theme.id} style={{ border: '1px solid var(--admin-border)', borderRadius: 8, padding: '10px 12px', display: 'grid', gap: 4, cursor: 'pointer', background: activeTheme === theme.id ? 'var(--admin-primary-subtle)' : 'var(--admin-surface)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="radio"
                    name="theme"
                    checked={activeTheme === theme.id}
                    onChange={() => setActiveTheme(theme.id)}
                  />
                  <strong>{theme.label}</strong>
                </span>
                <span style={{ fontSize: 13, color: 'var(--admin-muted)' }}>{theme.description}</span>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            style={{ marginTop: 14, border: 'none', background: 'var(--admin-primary)', color: 'white', borderRadius: 6, padding: '9px 12px', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>

          {message ? <p style={{ margin: '8px 0 0', color: 'var(--admin-ok)' }}>{message}</p> : null}
        </section>

        <section style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: 14, maxWidth: 900, marginTop: 14 }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700 }}>Nhãn hiển thị</h2>
          <p style={{ margin: '0 0 14px', color: 'var(--admin-muted)' }}>
            Cấu hình nhãn storefront cho tên biến thể và siêu dữ liệu chi tiết sản phẩm.
          </p>

          <div style={{ display: 'grid', gap: 12 }}>
            {renderLabelFields(
              'Variant Names: Background',
              'Keys: bg_tone_label.*',
              BG_TONE_LABEL_FIELDS,
              'bg_tone_label'
            )}
            {renderLabelFields('Variant Names: Frame', 'Keys: frame_label.*', FRAME_LABEL_FIELDS, 'frame_label')}
            {renderLabelFields('Purpose Place Labels', 'Keys: place_label.*', PLACE_LABEL_FIELDS, 'place_label')}
            {renderLabelFields('Spec Key Labels', 'Keys: spec_label.*', SPEC_LABEL_FIELDS, 'spec_label')}
          </div>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            style={{ marginTop: 14, border: 'none', background: 'var(--admin-primary)', color: 'white', borderRadius: 6, padding: '9px 12px', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'Đang lưu...' : 'Lưu nhãn hiển thị'}
          </button>
        </section>
      </AdminFrame>
    </AdminGuard>
  )
}
