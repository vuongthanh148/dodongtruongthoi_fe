// Desktop mega-menu taxonomy. This is the intended grouping from the design handoff
// (docs/design_handoff_desktop_responsive/app/desktop-shell.jsx: MENU_GROUPS). The
// backend category list is currently flat and does not expose these sub-groups, so
// each item links to the best-matching /categories/[id] route for now. Replace with
// API-driven groups once the backend exposes this taxonomy.
export interface MegaMenuItem {
  id: string
  name: string
}

export interface MegaMenuGroup {
  title: string
  allLabel: string
  allHref: string
  items: MegaMenuItem[]
  badge?: string
  note?: string
}

export const MEGA_MENU_GROUPS: MegaMenuGroup[] = [
  {
    title: 'Tranh đồng',
    allLabel: 'Tất cả tranh đồng',
    allHref: '/categories/tranh-phong-thuy',
    items: [
      { id: 'tranh-phong-thuy', name: 'Tranh phong thủy' },
      { id: 'tranh-tu-quy', name: 'Tranh tứ quý' },
      { id: 'tranh-chu', name: 'Tranh chữ thư pháp' },
      { id: 'tranh-coi-nguon', name: 'Cội nguồn quê hương' },
    ],
  },
  {
    title: 'Trống đồng',
    allLabel: 'Tất cả trống đồng',
    allHref: '/categories/trong-dong',
    items: [
      { id: 'mat-trong', name: 'Mặt trống đồng' },
      { id: 'qua-trong', name: 'Quả trống đồng' },
    ],
  },
  {
    title: 'Đồ thờ cúng',
    allLabel: 'Tất cả đồ thờ',
    allHref: '/categories/dinh-dong-tho-cung',
    items: [
      { id: 'dinh-dong-tho-cung', name: 'Đỉnh đồng' },
      { id: 'tam-ngu-su', name: 'Bộ tam sự · ngũ sự' },
      { id: 'hoanh-phi', name: 'Hoành phi câu đối' },
    ],
  },
  {
    title: 'Quà tặng',
    badge: 'Sắp có',
    allLabel: 'Xem bộ sưu tập quà',
    allHref: '/categories',
    note: 'Đặt số lượng · khắc logo · hộp quà',
    items: [
      { id: 'qua-de-ban', name: 'Quà để bàn' },
      { id: 'linh-vat', name: 'Linh vật phong thủy' },
      { id: 'qua-doanh-nghiep', name: 'Quà tặng doanh nghiệp' },
    ],
  },
]

export interface DeskNavLink {
  id: string
  name: string
  href: string
  hasDropdown?: boolean
}

export const DESK_NAV_LINKS: DeskNavLink[] = [
  { id: 'products', name: 'Sản phẩm', href: '/categories', hasDropdown: true },
  { id: 'craft', name: 'Giới thiệu', href: '/lang-nghe' },
  { id: 'blog', name: 'Cẩm nang', href: '/cam-nang' },
  { id: 'contact', name: 'Liên hệ', href: '/lien-he' },
]
