# Desktop/tablet responsive layer — status

Tracks progress against `docs/design_handoff_desktop_responsive/PROMPT.md`. Mobile
(`<768px`) is unchanged everywhere except the few spots the design explicitly
called for a change (noted below). All work is additive: `md:`/`lg:`/`xl:`
Tailwind classes or new components shown only at wider breakpoints.

**Verification state as of this doc:** `npx tsc --noEmit` and `npm run lint`
both clean (aside from one pre-existing, unrelated `react-select`
module-resolution error in `src/app/admin/products/[id]/page.tsx` — that
package isn't installed in this environment's `node_modules`; not something
this pass touched). The Playwright smoke suite (`tests/responsive-overflow.spec.ts`)
passes 60/60 — every route at 375/768/1024/1440px has zero horizontal overflow.

## Step 1 — Shell ✅

- New `DeskHeader` (`src/components/layout/Header.tsx`, repurposing the dead
  `Header.tsx` stub) — sticky, shown `lg:`+, with logo, nav, keyboard-accessible
  mega-menu (`src/components/layout/MegaMenu.tsx`), search, "Tra cứu đơn"
  pill, saved/cart icon links with badges.
- `TopBar` (mobile header) untouched below `md:`; gained a `md:`-only inline
  search row + tra-cứu/cart icons (design explicitly calls for this).
- `Breadcrumbs` (`src/components/layout/Breadcrumbs.tsx`) — new, `md:`+ only,
  emits JSON-LD `BreadcrumbList` on every page it's used on.
- `Footer` rewritten as one responsive component (5-col `lg:`/`xl:`, brand+4-col
  `md:`, brand+2×2 base) replacing the old `Footer`/`FooterMinimal` split.
