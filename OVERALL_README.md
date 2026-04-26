# Đồ Đồng Trường Thơi

**Handcrafted Vietnamese bronze paintings & urns — e-commerce platform**

Modern web application for displaying, discovering, and purchasing traditional bronze artwork (tranh đồng, đỉnh đồng).

---

## Overview

- 📱 **Storefront:** Mobile-first design, product catalog, shopping cart, order history lookup
- 🎨 **Theming:** Dynamic seasonal themes (Lunar New Year, Independence Day, Labor Day) — theme switching in real-time
- 🛒 **Orders:** Phone-based order flow, no user registration, campaign discounts, variant selection
- ❤️ **Wishlists:** Hybrid localStorage + server sync once customer provides phone
- 👮 **Admin CMS:** Product/category/order/banner management with JWT authentication
- 📐 **Design System:** Single-file three-layer color system (primitives → brand tokens → themes)

---

## Project Status

**Phase 3 (BE Core) Complete ✅**
- Frontend: All pages built, fully styled, integrated with backend
- Backend: All public APIs functional, in-memory storage ready for DB migration
- APIs: Health, categories, products, orders, wishlists, campaigns, reviews, admin login
- Testing: All endpoints verified working

**Next:** Phase 4 (CMS CRUD) → Phase 5 (PostgreSQL) → Phase 6 (Production)

---

## Getting Started

### Prerequisites
- Node.js 18+ (Frontend)
- Go 1.23+ (Backend)

### 1. Start Backend
```bash
cd dodongtruongthoi_be
PORT=8080 JWT_SECRET=dev-secret go run ./cmd/server
```
✅ Server runs on `http://localhost:8080`

### 2. Start Frontend
```bash
cd dodongtruongthoi_fe
npm install
npm run dev
```
✅ Storefront on `http://localhost:3000`

### 3. Test
```bash
# Categories
curl http://localhost:8080/api/v1/categories

# Create order
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0912345678",
    "items": [{
      "productId": "countryside-painting",
      "sizeCode": "m",
      "bgTone": "gold",
      "frame": "bronze",
      "quantity": 1,
      "unitPrice": 11200000
    }]
  }'

# Get orders by phone
curl "http://localhost:8080/api/v1/orders?phone=0912345678"
```

---

## Architecture

### Frontend (Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS v4)

```
dodongtruongthoi_fe/
├── src/app/              # Pages & routing
│   ├── globals.css       # Entire design system (colors, themes, CSS helpers)
│   ├── layout.tsx        # Root layout, server-side theme fetch
│   ├── page.tsx          # Home page
│   ├── categories/[id]/  # Category listing
│   ├── products/[id]/    # Product detail
│   ├── cart/, saved/, orders/
│   └── admin/            # CMS pages (login, dashboard, CRUD)
├── src/components/       # Reusable UI
│   ├── icons/            # 16 SVG icons
│   ├── ui/               # Components (ProductCard, ArtPiece, etc.)
│   └── layout/           # TopBar, Footer, MenuDrawer
└── src/lib/              # Types, data, helpers
```

**Key Features:**
- ✅ Three-layer color system (primitives → brand → themes)
- ✅ 4 seasonal themes (default, tet, independence, labor-day)
- ✅ Server-side theme fetching (no flash)
- ✅ Variant-aware product images (waterfall resolution)
- ✅ Campaign discounts
- ✅ Phone-based wishlist sync
- ✅ Hybrid localStorage + DB cart

### Backend (Go 1.23 + Chi + In-Memory Storage)

```
dodongtruongthoi_be/
├── cmd/server/           # Entry point
└── internal/
    ├── domain/           # Data models, repository interfaces
    ├── usecase/          # Business logic
    ├── repository/       # Data access (in-memory now, PostgreSQL in Phase 4)
    ├── delivery/http/    # Chi handlers, routes, middleware
    └── config/           # Environment loading
```

**Architecture:** Clean Architecture (domain/usecase/repository/delivery separation)

**APIs:**
- Public: Categories, products, orders, wishlist, banners, contacts, settings
- Admin (JWT protected): CRUD for all entities, login, theme switcher

---

## Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI:** React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"` + `@theme inline`)
- **Fonts:** Cormorant Garamond, Be Vietnam Pro, Lora, JetBrains Mono
- **Build:** Turbopack (Next.js 16)

### Backend
- **Language:** Go 1.23
- **Router:** Chi v5
- **Database:** In-memory (phase 3) / PostgreSQL pgx/v5 (phase 4+)
- **Auth:** JWT (HMAC-SHA256)
- **Hashing:** bcrypt

---

## Key Design Decisions

### Color System
All colors in `src/app/globals.css`:
- **Layer 1:** Primitives (raw hex values)
- **Layer 2:** Brand tokens (semantic names)
- **Layer 3:** Themes (override Layer 2 per theme)

New theme = add `[data-theme="name"]` CSS block. Zero component changes.

