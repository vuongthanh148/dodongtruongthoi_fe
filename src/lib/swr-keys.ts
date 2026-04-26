export const SWR_KEYS = {
  categories: 'categories',
  category: (id: string) => `category:${id}`,
  products: 'products',
  productsByCategory: (id: string) => `products:${id}`,
  product: (id: string) => `product:${id}`,
  reviews: (productId: string) => `reviews:${productId}`,
  banners: 'banners',
  campaigns: 'campaigns',
  orders: (phone: string) => `orders:${phone}`,
  order: (id: string) => `order:${id}`,
} as const
