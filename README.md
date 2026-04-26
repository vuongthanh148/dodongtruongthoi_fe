# Đồ Đồng Trường Thơi — Frontend

Handcrafted Vietnamese bronze paintings (tranh đồng) and urns (đỉnh đồng) — mobile-first e-commerce storefront + admin CMS.

**Status:** Phase 1-3 Complete ✅ All pages built, integrated with backend, deployed locally

---

## Quick Start

### Prerequisites
- Node.js 18+
- Backend running on `http://localhost:8080`

### Run
```bash
npm install
npm run dev
```
→ `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

---

## Stack

- **Next.js 16** (App Router, Server Components)
- **React 19**
- **TypeScript 5** (strict mode)
- **Tailwind CSS v4** (`@import "tailwindcss"`, `@theme inline`)
- **Fonts:** Cormorant Garamond, Be Vietnam Pro, Lora, JetBrains Mono

---

## Architecture

### Three-Layer Color System
All colors in `src/app/globals.css` — no `tailwind.config.js`:
1. **Primitives:** `--primitive-ivory-*`, `--primitive-crimson-*`, etc. (raw hex)
2. **Brand Tokens:** `--accent`, `--gold`, `--bg-page`, etc. (semantic, expose to Tailwind)
3. **Themes:** `[data-theme="tet"]`, `[data-theme="independence"]`, etc. (override Layer 2)

Result: Add new seasonal theme in CSS only — zero component changes.

### Server-Side Theme
`layout.tsx` fetches active theme from BE:
```typescript
const activeTheme = await fetch('http://localhost:8080/api/v1/settings').then(...)
<html data-theme={activeTheme}>
```
✅ No flash of wrong theme

### Content Strategy
- **UI strings** (nav, buttons, labels): Hardcoded Vietnamese in `.tsx`
- **Business data** (products, categories): Fetched from API
- **Code identifiers** (CSS vars, TypeScript types): English only

---

## Project Structure

```
src/
├── app/
│   ├── globals.css                (color system, all themes, CSS helpers)
│   ├── layout.tsx                 (fonts, server-side theme fetch)
│   ├── page.tsx                   (home)
│   ├── categories/[id]/page.tsx
│   ├── products/[id]/page.tsx
│   ├── cart/page.tsx
│   ├── saved/page.tsx             (wishlist)
│   ├── orders/page.tsx            (phone lookup)
│   └── admin/
│       ├── login/page.tsx
│       ├── page.tsx               (dashboard)
│       ├── products/...           (CRUD)
│       ├── categories/...
│       ├── campaigns/...
│       ├── banners/...
│       ├── settings/page.tsx      (theme switcher)
│
├── components/
│   ├── icons/                     (16 SVG icons)
│   ├── ui/
│   │   ├── ArtPiece.tsx           (CSS gradient placeholder)
│   │   ├── ProductCard.tsx        (grid card)
│   │   ├── VariantSwatch.tsx      (color selector)
│   │   ├── SectionHeading.tsx     (title + divider)
│   │   ├── DongsonBorder.tsx      (ornamental border)
│   │   ├── ContactBubbles.tsx     (floating social FAB)
│   └── layout/
│       ├── TopBar.tsx
│       ├── MenuDrawer.tsx
│       └── Footer.tsx
│
└── lib/
    ├── types.ts                   (interfaces)
    ├── data.ts                    (mock data)
    ├── image.ts                   (imgUrl, pickVariantImage)
    ├── themes.ts                  (THEMES constant)
    ├── api.ts                     (API client)
    ├── storage.ts                 (localStorage)
    └── constants.ts
