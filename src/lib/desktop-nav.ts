export interface DeskNavLink {
  id: string
  name: string
  href: string
  hasDropdown?: boolean
}

export interface MegaMenuItem {
  label: string
  href: string
}

export interface MegaMenuGroup {
  title: string
  badge?: string
  allLabel: string
  allHref: string
  items: MegaMenuItem[]
  note?: string
}

const search = (q: string) => `/products?q=${encodeURIComponent(q)}`

export const DESK_NAV_LINKS: DeskNavLink[] = [
  { id: 'products', name: 'Sản phẩm', href: '/categories', hasDropdown: true },
  { id: 'craft', name: 'Giới thiệu', href: '/lang-nghe' },
  { id: 'blog', name: 'Cẩm nang', href: '/cam-nang' },
  { id: 'contact', name: 'Liên hệ', href: '/lien-he' },
]

// Mega-menu taxonomy from the design handoff (desktop-shell.jsx MENU_GROUPS).
// Links to an existing API category use /categories/{id}. Sub-categories that
// the API does not have yet fall back to a product search with the design label.
export const MEGA_MENU_GROUPS: MegaMenuGroup[] = [
  {
    title: 'Tranh đồng',
    allLabel: 'Tất cả tranh đồng',
    allHref: '/categories/tranh-dong',
    items: [
      { label: 'Tranh phong thủy', href: '/categories/tranh-phong-thuy' },
      { label: 'Tranh tứ quý', href: search('Tranh tứ quý') },
      { label: 'Tranh chữ thư pháp', href: search('Tranh chữ thư pháp') },
      { label: 'Cội nguồn quê hương', href: search('Cội nguồn quê hương') },
    ],
  },
  {
    title: 'Trống đồng',
    allLabel: 'Tất cả trống đồng',
    allHref: search('trống đồng'),
    items: [
      { label: 'Mặt trống đồng', href: search('Mặt trống đồng') },
      { label: 'Quả trống đồng', href: search('Quả trống đồng') },
    ],
  },
  {
    title: 'Đồ thờ cúng',
    allLabel: 'Tất cả đồ thờ',
    allHref: '/categories/dinh-dong-tho-cung',
    items: [
      { label: 'Đỉnh đồng', href: '/categories/dinh-dong-tho-cung' },
      { label: 'Bộ tam sự · ngũ sự', href: search('Bộ tam sự ngũ sự') },
      { label: 'Hoành phi câu đối', href: search('Hoành phi câu đối') },
    ],
  },
  {
    title: 'Quà tặng',
    badge: 'Sắp có',
    allLabel: 'Xem bộ sưu tập quà',
    allHref: search('quà tặng'),
    items: [
      { label: 'Quà để bàn', href: search('Quà để bàn') },
      { label: 'Linh vật phong thủy', href: search('Linh vật phong thủy') },
      { label: 'Quà tặng doanh nghiệp', href: search('Quà tặng doanh nghiệp') },
    ],
    note: 'Đặt số lượng · khắc logo · hộp quà',
  },
]
