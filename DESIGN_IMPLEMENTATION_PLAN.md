# Design Implementation Plan — Đồ Đồng Trường Thơi

## Project Context
Vietnamese bronze art e-commerce (tranh đồng, đỉnh đồng). Mobile-first, Next.js App Router.
Stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4, inline styles via CSS tokens.
Fonts: Cormorant Garamond (headings), Be Vietnam Pro (body), Lora (italic accent), JetBrains Mono (labels).
Color tokens: `--bg-page`, `--bg-card`, `--bg-surface-alt`, `--bg-dark`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent`, `--gold`, `--bronze`, `--border`, `--border-soft`.

Read `src/app/globals.css` for all token values before editing.
Read `src/components/icons/index.ts` to see available SVG icons.

---

## Priority Order
1. **Part A** — Typography fix (80% of text is 9–13px — main readability problem)
2. **Part B** — Layout & spacing fixes
3. **Part C** — Emoji → SVG icon replacements
4. **Part D** — Search & Filter redesign (BottomSheet + SearchOverlay)

---

## Part A — Typography Fix

### Problem
- `Label` component hardcodes `fontSize: 10` — used everywhere for section labels
- Product card badge: `fontSize: 9` (JetBrains mono)
- Campaign card: `fontSize: 9` label, `fontSize: 12` body, `fontSize: 11.5` date
- Story cards: `fontSize: 12` body text
- Footer: `fontSize: 12–13` in zones 2–4
- MenuDrawer hint text: `fontSize: 12`
- `--text-muted` (#8a7761) on `--bg-surface-alt` (#ece3d1) = 3.4:1 contrast — fails WCAG AA under 18px

### Type Scale to Apply
| Old size | New size | Usage |
|----------|----------|-------|
| 9px | 11px | Badge labels (JetBrains mono, uppercase) |
| 10px | 12px | Label component (JetBrains mono, uppercase) |
| 11–11.5px | 13px | Captions, dates, secondary metadata |
| 12px | 14px | Body text (descriptions, hints, footer links) |
| 13px | 15px | Primary body, nav links |
| Keep 14–20px | unchanged | Already acceptable |

### File Changes

#### `src/components/ui/Label.tsx`
Change `fontSize: 10` → `fontSize: 12`.
No other changes needed — letter-spacing and uppercase stay.

#### `src/components/ui/ProductCard.tsx`
- Badge span: `fontSize: 9` → `fontSize: 11`
- Subtitle `<p>`: `fontSize: 11` → `fontSize: 13`; add `lineHeight: 1.4`
- Rating div: `fontSize: 10` → `fontSize: 12`

#### `src/app/page.tsx` — Campaign section (around line 535–556)
- `<Label>` with `fontSize: 9` override → remove override (Label base is now 12)
- `fontSize: 12` description `<p>` → `fontSize: 14`
- `fontSize: 12` discount label → `fontSize: 14`
- `fontSize: 11.5` date range → `fontSize: 13`

#### `src/app/page.tsx` — Story section (around line 257–295)
- Body text `fontSize: 32` heading → keep
- Body paragraph text (currently ~12px) → `fontSize: 15`, `lineHeight: 1.6`
- Any `fontSize: 11` or `12` in story cards → lift to `13–14`

#### `src/app/page.tsx` — Stores section (around line 690–710)
- Store name heading → keep (already good)
- Address/phone/hours text → ensure `fontSize: 14`, `color: 'var(--text-secondary)'` (not muted)
- `fontSize: 11` or `12` anywhere → lift to `13`

#### `src/components/layout/Footer.tsx`
- Zone 2 links: `fontSize: 13` → `fontSize: 15`
- Zone 3 contact details (email, address): `fontSize: 12` → `fontSize: 14`
- Zone 3 hotline: keep accent styling, ensure `fontSize: 15`
- Zone 4 bottom bar: `fontSize: 11` → `fontSize: 12` (minimum acceptable for legal text)
- "Báo cáo sự cố" link: `fontSize: 11` → `fontSize: 13`

#### `src/components/layout/MenuDrawer.tsx`
- Hint text under nav items: `fontSize: 12` → `fontSize: 13`
- Contact info in bottom card: `fontSize: 12` → `fontSize: 14`
- Hotline display: ensure `fontSize: 15`

#### `src/app/categories/[id]/page.tsx`
- Product count "N tác phẩm": ensure `fontSize: 14`
- Any `fontSize: 11` or `12` captions → lift to `13–14`
- Filter label text inside filter bar → ensure `fontSize: 14`

#### `src/app/products/[id]/page.tsx` (if exists)
- Section labels "VỀ TÁC PHẨM", "Ý NGHĨA PHONG THỦY" — these use `Label` component, fixed by Label fix above
- Frame thumbnail labels below thumbnails: ensure `fontSize: 13` minimum
- Tab bar labels: ensure `fontSize: 15`

### Line Height Fix
For any block of body text (descriptions, story paragraphs, FAQ answers), ensure `lineHeight: 1.6`.

---

## Part B — Layout & Spacing Fixes

### Problems Observed
1. Card grids use `gap: 10` — tight, needs breathing room
2. Section `paddingTop` is inconsistent: 22, 28, 28px — not on 8px grid
3. All homepage sections share `--bg-page` — no visual rhythm
4. No `maxWidth` container — content stretches infinitely on wide screens
5. Story + Stores sections have no visual separation from product sections

### Changes

#### `src/app/page.tsx` — Card grids
- Category grid: `gap: 10` → `gap: 14`, `padding: '0 16px'` → `padding: '0 16px'` (keep)
- Featured products grid: `gap: 10` → `gap: 14`

#### `src/app/page.tsx` — Section spacing
Standardize to 8px grid. Replace:
- `paddingTop: 22` → `paddingTop: 24`
- `paddingTop: 28` → `paddingTop: 32`

#### `src/app/page.tsx` — Section background alternation
Add `background: 'var(--bg-surface-alt)'` + `padding: '24px 0 32px'` + `margin: '32px -16px 0'` (or handle with a full-bleed wrapper) to:
- Story/CÂU CHUYỆN section → `--bg-surface-alt` background
This creates visual rhythm: page → alt → page → alt pattern.

Note: To make section go full-bleed (edge to edge), wrap content section div with negative margin hack:
```tsx
<section style={{
  background: 'var(--bg-surface-alt)',
  padding: '28px 16px 32px',
  margin: '32px 0 0',  // no negative margin needed if page has no outer padding
}}>
```

#### `src/app/categories/[id]/page.tsx`
- Product grid: `gap: 10` → `gap: 14`

#### `src/components/ui/ProductCard.tsx`
- Subtitle `<p>` — add `overflow: hidden`, `textOverflow: 'ellipsis'`, `whiteSpace: 'nowrap'`, `height: 'auto'` (remove fixed height 30px). This prevents awkward 2-line wrap in tight 2-col grid.

---

## Part C — Emoji → SVG Icons

### Problem
Emojis 📞📧📍📋 used as structural icons in Footer and homepage stores section.
ui-ux-pro-max rule: use SVG icons, not emojis.

### New Icon Files to Create
Create these 3 files matching existing icon pattern (see `src/components/icons/IconSearch.tsx` for reference):

#### `src/components/icons/IconPhone.tsx`
```tsx
interface IconProps { size?: number; color?: string }