```

---

## Key Features

### Mobile-First Design
- 390px breakpoint optimized
- Responsive grid/flex layouts
- Touch-friendly buttons

### Dynamic Theming
4 themes stored in `src/lib/themes.ts`:
- Default (crimson + gold)
- Lunar New Year (scarlet + amber)
- Independence Day (patriotic red)
- Labor Day (warm red + amber)

Switch in `/admin/settings` → backend updates → FE re-fetches on next load

### Product Variants
Required variant guard prevents add-to-cart:
```typescript
if (product.requiresBgTone && !bgTone) return false
if (product.requiresFrame && !frame) return false
if (product.requiresSize && !sizeCode) return false
```

### Variant-Aware Images
Waterfall resolution (FE `pickVariantImage()`):
1. Exact (bg_tone, frame) match
2. Same bg_tone, any frame
3. General product image
4. CSS gradient fallback

### Hybrid Wishlist
- localStorage by default (anon customers)
- Syncs to DB once phone provided
- Retrieves from server on return visit

### Campaign Discounts
BE computes at query time (always current):
- Shows original + discounted price
- No stale data
- Badge shows discount type

---

## Admin CMS

### Overview
Complete content management system for managing products, categories, banners, contacts, campaigns, orders, and reviews. Built with React hooks, TypeScript, and a lightweight admin UI.

**Key Features:**
- ✅ Toast notifications (Sonner)
- ✅ Loading states on all pages
- ✅ Mobile-optimized orders page
- ✅ Campaign product picker
- ✅ Category name resolution in tables
- ✅ Error handling on all CRUD operations

### Access Admin CMS

| Page | URL | Purpose |
|------|-----|---------|
| Login | `/admin/login` | Authenticate |
| Dashboard | `/admin` | Overview |
| Products | `/admin/products` | CRUD products, manage variants |
| Categories | `/admin/categories` | CRUD categories |
| Banners | `/admin/banners` | CRUD home page banners |
| Contacts | `/admin/contacts` | CRUD social links & hotline |
| **Orders** | `/admin/orders` | View orders, update status (mobile-friendly ⭐) |
| Reviews | `/admin/reviews` | Approve/reject customer reviews |
| Campaigns | `/admin/campaigns` | Create discounts, assign products ⭐ |
| Settings | `/admin/settings` | Switch theme |

**Login Credentials:**
```
Username: admin
Password: admin123
```

### Features in Detail

#### 1. Products Management (`/admin/products`)
- **List all products** with table view
- **Category names resolved** (shows name, not ID) via parallel API fetch
- **Loading state** while fetching
- **Toast notifications** on create/update/delete
- **Click "Edit"** → form at `/admin/products/{id}`
- **Click "Delete"** → soft delete with confirmation

#### 2. Categories Management (`/admin/categories`)
- **Inline form** at top + table below
- **Create/Update/Delete** without page reload
- **Fields:** ID, name, slug, tone, image URL, sort order, active status
- **Toast feedback** on save/delete
- **Loading state** while fetching

#### 3. Banners Management (`/admin/banners`)
- **Card-based layout** instead of table
- **Create/Update/Delete** in modal form
- **Fields:** title, subtitle, image URL, link URL, sort order
- **Toast notifications** on operations
- **Used in:** Home page carousel

#### 4. Contacts Management (`/admin/contacts`)
- **Social platforms:** Zalo, Messenger, Facebook, TikTok, Phone, Email
- **Inline CRUD** form
- **Fields:** platform, label, URL, sort order
- **Used in:** Footer floating bubble + menu drawer

#### 5. Orders Management (`/admin/orders`) ⭐ Mobile-Friendly
- **Status filtering:** All, Pending, Confirmed, Processing, Shipped, Completed, Cancelled
- **Per-order card** showing:
  - Order ID
  - Customer phone + name
  - Creation timestamp
  - Total amount (bold, red)
  - Item list with qty × unit price
- **Status update:** Dropdown + admin note textarea
- **Toast notifications** on status change
- **Mobile layout:**
  - Sidebar collapses to hamburger menu on <768px
  - Order cards stretch full-width
  - Controls remain tappable

#### 6. Reviews Management (`/admin/reviews`)
- **Filter tabs:** All / Pending / Approved
- **Table view** with:
  - Reviewer name
  - Product name
  - Star rating (★☆)
  - Comment (truncated to 2 lines)
  - Status badge (color-coded)
  - Date
- **Actions:** Approve / Reject / Delete
- **Toast notifications** on approve/disapprove/delete

#### 7. Campaigns Management (`/admin/campaigns`) ⭐ New Feature
- **Create/Update/Delete** campaigns
- **Fields:** name, description, discount type (% or fixed), value, start date, end date, active status
- **Product Assignment:**
  - Click **"Products"** button on any campaign row
  - Modal opens with checkbox list of all products
  - Search/scroll to find products
  - **"Save Products"** button calls `PUT /campaigns/{id}/products`
  - Toast confirms save
- **Used for:** Homepage discount badges + price overrides

#### 8. Settings (`/admin/settings`)
- **Theme switcher** with radio buttons
- **4 themes:**
  - Default (crimson + gold)
  - Tet (scarlet + amber)
  - Independence Day (patriotic)
  - Labor Day (warm)
- **Change theme** → API updates → FE re-fetches on reload

### Components

**Admin Layout Components:**
```
src/components/admin/
├── AdminLayout.tsx        (NEW) - Wraps pages with Toaster provider
├── AdminFrame.tsx         - Main sidebar + header layout
│                          - Mobile: hamburger menu overlay
├── AdminGuard.tsx         - Client-side auth protection
```

**Shared UI:**
```
src/lib/
├── admin-api.ts          - `adminGet`, `adminPost`, `adminPut`, `adminDelete`, `adminUpload`
├── admin-auth.ts         - Token storage helpers
├── format.ts             - `formatVnd()`, `formatPhone()`
```

### Toast Notifications

All CRUD operations show feedback:
```typescript
import { toast } from 'sonner'

