'use client'

import { Footer } from '@/components/layout/Footer'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { ContactBubbles } from '@/components/ui/ContactBubbles'
import { SearchOverlay } from '@/components/ui/SearchOverlay'
import { BannerSection } from '@/components/sections/BannerSection'
import { CampaignsSection } from '@/components/sections/CampaignsSection'
import { CategoryTilesSection } from '@/components/sections/CategoryTilesSection'
import { CraftBandSection } from '@/components/sections/CraftBandSection'
import { CraftDetailSection } from '@/components/sections/CraftDetailSection'
import { CustomerPhotosSection } from '@/components/sections/CustomerPhotosSection'
import { FeaturedProductsSection } from '@/components/sections/FeaturedProductsSection'
import { GiftServiceSection } from '@/components/sections/GiftServiceSection'
import { OccasionSection } from '@/components/sections/OccasionSection'
import { StoriesSection } from '@/components/sections/StoriesSection'
import { VisitBlock } from '@/components/sections/VisitBlock'
import { CATEGORIES } from '@/lib/data'
import {
  fetchBanners,
  fetchCustomerPhotos,
  fetchCategories,
  fetchProducts,
} from '@/lib/storefront-api'
import { useCampaigns } from '@/lib/use-campaigns'
import { SWR_KEYS } from '@/lib/swr-keys'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

// Home section order per HANDOFF "Home": Hero → Theo dịp → Danh mục → Chi tiết thủ công →
// Khuyến mãi → Yêu thích → Quà biếu → Làng nghề → Ảnh khách hàng → Cẩm nang → Showroom → Footer.
// Sections without data render nothing (campaigns hidden at 0).
export default function Home() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const { data: categoriesData = [] } = useSWR(SWR_KEYS.categories, fetchCategories)
  const { data: allProducts = [], isLoading } = useSWR(SWR_KEYS.products, fetchProducts)
  const { data: banners = [] } = useSWR(SWR_KEYS.banners, fetchBanners)
  const { data: campaignsData = [] } = useCampaigns()
  const { data: customerPhotos = [] } = useSWR(SWR_KEYS.customerPhotos, fetchCustomerPhotos)

  const categories = useMemo(() => {
    const catsWithCounts = categoriesData.map((cat) => ({
      ...cat,
      productCount: allProducts.filter((p) => p.categoryId === cat.id).length,
    }))
    return catsWithCounts.length > 0 ? catsWithCounts : CATEGORIES
  }, [categoriesData, allProducts])

  const featuredProducts = useMemo(() => allProducts.slice(0, 4), [allProducts])

  return (
    <div className="paper" style={{ background: 'var(--bg-page)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DeskHeader />
      <TopBar
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
        onSearch={() => setIsSearchOpen(!isSearchOpen)}
      />

      <BannerSection banners={banners} products={featuredProducts} />

      <SearchOverlay
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        categories={categories}
        initialProducts={featuredProducts}
      />

      <OccasionSection />

      <CategoryTilesSection categories={categories} />

      <CraftDetailSection />

      <CampaignsSection campaigns={campaignsData} />

      <FeaturedProductsSection
        products={allProducts}
        loading={isLoading}
        activeCategoryId="all"
        categories={categories}
      />

      <GiftServiceSection />

      <CraftBandSection />

      <CustomerPhotosSection photos={customerPhotos} />

      <StoriesSection banners={banners} customerPhotos={customerPhotos} />

      <VisitBlock />

      <div style={{ flex: 1 }} />

      <Footer />

      <ContactBubbles />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}
