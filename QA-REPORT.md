# QA Report — Design Handoff vs. Implementation

Date: 2026-10-19. Scope: full storefront + CMS, per `docs/handoff/QA-PROMPT.md`. Compared live site (`https://dodong.store`, built from `main`) against `docs/handoff/HANDOFF.md`, `docs/handoff/app/tokens.css`/`storefront.css`/`admin.css`, the design canvases (`Cua hang 1-4`, `Noi dung.html`, `CMS.html`), and reference `app/*.jsx`.

**Method note (applies to every section below):** audits ran as 6 parallel agents sharing one Playwright browser instance; tabs were repeatedly hijacked/renavigated by other concurrent agents. Each section recovered some live screenshots but leaned on direct source-code comparison (reading the actual shipped components against `HANDOFF.md` rules and the reference jsx values) as the documented fallback. This is noted per-finding where visual confirmation is missing. CMS (Section F) could not get a stable authenticated session at all — audited from code only; login itself is unconfirmed either way (not a verified `admin`/`admin` failure).

**Prior product decision carried into this audit:** Staff & roles / multi-user RBAC (`adm-staff-*` boards) is intentionally out of scope — the owner explicitly chose to stay on one admin account for now. Listed under Missing states, not scored as a defect.

---

## Section A — Tokens, Global Shell, Home, Campaigns

### Tokens (`color`, `type`)
Route: n/a (CSS). Files: `src/app/globals.css`, `src/app/layout.tsx`. Boards: `color`, `type`.
- [all] `tokens.css` vs `globals.css` — name-for-name match confirmed, including every `NEW` token. **Pass.**
- [all] Fonts load per HANDOFF.md:92 exactly (Playfair/Be Vietnam Pro/Lora). **Pass.**
- [all] Disabled-button opacity 0.45 rule present in `.paper button:disabled, .adm button:disabled`. **Pass** (but see Section C — cart/checkout aren't wrapped in `.paper`, so this rule doesn't reach them).
- [all] `globals.css:331-337` (`.frame-bronze`) and `:312-317` (`.bronze-art.dark`) hardcode gradient rgba values drifted from `--border-gold` — minor.
- [all] `.brand-focus:focus-visible` (`globals.css:555-559`) hardcodes `rgba(139,30,30,0.1)` instead of `var(--accent-subtle)` (`0.08`) — minor, token-system violation (also found independently in Section D on the same selector).

### Global shell — Desktop header (`DeskHeader`)
Route: every page. Files: `Header.tsx`, `MegaMenu.tsx`, `Logo.tsx`. Boards: `nav-grouped`, `home-1440/1280/1024`.
- [lg/xl] Sticky header, mega-menu hover (180ms close), Esc close, clip-path reveal 340ms + 40ms stagger, "Bán chạy" hidden at lg, tagline hidden at lg — all match. **Pass.**
- One `<Logo/>` reading one SVG, reused in Header/Footer. **Pass** (artwork itself out of scope).

### Global shell — Tablet/mobile header (`TopBar`)
- [md/sm] Matches HANDOFF.md:48 exactly. **Pass.**

### Global shell — Footer (`DeskFooter`)
- [lg/xl/md/sm] Grid, padding, column counts all match HANDOFF.md:57. **Pass.**

### Global shell — VisitBlock (Showroom)
Files: `VisitBlock.tsx`, `lib/constants.ts`.
- [lg] expected map height 220px (xl/lg/md/sm = 240/220/240/200) — actual: only `h-[200px] md:h-[240px]`, lg renders 240 instead of 220 — minor.
- [md] expected gap 40px at md — actual `gap-5 md:gap-6 lg:gap-10` = 20/24/40, md renders 24 instead of 40 — minor.
- [all] Address/phone/hours confirmed from one shared `STORES[0]` config, reused by VisitBlock/MenuDrawer/Footer. **Pass.**

