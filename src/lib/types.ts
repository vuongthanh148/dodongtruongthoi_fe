export type CategoryTone = 'gold' | 'red' | 'bronze' | 'dark'

export interface Category {
  id: string
  name: string
  productCount: number
  tone: CategoryTone
}

export interface ProductImage {
  id: string
  url: string
  altText: string
  bgTone: string | null
  frame: string | null
  sortOrder: number
}

export interface ProductSize {
  id: string
  name: string
  code: 's' | 'm' | 'l' | 'xl'
  price: number
}

export interface Product {
  id: string
  title: string
  subtitle: string
  categoryId: string
  badge?: 'best_seller' | 'new' | 'sale'
  rating: number
  reviewCount: number
  price: number
  discountPrice?: number
  discountLabel?: string
  defaultBg: string
  defaultFrame: string
  bgTones: string[]
  frames: string[]
  description: string
  meaning: string
  specs: Record<string, string>
  zodiacIds: string[]
  purpose: {
    place: string[]
    use: string[]
    avoid: string[]
  }
  images: ProductImage[]
  sizes: ProductSize[]
}

export interface BgTone {
  id: string
  name: string
  hex: string
}

export interface FrameStyle {
  id: string
  name: string
}

export interface Review {
  id: string
  productId: string
  reviewerName: string
  date: string
  rating: number
  body: string
}

export interface SavedProductVariant {
  productId: string
  bgTone?: string
  frame?: string
  sizeId?: string
}

export interface CartItem {
  productId: string
  sizeId?: string
  bgTone?: string
  bgToneLabel?: string
  frame?: string
  frameLabel?: string
  quantity: number
  unitPrice: number
  variantImageUrl?: string
}

export type OrderStatus =
  | 'pending_confirm'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled'

export interface Order {
  id: string
  phone: string
  customerName?: string
  address?: string
  note?: string
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  updatedAt?: string
}

export interface OrderItem {
  productId: string
  productTitle: string
  productSubtitle?: string
  sizeCode?: string
  sizeLabel?: string
  bgTone?: string
  bgToneLabel?: string
  frame?: string
  frameLabel?: string
  quantity: number
  unitPrice: number
  variantImageUrl?: string
}

export interface Order {
  id: string
  phone: string
  customerName?: string
  address?: string
  note?: string
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  updatedAt?: string
}

export interface AdminCategory {
  id: string
  name: string
  slug: string
  description: string | null
  tone: string
  image_url: string | null
  sort_order: number
  is_active: boolean
}

export interface AdminProductSize {
  id: string
  product_id: string
  size_label: string
  size_code: string
  price: number
  sort_order: number
}

export interface AdminProductImage {
  id: string
  product_id: string
  bg_tone: string | null
  frame: string | null
  url: string
  alt_text: string | null
  sort_order: number
}

export interface AdminProduct {
  id: string
  title: string
  subtitle: string | null
  category_id: string
  badge: string | null
  base_price: number
  description: string | null
  meaning: string | null
  default_bg: string
  default_frame: string
  bg_tones: string[]
  frames: string[]
  zodiac_ids: string[]
  purpose_place: string[]
  purpose_use: string[]
  purpose_avoid: string[]
  specs: Record<string, string> | null
  requires_bg_tone: boolean
  requires_frame: boolean
  requires_size: boolean
  is_active: boolean
  sort_order: number
  price: number
  discount_price?: number
  sizes: AdminProductSize[]
  images: AdminProductImage[]
  rating: number
  review_count: number
}

export interface AdminCampaign {
  id: string
  name: string
  description: string | null
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  starts_at: string
  ends_at: string
  is_active: boolean
}

export interface AdminBanner {
  id: string
  title: string | null
  subtitle: string | null
  image_url: string | null
  link_url: string | null
  sort_order: number
  is_active: boolean
}

export interface AdminContact {
  id: string
  platform: string
  label: string
  url: string
  sort_order: number
  is_active: boolean
}

export interface AdminOrder {
  id: string
  phone: string
  customer_name: string | null
  note: string | null
  status: OrderStatus
  admin_note: string | null
  total_amount: number
  created_at: string
  items: OrderItem[]
}

export interface AdminReview {
  id: string
  product_id: string
  reviewer_name: string
  rating: number
  body: string | null
  is_approved: boolean
  created_at: string
}

export interface CreateOrderRequest {
  phone: string
  customerName?: string
  address?: string
  note?: string
  items: Array<{
    productId: string
    productTitle: string
    sizeCode?: string
    sizeLabel?: string
    bgTone?: string
    bgToneLabel?: string
    frame?: string
    frameLabel?: string
    quantity: number
    unitPrice: number
    variantImageUrl?: string
  }>
}
