'use client'

import { DrumMark, IconChevron, IconMapPin, IconPhone } from '@/components/icons'
import { Footer } from '@/components/layout/Footer'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Btn } from '@/components/ui/Btn'
import { Carousel } from '@/components/ui/Carousel'
import { ContactBubbles } from '@/components/ui/ContactBubbles'
import { DongsonBorder } from '@/components/ui/DongsonBorder'
import { Heading } from '@/components/ui/Heading'
import { Label } from '@/components/ui/Label'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { SearchOverlay } from '@/components/ui/SearchOverlay'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Skeleton } from '@/components/ui/Skeleton'
import { BANNER_AUTO_SCROLL_MS, CUSTOMER_PHOTO_AUTO_SCROLL_MS, STORES } from '@/lib/constants'
import { CATEGORIES } from '@/lib/data'
import {
  fetchBanners,
  fetchCampaigns,
  fetchCategories,
  fetchCustomerPhotos,
  fetchProducts
} from '@/lib/storefront-api'
import { SWR_KEYS } from '@/lib/swr-keys'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

export default function Home() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [currentCustomerPhotoIndex, setCurrentCustomerPhotoIndex] = useState(0)

  const { data: categoriesData = [] } = useSWR(SWR_KEYS.categories, fetchCategories)
  const { data: allProducts = [], isLoading } = useSWR(SWR_KEYS.products, fetchProducts)
  const { data: banners = [] } = useSWR(SWR_KEYS.banners, fetchBanners)
  const { data: campaignsData = [] } = useSWR(SWR_KEYS.campaigns, fetchCampaigns, {
    dedupingInterval: 60 * 1000, // campaigns are time-sensitive — 1 min cache
  })
  const { data: customerPhotos = [] } = useSWR(SWR_KEYS.customerPhotos, fetchCustomerPhotos)

  // Compute derived data
  const categories = useMemo(() => {
    const catsWithCounts = categoriesData.map((cat) => ({
      ...cat,
      productCount: allProducts.filter((p) => p.categoryId === cat.id).length,
    }))
    return catsWithCounts.length > 0 ? catsWithCounts : CATEGORIES
  }, [categoriesData, allProducts])

  const featuredProducts = useMemo(() => allProducts.slice(0, 4), [allProducts])

  const campaigns = useMemo(() => {
    const now = Date.now()
    return campaignsData.filter((campaign) => {
      if (!campaign.isActive) {
        return false
      }
      const startsAt = new Date(campaign.startsAt).getTime()
      const endsAt = new Date(campaign.endsAt).getTime()
      return (
        Number.isFinite(startsAt) && Number.isFinite(endsAt) && startsAt <= now && now <= endsAt
      )
    })
  }, [campaignsData])

  useEffect(() => {
    if (customerPhotos.length <= 1) {
      setCurrentCustomerPhotoIndex(0)
      return
    }

    setCurrentCustomerPhotoIndex((prev) => Math.min(prev, customerPhotos.length - 1))
  }, [customerPhotos.length])

  return (
    <div className="paper" style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <TopBar
        showLogo
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
        onSearch={() => setIsSearchOpen(!isSearchOpen)}
      />

      <SearchOverlay
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        categories={categories}
        initialProducts={featuredProducts}
      />

      <div
        style={{
          position: 'relative',
          margin: '14px 16px 0',
          borderRadius: 14,
          overflow: 'hidden',
          background: 'var(--bg-dark)',
          aspectRatio: '4/5',
        }}
      >
        {banners.length > 0 ? (
          <Carousel
            items={banners}
            currentIndex={currentBannerIndex}
            onIndexChange={setCurrentBannerIndex}
            autoScrollMs={BANNER_AUTO_SCROLL_MS}
            navColor="light"
            containerStyle={{
              position: 'relative',
              height: '100%',
            }}
            scrollContainerStyle={{
              height: '100%',
              touchAction: 'pan-y',
            }}
            renderItem={(banner) => (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${banner.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(20,14,9,0.25) 0%, transparent 40%, rgba(20,14,9,0.75) 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '28px 22px',
                  }}
                >
                  <div />
                  <div style={{ color: 'var(--text-on-dark)' }}>
                    {banner.title && (
                      <Heading
                        as="h2"
                        size="xl"
                        color="var(--text-on-dark)"
                        style={{
                          fontWeight: 500,
                          marginBottom: 8,
                          textWrap: 'balance',
                          fontSize: 32,
                        }}
                      >
                        {banner.title}
                      </Heading>
                    )}
                    {banner.subtitle && (
                      <div
                        style={{
                          fontSize: 14,
                          lineHeight: 1.55,
                          marginBottom: 16,
                          maxWidth: 280,
                          color: 'rgba(244,237,224,0.75)',
                        }}
                      >
                        {banner.subtitle}
                      </div>
                    )}
                    {banner.linkUrl && (
                      <Btn
                        type="button"
                        size="lg"
                        onClick={() => {
                          const nextHref = banner.linkUrl?.trim()
                          if (!nextHref || nextHref === 'null' || nextHref === 'undefined') {
                            return
                          }
                          router.push(nextHref)
                        }}
                        style={{ padding: '11px 20px' }}
                        icon={<IconChevron size={14} color="white" />}
                      >
                        Xem chi tiết
                      </Btn>
                    )}
                  </div>
                </div>
              </div>
            )}
          />
        ) : (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at 30% 30%, rgba(255,200,120,0.25), transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(139,30,30,0.3), transparent 60%), linear-gradient(135deg, var(--bg-dark) 0%, var(--primitive-ink-950) 100%)',
              }}
            />

            <div
              style={{
                position: 'absolute',
                left: 14,
                top: 14,
                right: 14,
                bottom: 14,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                background:
                  'repeating-linear-gradient(45deg, rgba(201,169,97,0.10) 0 8px, rgba(201,169,97,0.02) 8px 16px)',
              }}
            >
              <div style={{ textAlign: 'left', width: '100%' }}>
                <Label
                  color="gold"
                  style={{
                    fontSize: 11,
                    color: 'rgba(201,169,97,0.6)',
                    letterSpacing: '0.15em',
                    marginBottom: 20,
                    paddingInline: 12,
                  }}
                >
                  [ hero-photo.jpg - anh nghe nhan go dong, lang Dai Bai ]
                </Label>
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                inset: 0,
                padding: '28px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background:
                  'linear-gradient(180deg, rgba(20,14,9,0.25) 0%, transparent 40%, rgba(20,14,9,0.85) 100%)',
              }}
            >
              <div style={{ alignSelf: 'flex-start' }}>
                <Label
                  color="gold"
                  style={{
                    fontSize: 12,
                    letterSpacing: '0.2em',
                  }}
                >
                  Làng nghề · Est. 1968
                </Label>
              </div>
              <div>
                <Heading
                  as="h1"
                  size="xl"
                  color="var(--text-on-dark)"
                  style={{
                    fontWeight: 500,
                    lineHeight: 1.05,
                    marginBottom: 8,
                    textWrap: 'balance',
                    fontSize: 32,
                  }}
                >
                  Tinh hoa
                  <br />
                  đồng Việt
                  <br />
                  <i
                    style={{
                      fontFamily: 'var(--font-lora), serif',
                      fontWeight: 400,
                      fontSize: 20,
                      color: 'var(--gold)',
                    }}
                  >
                    - gõ bằng tay, thổi hồn bằng tâm
                  </i>
                </Heading>
                <div
                  style={{
                    color: 'var(--text-on-dark-muted)',
                    fontSize: 14,
                    lineHeight: 1.55,
                    marginBottom: 16,
                    maxWidth: 280,
                  }}
                >
                  Hơn bốn thập kỷ, nghệ nhân làng Đại Bái gửi gắm vào từng nét chạm. Mỗi bức tranh
                  là một câu chuyện.
                </div>
                <Btn
                  type="button"
                  size="lg"
                  onClick={() =>
                    router.push(`/categories/${categories[0]?.id || 'tranh-phong-thuy'}`)
                  }
                  style={{ padding: '11px 20px' }}
                  icon={<IconChevron size={14} color="white" />}
                >
                  Xem bộ sưu tập
                </Btn>
              </div>
            </div>
          </>
        )}
      </div>

      {customerPhotos.length > 0 ? (
        <section
          style={{
            background: 'var(--bg-page)',
            color: 'var(--text-primary)',
            padding: '24px 0 30px',
            marginTop: 16,
            borderTop: '1px solid rgba(138, 108, 58, 0.25)',
            borderBottom: '1px solid rgba(138, 108, 58, 0.2)',
          }}
        >
          <div style={{ padding: '0 16px', marginBottom: 12 }}>
            <Label
              color="gold"
              style={{
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              Khách hàng
            </Label>
            <Heading as="h2" size="md" color="var(--text-primary)">
              Tranh trong nhà khách hàng
            </Heading>
            <div
              style={{
                fontSize: 13,
                color: 'var(--text-secondary)',
                marginTop: 6,
                lineHeight: 1.6,
              }}
            >
              Hình ảnh thực tế từ không gian sống của khách hàng trên toàn quốc.
            </div>
          </div>

          <div style={{ padding: '0 16px' }}>
            <Carousel
              items={customerPhotos}
              currentIndex={currentCustomerPhotoIndex}
              onIndexChange={setCurrentCustomerPhotoIndex}
              autoScrollMs={CUSTOMER_PHOTO_AUTO_SCROLL_MS}
              navColor="dark"
              showDots={false}
              containerStyle={{
                position: 'relative',
              }}
              scrollContainerStyle={{
                touchAction: 'pan-y',
              }}
              renderItem={(photo) => (
                <article
                  style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid var(--border-soft)',
                    background: 'var(--primitive-ivory-300)',
                    aspectRatio: '16 / 9',
                    boxShadow: '0 10px 28px rgba(55, 34, 17, 0.16)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${photo.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.04) 20%, rgba(25,16,10,0.48) 100%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 12,
                      right: 12,
                      bottom: 12,
                      fontSize: 13,
                      color: 'var(--text-on-dark)',
                      lineHeight: 1.5,
                      background: 'rgba(43, 24, 12, 0.45)',
                      border: '1px solid rgba(255, 238, 218, 0.25)',
                      borderRadius: 8,
                      padding: '7px 9px',
                      backdropFilter: 'blur(2px)',
                    }}
                  >
                    {photo.caption || 'Không gian thực tế của khách hàng'}
                  </div>
                </article>
              )}
            />
          </div>
        </section>
      ) : null}

      <DongsonBorder className="mx-4 mt-6" />

      <section style={{ paddingTop: 24 }}>
        <SectionHeading eyebrow="Danh mục" title="Chọn theo sản phẩm" />
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '0 16px' }}
        >
          {isLoading
            ? [0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <Skeleton style={{ aspectRatio: '16/10', borderRadius: 8 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Skeleton style={{ height: 16, flex: 1 }} />
                    <Skeleton style={{ height: 16, width: 30 }} />
                  </div>
                </div>
              ))
            : categories.map((category) => (
                <article
                  key={category.id}
                  onClick={() => router.push(`/categories/${category.id}`)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    cursor: 'pointer',
                  }}
                >
                  <ArtPiece
                    bg={category.tone}
                    frame="bronze"
                    label={category.name}
                    pad={4}
                    aspect="16/10"
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginTop: 2,
                    }}
                  >
                    <Heading as="h3" size="sm" style={{ fontSize: 14.5, lineHeight: 1.15 }}>
                      {category.name}
                    </Heading>
                    <div
                      style={{
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: 13,
                        color: 'var(--text-muted)',
                      }}
                    >
                      {String(category.productCount).padStart(2, '0')}
                    </div>
                  </div>
                </article>
              ))}
        </div>
      </section>

      {campaigns.length > 0 ? (
        <section style={{ paddingTop: 32 }}>
          <SectionHeading eyebrow="Ưu đãi" title="Sự kiện & khuyến mãi" />
          <div style={{ display: 'grid', gap: 10, padding: '0 16px' }}>
            {campaigns.map((campaign) => {
              const discountLabel =
                campaign.discountType === 'percentage'
                  ? `Giảm ${campaign.discountValue}%`
                  : `Giảm ${campaign.discountValue.toLocaleString('vi-VN')}đ`

              return (
                <article
                  key={campaign.id}
                  style={{
                    borderRadius: 10,
                    padding: '16px 14px',
                    background:
                      'linear-gradient(135deg, rgba(139,30,30,0.96) 0%, rgba(106,21,21,0.98) 60%, rgba(74,10,10,1) 100%)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <Label color="gold" style={{ marginBottom: 8 }}>
                    ƯU ĐÃI
                  </Label>
                  <Heading as="h3" size="sm" color="white" style={{ marginBottom: 4 }}>
                    {campaign.name}
                  </Heading>
                  {campaign.description ? (
                    <p
                      style={{
                        margin: '0 0 10px',
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: 'rgba(255,255,255,0.84)',
                      }}
                    >
                      {campaign.description}
                    </p>
                  ) : null}
                  <div
                    style={{ fontSize: 14, color: 'var(--gold)', fontWeight: 600, marginBottom: 8 }}
                  >
                    {discountLabel}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 10 }}>
                    {new Date(campaign.startsAt).toLocaleDateString('vi-VN')} -{' '}
                    {new Date(campaign.endsAt).toLocaleDateString('vi-VN')}
                  </div>
                  <Btn
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(`/categories/${categories[0]?.id || 'tranh-phong-thuy'}`)
                    }
                    style={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    Xem ưu đãi
                  </Btn>
                </article>
              )
            })}
          </div>
        </section>
      ) : null}

      <section style={{ paddingTop: 32 }}>
        <SectionHeading
          eyebrow="Nổi bật"
          title="Được chọn nhiều nhất"
          action="Xem tất cả"
          onActionClick={() =>
            router.push(`/categories/${categories[0]?.id || 'tranh-phong-thuy'}`)
          }
        />
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '0 16px' }}
        >
          {isLoading ? (
            [0, 1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                noInnerPadding
                onOpen={(bgTone) =>
                  router.push(`/products/${product.id}${bgTone ? `?bgTone=${bgTone}` : ''}`)
                }
              />
            ))
          ) : (
            <p
              style={{
                gridColumn: '1/-1',
                fontSize: 13,
                color: 'var(--text-muted)',
                padding: '20px 0',
              }}
            >
              Chưa có sản phẩm nổi bật.
            </p>
          )}
        </div>
      </section>

      {/* Story carousel section */}
      <section
        style={{
          background: 'var(--bg-surface-alt)',
          padding: '24px 0 32px',
          margin: '32px 0 0',
        }}
      >
        <div style={{ padding: '0 16px', marginBottom: 12 }}>
          <Label style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>Câu chuyện</Label>
        </div>
        <div
          style={{ display: 'flex', gap: 10, padding: '0 16px', overflowX: 'auto' }}
          className="noscroll"
        >
          {(() => {
            const stories = [
              {
                eyebrow: 'ĐẾN ĐẬU TRANH',
                title: 'Một bức tranh — hai mươi ngày — ba thế hệ thợ',
                body: 'Chúng tôi vẫn giữ nguyên cách làm của cụ ông: đóng thoi nung đỏ, đập mỏng trên đe đá, gõ từng nét bằng búa gỗ mít.',
                image: customerPhotos.length > 0 ? customerPhotos[0]?.imageUrl : undefined,
                accent: 'var(--gold)',
              },
              {
                eyebrow: 'LÀNG NGHỀ',
                title: 'Làng Đại Bái — 900 năm lửa đồng',
                image: banners.length > 0 ? banners[0]?.imageUrl : undefined,
                accent: 'var(--gold)',
              },
              {
                eyebrow: 'QUÁ TRÌNH SẢN XUẤT',
                title: 'Từ đe đá đến phòng khách — hành trình của mỗi tác phẩm',
                body: 'Mỗi sản phẩm đi qua 20+ bước, từ lạc mô đến hoàn thiện, để mang đến vẻ đẹp hoàn hảo cho gia đình bạn.',
                image: customerPhotos.length > 1 ? customerPhotos[1]?.imageUrl : undefined,
                accent: 'var(--gold)',
              },
              {
                eyebrow: 'CHỨNG CHỈ QUỐC TẾ',
                title: 'Chứng nhận Bộ Công Thương — cam kết chất lượng',
                image: banners.length > 1 ? banners[1]?.imageUrl : undefined,
                accent: 'var(--gold)',
              },
            ]

            return stories.map((story, idx) => {
              const hasImage = !!story.image
              return (
                <div
                  key={idx}
                  onClick={() => router.push('/lang-nghe')}
                  style={{
                    position: 'relative',
                    backgroundImage: hasImage ? `url(${story.image})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: hasImage ? undefined : 'var(--bg-dark)',
                    borderRadius: 10,
                    overflow: 'hidden',
                    aspectRatio: hasImage ? '3/4' : undefined,
                    flex: hasImage ? '0 0 72%' : '0 0 82%',
                    cursor: 'pointer',
                    padding: hasImage ? undefined : '22px 18px',
                    color: 'var(--text-on-dark)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: hasImage ? 'flex-end' : 'space-between',
                  }}
                >
                  {hasImage && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '20px 16px 16px',
                        background:
                          'linear-gradient(to top, rgba(20,14,9,0.92) 0%, rgba(20,14,9,0.6) 60%, transparent 100%)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          letterSpacing: '0.2em',
                          color: story.accent,
                          marginBottom: 6,
                        }}
                      >
                        {story.eyebrow}
                      </div>
                      <Heading
                        as="h3"
                        size="sm"
                        style={{
                          fontSize: 15,
                          color: 'var(--text-on-dark)',
                          fontWeight: 500,
                          lineHeight: 1.2,
                        }}
                      >
                        {story.title}
                      </Heading>
                      <div
                        style={{
                          fontSize: 13,
                          color: story.accent,
                          marginTop: 8,
                        }}
                      >
                        →
                      </div>
                    </div>
                  )}
                  {!hasImage && (
                    <>
                      <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.08 }}>
                        <DrumMark size={100} color="var(--gold)" />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <div
                          style={{
                            fontSize: 10,
                            letterSpacing: '0.2em',
                            color: story.accent,
                            marginBottom: 8,
                            textTransform: 'uppercase',
                          }}
                        >
                          {story.eyebrow}
                        </div>
                        <Heading
                          as="h3"
                          size="sm"
                          color="var(--text-on-dark)"
                          style={{
                            fontSize: 16,
                            fontWeight: 500,
                            lineHeight: 1.2,
                            marginBottom: 10,
                          }}
                        >
                          {story.title}
                        </Heading>
                        {story.body && (
                          <p
                            style={{
                              fontSize: 15,
                              lineHeight: 1.6,
                              color: 'rgba(244,237,224,0.7)',
                              margin: '0 0 12px 0',
                            }}
                          >
                            {story.body}
                          </p>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: story.accent, fontStyle: 'italic' }}>
                        →
                      </div>
                    </>
                  )}
                </div>
              )
            })
          })()}
        </div>
      </section>

      {/* Stores/Map section */}
      <section style={{ paddingTop: 32 }}>
        <div style={{ padding: '0 16px', marginBottom: 12 }}>
          <Label style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Hệ thống cửa hàng
          </Label>
        </div>
        <div style={{ display: 'grid', gap: 10, padding: '0 16px' }}>
          {STORES.map((store, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                border: '1px solid var(--border-soft)',
                borderRadius: 10,
                padding: '16px 14px',
              }}
            >
              <Heading as="h3" size="sm" style={{ marginBottom: 6, fontSize: 14 }}>
                {store.name}
              </Heading>
              <div
                style={{
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  marginBottom: 8,
                  lineHeight: 1.5,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IconMapPin size={13} color="var(--text-muted)" />
                  {store.address}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IconPhone size={13} color="var(--text-muted)" />
                  {store.phone}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {store.hours}
                </div>
              </div>
              <Btn
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(store.mapUrl, '_blank')}
                style={{
                  fontSize: 13,
                  padding: '6px 12px',
                  width: '100%',
                }}
              >
                Chỉ đường →
              </Btn>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      <div style={{ height: 94 }} />

      <ContactBubbles />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}