### Home — Hero / Banner (`BannerSection`)
Route: `/`. File: `BannerSection.tsx`. Boards: `home-1440/375`.
- [all] expected h1 in `--font-heading` (Playfair) — actual: uses `var(--font-lora), serif` (`--font-accent`, wordmark/tagline-only token) on a real heading — **major**.
- [xl/lg/md/sm] expected sizes 72/60/54/40 — actual `text-[26px] md:text-[38px] lg:text-[46px]` (no xl step) — 30-40px smaller than spec at every breakpoint — **major** (also a question: may be an intentional carousel restyle, but the font-token choice is unambiguously wrong regardless).
- [all] expected 4-tile trust-badge strip below hero ("Đồng nguyên chất 99%" etc.) — **entirely missing** — **major**.
- [sm/md] Hero has no container padding/max-width below `lg` while every other section does — flagged as a question (may be intentional full-bleed), not asserted as a bug.
- [sm] Banner subtitle renders at 11.5px, under the 12px minimum (HANDOFF.md:101) — minor.

### Home — Theo dịp / Danh mục / Chi tiết thủ công / Dịch vụ quà biếu / Làng nghề band / Ảnh khách hàng
- [all] All six sections use the compliant `SectionTitle` component and the correct vpad scale (40/56/64/72). Section order matches HANDOFF.md:106. **Pass**, no issues.

### Home — Sản phẩm được yêu thích (`FeaturedProductsSection`)
- [all] Hand-rolls its own heading instead of `SectionTitle`: eyebrow uses JetBrains Mono, 10px, uppercase (exactly the pattern HANDOFF.md:102 says to stop using); title uses `--font-accent` (Lora) at 24px instead of `--font-heading` — triple violation on the Home page's most visible section — **major**.
- [all] "Xem tất cả →" link also set to `--font-accent` — minor.
- [xl/lg/md/sm] vpad is `mt-6 md:mt-10 lg:mt-14 xl:mt-[72px]` (24/40/56/72) — every breakpoint but xl is one tier below spec, inconsistent with every sibling section — **major**.
- [all] heading-to-grid gap is a flat 16px, not on the 32/28/24/20 scale — minor.
- [all] `ProductCard.tsx` itself (price-num, title/subtitle font, campaign end-line) matches spec exactly — **pass**.

### Home — Khuyến mãi (`CampaignsSection`)
- [all] Campaign price rounding, "≤3 days → Còn n ngày", higher-discount-wins overlap resolution, 1-vs-2+ campaign layout, vpad scale — all implemented exactly per HANDOFF.md:117/153-154. **Pass**, no issues.

