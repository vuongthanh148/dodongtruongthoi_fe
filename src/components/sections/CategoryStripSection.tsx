'use client'

import { CatPill } from '@/components/ui/CatPill'
import type { Category } from '@/lib/types'

interface CategoryStripSectionProps {
  categories: Category[]
  activeCategoryId: string
  onCategoryChange: (id: string) => void
}

export function CategoryStripSection({ categories, activeCategoryId, onCategoryChange }: CategoryStripSectionProps) {
  const categoryPills = [{ id: 'all', name: 'Tất cả' }, ...categories]

  return (
    <div style={{ borderBottom: '1px solid var(--border)', padding: 0 }}>
      <div style={{ display: 'flex', overflowX: 'auto', padding: '12px 16px', gap: 8 }} className="noscroll">
        {categoryPills.map((category) => (
          <CatPill key={category.id} active={activeCategoryId === category.id} onClick={() => onCategoryChange(category.id)}>
            {category.name}
          </CatPill>
        ))}
      </div>
    </div>
  )
}
