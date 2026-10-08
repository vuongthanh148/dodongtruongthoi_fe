'use client'

import { useState } from 'react'
import { IconBox, IconMail, IconMapPin, IconPhone, IconZalo } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { ContentPageShell } from '@/components/content/ContentPageShell'
import { MapEmbed } from '@/components/ui/MapEmbed'
import { CONTACT_COPY, CONTENT_PAGE_META } from '@/lib/content-data'
import { HOTLINE, HOTLINE_TEL, SHOP_ADDRESS, SHOP_EMAIL, SOCIAL_LINKS, STORES } from '@/lib/constants'
import { submitContactMessage } from '@/lib/storefront-api'

type ContactFieldErrors = { name?: string; phone?: string; message?: string }

const errorTextStyle: React.CSSProperties = { fontSize: 13, color: 'var(--color-error)' }
const inputStyle: React.CSSProperties = {
  height: 46,
  borderRadius: 6,
  border: '1px solid var(--border)',
  background: 'var(--bg-page)',
  padding: '0 14px',
  fontSize: 14,
  color: 'var(--text-primary)',
  outline: 'none',
}
const labelTextStyle: React.CSSProperties = { fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }

function InfoRow({
  Icon,
  label,
  value,
  strong,
}: {
  Icon: typeof IconPhone
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-2.5" style={{ padding: '14px 0', borderTop: '1px solid var(--border-soft)' }}>
      <div>
        <Icon size={18} color="var(--accent)" />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
        <div
          style={{
            fontFamily: strong ? 'var(--font-body)' : undefined,
            fontSize: strong ? 20 : 15,
            fontWeight: strong ? 700 : 400,
            color: strong ? 'var(--accent)' : 'var(--text-primary)',
            lineHeight: 1.5,
            marginTop: 2,
            fontVariantNumeric: 'tabular-nums',
            overflowWrap: 'anywhere',
          }}
        >
          {value}
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const store = STORES[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (sending) return

    const payload = { name: name.trim(), phone: phone.trim(), message: message.trim() }
    const nextErrors: ContactFieldErrors = {}
    if (!payload.name) nextErrors.name = CONTACT_COPY.nameRequired
    if (!payload.phone) nextErrors.phone = CONTACT_COPY.phoneRequired
    if (!payload.message) nextErrors.message = CONTACT_COPY.messageRequired

    setFieldErrors(nextErrors)
    setSubmitError(null)
    if (Object.keys(nextErrors).length > 0) return

    setSending(true)
    const result = await submitContactMessage(payload)
    setSending(false)

    if (result.ok) {
      setName('')
      setPhone('')
      setMessage('')
      setSent(true)
      return
    }
    setSubmitError(result.status === 400 && result.message ? result.message : CONTACT_COPY.failed)
  }

  return (
    <ContentPageShell topTitle={CONTENT_PAGE_META.contact.topTitle} crumbs={CONTENT_PAGE_META.contact.crumbs} withVisit={false}>
      <Container className="w-full pb-10 pt-4 md:pb-14 md:pt-6 lg:pb-16 xl:pb-[72px]">
        <div className="mb-5 md:mb-6 lg:mb-7 xl:mb-8">
          <h1
            className="text-[26px] md:text-[30px] lg:text-[34px] xl:text-[36px]"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, lineHeight: 1.15, margin: 0, color: 'var(--text-primary)' }}
          >
            {CONTACT_COPY.title}
          </h1>
          <p className="mt-1.5 max-w-[560px] text-sm md:text-[15px]" style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: '6px 0 0' }}>
            {CONTACT_COPY.sub}
          </p>
        </div>

        {/* Map: the embed's own marker pins the showroom; "Chỉ đường" opens directions. */}
        <div className="relative mb-5 h-[240px] md:mb-6 md:h-[300px] lg:mb-7 lg:h-[340px] xl:mb-8 xl:h-[380px]">
          <MapEmbed src={store.mapEmbedUrl} title={CONTACT_COPY.mapTitle(store.name)} height="100%" radius={10} />
          <a
            href={store.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-3 right-3 flex items-center justify-center"
            style={{ height: 40, padding: '0 16px', borderRadius: 6, background: 'var(--accent)', color: 'var(--primitive-white)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, textDecoration: 'none', boxShadow: '0 6px 16px -8px rgba(0,0,0,0.4)' }}
          >
            {CONTACT_COPY.mapAction}
          </a>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1fr)_1.3fr] md:gap-6 lg:gap-8 xl:gap-12">
          <div style={{ minWidth: 0 }}>
            <h2 className="mb-1.5 text-[22px]" style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, lineHeight: 1.2 }}>
              {CONTACT_COPY.infoTitle}
            </h2>
            <InfoRow Icon={IconPhone} label={CONTACT_COPY.hotlineLabel} value={HOTLINE.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')} strong />
            <InfoRow Icon={IconMapPin} label={CONTACT_COPY.addressLabel} value={SHOP_ADDRESS} />
            <InfoRow Icon={IconBox} label={CONTACT_COPY.hoursLabel} value={store.hours || CONTACT_COPY.hoursFallback} />
            <InfoRow Icon={IconMail} label={CONTACT_COPY.emailLabel} value={SHOP_EMAIL} />
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <a
                href={HOTLINE_TEL}
                className="flex items-center justify-center gap-2"
                style={{ height: 50, borderRadius: 6, background: 'var(--accent)', color: 'var(--primitive-white)', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}
              >
                <IconPhone size={16} color="currentColor" /> {CONTACT_COPY.call}
              </a>
              <a
                href={SOCIAL_LINKS.zalo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2"
                style={{ height: 50, borderRadius: 6, border: '1.5px solid var(--accent)', color: 'var(--accent)', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}
              >
                <IconZalo size={18} /> {CONTACT_COPY.zalo}
              </a>
            </div>
          </div>

          <div className="rounded-[10px] p-4 md:p-7" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {sent ? (
              <div className="lk-in py-6 text-center" role="status">
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 600 }}>{CONTACT_COPY.successTitle}</div>
                <div className="mt-2" style={{ fontSize: 14.5, color: 'var(--text-secondary)' }}>
                  {CONTACT_COPY.successBody}
                </div>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-4"
                  style={{ fontSize: 14, fontWeight: 500, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {CONTACT_COPY.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="mb-4 text-[22px]" style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, lineHeight: 1.2 }}>
                  {CONTACT_COPY.formTitle}
                </h2>
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <label className="flex min-w-0 flex-col gap-1.5">
                    <span style={labelTextStyle}>{CONTACT_COPY.nameLabel}</span>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={CONTACT_COPY.namePlaceholder}
                      className="brand-focus"
                      style={inputStyle}
                    />
                    {fieldErrors.name ? <span style={errorTextStyle}>{fieldErrors.name}</span> : null}
                  </label>
                  <label className="flex min-w-0 flex-col gap-1.5">
                    <span style={labelTextStyle}>{CONTACT_COPY.phoneLabel}</span>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={CONTACT_COPY.phonePlaceholder}
                      className="brand-focus"
                      style={inputStyle}
                    />
                    {fieldErrors.phone ? <span style={errorTextStyle}>{fieldErrors.phone}</span> : null}
                  </label>
                  <label className="col-span-full flex flex-col gap-1.5">
                    <span style={labelTextStyle}>{CONTACT_COPY.messageLabel}</span>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={CONTACT_COPY.messagePlaceholder}
                      rows={4}
                      className="brand-focus"
                      style={{ borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-page)', padding: 14, fontSize: 14, color: 'var(--text-primary)', outline: 'none', resize: 'none' }}
                    />
                    {fieldErrors.message ? <span style={errorTextStyle}>{fieldErrors.message}</span> : null}
                  </label>
                </div>
                {submitError ? (
                  <div role="alert" className="mt-4" style={errorTextStyle}>
                    {submitError}
                  </div>
                ) : null}
                <button
                  type="submit"
                  disabled={sending}
                  className="mt-4 h-[50px] w-full rounded-[6px] px-6 sm:w-auto"
                  style={{ background: 'var(--accent)', color: 'var(--primitive-white)', border: 'none', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.45 : 1 }}
                >
                  {sending ? CONTACT_COPY.submitting : CONTACT_COPY.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </ContentPageShell>
  )
}
