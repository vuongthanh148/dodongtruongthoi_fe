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

export const DEFAULT_BG_TONES = BG_TONES

export const FRAME_STYLES: FrameStyle[] = [
  { id: 'bronze', name: 'Khung Nau Dong' },
  { id: 'gold', name: 'Khung Vang Antique' },
  { id: 'dark', name: 'Khung Den Mun' },
  { id: 'carved', name: 'Khung Cham Khac' },
]

export const DEFAULT_FRAME_STYLES = FRAME_STYLES

export const DEFAULT_PLACE_LABELS: Record<string, string> = {
  living_room: 'Phòng khách',
  office: 'Văn phòng',
  bedroom: 'Phòng ngủ',
  dining_room: 'Phòng ăn',
  entrance: 'Hành lang / Lối vào',
}

export const DEFAULT_SPEC_LABELS: Record<string, string> = {
  material: 'Chất liệu',
  technique: 'Kỹ thuật',
  origin: 'Xuất xứ',
  style: 'Phong cách',
  warranty: 'Bảo hành',
  size: 'Kích thước',
}

export function mergeLabelOverrides<T extends { id: string; name: string }>(
  defaults: T[],
  overrides: Record<string, string>
): T[] {
  return defaults.map((entry) => {
    const override = overrides[entry.id]
    if (!override || !override.trim()) {
      return entry
    }

    return {
      ...entry,
      name: override.trim(),
    }
  })
}

// Products are now fetched from API, see src/lib/storefront-api.ts
export const PRODUCTS: Product[] = []

// Reviews are now fetched from API, see src/lib/storefront-api.ts
export const REVIEWS: Review[] = []

export const STORY_CARDS = [
  {
    eyebrow: 'ĐẾN ĐẬU TRANH',
    title: 'Một bức tranh — hai mươi ngày — ba thế hệ thợ',
    body: 'Chúng tôi vẫn giữ nguyên cách làm của cụ ông: đóng thoi nung đỏ, đập mỏng trên đe đá, gõ từng nét bằng búa gỗ mít.',
    imageSourceIndex: 0, // maps to customerPhotos[0]
    accent: 'var(--gold)',
  },
  {
    eyebrow: 'LÀNG NGHỀ',
    title: 'Làng Đại Bái — 900 năm lửa đồng',
    imageSourceIndex: 0, // maps to banners[0]
    accent: 'var(--gold)',
  },
  {
    eyebrow: 'QUÁ TRÌNH SẢN XUẤT',
    title: 'Từ đe đá đến phòng khách — hành trình của mỗi tác phẩm',
    body: 'Mỗi sản phẩm đi qua 20+ bước, từ lạc mô đến hoàn thiện, để mang đến vẻ đẹp hoàn hảo cho gia đình bạn.',
    imageSourceIndex: 1, // maps to customerPhotos[1]
    accent: 'var(--gold)',
  },
  {
    eyebrow: 'CHỨNG CHỈ QUỐC TẾ',
    title: 'Chứng nhận Bộ Công Thương — cam kết chất lượng',
    imageSourceIndex: 1, // maps to banners[1]
    accent: 'var(--gold)',
  },
]
