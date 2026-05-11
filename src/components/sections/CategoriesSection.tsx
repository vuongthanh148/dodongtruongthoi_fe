'use client'

import Link from 'next/link'
import { ArtPiece } from '@/components/ui/ArtPiece'
import type { Category } from '@/lib/types'
import { SectionHeading } from '@/components/ui/SectionHeading'

interface CategoriesSectionProps {
  categories: Category[]
  loading: boolean
}

export function CategoriesSection({ categories, loading }: CategoriesSectionProps) {
  return (
    <section style={{ padding: '32px 16px', background: 'var(--bg-page)' }}>
      <div style={{ marginBottom: 24, paddingLeft: 0 }}>
        <SectionHeading title="Danh mục" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            style={{
              display: 'grid',
              gap: 8,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}
            >
              <ArtPiece bg={category.tone} frame="bronze" label={category.name} pad={8} aspect="1 / 1" />
            </div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{category.name}</p>
            {!loading ? (
              <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{category.productCount} sản phẩm</p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  )
}
