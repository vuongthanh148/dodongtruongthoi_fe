# Prompt: Migrate storefront to responsive desktop view

Copy everything below the line into a new Claude session working in the
`dodongtruongthoi_fe` repo.

---

## Context

This is a Next.js 16 / React 19 / Tailwind v4 e-commerce storefront for a
Vietnamese bronze-craft brand (Đồ Đồng Trường Thơi), plus an admin CMS. The
**entire storefront was built mobile-only** — there is no responsive layer
at all:

- Zero `@media` queries in `src/app/globals.css`.
- Zero `sm:`/`md:`/`lg:`/`xl:` Tailwind prefixes anywhere in
  `src/app/**`, `src/components/sections/**`, or `src/components/layout/**`
  (Tailwind v4 is installed and configured, just unused for layout).
- Nearly every grid is hardcoded `gridTemplateColumns: '1fr 1fr'` (fixed
  2-column) or `repeat(2, minmax(0, 1fr))` via inline `style={}`.
- Global nav is a mobile app-bar (`TopBar`: hamburger + centered title +
  icon buttons) with a full-screen slide-out `MenuDrawer` — there is no
  persistent desktop navigation bar.
- Product detail and other flows use a `position: fixed` bottom action
  bar (e.g. "Thêm vào giỏ" / "Mua ngay"), which is a mobile-only pattern.
- Filtering (category page) opens a `BottomSheet` (mobile drawer) — no
  desktop-appropriate sidebar/dropdown equivalent exists.
- There's a dead, never-imported `src/components/layout/Header.tsx` —
  a generic scaffold header from before the real (mobile) design was
  built. It is not wired into any layout. Either repurpose it as the
  desktop header or delete it — don't leave it as unused dead code.

**The admin CMS (`src/app/admin/**`) is the opposite** — it already uses a
desktop sidebar + content layout (`AdminFrame`/`AdminLayout`, with a
`mobileHideSidebar` prop suggesting some mobile awareness already exists
there). **Admin is out of scope for this task** unless something you touch
in shared components breaks it — verify it still renders correctly, don't
redesign it.

## Goal

Make the storefront (not admin) work well at desktop widths (roughly
1024px+, with a comfortable ceiling around 1440-1600px) while keeping the
existing mobile experience intact and unchanged below `md` (768px).
This is an **additive responsive layer**, not a rewrite — mobile is the
baseline that already works and ships to real users; desktop is a new
breakpoint being added on top.

## Before you touch code

Read `src/app/globals.css` for the full design token set (`--accent`,
`--gold`, `--bronze`, `--text-primary`, `--bg-page`, font variables, etc.)
— desktop layouts must reuse these tokens, not introduce new colors/fonts.
Also read `AGENTS.md` at the repo root: this Next.js version has breaking
changes from what you may know — read the relevant
`node_modules/next/dist/docs/` pages before writing App Router code.

## Screen inventory

### A. Existing mobile screens that need desktop layouts

For each, the current mobile pattern is noted so you know what to
preserve below `md` and what to add above it.

