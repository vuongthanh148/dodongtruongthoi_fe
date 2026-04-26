'use client'

import { useEffect } from 'react'
import { IconClose } from '@/components/icons'
import { Btn } from '@/components/ui/Btn'
import { Heading } from '@/components/ui/Heading'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function BottomSheet({ open, onClose, title, children, footer }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 70,
          background: 'rgba(20,14,9,0.55)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 250ms ease',
        }}
      />

      {/* Bottom Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 71,
          background: 'var(--bg-page)',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '75vh',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 280ms cubic-bezier(0.32, 0, 0.15, 1)',
        }}
      >
        {/* Handle Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: 'var(--border)',
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px 12px',
            borderBottom: '1px solid var(--border-soft)',
            flexShrink: 0,
          }}
        >
          <Heading size="sm">{title}</Heading>
          <Btn
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            style={{
              padding: 4,
            }}
          >
            <IconClose size={18} />
          </Btn>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
          }}
        >
          {children}
        </div>

        {/* Footer (optional) */}
        {footer && (
          <div
            style={{
              padding: '12px 20px 20px',
              borderTop: '1px solid var(--border-soft)',
              display: 'flex',
              gap: 8,
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </>
  )
}
