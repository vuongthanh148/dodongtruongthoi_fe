'use client'

import { CatPill } from '@/components/ui/CatPill'
import { Container } from '@/components/layout/Container'
import type { Category } from '@/lib/types'

interface CategoryStripSectionProps {
  categories: Category[]
  activeCategoryId: string
  onCategoryChange: (id: string) => void
}

export function CategoryStripSection({ categories, activeCategoryId, onCategoryChange }: CategoryStripSectionProps) {
  const categoryPills = [{ id: 'all', name: 'Tất cả' }, ...categories]

  return (
    <>
      <div style={{ borderBottom: '1px solid var(--border)', padding: 0 }} className="md:hidden">
        <div style={{ display: 'flex', overflowX: 'auto', padding: '12px 16px', gap: 8 }} className="noscroll">
          {categoryPills.map((category) => (
            <CatPill key={category.id} active={activeCategoryId === category.id} onClick={() => onCategoryChange(category.id)}>
              {category.name}
            </CatPill>
          ))}
        </div>
      </div>

      <Container>
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 py-5">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className="flex items-center gap-3 rounded-[10px] border p-3.5 text-left"
              style={{
                background: 'var(--bg-card)',
                borderColor: activeCategoryId === category.id ? 'var(--accent)' : 'var(--border)',
              }}
            >
              <div className="h-[52px] w-[52px] shrink-0 rounded-lg" style={{ background: 'var(--bronze)' }} />
              <div>
                <div className="font-[family-name:var(--font-lora)] text-[15px] font-semibold">
                  {category.name}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {category.productCount} sản phẩm
                </div>
              </div>
            </button>
          ))}
        </div>
      </Container>
    </>
  )
}
