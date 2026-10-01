'use client'

import { Footer } from '@/components/layout/Footer'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { ContactBubbles } from '@/components/ui/ContactBubbles'
import { SearchOverlay } from '@/components/ui/SearchOverlay'
import { TrustBar } from '@/components/ui/TrustBar'
import { BannerSection } from '@/components/sections/BannerSection'
import { CampaignsSection } from '@/components/sections/CampaignsSection'
import { CategoryStripSection } from '@/components/sections/CategoryStripSection'
import { FeaturedProductsSection } from '@/components/sections/FeaturedProductsSection'
import { StoriesSection } from '@/components/sections/StoriesSection'
import { StoreLocationsSection } from '@/components/sections/StoreLocationsSection'
import { CATEGORIES } from '@/lib/data'
import {
  fetchBanners,
  fetchCampaigns,
  fetchCategories,
  fetchProducts,
} from '@/lib/storefront-api'
import { SWR_KEYS } from '@/lib/swr-keys'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

export default function Home() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeCatId, setActiveCatId] = useState('all')

  const { data: categoriesData = [] } = useSWR(SWR_KEYS.categories, fetchCategories)
  const { data: allProducts = [], isLoading } = useSWR(SWR_KEYS.products, fetchProducts)
  const { data: banners = [] } = useSWR(SWR_KEYS.banners, fetchBanners)
  const { data: campaignsData = [] } = useSWR(SWR_KEYS.campaigns, fetchCampaigns, {
    dedupingInterval: 60 * 1000,
  })

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
        variant="overlay"
        showLogo
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
        onSearch={() => setIsSearchOpen(!isSearchOpen)}
      />

      <BannerSection banners={banners} />

      <TrustBar />

      <SearchOverlay
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        categories={categories}
        initialProducts={featuredProducts}
      />

      <CategoryStripSection
        categories={categories}
        activeCategoryId={activeCatId}
        onCategoryChange={setActiveCatId}
      />

      <CampaignsSection campaigns={campaignsData} />

      <FeaturedProductsSection
        products={allProducts}
        loading={isLoading}
        activeCategoryId={activeCatId}
        categories={categories}
      />

      <StoriesSection />

      <StoreLocationsSection />

      <div style={{ flex: 1 }} />

      <Footer />

      <ContactBubbles />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}
