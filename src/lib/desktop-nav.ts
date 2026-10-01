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
