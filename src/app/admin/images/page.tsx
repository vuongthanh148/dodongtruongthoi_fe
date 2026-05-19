'use client'

import { AdminFrame } from '@/components/admin/AdminFrame'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { imageApi } from '@/lib/admin-api'
import type { LibraryImage } from '@/lib/types'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function AdminImagesPage() {
  const [images, setImages] = useState<LibraryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadName, setUploadName] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await imageApi.list()
    setImages(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleUpload() {
    if (!uploadFile) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', uploadFile)
    fd.append('name', uploadName || uploadFile.name)
    await imageApi.upload(fd)
    setUploadFile(null)
    setUploadName('')
    if (fileRef.current) fileRef.current.value = ''
    setUploading(false)
    await load()
  }

  async function handleRename(id: string) {
    if (!editName.trim()) return
    await imageApi.rename(id, editName.trim())
    setEditingId(null)
    setEditName('')
    await load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this image from library? It will be detached from all products.')) return
    await imageApi.delete(id)
    await load()
  }

  return (
    <AdminGuard>
      <AdminFrame title="Image Library" subtitle="Upload once, attach to any product">
        {/* Upload section */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 20, display: 'grid', gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Upload new image</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 10, alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>File</label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Name</label>
              <input
                placeholder="Descriptive name"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <button
              type="button"
              onClick={handleUpload}
              disabled={!uploadFile || uploading}
              style={primaryBtn}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <p style={{ color: '#6b7280' }}>Loading...</p>
        ) : images.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No images yet. Upload one above.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {images.map((img) => (
              <div key={img.id} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '8px 10px' }}>
                  {editingId === img.id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleRename(img.id) }}
                        style={{ ...inputStyle, fontSize: 12, padding: '4px 8px' }}
                        autoFocus
                      />
                      <button type="button" onClick={() => handleRename(img.id)} style={{ ...primaryBtn, padding: '4px 10px', fontSize: 12 }}>✓</button>
                      <button type="button" onClick={() => setEditingId(null)} style={{ ...secondaryBtn, padding: '4px 8px', fontSize: 12 }}>✗</button>
                    </div>
                  ) : (
                    <div
                      style={{ fontSize: 12, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}
                      title={`Click to rename: ${img.name}`}
                      onClick={() => { setEditingId(img.id); setEditName(img.name) }}
                    >
                      {img.name || '(unnamed)'}
                    </div>
                  )}
                  <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 3 }}>
                    {new Date(img.created_at).toLocaleDateString('vi-VN')}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(img.id)}
                    style={{ ...secondaryBtn, marginTop: 6, width: '100%', fontSize: 12, padding: '4px 0', color: '#991b1b', borderColor: '#fca5a5' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminFrame>
    </AdminGuard>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
}

const primaryBtn: React.CSSProperties = {
  padding: '10px 20px',
  background: '#7f1d1d',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  fontSize: 14,
  cursor: 'pointer',
  fontWeight: 500,
}

const secondaryBtn: React.CSSProperties = {
  padding: '8px 14px',
  background: 'white',
  color: '#374151',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 13,
  cursor: 'pointer',
}
