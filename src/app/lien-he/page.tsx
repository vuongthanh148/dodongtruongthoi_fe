'use client'

import { useState } from 'react'
import { IconBox, IconMail, IconMapPin, IconPhone, IconZalo } from '@/components/icons'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { MapEmbed } from '@/components/ui/MapEmbed'
import { HOTLINE, SHOP_ADDRESS, SHOP_EMAIL, SOCIAL_LINKS, STORES } from '@/lib/constants'

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
      <div>
        <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{label}</div>
        <div
          className={strong ? 'font-[family-name:var(--font-lora)] text-xl font-bold' : ''}
          style={{
            fontSize: strong ? undefined : 15,
            color: strong ? 'var(--accent)' : 'var(--text-primary)',
            marginTop: 2,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const store = STORES[0]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <DeskHeader />
      <TopBar title="Liên hệ" onMenu={() => setIsMenuOpen(true)} />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Liên hệ' }]} />

      <Container className="w-full pb-16 pt-4 md:pt-6">
        <div className="mb-6 md:mb-8">
          <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 26, fontWeight: 600, color: 'var(--text-primary)' }} className="md:text-[32px]">
            Liên hệ
          </div>
          <div className="mt-1.5 max-w-[560px]" style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Ghé xưởng tại làng Đại Bái hoặc nhắn cho chúng tôi, phản hồi trong giờ hành chính.
          </div>
        </div>

        {/* Map */}
        <div
          className="relative mb-8 overflow-hidden rounded-lg md:mb-10 md:rounded-xl"
          style={{ height: 220, border: '1px solid var(--border)' }}
        >
          <style>{`@media (min-width: 768px) { .contact-map { height: 300px !important; } } @media (min-width: 1024px) { .contact-map { height: 340px !important; } } @media (min-width: 1280px) { .contact-map { height: 380px !important; } }`}</style>
          <div className="contact-map absolute inset-0">
            <MapEmbed src={store.mapEmbedUrl} title={`Bản đồ ${store.name}`} height="100%" radius={0} />
            <a
              href={store.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-3 right-3 flex items-center justify-center"
              style={{ height: 40, padding: '0 16px', borderRadius: 6, background: 'var(--accent)', color: 'white', fontSize: 13, textDecoration: 'none', boxShadow: '0 6px 16px -8px rgba(0,0,0,0.4)' }}
            >
              Chỉ đường →
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1fr)_1.3fr] md:gap-6 lg:gap-12">
          <div>
            <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Thông tin</div>
            <InfoRow Icon={IconPhone} label="Hotline · Zalo" value={HOTLINE.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')} strong />
            <InfoRow Icon={IconMapPin} label="Xưởng & showroom" value={SHOP_ADDRESS} />
            <InfoRow Icon={IconBox} label="Giờ mở cửa" value={store?.hours ?? 'Thứ 2 – Chủ nhật · 7:30 – 18:00'} />
            <InfoRow Icon={IconMail} label="Email" value={SHOP_EMAIL} />
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <a
                href={`tel:${HOTLINE}`}
                className="flex items-center justify-center gap-2"
                style={{ height: 50, borderRadius: 6, background: 'var(--accent)', color: 'white', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}
              >
                <IconPhone size={16} color="white" /> Gọi ngay
              </a>
              <a
                href={SOCIAL_LINKS.zalo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2"
                style={{ height: 50, borderRadius: 6, border: '1.5px solid var(--accent)', color: 'var(--accent)', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}
              >
                <IconZalo size={18} /> Zalo
              </a>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 18 }} className="md:p-7">
            {sent ? (
              <div className="lk-in text-center" style={{ padding: '24px 0' }}>
                <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 22, fontWeight: 600 }}>Đã nhận tin nhắn</div>
                <div className="mt-2" style={{ fontSize: 14.5, color: 'var(--text-secondary)' }}>
                  Chúng tôi sẽ gọi lại trong vòng 2 giờ làm việc.
                </div>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-4"
                  style={{ fontSize: 13, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Gửi tin khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Gửi tin nhắn</div>
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Họ và tên</span>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="brand-focus"
                      style={{ height: 46, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-page)', padding: '0 14px', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Số điện thoại</span>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09xx xxx xxx"
                      className="brand-focus"
                      style={{ height: 46, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-page)', padding: '0 14px', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </label>
                  <label className="col-span-full flex flex-col gap-1.5">
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Nội dung</span>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Bạn cần tư vấn sản phẩm nào, kích thước, ngân sách…"
                      rows={4}
                      className="brand-focus"
                      style={{ borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-page)', padding: 14, fontSize: 14, color: 'var(--text-primary)', outline: 'none', resize: 'none' }}
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-4.5 w-full sm:w-auto"
                  style={{ height: 50, padding: '0 24px', borderRadius: 6, background: 'var(--accent)', color: 'white', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
                >
                  Gửi tin nhắn
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
