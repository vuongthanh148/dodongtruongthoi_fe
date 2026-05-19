export type CategoryTone = 'gold' | 'red' | 'bronze' | 'dark'

export interface Category {
  id: string
  name: string
  productCount: number
  tone: CategoryTone
}

export interface VariantAttr {
  key: string
  value: string
}

export interface VariantOption {
  key: string
  label: string
  values: string[]
}

export interface LibraryImage {
  id: string
  name: string
  url: string
  cloudinary_public_id: string
  created_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_id: string
  url: string
  name: string
  sort_order: number
  attrs: VariantAttr[]
  created_at: string
}

export interface ProductSize {
  id: string
  name: string
  code: string
  price: number
}

export interface ProductSKU {
  id: string
  product_id: string
  size_code: string | null
  attrs: Record<string, string>
  price: number
  sort_order: number
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
  variantOptions: VariantOption[]
  defaultVariant: Record<string, string>
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
  skus: ProductSKU[]
}

export interface Review {
  id: string
  productId: string
  reviewerName: string
  date: string
  rating: number
  body: string
}

export interface CustomerPhoto {
  id: string
  imageUrl: string
  caption: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
}

export interface SavedProductVariant {
  productId: string
  attrs?: Record<string, string>
  sizeId?: string
}

export interface CartItem {
  productId: string
  productTitle?: string
  sizeId?: string
  sizeLabel?: string
  selectedAttrs?: Record<string, string>
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
  selectedAttrs?: Record<string, string>
  quantity: number
  unitPrice: number
  variantImageUrl?: string
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

export interface AdminProductSKU {
  id: string
  product_id: string
  size_code: string | null
  attrs: Record<string, string>
  price: number
  sort_order: number
}

export interface AdminProductImage {
  id: string
  product_id: string
  image_id: string
  url: string
  name: string
  sort_order: number
  attrs: VariantAttr[]
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
  variant_options: VariantOption[]
  default_variant: Record<string, string>
  zodiac_ids: string[]
  purpose_place: string[]
  purpose_use: string[]
  purpose_avoid: string[]
  specs: Record<string, string> | null
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
  items: AdminOrderItem[]
}

export interface AdminOrderItem {
  product_id: string
  product_title: string
  product_subtitle?: string
  size_code?: string
  size_label?: string
  selected_attrs?: Record<string, string>
  quantity: number
  unit_price: number
  variant_image_url?: string
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

export interface AdminCustomerPhoto {
  id: string
  image_url: string
  caption: string | null
  sort_order: number
  is_active: boolean
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
    selectedAttrs?: Record<string, string>
    quantity: number
    unitPrice: number
    variantImageUrl?: string
  }>
}
