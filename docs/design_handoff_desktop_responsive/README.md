# Handoff: Storefront responsive layer (desktop + tablet + mobile)

## Overview
Responsive layouts for the Đồ Đồng Trường Thơi storefront (`dodongtruongthoi_fe`, Next.js 16 / React 19 / Tailwind v4). The current storefront is mobile-only. These designs add tablet (≥768) and desktop (≥1024, content max 1280) layouts on top of the existing mobile experience. They also define a new desktop header with mega-menu, breadcrumbs, a sidebar filter, a 5-column footer, a secure order-lookup flow, and new content pages (Cẩm nang, Bài viết, Liên hệ).

Admin (`src/app/admin/**`) is out of scope.

## About the design files
The HTML/JSX files in this folder are **design references**, not production code. Recreate them in the repo using its existing patterns: App Router, the Tailwind v4 responsive utilities (`md:` / `lg:` / `xl:`), the tokens in `src/app/globals.css`, and the existing components (`ProductCard`, `Container`, `BottomSheet`, `TopBar`, `MenuDrawer`…). Don't copy the inline-style JSX.

**How to view:** open any of the 3 HTML files in a browser. Each one is a pan/zoom canvas showing every screen at 1440 / 768 / 375. A pill switcher at the top links the 3 files. Append `#<board-id>` to a URL to render one screen alone at native width, e.g. `Desktop - Home.html#pdp-a-1440`. Board ids are listed under "Screens" below.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii and interactions are final. The product imagery and bronze gradients are placeholders; real photos come from the API.

## Breakpoints (map to Tailwind)
The mocks switch layout at these artboard widths:
| Mock bp | Width | Tailwind | Notes |
|---|---|---|---|
| sm | <700 | base | Existing mobile. Keep as is except where noted. |
| md | 700–999 | `md:` (768) | Tablet: mobile header + inline search row, wider grids, summary stacks below. |
| lg | 1000–1199 | `lg:` (1024) | Desktop, compact: narrower columns, header search 170px, mega-menu without the "Bán chạy" column. |
| xl | ≥1200 | `xl:` (1280) | Full desktop. |
Content container: `max-width: 1344px` (1280 + 2×32 padding). Horizontal padding: 32 (lg/xl) · 24 (md) · 16 (sm).

## Design tokens (already in globals.css — reuse, don't add)
- Colors: `--ivory #f4ede0`, `--ivory-2 #ece3d1`, `--ivory-3 #e5d9c0`, `--ink #2a1f1a`, `--ink-2 #4a3a2e`, `--muted #8a7761`, `--son #8b1e1e` (primary/CTA), `--son-deep #6a1515`, `--bronze #6b4423`, `--bronze-2 #8a5a30`, `--gold #c9a961`, `--gold-2 #b08a3e`, `--line rgba(42,31,26,.14)`, `--line-2 rgba(42,31,26,.08)`. Card surface `#fffdf7`.
- Type: headings **Lora** 600 (page title 36/34/30/24 by bp; section 32/22), body **Be Vietnam Pro** 400/500/600. Eyebrow `.label-mono`: 10–11px, uppercase, letter-spacing .2em, weight 600, color `--bronze`. Prices `.price-num`: Lora 700, tabular-nums, color `--son`.
- Radii: cards 10px, buttons and inputs 6px, pills 16–20px, hero 12px.
- Buttons: height 50 (44–46 in mobile bottom bars), padding 0 22, 15px/600. Primary: `--son` bg, white text. Secondary: 1.5px `--son` border, `--son` text.
- Shadows: mega-menu `0 28px 40px -28px rgba(42,31,26,.45)`; mobile bottom bar `0 -8px 20px -12px rgba(0,0,0,.25)`.

## Spacing system (all pages)
Use three spacing steps everywhere; don't use ad-hoc margins between sections:
- **Section** `vpad`: 72 / 64 / 56 / 40 (xl / lg / md / sm). Gap between page sections: home sections, PDP → tabs → related, the last block → VisitBlock.
- **Block** `blk`: 32 / 28 / 24 / 20. From a page title or toolbar (tags, filters, search row, map) to its content.
- **Grid** `ggap`: 24 / 20 / 16 / 12. Gaps in card grids.