// On success
toast.success('Product created')  // Green, auto-closes 3s

// On error
toast.error('Failed to save')     // Red, auto-closes 3s
```

Notifications appear in **bottom-right** with animation. Multiple toasts stack.

### Loading States

All list pages show "Loading {entity}..." while fetching:
```typescript
const [loading, setLoading] = useState(true)

{loading ? (
  <p>Loading products...</p>
) : (
  <table>...</table>
)}
```

### API Integration

**Base URL:** `http://localhost:8080/api/v1/admin`

**Auth:** Bearer token from `POST /login`

**Helper functions** in `src/lib/admin-api.ts`:
```typescript
await adminGet<T>(path)                    // GET with Authorization header
await adminPost<T>(path, body)             // POST JSON
await adminPut<T>(path, body)              // PUT JSON
await adminDelete(path)                    // DELETE
await adminUpload<T>(path, formData)       // POST FormData (no Content-Type)
```

**Endpoints Available:**
```
POST   /login                              → { token }
GET    /products, /products/{id}
POST   /products
PUT    /products/{id}
DELETE /products/{id}
POST   /products/{id}/images               → FormData
DELETE /products/{id}/images/{imgId}
PUT    /products/{id}/sizes                → { sizes: [...] }

GET    /categories, /categories/{id}
POST   /categories
PUT    /categories/{id}
DELETE /categories/{id}

GET    /banners, /banners/{id}
POST   /banners
PUT    /banners/{id}
DELETE /banners/{id}

GET    /contacts, /contacts/{id}
POST   /contacts
PUT    /contacts/{id}
DELETE /contacts/{id}

GET    /orders, /orders?status={status}, /orders/{id}
PUT    /orders/{id}/status                 → { status, adminNote }

GET    /reviews, /reviews?approved={bool}
PUT    /reviews/{id}                       → { isApproved }
DELETE /reviews/{id}

GET    /campaigns, /campaigns/{id}
POST   /campaigns
PUT    /campaigns/{id}
DELETE /campaigns/{id}
PUT    /campaigns/{id}/products            → { product_ids: [...] }

GET    /settings
PUT    /settings                           → { key: value, ... }
```

### Mobile Support

Only **Orders page** is mobile-responsive (requirement):
- Sidebar hides on <768px viewport
- Hamburger menu (☰) opens overlay sidebar
- Order cards full-width, tappable
- All controls remain accessible

Other CMS pages are **desktop-only**.

### Code Structure

**Pattern:** Each admin page is a `'use client'` component with:
1. State for rows, editing, form, loading
2. `useEffect` to load data on mount
3. CRUD handlers (create, update, delete)
4. JSX with loading state → table/form

**Example:**
```typescript
'use client'

export default function AdminProductsPage() {
  const [rows, setRows] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    const data = await adminGet<AdminProduct[]>('/products')
    setRows(data ?? [])
    setLoading(false)
  }

  async function handleDelete(id: string) {
    const ok = await adminDelete(`/products/${id}`)
    if (ok) {
      toast.success('Product deleted')
      loadProducts()
    } else {
      toast.error('Failed to delete')
    }
  }

  return (
    <AdminLayout title="Products" subtitle="...">
      {/* Form here */}
      {loading ? <p>Loading...</p> : <table>{/* rows */}</table>}
    </AdminLayout>
  )
}
```

### Testing Admin APIs

**Test login + all endpoints:**
```bash
#!/bin/bash
TOKEN=$(curl -s http://localhost:8080/api/v1/admin/login \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r .data.token)

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/admin/products
```

---

## API Integration

Backend: `http://localhost:8080` (update for production in `layout.tsx` + `lib/api.ts`)

### Endpoints Used
- `GET /api/v1/settings` — active theme (server-side fetch)
- `GET /api/v1/categories`, `GET /api/v1/products`, `GET /api/v1/products/{id}`
- `POST /api/v1/orders`, `GET /api/v1/orders?phone=`
- `GET/POST/DELETE /api/v1/wishlists`
- `POST /api/v1/admin/login`, admin CRUD endpoints

