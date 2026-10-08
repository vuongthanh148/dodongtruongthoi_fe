'use client'

import type { ReactNode } from 'react'
import { AlertCircle, Inbox } from 'lucide-react'
import { ORDER_STATUS_TONE, orderStatusLabel } from '@/lib/admin-orders'
import type { OrderStatus } from '@/lib/types'

export const adminCard = 'overflow-hidden rounded-[8px] border border-admin-border bg-admin-surface'

export const adminButtonBase =
  'inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-md px-3.5 text-[14px] font-semibold whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 no-underline'
export const adminButtonSecondary = `${adminButtonBase} border border-admin-border bg-admin-surface text-admin-ink-2`
export const adminButtonPrimary = `${adminButtonBase} border border-admin-primary bg-admin-primary text-white`
export const adminButtonDanger = `${adminButtonBase} border border-admin-border bg-admin-surface text-admin-danger`

export const adminInput =
  'h-10 min-w-0 rounded-md border border-admin-border bg-admin-surface px-3 text-[14px] text-admin-ink placeholder:text-admin-muted'

export function StatusBadge({ status }: { status: OrderStatus }) {
  const tone = ORDER_STATUS_TONE[status]
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] leading-5 font-semibold whitespace-nowrap"
      style={{ background: tone.bg, color: tone.fg }}
    >
      {orderStatusLabel(status)}
    </span>
  )
}

export function AdminBlank({
  tone,
  icon,
  title,
  body,
  action,
}: {
  tone?: 'err'
  icon?: ReactNode
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 px-6 py-12 text-center">
      <span
        className="grid h-12 w-12 place-items-center rounded-full"
        style={
          tone === 'err'
            ? { background: 'var(--admin-primary-subtle)', color: 'var(--admin-danger)' }
            : { background: 'var(--admin-border-soft)', color: 'var(--admin-muted)' }
        }
      >
        {icon ?? (tone === 'err' ? <AlertCircle size={22} aria-hidden /> : <Inbox size={22} aria-hidden />)}
      </span>
      <div className="text-[16px] font-semibold text-admin-ink">{title}</div>
      <p className="max-w-[360px] text-[14px] leading-normal text-admin-muted">{body}</p>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}

export function Skel({ className }: { className: string }) {
  return <span aria-hidden className={`skel-a block rounded ${className}`} />
}
