import {
  fetchBanners,
  fetchCampaigns,
  fetchCategories,
  fetchCustomerPhotos,
  fetchProducts,
} from '@/lib/storefront-api'
import HomeClient from './HomeClient'

export default async function Home() {
  const [categories, products, banners, campaigns, customerPhotos] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
    fetchBanners(),
    fetchCampaigns(),
    fetchCustomerPhotos(),
  ])

  return (
    <HomeClient
      initialCategories={categories}
      initialProducts={products}
      initialBanners={banners}
      initialCampaigns={campaigns}
      initialCustomerPhotos={customerPhotos}
    />
  )
}
