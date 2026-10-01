export const SITE_NAME = 'Đồ Đồng Trường Thơi'
export const SITE_DESCRIPTION = 'Handcrafted Vietnamese bronze art and altar pieces from Dai Bai craft village.'
export const SHOP_EMAIL = 'dodongtruongthoi@gmail.com'
export const COMPANY_NAME = 'Công ty TNHH Đồ Đồng Trường Thơi'

export function buildMapDirectionsUrl(destination: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
}

// Exact pin from the showroom's Google Maps listing (Share → Embed a map).
const MAP_COORDS = '21.042698987217115,106.11652201174334'
const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.7496965895475!2d106.11652201174334!3d21.042698987217115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31350b2dd8e9a587%3A0x2bbe493048940607!2zxJDhu5IgxJDhu5JORyBN4bu4IE5HSOG7hiBUUsav4bucTkcgVEjGoEkgLSBDxqAgU-G7niAy!5e0!3m2!1sen!2ssg!4v1790614861583!5m2!1sen!2ssg'

export const STORES = [
  {
    name: 'Xưởng sản xuất & Showroom',
    address: 'Làng Đại Bái, Gia Bình, Bắc Ninh',
    phone: '0899012288',
    mapUrl: buildMapDirectionsUrl(MAP_COORDS),
    mapEmbedUrl: MAP_EMBED_SRC,
    hours: 'T2–CN: 7:30 – 18:00',
  },
] as const

// Derived from the single STORES entry so the rest of the app doesn't hand-retype these.
export const HOTLINE = STORES[0].phone
export const SHOP_ADDRESS = STORES[0].address

export const SOCIAL_LINKS = {
  zalo: 'https://zalo.me/0899012288',
  messenger: 'https://m.me/dodongtruongthoi',
  facebook: 'https://facebook.com/dodongtruongthoi',
  tiktok: 'https://tiktok.com/@dodongtruongthoi',
} as const

export const BANNER_AUTO_SCROLL_MS = 3000
export const CUSTOMER_PHOTO_AUTO_SCROLL_MS = 3600
export const FEATURED_PRODUCTS_COUNT = 4
