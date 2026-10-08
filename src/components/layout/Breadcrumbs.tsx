import Link from 'next/link'
import { IconChevron } from '@/components/icons'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dodongtruongthoi.com'

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav
        aria-label="Breadcrumb"
        className="mx-auto hidden w-full max-w-[1344px] px-6 py-4 md:block lg:px-8 lg:py-5"
      >
        <ol className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--text-muted-strong)]">
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            return (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <IconChevron size={12} color="var(--text-muted)" />}
                {isLast || !item.href ? (
                  <span aria-current={isLast ? 'page' : undefined} className="text-[var(--text-primary)]">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-[var(--accent)]">
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