export function IconPhone({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.92 6.92l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}
```

#### `src/components/icons/IconMail.tsx`
```tsx
interface IconProps { size?: number; color?: string }

export function IconMail({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}
```

#### `src/components/icons/IconMapPin.tsx`
```tsx
interface IconProps { size?: number; color?: string }

export function IconMapPin({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
```

#### `src/components/icons/index.ts`
Add exports:
```ts
export { IconPhone } from './IconPhone'
export { IconMail } from './IconMail'
export { IconMapPin } from './IconMapPin'
```

### Replace Emoji Usage

#### `src/components/layout/Footer.tsx`
Import `IconPhone, IconMail, IconMapPin` from `@/components/icons`.
- `📞 {HOTLINE}` → `<IconPhone size={14} color="var(--accent)" /> {HOTLINE}`
- `📧 {SHOP_EMAIL}` → `<IconMail size={14} color="var(--text-muted)" /> {SHOP_EMAIL}`
- `📍 {SHOP_ADDRESS}` → `<IconMapPin size={14} color="var(--text-muted)" /> {SHOP_ADDRESS}`
- `📋 Báo cáo sự cố` → plain text link, remove emoji (or use a small text prefix "→")

For inline icon + text, wrap in flex:
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-secondary)' }}>
  <IconMail size={14} color="var(--text-muted)" />
  {SHOP_EMAIL}
</div>
```

#### `src/app/page.tsx` — Stores section
- `📍 {store.address}` → `<IconMapPin size={13} color="var(--text-muted)" /> {store.address}`
- `📞 {store.phone}` → `<IconPhone size={13} color="var(--text-muted)" /> {store.phone}`
Wrap each in flex row div same pattern as footer.

---

## Part D — Search & Filter Redesign

### New Components to Create

#### `src/components/ui/BottomSheet.tsx`
```tsx
'use client'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}
```

Layout (always rendered, animate via transform):
```tsx
<>
  {/* Backdrop */}
  <div
    onClick={onClose}
    style={{
      position: 'fixed', inset: 0, zIndex: 70,
      background: 'rgba(20,14,9,0.55)',
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      transition: 'opacity 250ms ease',
    }}
  />
  {/* Sheet */}
  <div
    style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 71,
      background: 'var(--bg-page)',
      borderRadius: '16px 16px 0 0',
      maxHeight: '75vh',
      display: 'flex', flexDirection: 'column',
      transform: open ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 280ms cubic-bezier(0.32, 0, 0.15, 1)',
    }}
  >
    {/* Handle */}
    <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
      <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
    </div>
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px 12px', borderBottom: '1px solid var(--border-soft)' }}>
      <Heading size="sm">{title}</Heading>
      <Btn type="button" variant="ghost" size="sm" onClick={onClose} style={{ padding: 4 }}>
        <IconClose size={18} />
      </Btn>
    </div>
    {/* Content */}
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
      {children}
    </div>
    {/* Footer */}
    {footer && (
      <div style={{ padding: '12px 20px 24px', borderTop: '1px solid var(--border-soft)' }}>
        {footer}
      </div>
    )}
  </div>
</>
```

#### `src/components/ui/SearchOverlay.tsx`
```tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { IconClose, IconSearch } from '@/components/icons'
import { Btn } from '@/components/ui/Btn'
import { ProductCard } from '@/components/ui/ProductCard'
import type { Category, Product } from '@/lib/types'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
  categories: Category[]
  initialProducts: Product[]
}
```

Layout:
- Fixed full-screen, z-index 90
- Header row: `[←]` back/close + search input (auto-focused) 
- Category chips horizontal scroll row
- Results: if no query → show `initialProducts` with label "Sản phẩm nổi bật"; if query typed → filter by `title + subtitle` case-insensitive
- Empty state: "Không tìm thấy sản phẩm phù hợp"
- Products shown as compact `ProductCard` list (1 per row, horizontal card layout: image left, info right)

Auto-focus input when `open` becomes true using `useRef` + `useEffect`.

#### Modifications to `src/app/page.tsx`
1. Remove current inline search block (lines ~183–198): the `{isSearchOpen && (<div>...Input...</div>)}` block
2. Import `SearchOverlay`
3. Add `<SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} categories={categories} initialProducts={featuredProducts} />`
4. Pass `featuredProducts` — this is already loaded as state on the page

#### Modifications to `src/app/categories/[id]/page.tsx`
The filter bar (`[search] [Lọc] [↕]`) is already implemented. Enhance it:

1. Add `filterSheetOpen`, `sortSheetOpen` boolean state
2. Add `ratingFilter: 'all' | '4plus' | '5'` state (alongside existing `priceRange`)
3. Add `pendingPriceRange` + `pendingRating` staging state for the sheet (committed only on "Áp dụng")
4. Import and use `BottomSheet` for:
   - **Filter sheet**: price range pills + rating pills + "Xóa" / "Áp dụng (N sản phẩm)" footer
   - **Sort sheet**: radio-style list of sort options (selecting one immediately closes sheet)
5. Wire `[Lọc]` button → `setFilterSheetOpen(true)`; show active filter count badge on button
6. Wire `[↕]` button → `setSortSheetOpen(true)`

Filter sheet content:
```
Khoảng giá:
[Tất cả]  [Dưới 1 triệu]  [1–3 triệu]  [3–5 triệu]  [Trên 5 triệu]

Đánh giá:
[Tất cả]  [4★ trở lên]  [5★]

footer: [Xóa bộ lọc]           [Áp dụng]
```

Sort sheet content (each row is full-width tappable, closes on select):
```
● Nổi bật
○ Giá tăng dần
○ Giá giảm dần
○ Đánh giá cao nhất
```

Update `visibleProducts` useMemo to also filter by `ratingFilter`.

---

## Implementation Checklist

### Part A — Typography
- [ ] `src/components/ui/Label.tsx` — fontSize 10→12
- [ ] `src/components/ui/ProductCard.tsx` — badge 9→11, subtitle 11→13, rating 10→12
- [ ] `src/app/page.tsx` — campaign card sizes, story card body text
- [ ] `src/app/page.tsx` — stores section text sizes
- [ ] `src/components/layout/Footer.tsx` — zone 2–4 text sizes
- [ ] `src/components/layout/MenuDrawer.tsx` — hint text, contact text
- [ ] `src/app/categories/[id]/page.tsx` — captions and filter labels

### Part B — Layout
- [ ] `src/app/page.tsx` — card grid gap 10→14
- [ ] `src/app/page.tsx` — section paddingTop standardize to 24/32
- [ ] `src/app/page.tsx` — story section gets `--bg-surface-alt` background
- [ ] `src/app/categories/[id]/page.tsx` — grid gap 10→14
- [ ] `src/components/ui/ProductCard.tsx` — subtitle ellipsis overflow

### Part C — SVG Icons
- [ ] Create `src/components/icons/IconPhone.tsx`
- [ ] Create `src/components/icons/IconMail.tsx`
- [ ] Create `src/components/icons/IconMapPin.tsx`
- [ ] Export from `src/components/icons/index.ts`
- [ ] `src/components/layout/Footer.tsx` — replace 📞📧📍📋
- [ ] `src/app/page.tsx` — replace 📍📞 in stores section

### Part D — Search & Filter
- [ ] Create `src/components/ui/BottomSheet.tsx`
- [ ] Create `src/components/ui/SearchOverlay.tsx`
- [ ] `src/app/page.tsx` — replace inline search with SearchOverlay
- [ ] `src/app/categories/[id]/page.tsx` — wire filter/sort buttons to BottomSheet

---

## Verify After Implementation
1. Run `npm run build` — must pass with 0 TypeScript errors
2. Check `http://localhost:3000` — scroll full page, all text readable at arm's length
3. Check `http://localhost:3000/categories/tranh-phong-thuy` — filter/sort buttons open sheets
4. Check `http://localhost:3000/products/tranh-nui-nuoc` — section labels now 12px minimum
5. Search icon in TopBar → overlay opens with auto-focused input
6. Tap `[Lọc]` on category page → bottom sheet slides up from bottom
7. No emojis visible as icons anywhere in storefront
