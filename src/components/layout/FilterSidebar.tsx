import { VariantSwatch } from '@/components/ui/VariantSwatch'
import { BG_TONES } from '@/lib/data'
import type { Category } from '@/lib/types'

export type PriceRangeId = 'all' | 'under-1m' | '1m-3m' | '3m-5m' | 'over-5m'
export type RatingFilterId = 'all' | '4+' | '5'

const PRICE_RANGES: { id: PriceRangeId; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'under-1m', label: 'Dưới 1 triệu' },
  { id: '1m-3m', label: '1 – 3 triệu' },
  { id: '3m-5m', label: '3 – 5 triệu' },
  { id: 'over-5m', label: 'Trên 5 triệu' },
]

const RATINGS: { id: RatingFilterId; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: '4+', label: '4★ trở lên' },
  { id: '5', label: '5★' },
]

interface FilterSidebarProps {
  categories: Category[]
  activeCategoryId: string
  onCategoryChange: (id: string) => void
  priceRange: PriceRangeId
  onPriceRangeChange: (id: PriceRangeId) => void
  ratingFilter: RatingFilterId
  onRatingFilterChange: (id: RatingFilterId) => void
  bgTone: string | null
  onBgToneChange: (tone: string | null) => void
  onClearAll: () => void
}

function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="label-mono mb-3" style={{ color: 'var(--bronze)', fontSize: 10.5 }}>
      {children}
    </div>
  )
}

export function FilterSidebar({
  categories,
  activeCategoryId,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  ratingFilter,
  onRatingFilterChange,
  bgTone,
  onBgToneChange,
  onClearAll,
}: FilterSidebarProps) {
  return (
    <aside className="sticky top-[92px] hidden w-[216px] shrink-0 lg:block xl:w-[248px]">
      <div className="flex items-center justify-between pb-1.5">
        <span className="font-[family-name:var(--font-lora)] text-lg font-semibold">Bộ lọc</span>
        <button type="button" onClick={onClearAll} className="text-[13px]" style={{ color: 'var(--accent)' }}>
          Xóa tất cả
        </button>
      </div>

      <div className="border-b py-4.5" style={{ borderColor: 'var(--border-soft)' }}>
        <GroupHeading>Danh mục</GroupHeading>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            className="flex justify-between text-left text-sm"
            style={{
              color: activeCategoryId === 'all' ? 'var(--accent)' : 'var(--text-primary)',
              fontWeight: activeCategoryId === 'all' ? 600 : 400,
            }}
          >
            <span>Tất cả</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className="flex justify-between text-left text-sm"
              style={{
                color: activeCategoryId === cat.id ? 'var(--accent)' : 'var(--text-primary)',
                fontWeight: activeCategoryId === cat.id ? 600 : 400,
              }}
            >
              <span>{cat.name}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                {cat.productCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-b py-4.5" style={{ borderColor: 'var(--border-soft)' }}>
        <GroupHeading>Khoảng giá</GroupHeading>
        <div className="flex flex-col gap-2.5">
          {PRICE_RANGES.map((item) => (
            <label key={item.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <span
                className="grid h-4 w-4 shrink-0 place-items-center rounded-[3px] text-[11px] text-white"
                style={{
                  border: priceRange === item.id ? 'none' : '1.5px solid var(--border)',
                  background: priceRange === item.id ? 'var(--accent)' : 'var(--bg-card)',
                }}
                onClick={() => onPriceRangeChange(item.id)}
              >
                {priceRange === item.id ? '✓' : ''}
              </span>
              <span className="flex-1" onClick={() => onPriceRangeChange(item.id)}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-b py-4.5" style={{ borderColor: 'var(--border-soft)' }}>
        <GroupHeading>Đánh giá</GroupHeading>
        <div className="flex flex-col gap-2.5">
          {RATINGS.map((item) => (
            <label key={item.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <span
                className="grid h-4 w-4 shrink-0 place-items-center rounded-[3px] text-[11px] text-white"
                style={{
                  border: ratingFilter === item.id ? 'none' : '1.5px solid var(--border)',
                  background: ratingFilter === item.id ? 'var(--accent)' : 'var(--bg-card)',
                }}
                onClick={() => onRatingFilterChange(item.id)}
              >
                {ratingFilter === item.id ? '✓' : ''}
              </span>
              <span className="flex-1" onClick={() => onRatingFilterChange(item.id)}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="py-4.5">
        <GroupHeading>Màu nền</GroupHeading>
        <div className="flex gap-2.5">
          {BG_TONES.map((tone) => (
            <VariantSwatch
              key={tone.id}
              tone={tone.id}
              active={bgTone === tone.id}
              size={26}
              onClick={() => onBgToneChange(bgTone === tone.id ? null : tone.id)}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}