Every page starts the same way: Breadcrumbs (md+) → `PageTitle` (h1 36 / 34 / 30 / 24 + optional sub), then `blk`, then content. Inside a page, each section starts with `DeskHeading`.

Suggested Tailwind mapping: section `mt-10 md:mt-14 lg:mt-16 xl:mt-[72px]`, block `mb-5 md:mb-6 lg:mb-7 xl:mb-8`, grid `gap-3 md:gap-4 lg:gap-5 xl:gap-6`.

## Global shell
### Desktop header (lg+) — `DeskHeader` in `app/desktop-shell.jsx`
- Sticky, height 76, background `--ivory`, bottom border `--line`.
- Grid `auto | 1fr | auto`:
  - **Logo:** DrumMark 40 plus wordmark (Lora 20/600 `--son`) and tagline (Lora italic 11.5 `--bronze`, hidden at lg).
  - **Nav**, left-aligned after the logo (padding-left 24, gap 28): **Sản phẩm ▾ · Giới thiệu · Cẩm nang · Liên hệ**. Lora 15/500, active = `--son` with a 2px underline.
  - **Right cluster:** search pill (220w, 40h, radius 20), "Tra cứu đơn" outlined pill (icon only at lg), heart and cart icons with count badges.
  - "Trang chủ" is intentionally absent; the logo links home.
  - Each link reserves the bold width (hidden bold duplicate in an inline-grid) so the nav doesn't shift between pages.
- **Mega-menu "Sản phẩm"**, full width below the header:
  - Opens on hover (180ms close delay) or click; Esc closes it.
  - Reveal: `clip-path inset(0 0 100% 0) → inset(0 0 -60px 0)`, 340ms `cubic-bezier(.2,.8,.2,1)`. Columns stagger 40ms each (opacity + translateY 6px).
  - Columns (equal width, headers fixed at 30px so all rules align; "Tất cả … →" pinned to the column bottom with `margin-top:auto`):
    - **Tranh đồng:** Tranh phong thủy · Tranh tứ quý · Tranh chữ thư pháp · Cội nguồn quê hương
    - **Trống đồng:** Mặt trống đồng · Quả trống đồng
    - **Đồ thờ cúng:** Đỉnh đồng · Bộ tam sự · ngũ sự · Hoành phi câu đối
    - **Quà tặng** ("Sắp có" badge): Quà để bàn · Linh vật phong thủy · Quà tặng doanh nghiệp, with the note "Đặt số lượng · khắc logo · hộp quà"
    - **Bán chạy:** 2 product tiles with "từ {price}" (hidden at lg)
  - Link hover: color `--son` and translateX(3px). Tile hover: image scale 1.05, 400ms.
### Tablet header (md)
Hamburger, logo with tagline, then icons (tra cứu, heart, cart). A second row holds a full-width search input. The menu opens the existing `MenuDrawer`.
### Mobile header (sm)
Unchanged pattern: hamburger · centered logo · search icon · cart.
### Breadcrumbs (md+)
13px `--muted`, chevron separators, last item `--ink`. Hidden on mobile.
### Showroom block — `VisitBlock` (above the footer on every page except Liên hệ)
- Full-width band: `--ivory-2` background, top border `--line`, padding 40 (28 at sm).
- Left side:
  - eyebrow "SHOWROOM & XƯỞNG";
  - title "Xưởng sản xuất & Showroom" (Lora 26/24/22);
  - an info row that wraps: pin icon + address, phone icon + hotline (Lora 19/700 `--son`, tabular-nums), clock + "T2–CN: 7:30 – 18:00".
- Right side: 2 equal buttons (max 380w at lg+):
  - **Gọi ngay:** primary, links to `tel:`.
  - **Chỉ đường:** secondary on `#fffdf7`, opens a Google Maps directions URL in a new tab.
