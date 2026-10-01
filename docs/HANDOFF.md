# Work handoff — Đồ Đồng Trường Thơi (2026-09-30)

Two repos, both under `~/Documents/DoDong/`:
- `dodongtruongthoi_fe` — Next.js 16 (Turbopack, Tailwind v4, React, SWR) storefront. Port 3000.
- `dodongtruongthoi_be` — Go API + Postgres (docker compose). API on 8080, Postgres on 5432.

The same handoff (backend view) is in `dodongtruongthoi_be/docs/HANDOFF.md`.

## Goal
Make the live frontend match the design handoff in `docs/design_handoff_desktop_responsive/`
(JSX prototype under `app/`, README.md / PROMPT.md). Compare every screen: layout, padding, copy, buttons, links.

## Set up on a new machine
1. Clone both repos, `git pull` on `main`.
2. Backend: copy `.env` (not committed) → `docker compose up -d` in `dodongtruongthoi_be`.
   Postgres user/password is `postgres`/`postgres`, DB `dodongtruongthoi`. Migrations are embedded and applied by the Go server.
   Known quirk: the compose initdb script also applies migration 001 — if the API reports `relation "categories" already exists`, insert the `001_...sql` row into `schema_migrations`.
3. Local fake data (dev only):
   ```
   docker compose exec -T postgres psql -U postgres -d dodongtruongthoi < scripts/seed-test-data.sql        # 13 orders, all statuses
   docker compose exec -T postgres psql -U postgres -d dodongtruongthoi < scripts/seed-more-products.sql    # 12 demo-sp-* products (pagination)
   docker compose exec -T postgres psql -U postgres -d dodongtruongthoi < scripts/seed-order-items.sql      # line items + totals for orders
   ```
4. Frontend: `npm install && npm run dev`. `next.config` rewrites `/api/*` → `http://localhost:8080`.
5. Mockup viewer (optional): serve `docs/design_handoff_desktop_responsive` with any static server (used port 8090). Boards: Home.html (home-a-1440, cats-1440, list-a-1440, pdp-a-1440, saved-1440), "Mua hang.html" (cart, checkout, orders, lk-*, order), "Noi dung.html" (blog, article, contact, faq, guide, craft).

## Done (verified in browser at ~1440px unless noted)
- Header/mega menu use real categories (from API), Footer "Sản phẩm" column too; StoreLocationsSection (map embed) above footer on all pages except /lien-he.
- Home: hero split banner, TrustBar, category strip, campaigns, featured ("Sản phẩm được yêu thích", rounded `ProductCard`), section spacing scale.
- Listings `/products`, `/categories/[id]`: uniform rounded card grid, sort select, size filter (rating filter removed), "Xem thêm sản phẩm" load-more (PAGE_SIZE 9, reset derived from a filter key — no effect).
- `/categories` index: 6-col large image tiles (falls back to ArtPiece placeholder when a category has no `image_url`).
- PDP: size selector as button row, "Đã gồm VAT" note (user confirmed prices include VAT), breadcrumb/badge use real category name.
- Cart: table + mobile cards, summary card (white bordered, Tạm tính / Phí giao hàng / Lắp đặt), "Đổi tùy chọn", 30-minute confirm note.
- Checkout: H1 "Đặt hàng", "Thông tin người nhận" + "Thanh toán" cards, right column items + totals.
- Orders lookup H1/subtitle/"Dùng số mẫu"; order detail restructured to mockup (header, timeline, products, payment/delivery cards, sticky right column). Timeline maps statuses pending_confirm → confirmed → processing → shipped → completed; cancelled shows a banner instead. All statuses checked.
- FAQ, Guide, craft/"Giới thiệu" (`/lang-nghe`) flattened to the mockup (no dark hero card / boxed sections).
- QA sweep at 390px width (by a Haiku agent, not personally re-checked): no overflow/overlap found on 10 pages.

## Recurring bug to watch for
Inline `style={{ display: ... }}` (or inline `gridTemplateColumns`) always beats Tailwind classes like `hidden`, `md:hidden`, `lg:grid-cols-…`.
Always put `display` and responsive grid columns in `className`. Scan for it after every change.

## Open / not done
- Category tiles have no photos: the DB categories have no `image_url` (data, not code).
- Product detail thumbnails/frame/bg-tone selectors are data-dependent; not verified against mockup beyond the size selector.
- Mockup files in `docs/design_handoff_desktop_responsive` get reverted by the designer's tool now and then (SHOP.email, `mapDir`, hours 7:30–18:00, DeskContact wiring, README/data.jsx hours). Low priority; the code is the source of truth.
- Stories section on home uses a non-standard flat 64px margin.
- Mobile pages were only checked by a report-only agent — spot check product page and order detail yourself.

## Working agreement with the user
- Verify in a real browser against the mockup, not just typecheck. Run `npx tsc --noEmit -p .` and `npx eslint <files>`.
- Delegate mechanical implementation to Haiku subagents with precise specs, then review their work yourself (their "tsc passes" claims were wrong more than once).
- Ask before changing pricing/business claims (e.g. the VAT note).
