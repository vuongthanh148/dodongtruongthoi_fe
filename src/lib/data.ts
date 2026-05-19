import type { Category, Product, Review } from '@/lib/types'

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

export const ZODIAC = [
  { id: 'ty',   name: 'Tý',   years: '1984, 1996, 2008, 2020' },
  { id: 'suu',  name: 'Sửu',  years: '1985, 1997, 2009, 2021' },
  { id: 'dan',  name: 'Dần',  years: '1986, 1998, 2010, 2022' },
  { id: 'mao',  name: 'Mão',  years: '1987, 1999, 2011, 2023' },
  { id: 'thin', name: 'Thìn', years: '1988, 2000, 2012, 2024' },
  { id: 'ty2',  name: 'Tỵ',   years: '1989, 2001, 2013, 2025' },
  { id: 'ngo',  name: 'Ngọ',  years: '1990, 2002, 2014, 2026' },
  { id: 'mui',  name: 'Mùi',  years: '1991, 2003, 2015, 2027' },
  { id: 'than', name: 'Thân', years: '1992, 2004, 2016, 2028' },
  { id: 'dau',  name: 'Dậu',  years: '1993, 2005, 2017, 2029' },
  { id: 'tuat', name: 'Tuất', years: '1994, 2006, 2018, 2030' },
  { id: 'hoi',  name: 'Hợi',  years: '1995, 2007, 2019, 2031' },
]

export const BG_TONES: { id: string; name: string; hex: string }[] = [
  { id: 'gold', name: 'Nen Vang', hex: '#c9a961' },
  { id: 'red', name: 'Nen Do', hex: '#8b2020' },
  { id: 'bronze', name: 'Nen Nau Dong', hex: '#6b4423' },
  { id: 'dark', name: 'Nen Den Co', hex: '#1e140a' },
]

export const DEFAULT_BG_TONES = BG_TONES

export const FRAME_STYLES: { id: string; name: string }[] = [
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