- md: the buttons move below the info. sm: everything stacks, the info items become a column, buttons are 2 columns full width.
- **Embedded Google Map** (iframe, `loading="lazy"`, `title`, no API key: `https://maps.google.com/maps?q=<query>&z=15&hl=vi&output=embed`):
  - lg+: the map sits on the right (info 1fr / map 1.15fr, 240h).
  - md/sm: the map goes below the buttons (240/200h).
  - The Liên hệ page uses the same embed at 380/340/300/240h, with a "Chỉ đường →" button overlaid.
  - Buttons are real links: `tel:` and `https://www.google.com/maps/dir/?api=1&destination=<query>`.
  - Replace the query with the shop's exact Google Maps place (or its embed URL from Share → Embed) once confirmed.
- Address, phone and hours must come from one shared config/constant, also used by Liên hệ, the footer and MenuDrawer.

### Footer — `DeskFooter`
- **lg/xl:** 4-column grid `1.6fr 1fr 1fr 1fr`:
  - Brand block: logo, one-line description, 4 round social buttons (40px)
  - **Sản phẩm** (the 4 groups)
  - **Hỗ trợ:** Tra cứu đơn hàng, Hướng dẫn mua hàng, Câu hỏi thường gặp, Cẩm nang
  - **Chính sách:** Đổi trả, Vận chuyển & lắp đặt, Bảo hành, Thanh toán
- Contact details live in `VisitBlock`, not the footer.
- **md:** brand and socials in one row above a rule, then the 3 link columns in one row.
- **sm:** brand row, then the link columns in a 2-column grid.
- Legal bar: 12px, 60% opacity.
- Background `--ink`, text `rgba(244,237,224,.78)`, headings `.label-mono` in `--gold`.
### Mobile bottom action bar
Sticky at the bottom on PDP, Cart and Checkout (sm only): price on the left, CTA(s) on the right. From md up, the CTA lives in the page's buy box or summary.

## Screens (board ids in brackets; each exists at -1440 / -768 / -375 unless noted)
### Desktop - Home.html
1. **Mega-menu open** `[nav-grouped]` (1440 only).
2. **Home** `[home-a-*]` → `src/app/page.tsx`
   - Hero: 2fr/1fr grid (440h at xl) with a main banner, carousel dots and 2 side banners. At md/sm the side banners go below in 2 columns.
   - Category strip: 5 cards in a row (md: 3 columns; sm: horizontal pill scroller).
   - Featured grid: 4 / 3 / 3 / 2 columns, gap 24 / 20 / 16 / 12.
   - **Section order (changed from the live `src/app/page.tsx`, reorder it):** Banner → **TrustBar** (compact strip, directly under the hero) → Category strip → **CampaignsSection** → Featured → Stories → VisitBlock (StoreLocations) → Footer.
     - Why: reassurance first; promos are time-sensitive, so they sit high in the page; a promo CTA leads straight into products.
     - When there are 0 campaigns, Categories flows directly into Featured.
   - Trust bar: compact strip, 4 columns (2×2 at md and below), padding 16/20 (12/10 at sm), title Lora 16 (14 at sm).
   - **Spacing rhythm:** Hero and TrustBar form one group (gap 24 / 16 at sm). Every following section is a `<section>` with the same top margin (72 / 64 / 56 / 40 by bp) and starts with `DeskHeading` (eyebrow + Lora title + optional action + dongson rule). Don't use ad-hoc margins between sections.
   - **Categories:** heading "Mua theo danh mục"; 5 square image tiles (name Lora 17 + count) at md+; at sm a horizontal scroller with tiles 30% wide. Image-led so it reads differently from the text-only TrustBar above.
   - **CampaignsSection** (boards `[campaign-one-*] [campaign-many-*]`):
     - Heading "Ưu đãi / Chương trình khuyến mãi"; the whole section (heading included) is hidden when there are 0 campaigns.
     - Compact red cards (radius 10, padding 26/28): eyebrow "Giảm X · dates", Lora 24 title (28 when there is only 1), one-line description, solid ivory CTA "Xem ưu đãi →" (44h).
     - At xl, and for a single campaign at md+, the CTA sits on the right, vertically centred. Otherwise it goes below, pinned to the card bottom.
     - 2–3 campaigns: grid at md+, horizontal scroller at 85% width at sm.
     - Keep campaigns out of the hero side banners, so the same promo isn't shown twice above the fold.
   - Story cards: 2 columns (1 column at md and below).
