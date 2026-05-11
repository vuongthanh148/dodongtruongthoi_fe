'use client'

import { IconClose, IconFacebook, IconMessenger, IconTiktok, IconZalo } from '@/components/icons'
import { SOCIAL_LINKS } from '@/lib/constants'
import { useState } from 'react'

const links = [
  { label: 'Zalo', href: SOCIAL_LINKS.zalo, Icon: IconZalo },
  { label: 'Messenger', href: SOCIAL_LINKS.messenger, Icon: IconMessenger },
  { label: 'Facebook', href: SOCIAL_LINKS.facebook, Icon: IconFacebook },
  { label: 'TikTok', href: SOCIAL_LINKS.tiktok, Icon: IconTiktok },
]

export function ContactBubbles() {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        position: 'fixed',
        right: 12,
        bottom: 'max(18px, env(safe-area-inset-bottom, 0px))',
        maxHeight: 'calc(100dvh - 80px)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 60,
        alignItems: 'flex-end',
      }}
    >
      {open
        ? links.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: 'var(--text-on-dark)',
                  background: 'rgba(20,14,9,0.76)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 8px',
                  borderRadius: 999,
                  fontFamily: 'var(--font-be-vietnam), sans-serif',
                  border: '1px solid rgba(244,237,224,0.14)',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.28)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Icon size={20} color="white" />
              </span>
            </a>
          ))
        : null}
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: open ? 'var(--text-primary)' : 'var(--accent)',
          border: 'none',
          color: 'white',
          boxShadow: '0 10px 24px rgba(0,0,0,0.32)',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
        }}
      >
        {open ? (
          <IconClose size={18} color="white" />
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a8 8 0 1 1-3.2-6.4L21 4v5h-5" />
          </svg>
        )}
      </button>
    </div>
  )
}