| Route | File | Current mobile pattern | Desktop need |
|---|---|---|---|
| Home | `src/app/page.tsx` | Single-column stack: banner carousel → category strip → featured products (2-col grid) → campaigns → customer photos → story cards → trust bar | Wider hero, multi-column featured grid (4-6 cols), category strip as a proper grid/row instead of horizontal scroll, side-by-side sections where content allows |
| Products listing | `src/app/products/page.tsx` | Category pills row, 2-col fixed product grid (`page.tsx:196`), sort control | Sidebar or top filter bar with more breathing room, 3-5 col product grid, sort/filter visible without a drawer |
| Product detail | `src/app/products/[id]/page.tsx` | Full-width image carousel, options below, fixed bottom CTA bar, tabbed description/guide/specs/reviews, related products | Classic two-column PDP: image gallery left, sticky (not fixed-to-viewport-bottom) buy box right with price/options/CTA; tabs can stay or become a single scrollable page with anchor nav |
| Categories index | `src/app/categories/page.tsx` | Single-column stacked list of category cards (`flexDirection: 'column'`) | Grid of category tiles (3-6 cols), no vertical stack |
| Category detail | `src/app/categories/[id]/page.tsx` | Category pill strip, `BottomSheet` filter drawer, 2-col product grid | Desktop: filters as a persistent left sidebar or inline dropdown bar (no bottom sheet), wider product grid |
| Cart | `src/app/cart/page.tsx` | Single-column stacked flex layout (line items, then summary, then CTA, all stacked) | Two-column: line items left, sticky summary/CTA right |
| Checkout | `src/app/checkout/page.tsx` | Single-column stacked flex form flow | Two-column: form fields left, order summary right (standard checkout pattern) |
| Orders list | `src/app/orders/page.tsx` | Stacked flex list with search form on top | Table-like layout or multi-column card grid, more info visible per row without tapping in |
| Order detail | `src/app/orders/[id]/page.tsx` | Stacked flex sections (status, items, totals) | Wider layout, status/items side-by-side with a summary column |
| Saved/wishlist | `src/app/saved/page.tsx` | 2-col fixed grid (`gridTemplateColumns: '1fr 1fr'`, `saved/page.tsx:88`) — same pattern as product listing | Same multi-column treatment as product listing, keep grids consistent between the two |
| FAQ | `src/app/faq/page.tsx` | Content page | Centered readable column (don't stretch text full-width) |
| Hướng dẫn mua hàng | `src/app/huong-dan-mua-hang/page.tsx` | Content page | Same — constrain reading width |
| Làng nghề | `src/app/lang-nghe/page.tsx` | Content/story page | Wider imagery, side-by-side text+image sections |

### B. New additions — don't exist in mobile, needed for desktop

- **Persistent desktop header/nav bar** — replace (or add alongside,
  shown only at `md:`+) the hamburger-only `TopBar` with a real nav: logo,
  primary category links or a mega-menu, search input inline (not an
  overlay), cart/wishlist icons. Decide whether to repurpose the dead
  `Header.tsx` or build fresh — either is fine, just don't leave both.
- **Breadcrumbs** — none exist anywhere today (confirmed: no breadcrumb
  component in the codebase). Desktop e-commerce conventionally has them
  on product/category pages (Home / Category / Product). Mobile can stay
  as-is (title-only `TopBar`); add breadcrumbs only at `md:`+ if you
  introduce them.
- **Sidebar filter panel** for product listing/category pages, replacing
  the mobile `BottomSheet` at desktop widths.
- **Multi-column footer** — `Footer.tsx` currently has some 2-column
  grids already; verify/expand for desktop (link columns, newsletter,
  socials, trust badges side-by-side rather than stacked).
- Anything else genuinely missing that you judge a Vietnamese e-commerce
  desktop shopper would expect (e.g. a visible search bar instead of a
  search icon that opens an overlay) — use judgment, but don't invent
  large new features beyond adapting what exists to a wider viewport.

### C. Shared components that need responsive treatment

| Component | File | Current | Needed |
|---|---|---|---|
| `TopBar` | `src/components/layout/TopBar.tsx` | Mobile app-bar, `gridTemplateColumns: '1fr auto 1fr'`, hamburger+title+icons, no breakpoints | Hide/replace at `md:`+ in favor of the new desktop header, or extend it — your call, document which |
| `MenuDrawer` | `src/components/layout/MenuDrawer.tsx` | Full-screen slide-out nav (475 lines) | Mobile-only; desktop uses inline nav instead |
| `Container` | `src/components/layout/Container.tsx` | Already has `max-w-7xl px-4 sm:px-6 lg:px-8` — this one's already responsive-ready, reuse it | Make sure page content actually uses it consistently |
| `SearchOverlay` | `src/components/ui/SearchOverlay.tsx` | Full-screen mobile search overlay | Decide: keep as a dropdown-under-search-bar on desktop, or keep the overlay pattern but change its width/positioning |
| `BottomSheet` | `src/components/ui/BottomSheet.tsx` | Slide-up mobile sheet, currently only used for category filters | Mobile-only; desktop needs the sidebar/dropdown filter mentioned above instead |
| `ProductCard` | `src/components/ui/ProductCard.tsx` | Sized for a 2-col mobile grid | Verify it scales cleanly in a 3-5 col desktop grid (image aspect ratio, text truncation, price layout) |
| `Carousel` | `src/components/ui/Carousel.tsx` | Touch/swipe carousel | Confirm desktop behavior (arrows? still swipeable via mouse drag? or become a static grid at wide widths?) |
| `CatPill` / category strip | `src/components/ui/CatPill.tsx` + `CategoryStripSection.tsx` | Horizontal scroll strip of pills | Desktop: could stay as a centered row if it fits, or become part of the nav/sidebar |
| `ContactBubbles` | `src/components/ui/ContactBubbles.tsx` | Floating mobile social/contact buttons | Verify positioning doesn't collide with new desktop header/footer |
| `Footer` | `src/components/layout/Footer.tsx` | Partial 2-col grids already | Expand to a proper multi-column desktop footer |

## Design/technical constraints

- **Tailwind v4 breakpoints** (default, already available, no config
  file needed — v4 is CSS-first): `sm` 640px, `md` 768px, `lg` 1024px,
  `xl` 1280px, `2xl` 1536px. Treat `md`/`lg` as the primary desktop
  breakpoints for this app; decide per-component whether `sm` needs
  anything (probably not — mobile-to-tablet is likely fine as-is).
- Most layout today is inline `style={{}}` objects, not Tailwind
  classes. For new responsive behavior, prefer Tailwind's responsive
  utility classes (`className="grid grid-cols-2 md:grid-cols-4"`) over
  hand-rolled `@media` blocks or JS-based viewport detection — it's more
  maintainable and matches how `Container.tsx` already does it. You do
  not need to convert existing inline styles to Tailwind wholesale; add
  responsive classes alongside, or wrap with a className where needed.
- Reuse existing CSS custom properties from `globals.css` for all colors
  /fonts — do not introduce new hex values or font stacks.
- This app has **no automated frontend test suite** (verified: zero
  `*.test.*`/`*.spec.*` files, no Playwright config wired up despite the
  package being installed). Verification is manual: run `npm run dev`
  and check each screen at a mobile width (~375px) and a desktop width
  (~1440px) in a browser. Don't claim a screen is done without looking
  at it rendered.
- Follow `AGENTS.md`'s instruction to read `node_modules/next/dist/docs/`
  before using App Router APIs that may have changed in this Next.js
  version.

## Out of scope

- Admin CMS (`src/app/admin/**`) — already desktop-shaped, don't
  redesign it. Just don't break it if you touch a shared component it
  also imports (check import graphs before modifying shared UI
  components like icons or `Btn`/`Card`).
- Backend (`dodongtruongthoi_be`, separate repo) — no API changes should
  be needed for a responsive layout pass. If you find yourself wanting
  to change an API response shape, stop and flag it instead of doing it.
- No new features beyond what's listed in section B — this is a layout/
  responsive pass, not a scope expansion.

## Suggested approach

1. Decide the desktop nav strategy first (repurpose `Header.tsx` vs.
   build new, breadcrumbs yes/no) since it affects every page's shell.
2. Work top-down: shared shell/nav → home → product listing/category →
   product detail → cart/checkout → remaining content pages.
3. For each screen, add `md:`/`lg:` responsive classes rather than
   rewriting the mobile markup — verify mobile still looks identical
   after your change before moving to the next screen.
4. At the end, do a full pass at both viewport sizes across every route
   in the table above and report anything left rough or deferred.