---

## Testing

### Type Checking
```bash
npm run build  # validates all TypeScript
```

### Manual Testing
1. `npm run dev` → `http://localhost:3000`
2. Test on mobile: DevTools → Responsive (390px)
3. Test theme: Admin → Settings → pick theme → reload storefront

### API Testing
```bash
# Categories
curl http://localhost:8080/api/v1/categories

# Product with images + sizes + rating
curl http://localhost:8080/api/v1/products/countryside-painting

# Create order
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"phone":"0912345678","items":[...]}'
```

---

## Customization

### Adding a New Theme
1. Add `[data-theme="my-theme"]` block in `globals.css`:
   ```css
   [data-theme="my-theme"] {
     --accent: var(--primitive-my-color);
     --gold: var(--primitive-my-gold);
   }
   ```
2. Add entry to `THEMES` in `src/lib/themes.ts`
3. Done

### Changing Fonts
Edit `layout.tsx` + `@theme inline` in `globals.css`

### Updating Mock Data
Edit `src/lib/data.ts` → `CATEGORIES`, `PRODUCTS`, `REVIEWS`

---

## Deployment

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
```

### Vercel (Recommended)
```bash
git push origin main
# Auto-deploys from Vercel dashboard
```

### Self-Hosted
```bash
npm run build
npm start
```

---

## Development Commands

```bash
npm run dev       # dev server on :3000
npm run build     # production build
npm run lint      # ESLint
npm run type-check # TypeScript checking
```

---

## Code Standards

- **Server Components by default** — only use `'use client'` when necessary
- **No `any` types** — strict TypeScript throughout
- **Use brand tokens** — never reference primitives in components
- **Named exports** (except pages → default export)
- **Component files:** `.tsx` | Utilities: `.ts`
- **Props always typed**

---

## What's Included

### Storefront
✅ Home page with hero carousel, categories grid, featured products, craft story
✅ Category listing with filter/sort/grid toggle
✅ Product detail with image gallery, variant selector, tabs, reviews
✅ Shopping cart with localStorage persistence
✅ Phone-based order history lookup
✅ Wishlist with phone sync
✅ Responsive design (mobile-first, 390px optimized)

### Admin CMS
✅ Admin login with token-based auth
✅ Dashboard overview
✅ **Products** — CRUD with category name resolution
✅ **Categories** — Inline form + table
✅ **Banners** — Card-based management
✅ **Contacts** — Social platforms + hotline
✅ **Orders** — Status filtering + mobile-responsive (⭐ new)
✅ **Reviews** — Moderation with approve/reject
✅ **Campaigns** — Discount campaigns + product picker (⭐ new)
✅ **Settings** — Theme switcher
✅ **Toast notifications** — All CRUD operations (Sonner library)
✅ **Loading states** — All list pages
✅ **Mobile sidebar** — Hamburger menu on orders page

### Design & Theming
✅ All 4 seasonal themes pre-configured
✅ Theme switcher in admin settings
✅ Complete design system (colors, fonts, spacing) in one file
✅ Semantic color tokens (never use primitives)

---

## Known Limitations

- **Backend data:** Currently in-memory with mock seed data. Will migrate to PostgreSQL + Cloudinary in Phase 6+
- **No image uploads:** Admin product form links to Cloudinary but no in-app upload UI yet (Phase 5)
- **No form validation:** CMS forms accept any input (add validation in Phase 5)
- **No pagination:** All data loads at once (add pagination in Phase 5)
- **No search/filter:** On list pages (add in Phase 5)
- **Desktop-only CMS:** Only orders page is mobile-responsive (by requirement)
- **No bulk operations:** Can't select multiple items for batch action (Phase 6)

---

## Roadmap

| Phase | Status | Scope |
|-------|--------|-------|
| 1 | ✅ | Design system, colors, themes, fonts |
| 2 | ✅ | All storefront pages (home, category, product, cart, orders) |
| 3 | ✅ | BE integration, API client, mock data |
| 4 | ✅ | CMS CRUD operations (products, categories, banners, contacts, orders, reviews, campaigns) |
| 4a | ✅ | Toast notifications, loading states, mobile orders page, campaign product picker |
| 5 | 🔜 | Image upload, form validation, pagination, search/filter |
| 6 | 🔜 | PostgreSQL integration, bulk operations, audit logs |
| 7 | 🔜 | Production deployment, error handling, monitoring |

---

## Support

See `../IMPLEMENTATION_SUMMARY.md` for full architecture overview and testing details.

See `../dodongtruongthoi_be/README.md` for backend documentation.