3. **Categories index** `[cats-*]` → `src/app/categories/page.tsx`
   - 6-column grid: the first 2 tiles span 3, the other 3 span 2.
   - md: 2 columns, first tile full width. sm: horizontal cards (110px image).
4. **Listing / category** `[list-a-*]` → `src/app/products/page.tsx`, `src/app/categories/[id]/page.tsx`
   - lg+: sticky left sidebar (248px; 216 at lg) with groups Danh mục · Khoảng giá · Kích thước · Màu nền.
   - Sort dropdown top-right, active-filter chips above the grid, 3-column grid (2 at lg).
   - md/sm: category pills, then "Bộ lọc (n)" and sort buttons (these open the existing `BottomSheet`), chips, and a 3- or 2-column grid.
5. **PDP** `[pdp-a-*]` → `src/app/products/[id]/page.tsx`
   - 2 columns (1.25fr / 1fr, gap 56). Left: main image on an `--ivory-2` panel with a thumbnail row **below** it.
   - Right: **sticky** buy box (top 100). It holds eyebrow, title (Lora 38), rating, price, recap chip ("Nền X · Khung Y · Size"), then option rows Kích thước / Khung (+surcharge) / Màu nền (free), then [Thêm vào giỏ][Mua ngay][♡] and a consult line.
   - Below: tabs (Mô tả · Ý nghĩa · Thông số · Đánh giá) on the left, "Thông số chính" card on the right, then related products (4 / 3 / 2 columns).
   - Option buttons are `nowrap` with min-height 44. Price = size multiplier × frame surcharge; background color is free.
   - md/sm: single column, the buy box is not sticky, and sm uses the bottom action bar.
6. **Saved** `[saved-*]` → `src/app/saved/page.tsx`. Same grid as the listing, plus a "Thêm tất cả vào giỏ" button (md+).
### Desktop - Mua hang.html
7. **Cart** `[cart-*]` → `src/app/cart/page.tsx`
   - lg+: table (Sản phẩm | Số lượng | Thành tiền | ×) on the left, sticky summary card (400px; 320 at lg) on the right.
   - md/sm: item cards, the summary stacks below, and sm uses the bottom bar.
8. **Checkout** `[checkout-*]` → `src/app/checkout/page.tsx`
   - Left: recipient form (2-column fields; address and note span both columns), then payment options (3 cards: COD / Chuyển khoản / Tại showroom).
   - Right: sticky items list and summary.
   - md/sm: items first, then the form; sm uses the bottom bar.
9. **Order lookup (secure)** `[orders-*]` plus state boards `[lk-list] [lk-verify] [lk-locked] [lk-detail]` → `src/app/orders/page.tsx`. See the security section below.
10. **Order detail** `[order-*]` → `src/app/orders/[id]/page.tsx`
    - Left: progress stepper (horizontal; vertical on sm) and item list.
    - Right: sticky payment summary, a masked address card and a contact button.
### Desktop - Noi dung.html
11. **Cẩm nang (blog list)** `[blog-*]` (new route): tag pills, then a featured post (image and text side by side at lg+), then a 3 / 2 / 1-column grid.
12. **Bài viết (article)** `[article-*]` (new route): 760px reading column, title in Lora 42, 16:8 cover image, body 17.5 / 1.8, an info table card, a Zalo CTA block and related posts.
13. **Liên hệ** `[contact-*]` (new route): map embed area (380h) with a pin and "Chỉ đường" button; info list (hotline, address, hours, email) with Gọi/Zalo buttons; a message form with a success state.
14. **FAQ** `[faq-*]` → `src/app/faq/page.tsx`: 760px column, accordion.
15. **Hướng dẫn mua hàng** `[guide-*]` → `src/app/huong-dan-mua-hang/page.tsx`: 760px column with numbered steps.
16. **Giới thiệu · Làng nghề** `[craft-*]` → `src/app/lang-nghe/page.tsx`: full-bleed hero, then alternating image and text sections (2 columns; stacked at md and below), then a visit CTA.