### Home — "Cẩm nang" section (missing) / `StoriesSection`
- [all] HANDOFF.md:106 specifies a "Cẩm nang" (blog teaser) section as the last content block before Showroom. Actual: no such section exists; `StoriesSection` renders instead, with every card linking to `/lang-nghe` (duplicating `CraftBandSection`'s target earlier on the same page) rather than `/cam-nang` — **major**.
- [sm/md/lg/xl] `StoriesSection` eyebrow and card eyebrow use JetBrains Mono (10-12px, uppercase) and headings use `--font-accent` (Lora) at both mobile and desktop widths — **major** (4 instances: mobile eyebrow, card eyebrow, h3 title, desktop card title/link).
- **Root cause:** `src/components/ui/SectionHeading.tsx` and `Heading.tsx` both default headings to Lora and eyebrows to JetBrains Mono uppercase — a second, non-compliant heading system coexisting with the correct `SectionTitle.tsx`. Flagging the shared root cause since a StoriesSection-only patch would miss other call sites (confirmed reused in Sections B and E too) — **major**.

**Section A summary:** Blocker 0 · Major 12 · Minor 8.

---

## Section B — Categories, Product Listing/Filters, PDP, Share Sheet, Saved, Sync-by-Phone

### Categories index
Route: `/categories`. File: `categories/page.tsx`. Board: `cats-1440`.
- [xl/lg/md] expected image + separate solid caption band below (board `cats-1440`) — actual: full-bleed image with text overlaid via a dark gradient — **major**.
- [all] expected 56px icon badge on error/empty states (`StBlank` reference) — actual: `StateBox` has no icon at all — **major**.
- [all] error state uses a dashed border not seen in any reference — minor.
- [all] Error retry (SWR `mutate()`), empty-state link, VisitBlock+Footer present — **pass**.

### Category detail (listing + filters)
Route: `/categories/[id]`. Files: `categories/[id]/page.tsx`, `FilterSidebar.tsx`, `BottomSheet.tsx`.
- [all] `useSWR`'s `error` is never destructured — a real fetch failure and a genuinely empty category render the identical "Không tìm thấy sản phẩm" box with **no retry**, unlike the sibling `/products` page which correctly implements `listFailed`/"Thử lại" — **blocker**.
- [all] No "filtered, no match" state (removable chips + "Xoá bộ lọc") — only `/products` has this — **major**.
- [all] Grid/List toggle renders a second bespoke card (`CatListRow`) instead of `ProductCard` when "list" view is active — violates "one ProductCard everywhere" (HANDOFF.md:149) and isn't in any board — **major** (also a question: intentional scope addition or remove?).
- [all] Inside `CatListRow`: category eyebrow uses JetBrains Mono, title/subtitle use Lora instead of `--font-body` — **major**.
- [all] `Btn.tsx` defaults (radius 2, 9-12px padding, 12px text) have nothing to do with the storefront button spec (height 50/radius 6/15px-600); BottomSheet footer buttons pass no override at all — **major**.
- [lg/xl] `FilterSidebar` otherwise matches the board (Danh mục/Khoảng giá/Kích thước/Màu nền, sticky). **Pass.**
- [all] Campaign price math (rounding/soon-days/overlap) verified correct by source read. **Pass.**

### Product listing (all products / search)
Route: `/products`.
- [xl] Loading-state layout screenshot-confirmed correct. **Pass.**
- [all] Same Grid/List + `ProductsListRow` font-token issue as above — **major**.
- [all] `Price.tsx` (used by list rows + search) hardcodes Lora, no tabular-nums — a second, inconsistent price rendering vs. the correct `ProductCard.tsx` — **major**.
- [all] `ActiveFilterChips` (removable chips, "Xóa tất cả") matches `st-list-filtered-*` closely. **Pass.**
- [all] Distinct error/empty/search-no-match/filtered-no-match branches all present, missing only the icon badge noted above — **major** (same gap as Categories).
- [all] Same `Btn.tsx` issue on "Xem thêm sản phẩm" and sort/filter footer buttons — **major**.

### PDP (with/without campaign)
Route: `/products/[id]`.
- [all] Price block (struck price, −n% badge, campaign banner, VAT line) matches the reference exactly. **Pass.**
- [md+] Desktop CTA row correctly hand-styled at height 50/radius 6, bypassing the broken `Btn.tsx` defaults. **Pass.**
- [sm] `BottomActionBar` present per spec — not visually confirmed, flagged as a question.
- [all] `ArtPiece.tsx` zero-image placeholder label uses JetBrains Mono — minor (edge case).
- [all] Related products correctly reuse `<ProductCard>`. **Pass.**

### Share sheet
- [md+] Popover reuses the same 4-tile grid as the mobile sheet instead of the board's row layout (icon+label+subtext, 3 targets), and adds a 4th target (Messenger) not on any board — **major**.
- [all] "Copied" confirmation is a plain paragraph instead of either designed pattern (inline row / floating toast) — minor.
- [md+] No speech-bubble caret on the popover — minor.
- [all] Error/fallback state, "opening" timing (1400ms), 44×44 trigger button all match exactly. **Pass.**

### Saved
Route: `/saved`.
- [all] Title/count/device-note/CTA/empty-state all present and copy-consistent. **Pass.**
- [all] Empty state **does** include the 56px icon badge, unlike Categories/Products listing states — inconsistent across the app (cross-page finding) — **major**.
- [all] Correctly reuses `<ProductCard>` with a heart-toggle overlay. **Pass.**

### Sync by phone + OTP
- [all] Three-stage state machine, consent-gated send, 60s resend cooldown, 5/hour rate limit, "Tắt đồng bộ" deleting the server copy, options A/C correctly dropped — all match HANDOFF.md:160 exactly. **Pass.**
- [all] OTP entry is a single tracked-letter-spacing text input instead of the board's 6 separate boxed digit cells — **major** (visual mismatch, functionally equivalent).

**Section B summary:** Blocker 1 · Major 13 · Minor 4.

---

## Section C — Cart, Checkout, Bank Transfer, Confirmation

### Cart
Route: `/cart`.
- [1440] `Container` max-width/padding, `BottomActionBar` `md:hidden` gating — match exactly. **Pass.**
- [all] Expired-campaign notice has no icon and an unwanted background box vs. the reference's icon+plain-row — minor.
- [all] `cart-prices.ts`'s `fallbackPrice` can override `variantSale()`'s correct "revert to list price" behavior when a campaign has expired but `product.discountPrice` is still populated — would show a stale discounted price *and* the "price was updated" notice simultaneously, a self-contradicting UI — **major** (needs BE confirmation on whether `discountPrice` is cleared server-side on expiry).
- [all] No "Khuyến mãi '<name>' −X" savings line in the cart summary, unlike the reference — minor.
- [all] `QtyStepper` decrement uses `disabled:opacity-40`, not the spec's 0.45 — **major** (grouped with Checkout's instance below; root cause: cart/checkout aren't wrapped in `.paper`, so the site-wide disabled-opacity rule never reaches them).

### Checkout — form & payment method
Route: `/checkout`.
- [1440] Form layout, 3-tile payment radiogroup, two-column structure — all correct. **Pass.**
- [1440] Bank-panel field order (Ngân hàng→Chủ tài khoản→Số tài khoản) differs from the reference's order — minor.
- [1440] "Số tiền" row shown in checkout mode when the reference gates it to confirm-mode only — minor.
- [1440] Memo row always rendered in a highlighted dashed box even before it has a value, where the reference reserves that treatment for confirm mode — minor.
- [1440] No "Chờ chuyển khoản"/"Đã nhận thanh toán" status pill on the bank-panel header, in either mode — **major**.
- [1440] Disabled-opacity token violated: checkout submit + BottomActionBar CTA use `opacity-70`. Root cause confirmed via repo-wide grep: `cart/page.tsx` and `checkout/page.tsx` are not wrapped in `.paper`, so the `.paper button:disabled{opacity:.45}` rule never applies — **major**, affects 3+ buttons across both pages.
- [question] "Tại showroom" exists as a 3rd payment method; not independently confirmed against a board — not scored.

### Confirmation (bank transfer + order tracking)
- [code] All 4 `BankTransferPanel` states (loading/error/ready/paid) exist in code. **Pass.**
- [1440/375] "Paid" interaction model diverges from the design: the reference shows a backend-confirmed receipt with an exact timestamp and no button; the live app adds a customer "Tôi đã chuyển khoản" button that only flips local state — no API call, no persistence, reverts on refresh, no signal reaches staff. The copy is honestly hedged about this, but it's a real gap — **major** (needs BE: should this POST somewhere, or be driven by a real payment-status field?).
- [1440] "Theo dõi đơn hàng →" CTA is 48px vs the 50px spec — minor.
- Right column is 320px at `lg` vs. the reference's 340px — minor, reads as an intentional simplification (consistent 320/400 split used everywhere).
- [1440/375] `maskPhone` usage on the tracking panel matches the reference structure exactly. **Pass.**
- [1440/375] Header cart-count badge stays stale (shows "1") right after checkout clears the cart, until a route change — minor.

**Section C summary:** Blocker 0 · Major 4 · Minor 8.

---

## Section D — Order Lookup & Order Detail

### Phone step / masked list (`lk-list`)
Route: `/orders`.
- [1440] Phone-entry screen matches the board almost verbatim. **Pass.**
- [all] 4-step progress indicator (`<ol>`) is `hidden md:flex` — absent entirely below 768px, with no mobile board to confirm intent either way — minor/question.
- [1440] List columns (Mã đơn/Ngày đặt/Sản phẩm/Trạng thái), masked code format, masked phone, and the "ẩn cho tới khi xác minh" footer note all match the board exactly at the rendering level. **Pass.**
- **[BLOCKER — backend]** `GET /api/v1/orders?phone=` (`public_handler.go:248-271`) serializes `total_amount` in every summary row, contradicting both HANDOFF.md:64's "no price at summary stage" rule and the struct's own doc comment claiming prices are omitted. The frontend doesn't render it, but the raw network response leaks every order's total before any verification.
- **[BLOCKER — backend]** That same `GET /orders` endpoint has **zero rate limiting** (per-IP or per-phone) — `router.go` only rate-limits `POST /orders` and `POST /orders/verify`. Combined with the leak above, phone numbers can be scraped for order totals with no throttling.
- **[Needs BE check]** The existing per-IP limiter is in-memory, not shared — degrades on any multi-instance deployment.

### Verify (`lk-verify`)
- [1440] Copy, code input, footer links all match the board 1:1. **Pass.**
- [1440] Live code masks the order id in the verify title (board shows it unmasked) — the app is being *more* conservative than the design, not a bug — minor/question.
- **[Missing feature — major]** HANDOFF.md:65 requires verify by order code **or** 6-digit OTP (Zalo/SMS). The OTP tab is UI-disabled ("Sắp có") and confirmed server-side: no `/otp` route exists anywhere in the backend router. Also blocks the "Đã lưu" sync feature's planned OTP reuse (HANDOFF.md:160).
- [all] `lk-in` transition (280ms) and wrong-attempt shake (260ms + remaining count) both match exactly. **Pass.**

### Locked (`lk-locked`)
- [1440] Copy, countdown, Gọi/Zalo buttons match. **Pass.**
- [backend] 5 attempts / 15-minute lock verified server-authoritative and matching HANDOFF.md:66-67 exactly, with correct client/server trust boundary. **Pass.**
- [backend] Verify failures don't reveal whether a phone has any orders at all — good anti-enumeration design, noted as a positive, in contrast to the un-rate-limited list endpoint above.

### Order detail — verified (`lk-detail`, `order-*`)
- [1440/375] Layout, verified banner, masking (`N. V. An · 0899 ••• 288`, house-number tokens masked) all match the board exactly. **Pass.**
- [backend] 15-minute verified-session TTL matches and is server-authoritative, with correct frontend expiry handling. **Pass.**
- **[Needs BE check — not a spec violation]** `GetOrder` returns the fully unmasked order (full phone/address/name) once token-authorized; masking is presentation-only by design per the code's own comment. HANDOFF only requires UI-level masking, so this isn't a violation, but it means full PII is visible in DevTools for any verified session — worth an explicit sign-off.

### Offline state
- [1440] Matches the board exactly (copy, retry button, Gọi/Zalo). **Pass.**
- [1440] Board's "Mã đơn gần nhất trên máy này" fallback reference is not implemented anywhere — minor.

### Cross-cutting
- [all] Buttons across this flow use 48px/44px heights, not the spec's 50px — consistent across the whole flow, reads as a deliberate scale choice — minor.
- [all] `.brand-focus:focus-visible` hardcodes a slightly-off, non-token rgba (same root cause as Section A's finding on the same selector) — minor.
- [all] Disabled-opacity 0.45 rule correctly applied on every button in this flow. **Pass.**

**Section D summary:** Blocker 2 (both backend) · Major 1 · Minor 6.

---

## Section E — Content Pages (Blog, Article, Contact, FAQ, Guide, Craft Village)

### Blog list / Blog article
Routes: `/cam-nang`, `/cam-nang/[id]`.
- [1440/375] Both match their boards closely — title scale, tag filters, featured card, grid, breadcrumbs hidden on sm, Container padding, section spacing — all per spec. **Pass.**
- [question] Article h1 uses a larger type scale than the generic page-title spec, but the board itself shows the same deviation — not scored.

### Contact (Liên hệ)
Route: `/lien-he`.
- [1440] Normal state matches the board; VisitBlock correctly absent (the one page it should be). **Pass.**
- [1440] **Error state** (`cs-contact-error-1440`): the board shows a full map/hours/"Chỉ đường" fallback band below the error card. The live `ContentState` error body only inlines a phone + address line as small text — HANDOFF.md:133's literal rule ("keeps phone/Zalo/address visible") is technically met, but the board's richer fallback is missing — **major**.

### FAQ
- [1440] Matches the board exactly — accordion behavior, type sizes, no Playfair on Q&A. **Pass.**

### Buying guide
Route: `/huong-dan-mua-hang`.
- [1440] Nested sub-steps render with **no number markers** — confirmed via computed style (`listStyleType: "none"`) that Tailwind's preflight strips list markers and no `list-decimal` class was added. Board shows numbered sub-steps — **major**.
- [1440] Top-level step numbers (explicit `<span>`) render correctly. **Pass.**

### Craft village (Làng nghề)
Route: `/lang-nghe`.
- [1440] Duplicates the Home page's "6 công đoạn thủ công" steps-grid section, which HANDOFF.md:106 assigns to Home only — this section doesn't exist on the `craft-1440` board at all — **major**.
- [1440] Inter-section gap is 8px off the canonical scale at `sm` (48px via `gap-12` instead of 40px) — minor.
- [1440] Story rows, eyebrow styling, bottom CTA block all otherwise match the board. **Pass.**

### Missing states/screens
- `ContentState` correctly implements loading/error for all 6 content kinds, wired to every route's `loading.tsx`/`error.tsx`. **Pass** structurally — but currently unreachable live since none of these pages fetch async data yet (static in-memory content, consistent with HANDOFF.md:82).
- One boardless screen: the generic Next.js `not-found.tsx` (hit by an invalid article id) drops the entire site shell — no header/breadcrumbs/VisitBlock/footer — flagged as a question, not scored.

**Section E summary:** Blocker 0 · Major 3 · Minor 2.

---

## Section F — CMS (Admin)

**Login/screenshot caveat:** could not get a stable authenticated Playwright session (shared-browser contention); audited from full source read of every admin page/component plus the reference jsx, per HANDOFF's own equivalence rule. Not a confirmed credential failure.

### Tokens / Global shell
- [all] `--admin-*`/`--print-*` tokens and the `.adm` scope match `tokens.css`/`admin.css` exactly. **Pass.**
- [all] 4 nav groups (Bán hàng/Sản phẩm/Tiếp thị/Hệ thống) implemented exactly. **Pass.**
- [all] **7 screens** (`categories`, `banners`, `customer-photos`, `images`, `reviews`, `settings`, `contacts`) plus the `/admin/login` page are saturated with raw hex literals instead of `--admin-*` tokens — **major**, systemic.
- [all] The same 7 screens + login are entirely in **English**, while every other CMS screen is fully Vietnamese via `ADMIN_COPY` — **major**, systemic inconsistency (not placeholder-copy scope).
- [all] Same 7 screens + Products each re-declare local ad-hoc style objects instead of reusing `OrderPrimitives.tsx`'s shared primitives; Products additionally uses raw emoji glyphs instead of `lucide-react` icons used everywhere else — **major**.

### Dashboard
- [1440] Board's "Hôm nay/7 ngày/30 ngày" period-toggle control is entirely missing; the 30-day window is hardcoded — **major** (missing interactive control, not a style tweak).
- [1440/375] Bank-transfer queue item can never distinguish "received" from "not received" — there's no such field on `AdminOrder` at all — **major**, needs BE.
- [1440] Loading/error/empty/clear per-card states all implemented and match board behavior. **Pass.**

### Orders list
- [1440/375] Bulk toolbar is simplified to one status `<select>` + "Áp dụng" — missing the board's one-click "Xác nhận N đơn" shortcut and in-bulk-bar print/export — **major**.
- Other diffs (checkbox style, date-filter pattern, mobile pager pattern, bulk-bar tint) are minor. Loading/empty/error/bulk-progress/export states all implemented and in some ways more thorough than the board (per-row bulk-failure reasons). **Pass** on state coverage.

### Order detail / Invoice
- [1440/375] No bank-transfer received/unpaid tracking anywhere (consistent with Dashboard finding — no such field exists) — **major**, needs BE.
- [1440] Status-update toast has no "Hoàn tác" undo, unlike HANDOFF's general toast rule — minor/major judgment call, not a broken flow.
- [1440] Invoice: tokens, layout, and print setup (`@page`, print variants) all match the board. **Pass.** Footer is missing the GTGT-disclaimer/warranty/page-count line — minor.
- Everything else (next-step card, items table, progress timeline, notes, customer actions) matches closely. **Pass.**

### Products
- [1440/375] **"Hoàn tác" (undo) doesn't undo** — `handleToggleActive(id, currentValue)` closes over the pre-toggle value, so clicking undo re-applies the same toggle instead of reversing it. The failure-toast "Thử lại" button uses the same call correctly (retry should repeat the action) — only the undo path is broken — **blocker**.
- [1440/375] Thumbnails never render a real photo — always an empty gray box, for every product — **major**.
- [1440] "Kho" (stock) column hardcoded to `0`, "Cập nhật" hardcoded to a fixed date, for every row — **major** ×2, dead stubs that look like real data.
- [1440] Category/display filter buttons have no handlers at all — dead UI — **major**.
- [1440] No persistent "+ Thêm sản phẩm" header action once the list has rows (`AdminFrame` has no actions slot) — **major**.
- [1440] No pagination anywhere on this page — **major**.
- Loading/error/empty/optimistic-toggle states are otherwise correctly structured. **Pass** aside from the undo bug.

### Campaign form
- [1440] Price-rounding formula, overlap "higher discount wins", past-start-date warning ("Lưu và chạy ngay"), end≤start blocking error — all verified correct against HANDOFF.md's behaviour rules. **Pass**, no issues.
- [1440] `cf-loadError` state is unreachable (no per-campaign fetch-by-id) and the list-load failure path has no `catch` at all — an unhandled promise rejection with zero error UI — **major**.
- Minor diffs: overlap hint not surfaced in the form UI, disabled-save opacity 0.7 vs spec's 0.45, "Tạo mới" instead of a true "Huỷ"/cancel, no mobile sticky action bar.

### Inbox
- [1440/375] All primary states (loading/error/empty/marking/marked) present and correct. **Pass.**
- Minor gaps: confirmation is an inline line rather than a toast with "Hoàn tác" (though an undo path exists via re-clicking); no VIP badge or lead-source line — data model doesn't carry these fields (needs BE check).

### Audit log
- [1440/375] Mixes storefront tokens (`text-text-muted`, `bg-accent`, etc.) into a CMS screen, breaking the stated token-set separation — **major**.
- [1440] Actor's **role** is never shown — not modeled on the `AuditEntry` type at all, despite HANDOFF's explicit "actor, role, time, before→after" requirement — **major**, needs BE.
- [1440] Before→after rendered as raw `JSON.stringify` output instead of a readable sentence — **major**, defeats the log's purpose for a non-technical admin.
- [1440] Changed object shown as a raw UUID fragment instead of a readable label — **major**, same readability problem.
- Minor: no actor filter, no pagination, loading/empty/error states are plain text with no skeletons (unlike every other screen).

### Staff & roles
Confirmed absent from the codebase — **intentionally deferred per product decision**, not scored.

### Spot-checked screens (no dedicated board)
`/admin/categories`, `/admin/banners`, `/admin/customer-photos`, `/admin/images`, `/admin/reviews`, `/admin/settings`, `/admin/contacts` — all share the two systemic cross-cutting issues above (hex colors, English copy); scored once there, not repeated per screen.

**Section F summary:** Blocker 1 · Major 19 · Minor 21.

---

## Missing states/screens (consolidated)

| Board / state | Screen | Status |
|---|---|---|
| `st-list-error` | `/categories/[id]` | Missing — `error` never read from `useSWR`; no retry (**blocker**) |
| `st-list-filtered` | `/categories/[id]` | Missing — only `/products` has the chips+clear UI |
| Icon badge on `StBlank` | `/categories`, `/products` state boxes | Missing — present on `/saved`, inconsistent elsewhere |
| 6-box OTP entry | Saved sync | Different implementation (single input, not 6 boxed cells) |
| Popover row layout, 3 targets | Share sheet ≥md | Different implementation (reuses mobile 4-tile grid + extra target) |
| Share popover caret | Share sheet ≥md | Missing |
| Bank-panel status pill | Checkout + Confirmation | Missing entirely, both modes |
| OTP verify path | Order lookup | UI present but disabled; zero backend route exists |
| "Mã đơn gần nhất" offline fallback | Order lookup offline | Not implemented |
| Home "Cẩm nang" (blog teaser) section | `/` | Missing — replaced by `StoriesSection` pointing elsewhere |
| Home trust-badge strip | `/` hero | Missing entirely |
| Contact error map/hours fallback | `/lien-he` error state | Missing — only phone/address text shown |
| Numbered guide sub-steps | `/huong-dan-mua-hang` | Markers stripped by Tailwind preflight, no `list-decimal` added |
| `adm-staff-*` (Staff & roles) | CMS | Intentionally deferred per product decision — not scored |
| `cf-loadError` | Campaign form | Unreachable; list-load failure is an unhandled rejection with no UI |
| Dashboard period toggle | CMS Dashboard | Missing entirely |
| Order "paid"/reconciled state | Order detail, Dashboard queue | Missing — no data field, no UI |
| `AdmPager`-equivalent | Products, Audit log (CMS) | No pagination on either |

## Backend items that can't be verified from the frontend ("Needs BE check")

**Security-relevant (flag first):**
- `GET /api/v1/orders?phone=` serializes `total_amount` in every summary row before verification — contradicts HANDOFF.md:64 and the endpoint's own doc comment. **(Blocker)**
- Same endpoint has no rate limiting at all (per-IP or per-phone), unlike the verify/create endpoints. **(Blocker)**
- Existing per-IP rate limiter is in-memory, won't hold its bound across multiple backend instances.
- `GetOrder` returns fully unmasked PII once token-authorized; masking is presentation-only by design (not a spec violation, but worth explicit sign-off).

**Other:**
- OTP delivery (order lookup + saved-sync reuse) — no backend route exists at all, not just unverifiable from the frontend.
- Saved-sync endpoints (`/saved/otp`, `/saved/verify`, `/saved` GET/PUT/DELETE) — not built yet; frontend degrades gracefully.
- Whether `product.discountPrice` is cleared server-side once a campaign's `endsAt` passes (cart expired-price revert depends on this).
- Bank-transfer "paid" self-report has no backend call/persistence — confirm intended integration (webhook vs. CMS-set flag).
- Bank account details are placeholder pending real info from the owner (out of scope as mock-data values, but blocks real bank-transfer payments today).
- Bank-transfer "received/reconciled" field doesn't exist on `AdminOrder` — needed for Order detail + Dashboard queue to mean what the design says.
- Audit log: actor role not in the API/type; 12-month retention is a DB policy question.
- Inbox: lead-source (`Nguồn`) and "Đơn lớn" (VIP) fields not in `ContactMessage`.
- Products list: whether `/products` even returns stock/updated_at (currently hardcoded stubs regardless).
- Campaign price enforcement at order time — frontend logic is explicitly display-only, server enforcement unverifiable from here.
- Zalo share URL endpoint correctness — flagged as unconfirmed in the code's own comment.
- `/api/v1/settings` active-theme correctness in production — token values verified, live value not.
- Contact form submission rate-limiting/spam handling.
- Live, authenticated CMS screenshot verification (loading/error/toggle-fail states, print-preview rendering) — not completed this session (tooling contention), not a confirmed login failure.

## Summary counts (grand total)

| Severity | A (Home/Nav) | B (Categories/PDP) | C (Cart/Checkout) | D (Order lookup) | E (Content) | F (CMS) | **Total** |
|---|---|---|---|---|---|---|---|
| Blocker | 0 | 1 | 0 | 2 | 0 | 1 | **4** |
| Major | 12 | 13 | 4 | 1 | 3 | 19 | **52** |
| Minor | 8 | 4 | 8 | 6 | 2 | 21 | **49** |

**4 blockers**, in order of severity:
1. Backend: order-lookup phone-summary endpoint leaks `total_amount` pre-verification.
2. Backend: same endpoint has no rate limiting at all.
3. `/categories/[id]` never surfaces a fetch error — real server errors look identical to "no products," with no retry.
4. CMS Products "Hoàn tác" (undo) button re-applies the same toggle instead of reversing it.
