'use client'

import { useState } from 'react'
import { IconClose, IconFacebook, IconMessenger, IconTiktok, IconZalo } from '@/components/icons'
import { SOCIAL_LINKS } from '@/lib/constants'

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
        right: 10,
        bottom: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 7,
        zIndex: 60,
        alignItems: 'flex-end',
      }}
    >
      {open
        ? links.map(({ href, label, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontSize: 10,
                  color: 'white',
                  background: 'rgba(20,14,9,0.75)',
                  backdropFilter: 'blur(6px)',
                  padding: '3px 7px',
                  borderRadius: 10,
                  fontFamily: 'var(--font-be-vietnam), sans-serif',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Icon size={22} />
              </span>
            </a>
          ))
        : null}
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: open ? 'var(--text-primary)' : 'var(--accent)',
          border: 'none',
          color: 'white',
          boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
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