## Order lookup — security (needs backend work)
The current flow shows full order data from a phone number alone. **The API must enforce the following; hiding data in the UI is not enough.** Flag this to the `dodongtruongthoi_be` owner; don't change API shapes from the FE repo.
1. **Phone only → summary list.** Order code masked (`DH-2•••42`), plus date, status and product names. No price, address or recipient name.
2. **"Xem chi tiết" → verify with order code or OTP.**
   - Order code: sent by SMS/Zalo at checkout.
   - OTP: 6 digits via Zalo or SMS, 60s resend cooldown.
3. **Wrong attempts:** each one shakes the error box (260ms) and shows the remaining count. After **5** failures, lock that phone for **15 minutes** (lock screen with Gọi/Zalo buttons).
4. **Verified detail:** a session of about 15 minutes. The address stays partially masked (`•• ngõ •• Láng Hạ…`), as does the phone (`0899 ••• 288`).
5. Rate-limit lookups per phone number and per IP.

## Interactions summary
- Mega-menu: see the header section.
- Step and screen transitions in the lookup flow: `lkIn` (opacity with translateY 8px, 280ms).
- Input focus: border `--son` and ring `0 0 0 3px rgba(139,30,30,.1)`.
- Nav hover: color `--son`, 160ms.
- Horizontal scrollers (`.noscroll`) hide the scrollbar.

## Components to create or update in the repo
- **Desktop header:** replace the dead `Header.tsx` with it. Show at `lg:`, keep `TopBar` below `lg`.
- **MegaMenu, Breadcrumbs, FilterSidebar:** new; FilterSidebar is desktop-only, `BottomSheet` stays for mobile.
- **Footer:** rework `Footer.tsx`.
- **VisitBlock:** new, rendered in the root layout above the footer and hidden on `/lien-he`.
- **Order lookup:** new `OrderLookup` state machine (phone → list → verify → locked | detail).
- **New pages:** `BlogList`, `BlogPost`, `ContactPage`.
- Verify `ProductCard`, `Carousel`, `CatPill` and `ContactBubbles` at 3–4-column widths.

## Data notes
- Menu groups, footer links and the category list (`DESK_CATS`, `MENU_GROUPS` in `desktop-shell.jsx`) are the intended taxonomy. Replace them with API categories when the API has them.
- "Quà tặng" is marked "Sắp có". Once live: desk gifts use the normal cart flow; corporate gifts use a "Nhận báo giá" inquiry form (quantity, engraving, date) instead of the cart.
- Products, prices and posts in `data.jsx` / `desktop-content.jsx` are mock data.

## Files
- `Desktop - Home.html`, `Desktop - Mua hang.html`, `Desktop - Noi dung.html`: canvases; open in a browser.
- `app/desktop-shell.jsx`: tokens use, breakpoints hook, header, mega-menu, breadcrumbs, footer, bottom bar.
- `app/desktop-screens.jsx`: Home, Listing, PDP, Cart.
- `app/desktop-pages.jsx`: Categories, Checkout, Orders (legacy), Order detail, Saved, FAQ, Guide, Làng nghề.
- `app/desktop-orders.jsx`: secure order lookup flow.
- `app/desktop-content.jsx`: Cẩm nang, Bài viết, Liên hệ.
- `app/desktop-canvas.jsx`: board list and page switcher (viewer only).
- `app/ui.jsx`, `app/icons.jsx`, `app/data.jsx`: shared primitives (ArtPiece, ProductCard, swatches, icons) and mock data.
- `assets/`: sample product image and the chim Lạc mark.
