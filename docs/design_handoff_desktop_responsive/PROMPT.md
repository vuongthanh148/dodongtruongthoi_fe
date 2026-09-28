# Prompt for Claude Code — Responsive storefront implementation

Copy everything below the line into a Claude Code session opened in the `dodongtruongthoi_fe` repo. Place this handoff folder at `docs/design_handoff_desktop_responsive/` first.

---

## Your task

Implement a **responsive layer** (tablet + desktop) for the Đồ Đồng Trường Thơi storefront, following the design references in `docs/design_handoff_desktop_responsive/`. The storefront is currently **mobile-only**. The goal is to add tablet (≥768px) and desktop (≥1024px) layouts **without changing the existing mobile experience** below 768px, except where the design explicitly says so.

This is an **additive** pass, not a rewrite. Mobile ships to real users today and is the baseline. Every change should be "add `md:`/`lg:`/`xl:` classes or wrap with a desktop-only component", not "rewrite the mobile markup".

## Read first (in this order)
1. `docs/design_handoff_desktop_responsive/README.md`: the full spec (tokens, breakpoints, every screen, interactions, security requirements). Treat it as the source of truth.
2. Open the 3 HTML files in a browser: `Desktop - Home.html`, `Desktop - Mua hang.html`, `Desktop - Noi dung.html`. Each is a canvas showing every screen at 1440 / 768 / 375. Append `#<board-id>` to render one screen alone at native width, e.g. `Desktop - Home.html#pdp-a-1440`. The board ids are listed in the README.
3. `docs/design_handoff_desktop_responsive/app/*.jsx`: the reference implementation. Read it for exact values (paddings, gaps, font sizes, grid templates). **Do not copy it**; it is inline-style React with a fake viewport hook (`useBp`) used only to render several widths side by side. In the repo, use Tailwind responsive utilities and real CSS breakpoints.
4. `AGENTS.md` at the repo root. This Next.js version has breaking changes. Read the relevant `node_modules/next/dist/docs/` pages before touching App Router APIs (layouts, metadata, route groups, `Link`, `Image`, dynamic routes).
5. `src/app/globals.css`: all design tokens already exist there (`--son`, `--gold`, `--bronze`, `--ivory`, `--ink`, `--muted`, `--line`, fonts). **Do not introduce new hex values or font stacks.** If the design uses a value that has no token, check whether an existing one is close. If not, add it to `globals.css` as a token and note it in your summary.

## Breakpoint mapping
The design mocks switch at artboard widths. Map them to Tailwind v4 defaults (CSS-first config, no tailwind.config needed):

| Design | Tailwind | Behaviour |
|---|---|---|
| sm (<768) | base (no prefix) | Existing mobile. Keep it. |
| md (768–1023) | `md:` | Tablet: mobile-style header + inline search row, wider grids (3 col), summaries stack below content, no sidebars. |
| lg (1024–1279) | `lg:` | Desktop compact: desktop header, sidebars, 2-col PDP/cart/checkout, tighter gaps, mega-menu without "Bán chạy" column, search 170px, "Tra cứu đơn" icon-only. |
| xl (≥1280) | `xl:` | Full desktop per the 1440 artboards. |

Content container: `max-width: 1344px` (1280 + 2×32 padding), centered. Horizontal padding is 16 / 24 / 32 at base / `md:` / `lg:`. `src/components/layout/Container.tsx` already exists; reuse it, adjusting its max-width and padding if needed, and make every page use it consistently.

## Implementation order
Work top-down, one PR-sized step at a time. Verify each step at 375 / 768 / 1024 / 1440 before moving on.