### Content Strategy
- **UI strings:** Vietnamese hardcoded in `.tsx` files
- **Business data:** Fetched from API (product titles, descriptions, etc.)
- **Code identifiers:** English only (CSS vars, TypeScript types, column names)

### Order Model
- Phone-based lookup (no user auth)
- Variant snapshot at order time (order readable forever even if product changes)
- Campaign discount computed at query time (always current)
- Status flow: pending_confirm → confirmed → processing → shipped → completed

### Wishlist
- localStorage by default (anonymous)
- Syncs to server once phone provided
- Merges server wishlist back on return

---

## File Structure

### Shared Documentation
- **IMPLEMENTATION_SUMMARY.md** — Full architecture, testing results, roadmap
- **dodongtruongthoi_fe/README.md** — Frontend development guide
- **dodongtruongthoi_be/README.md** — Backend development guide
- **migrations/001_create_categories_products_orders.sql** — Database schema

---

## Workflows

### Adding a New Product
1. Backend: Add to seed data in `platform_usecase.go` (for now)
2. FE: `npm run dev` pulls from `GET /api/v1/products`
3. Display includes variant selectors, images, discounts, reviews

### Switching Themes
1. Admin: `/admin/settings` → select theme → save
2. `PUT /api/v1/admin/settings {active_theme: "tet"}`
3. Backend updates in-memory settings
4. FE: Next page load fetches `GET /api/v1/settings` → reads theme → sets `<html data-theme="tet">`
5. All CSS `[data-theme="tet"]` overrides activate
6. Accent colors, gold, borders all shift — components unchanged

### Creating an Order
1. Customer adds to cart (localStorage)
2. Proceeds to checkout, enters phone
3. FE submits `POST /api/v1/orders` with items (variants must be complete)
4. BE validates `requires_*` flags, calculates discounts, snapshots data
5. Order created with status=`pending_confirm`
6. Customer can retrieve later: `GET /api/v1/orders?phone=...`

---

## Deployment

### Locally (Current)
```bash
# Terminal 1: Backend
cd dodongtruongthoi_be
PORT=8080 JWT_SECRET=dev-secret go run ./cmd/server

# Terminal 2: Frontend
cd dodongtruongthoi_fe
npm run dev
```

### Production
- **FE:** Deploy to Vercel (auto from git)
- **BE:** Deploy to Railway/Heroku/AWS/GCP (set `PORT`, `JWT_SECRET`, `DATABASE_URL`)
- Update FE API base URL to production domain

---

## Data

### Seed Data (Auto-Loaded)
- 2 products (countryside painting, horses painting)
- 3 categories (feng-shui, countryside, bronze urns)
- 2 product sizes each
- 1 active campaign (Tet 10% off)
- 3 reviews (2 × 5-star, 1 × 4-star)
- 4 contact links (Zalo, Messenger, Facebook, TikTok)

### Admin Credentials
- Username: `admin`
- Password: `admin123`

---

## Environment Variables

### Backend (.env)
```
PORT=8080
JWT_SECRET=your-secret-key
DATABASE_URL=postgres://localhost/dodongtruongthoi  # Optional
APP_ENV=development|production
```

### Frontend
- Backend API: Hardcoded `http://localhost:8080` in `layout.tsx` + `lib/api.ts`
- Change for production

---

## Development

### Frontend
```bash
cd dodongtruongthoi_fe
npm run dev        # dev server
npm run build      # production build
npm run lint       # type check
```

### Backend
```bash
cd dodongtruongthoi_be
go run ./cmd/server           # dev server
go build -o server ./cmd/server  # build binary
go test ./...                 # run tests
```

---

## Roadmap

| Phase | Status | What |
|-------|--------|------|
| 1 | ✅ | FE design system + home page |
| 2 | ✅ | FE category, product, cart pages |
| 3 | ✅ | BE core APIs + public endpoints |
| 4 | 🔜 | CMS CRUD endpoints, image upload |
| 5 | 🔜 | PostgreSQL migration, error handling |
| 6 | 🔜 | Production config, monitoring, tests |

---

## Code Quality

- ✅ No Vietnamese in code identifiers (CSS vars, TypeScript types, column names)
- ✅ Vietnamese in display data and UI strings only
- ✅ TypeScript strict mode (FE)
- ✅ Go idiomatic (BE)
- ✅ Clean Architecture (BE)
- ✅ No build errors: `npm run build` + `go build` both pass
- ✅ All endpoints tested and working

---

## Support

For detailed information:
- **FE guide:** See `dodongtruongthoi_fe/README.md`
- **BE guide:** See `dodongtruongthoi_be/README.md`
- **Architecture:** See `IMPLEMENTATION_SUMMARY.md`

---

## License

Proprietary — Đồ Đồng Trường Thơi

---

**Built with ❤️ for Vietnamese artisan crafts** 🎨