- `Container` fixed to the spec's math: `max-w-[1344px]`, 16/24/32px padding.
- New icons: `IconCart`, `IconBox` (didn't exist before).
- New nav taxonomy: `src/lib/desktop-nav.ts` (`MEGA_MENU_GROUPS`,
  `DESK_NAV_LINKS`) — see **Known gaps** below re: category IDs.

## Step 2 — Home ✅

- `BannerSection`: hero becomes an inset, rounded, taller card at `lg:`+
  (was full-bleed). Responsive type scale. **Did not** add the design's "2
  side promo banners" — see **Known gaps**.
- `CategoryStripSection`: new card-grid at `md:`+ (3 cols → 5 at `lg:`/`xl:`),
  mobile pill-scroller untouched below `md:`.
- `FeaturedProductsSection`: grid made responsive (2/3/3/4 cols); item count
  unchanged (still `FEATURED_PRODUCTS_COUNT`).
- `StoriesSection`: new 2-column ivory card layout at `lg:`+ using
  `STORY_CARDS[0]`/`[1]`; original dark single-card mobile/tablet version
  untouched below `lg:`.
- `TrustBar`: constrained to the site max-width at `lg:`+; kept its existing
  3-item dark/centered content rather than the mockup's different 4-item
  copy — see **Known gaps**.
- `StoreLocationsSection`: **not part of the design handoff at all** (confirmed
  by searching the reference `desktop-screens.jsx` — Home only has hero →
  category strip → featured grid → story cards → trust bar). It's
  pre-existing mobile content. Rebuilt per the user's own follow-up mockup:
  single row at `lg:`+ (title, address/phone/hours inline, compact
  never-full-width buttons with icons), stacked with the same compact buttons
  below `lg:`, sitting directly above the footer with no gap.

## Step 3 — Listing + Category ✅

- New `FilterSidebar` (`src/components/layout/FilterSidebar.tsx`) — sticky,
  `lg:`+ only, shared by both listing pages: category list, price range,
  rating, bg-tone color swatches.
- `products/page.tsx` and `categories/[id]/page.tsx`: brought to filter parity
  (both now have price/rating/color filters + `FilterSidebar` at `lg:`+); the
  mobile "Bộ lọc (n)" + sort `BottomSheet` flow is unchanged/kept below `lg:`.
  Filter state lives in the same component state read by both the sidebar and
  the sheet, so resizing never loses a selection (no URL sync was needed to
  satisfy this — see reasoning in conversation, not repeated here).
- `categories/page.tsx`: new card grid at `md:`+ (2/3/4 cols); mobile list
  view untouched.
- `saved/page.tsx`: grid made responsive to match the listing pages (2/3/3/4
  cols); added a `md:`+ "Thêm tất cả vào giỏ" button.

## Step 4 — PDP ✅

- `products/[id]/page.tsx` restructured into a 2-column grid at `lg:`+
  (gallery left, sticky buy-box right, `top-[92px]`); single column below
  `lg:`, unchanged.
- Desktop CTA row (Lưu / Thêm vào giỏ / Mua ngay) added inside the sticky buy
  box, shown only `md:`+; the mobile fixed bottom bar is now `md:hidden` so
  there's never a duplicate set of buttons in the DOM at once.
- New "Thông số chính" spec-summary card next to the tabs at `lg:`+.
- "Sản phẩm liên quan" grid made responsive (was a fixed horizontal-scroll
  row at every width; now `md:`+ becomes a real grid, 3/4 cols).

## Step 5 — Cart / Checkout ✅

- `cart/page.tsx`: 2-column grid at `lg:`+ (items left, sticky summary +
  trust row right, 320px `lg:` / 400px `xl:`); unchanged below `lg:`.
- `checkout/page.tsx`: 2-column grid at `lg:`+ (form left via `lg:order-1`,
  sticky summary right via `lg:order-2`, DOM order unchanged for a11y); phone
  + name fields become a 2-col row at `md:`+; address/note stay full width.
  Added a new payment-method selector (COD / Chuyển khoản / Tại showroom —
  this UI didn't exist before) whose selection is prepended to the order
  `note` sent to the API, since the backend has no dedicated field yet.

## Step 6 — Orders + secure lookup ✅

- `orders/page.tsx` **rebuilt** as the full state machine the design calls
  for: phone → masked list → verify (order code or mock OTP) → locked (5
  failed attempts → 15 min) → detail (still-masked address/phone). This is
  explicitly a **client-side UI mock** — the current API returns full data
  from a phone number alone with no verification. Masking helpers live in
  `src/lib/order-lookup.ts`. **`docs/BACKEND_TODO_order_lookup.md`** spells out
  the real API changes needed (masked summary endpoint, verify endpoint,
  OTP endpoint, session token, rate limiting, error codes).
- `orders/[id]/page.tsx`: 2-column responsive layout at `lg:`+, new status
  stepper, and the same masking helpers applied to phone/name/address (this
  page has no verification gate today — flagged in the backend TODO doc too).

## Step 7 — Content pages ✅

- `faq/page.tsx`, `huong-dan-mua-hang/page.tsx`: wrapped in a new shared
  `ReadColumn` (`src/components/layout/ReadColumn.tsx`, 760px max-width,
  centered) inside `Container`, `md:`+; mobile unchanged.
- `lang-nghe/page.tsx`: story cards alternate image-left/text-right and
  image-right/text-left at `md:`+ (via a `direction: rtl`/`ltr` CSS trick that
  keeps DOM/reading order intact for a11y); full-bleed hero and mobile stacked
  cards untouched.
- **New routes** (didn't exist before): `cam-nang/page.tsx` (blog list, tag
  filter, featured post + grid), `cam-nang/[id]/page.tsx` (article, 760px
  reading column, related posts), `lien-he/page.tsx` (map placeholder, info
  list, message form with a success state). Placeholder content lives in
  `src/lib/content-data.ts` (`BLOG_POSTS`) — replace with a real CMS/API
  source when one exists.

## Known gaps / deferred (flagged, not silently skipped)

Status as of the 2026-10-04 design-vs-live pass. Items 1, 2, 3 and 5 from the
earlier list are resolved and removed.

1. **Hero side tiles at 768/375** — the 1440 hero shows side tiles; md/sm still
   lack the 2-column side tiles from the design (design README: "At md/sm the
   side banners go below in 2 columns"). Open.
2. **Mega-menu / footer product links** — `MEGA_MENU_GROUPS` in
   `src/lib/desktop-nav.ts` maps design labels that have no API category to
   `/products?q=<label>`. Replace with real category ids when the backend has
   them. Partially resolved.
3. **`categories/page.tsx` empty state** — pre-existing gap: no "no categories"
   message if the fetch returns empty. Open.
4. **Review form and order cancel** — storefront has no review submit form
   (BUG-004) and buyer order page has no cancel action (BUG-002). Feature gaps;
   build or drop from the E2E plan. Open.
5. **PDP related-products / desktop CTA** — verified via `tsc`/lint and screenshot
   only against the local dev data. Re-check against real product data.
6. **`orders/[id]` has no verification gate** — direct-link access bypasses the
   lookup flow. Intentional for now (see `docs/BACKEND_TODO_order_lookup.md`).

## Environment notes for whoever picks this up

- `react-select` (used by the admin product-edit page) and, until this pass,
  `@playwright/test`/`playwright` were listed in `package.json` but not
  actually installed in `node_modules` in this sandbox — a pre-existing,
  environment-specific gap, not something this pass introduced. Running a
  clean `npm install` should resolve it.
- A Playwright smoke test now exists: `tests/responsive-overflow.spec.ts` +
  `playwright.config.ts`. Run with `npx playwright test` (dev server must be
  reachable at `http://localhost:3000`, or set `PLAYWRIGHT_BASE_URL`). It only
  checks for horizontal overflow at 375/768/1024/1440px across every route —
  not visual fidelity.