1. **Shell**
   - Desktop header (`lg:`+): logo · nav (Sản phẩm ▾ · Giới thiệu · Cẩm nang · Liên hệ) · search input · "Tra cứu đơn" pill · saved · cart. **Repurpose the dead `src/components/layout/Header.tsx`** for this, or delete it and build new; don't leave both.
   - Keep `TopBar` + `MenuDrawer` for `<lg`. At `md:` add the inline full-width search row under `TopBar` and show saved + tra-cứu icons.
   - Mega-menu (see README). It must be keyboard accessible:
     - trigger is a `<button aria-expanded aria-controls>`;
     - opens on hover (with a ~180ms close delay so moving the pointer into the panel doesn't close it), click, and Enter/Space;
     - closes on Esc and on outside click, and returns focus to the trigger on close;
     - the panel's links are reachable with Tab.
   - Breadcrumbs (`md:`+ only) on listing, category, PDP, cart, checkout, orders and content pages. Use a `<nav aria-label="Breadcrumb"><ol>` with `aria-current="page"` on the last item. Add JSON-LD `BreadcrumbList` on product and category pages.
   - Footer: 5 columns at `lg:`, a brand row plus 4 columns at `md:`, a brand row plus a 2×2 grid at base.
   - Nav links reserve their bold width so the active state doesn't shift the layout. The reference uses a hidden bold duplicate in an inline-grid; any equivalent approach is fine.
2. **Home** (`src/app/page.tsx`): hero grid, category strip → grid, featured grid 2 / 3 / 3 / 4 columns, story cards, trust bar.
3. **Listing + Category** (`src/app/products/page.tsx`, `src/app/categories/[id]/page.tsx`, `src/app/categories/page.tsx`)
   - Persistent `FilterSidebar` at `lg:`+ (sticky, `top` = header height + gap).
   - Below `lg`, keep the existing `BottomSheet` filter and add the "Bộ lọc (n)" and sort buttons row.
   - **Filter state must be shared between the sidebar and the bottom sheet**, ideally in URL search params, so resizing or rotating a device doesn't lose filters.
   - Replace every hardcoded `gridTemplateColumns: '1fr 1fr'` / `repeat(2, …)` inline style with Tailwind grid classes. Saved (`src/app/saved/page.tsx:88`) must use the **same grid** as the listing.
4. **PDP** (`src/app/products/[id]/page.tsx`)
   - Two columns at `lg:`: gallery on the left with the main image and thumbnails **below** it; a **sticky** buy box on the right.
   - The fixed bottom CTA bar stays **only below `md`**. From `md:`, render the CTAs inside the buy box. Don't render both, or duplicate buttons will reach screen readers.
   - Tabs remain.
   - Pricing logic is unchanged: price = size × frame surcharge; background color is free.
5. **Cart / Checkout** (`src/app/cart/page.tsx`, `src/app/checkout/page.tsx`)
   - Two columns at `lg:` with a sticky summary on the right. Stack at `md`.
   - The bottom bar is base only.
   - Checkout form fields use 2 columns from `md:`. Address and note span both columns.
6. **Orders** (`src/app/orders/page.tsx`, `src/app/orders/[id]/page.tsx`): table layout at `lg:`, cards below. Implement the **secure lookup flow** UI (see "Security" below).
7. **Content pages**
   - FAQ and Hướng dẫn: centered reading column, max 760px.
   - Làng nghề / Giới thiệu: alternating image and text sections.
   - New routes: **Cẩm nang** list, **Cẩm nang** article, **Liên hệ** (map embed, info, form).
   - If data sources don't exist yet, build them with static placeholder content behind a clearly named constant and list them in your summary.

## Things to watch (responsive pitfalls)
- **No horizontal overflow at any width.** Test 320, 375, 414, 768, 1024, 1280, 1440 and 1920. Common culprits:
  - grid tracks written as `1fr` instead of `minmax(0,1fr)`;
  - long product names or emails (use `overflow-wrap:anywhere` or truncate);
  - negative-margin horizontal scrollers;
  - fixed-width inputs;
  - `100vw` inside padded containers.
- **Flex/grid children that contain text need `min-w-0`**, or they refuse to shrink.
- **Prefer `nowrap` on short controls** (option buttons like "1.2m × 0.8m", "Xem chi tiết →", badges) and allow wrap on long text. A wrapped button label counts as a bug.
- **Sticky elements:** the sticky header height offsets every sticky sidebar or summary (`top-[calc(header+16px)]`). Make sure sticky parents don't have `overflow:hidden`, which breaks `position:sticky`.
- **Fixed elements vs. desktop:** `ContactBubbles` and any `position:fixed` bottom bars must not overlap the footer or the sticky buy box at `lg:`. Hide the bottom bars at `md:`+ and reposition the bubbles if needed.
- **Hover-only interactions need touch and keyboard equivalents.** Tablets (768–1024) are touch devices, so the mega-menu must open on tap. Use `@media (hover:hover)` for hover-only effects such as image zoom.
- **Touch targets:** at least 44×44px below `lg`. This includes icon buttons, quantity steppers, swatches and filter checkboxes.
- **Images:** use `next/image` with correct `sizes` per breakpoint (e.g. `(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw` for a 4/3/2 grid). Keep aspect ratios fixed (PDP main image 4:3, product cards as today) to avoid layout shift.
- **Carousel:** on desktop, add prev/next arrow buttons (with aria-labels) and keep swipe on touch. Pause autoplay on hover and focus, and honour `prefers-reduced-motion`.
- **Typography scale:** titles step down per breakpoint as in the README (e.g. page title 36 / 34 / 30 / 24). Don't let desktop sizes leak into mobile.
- **Reading width:** long-form text never exceeds about 760px, even on 1920 screens.
- **Don't do JS viewport detection** (`window.innerWidth`, `useMediaQuery`) to choose layouts. It causes hydration mismatches and flashes. Use CSS (Tailwind prefixes, or `hidden lg:block` / `lg:hidden`). If a component really must differ in JS, render both and hide one with CSS.
- **Avoid duplicate DOM for SEO-critical content.** Rendering two headers (mobile and desktop) is fine. Don't render product titles, prices or descriptions twice.
- **Focus styles:** visible focus ring on all interactive elements: `--son` border plus `0 0 0 3px rgba(139,30,30,.1)`.
- **Reduced motion:** wrap the mega-menu clip-path reveal, stagger, shake and slide-in animations in `@media (prefers-reduced-motion: no-preference)`.
- **Vietnamese text:** allow room for diacritics (line-height ≥ 1.15 on Lora headings), and don't uppercase long Vietnamese strings except `.label-mono` eyebrows.
- **Admin must not break.** Before editing any shared component (`Btn`, `Card`, icons, `Container`, fonts in `globals.css`), check the import graph for `src/app/admin/**` usage and verify admin still renders.

## Security — order lookup (flag this; don't implement in the FE alone)
The current lookup returns full order data from a phone number alone, so anyone can see strangers' names and addresses. The design adds:
1. **Phone → masked list.** Code masked (`DH-2•••42`), plus date, status and product names. No price, address or recipient.
2. **Detail requires verification**, by order code (sent at checkout) or OTP via Zalo/SMS (6 digits, 60s resend).
3. **5 failed attempts → 15-minute lock** per phone.
4. **Verified detail:** session of about 15 minutes; address and phone still partially masked.
5. Rate limiting per phone and per IP.

**These rules must be enforced by the backend (`dodongtruongthoi_be`, separate repo).** In this repo:
- build the UI state machine (phone → list → verify → locked | detail) against the **current** API;
- mask on the client for now;
- write a short `docs/BACKEND_TODO_order_lookup.md` describing the required API changes: endpoints, request/response shapes, error codes for wrong code, locked and expired.

**Do not change API shapes yourself.** Stop and flag if the FE can't be built without them.

## Out of scope
- Admin CMS redesign.
- Backend changes (see above).
- New features beyond the handoff. "Quà tặng" is shown in the menu as "Sắp có"; no gift pages or quote form yet.
- Converting existing inline styles to Tailwind wholesale. Only touch what's needed for responsiveness.

## Verification (there is no test suite)
- Run `npm run dev` and check **every route** at 375, 768, 1024 and 1440 in the browser, including:
  - menus open and closed, filters applied, cart empty and full;
  - the lookup states (list, verify, wrong code, locked, detail).
- Compare each against its board (`#<board-id>` in the HTML references).
- Check keyboard-only navigation of the header, mega-menu, filters, PDP options and checkout.
- If Playwright is installed but not wired up, you **may** add a minimal config and a smoke spec that loads each route at the 4 widths and asserts `document.documentElement.scrollWidth <= innerWidth`. Keep it small and document how to run it.
- Run `npm run build` and `npm run lint`: no new errors or hydration warnings.

## When you finish
Report, per route: what changed, which components were added or modified, anything deferred or rough, any new tokens added to `globals.css`, and the backend TODOs. Don't claim a screen is done without having looked at it rendered at all 4 widths.
