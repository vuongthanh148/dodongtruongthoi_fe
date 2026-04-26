import type { BgTone, Category, FrameStyle, Product, Review } from '@/lib/types'

// Categories are fetched from API, but these are used as fallback data.
export const CATEGORIES: Category[] = [
  { id: 'tranh-phong-thuy', name: 'Tranh Phong Thủy', productCount: 0, tone: 'gold' },
  { id: 'dinh-dong-tho-cung', name: 'Đỉnh Đồng Thờ Cúng', productCount: 0, tone: 'bronze' },
  { id: 'tuong-dong-trang-tri', name: 'Tượng Đồng Trang Trí', productCount: 0, tone: 'red' },
  { id: 'do-dung-nha-bep', name: 'Đồ Dùng Nhà Bếp', productCount: 0, tone: 'bronze' },
  { id: 'phu-kien-trang-tri', name: 'Phụ Kiện Trang Trí', productCount: 0, tone: 'dark' },
  { id: 'trong-dong', name: 'Trống Đồng', productCount: 0, tone: 'gold' },
  { id: 'dia-dong', name: 'Đĩa & Mâm Đồng', productCount: 0, tone: 'bronze' },
  { id: 'quan-thu-cau-doi', name: 'Cuốn Thư Câu Đối', productCount: 0, tone: 'red' },
  { id: 'binh-hoa-dong', name: 'Bình Hoa Đồng', productCount: 0, tone: 'gold' },
  { id: 'lu-huong', name: 'Lư Hương & Đỉnh', productCount: 0, tone: 'dark' },
  { id: 'chan-den', name: 'Chân Đèn & Nến', productCount: 0, tone: 'bronze' },
  { id: 'tuong-phong-thuy', name: 'Tượng Phong Thủy', productCount: 0, tone: 'gold' },
  { id: 'tuong-phat', name: 'Tượng Phật & Bồ Tát', productCount: 0, tone: 'dark' },
]

export const BG_TONES: BgTone[] = [
  { id: 'gold', name: 'Nen Vang', hex: '#c9a961' },
  { id: 'red', name: 'Nen Do', hex: '#8b2020' },
  { id: 'bronze', name: 'Nen Nau Dong', hex: '#6b4423' },
  { id: 'dark', name: 'Nen Den Co', hex: '#1e140a' },
]

export const FRAME_STYLES: FrameStyle[] = [
  { id: 'bronze', name: 'Khung Nau Dong' },
  { id: 'gold', name: 'Khung Vang Antique' },
  { id: 'dark', name: 'Khung Den Mun' },
  { id: 'carved', name: 'Khung Cham Khac' },
]

// Products are now fetched from API, see src/lib/storefront-api.ts
export const PRODUCTS: Product[] = []

// Reviews are now fetched from API, see src/lib/storefront-api.ts
export const REVIEWS: Review[] = []
