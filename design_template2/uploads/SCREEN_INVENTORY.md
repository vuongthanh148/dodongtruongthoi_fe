## User-Facing Screen Inventory

This document maps all user-facing screens, sections, and shared UI
surfaces currently used in the app. It is meant for product/design
redesign planning.

Scope:
- Includes all routes under src/app except src/app/admin.
- Includes root shell and fallback pages.
- Includes page-level states, overlays, drawers, sheets, and floating UI.
- Excludes admin CMS surfaces.

## Root Shell And Special Pages

### src/app/layout.tsx
- SWRProvider (global data-fetching provider).
- Font loading: Cormorant, Be Vietnam Pro, Lora, JetBrains Mono.
- Theme provider behavior based on active_theme setting.

### src/app/error.tsx
- Global error fallback screen.
- Error heading and message.
- Retry action button.

### src/app/not-found.tsx
- 404 fallback screen.
- Message and back-to-home link.

## User-Facing Routes

### / (src/app/page.tsx) - Home
- TopBar (home variant: logo, menu, search, saved shortcut).
- SearchOverlay (full-screen search modal).
- Banner carousel section with gradient image treatment and CTA.
- Customer photos carousel with caption overlays.
- Categories section (grid with ArtPiece tiles and product counts).
- Decorative separator (DongsonBorder).
- Campaigns section (promotion cards and date range).
- Featured products section.
- Stories section (horizontal cards).
- Store locations section (store card, address, phone, map action).
- Footer (full variant).
- ContactBubbles (floating contact actions).
- MenuDrawer.
- Loading state skeletons for async sections.
- Empty-state handling when APIs return no records.

### /categories/[id] (src/app/categories/[id]/page.tsx) - Category Listing
- TopBar (back + title variant).
- Breadcrumb (Home > current category).
- Category heading and product count.
- Horizontal category tab selector.
- Sticky search/filter/sort control row.
- Product grid (ProductCard entries).
- FilterSheet (BottomSheet):
  - Price range filters.
  - Rating filters.
  - Clear and apply actions.
- SortSheet (BottomSheet):
  - Featured.
  - Price ascending.
  - Price descending.
  - Rating descending.
- Skeleton loading state for product grid.
- No-results state with recovery CTA.

### /products/[id] (src/app/products/[id]/page.tsx) - Product Detail
- TopBar (back, title, saved count badge).
- Product image carousel/gallery.
- CompareModal trigger and modal content.
- Product identity block (title, subtitle, price, rating).
- Variant selection area:
  - Background tone swatches (VariantSwatch).
  - Frame swatches (VariantSwatch).
  - Size selector.
- Tab switcher:
  - Description tab.
  - Guide tab.
  - Specs tab.
  - Reviews tab.
- Tab content for description/guide/specs/reviews.
- Action row:
  - Save to wishlist.
  - Add to cart.
  - Compare.
- Related products section.
- Recently viewed products section.
- MenuDrawer.
- Loading and error states.

### /cart (src/app/cart/page.tsx) - Shopping Cart
- TopBar (title + menu + saved shortcut).
- Cart item rows with:
  - Product title.
  - Size label.
  - Background tone label.
  - Frame label.
  - Quantity controls.
  - Unit and line pricing.
  - Remove action.
- Empty cart state with continue-shopping CTA.
- Cart summary panel (subtotal + checkout CTA).
- FooterMinimal.
- MenuDrawer.

### /checkout (src/app/checkout/page.tsx) - Place Order
- TopBar (title + menu + saved shortcut).
- Order form:
  - Phone input (required).
  - Name input.
  - Address input.
  - Note textarea.
  - Inline validation/error message zone.
  - Back-to-cart action.
  - Place-order submit action.
- Order summary panel (items, quantities, subtotal).
- FooterMinimal.
- MenuDrawer.

### /saved (src/app/saved/page.tsx) - Saved Products
- TopBar (back + title).
- Saved count heading.
- Empty state with icon, message, and home CTA.
- Saved products grid (with variant-aware links).

### /orders (src/app/orders/page.tsx) - Order Lookup
- TopBar (back + title + menu + saved shortcut).
- Search form (phone input + submit).
- Pre-search helper/info state.
- Error message area.
- Orders list cards with:
  - Order ID preview.
  - Date.
  - Status badge.
  - Item preview with "+N more" behavior.
  - Order total.
  - Link to details.
- No-results state.
- FooterMinimal.
- MenuDrawer.

### /orders/[id] (src/app/orders/[id]/page.tsx) - Order Detail
- TopBar (back + title + menu + saved shortcut).
- Success banner for pending_confirm state.
- Order header (ID/date/status badge).
- Customer info block (phone, name, address, note).
- Order items list with variant labels and per-item subtotal.
- Order total block.
- Loading and error states.
- FooterMinimal.
- MenuDrawer.

### /faq (src/app/faq/page.tsx) - FAQ
- TopBar (back + title).
- Intro card.
- Collapsible FAQ items.
- FooterMinimal.

### /lang-nghe (src/app/lang-nghe/page.tsx) - Craft Village Story
- TopBar (back + title).
- Intro/story card.
- ArtPiece display card.
- History card.
- Craftsmen card.
- Heritage card.
- FooterMinimal.

### /huong-dan-mua-hang (src/app/huong-dan-mua-hang/page.tsx) - Buying Guide
- TopBar (back + title).
- Step 1 card.
- Step 2 card.
- Step 3 card.
- Step 4 card.
- Step 5 card.
- FooterMinimal.

## Shared Layout And UX Surfaces

### Primary Layout Components
- TopBar (home, back/title, and saved-badge variants).
- MenuDrawer.
- Footer (full variant).
- FooterMinimal (compact variant).
- Container/layout wrappers used across pages.

### Overlays, Modals, Drawers, Sheets
- SearchOverlay.
- CompareModal.
- MenuDrawer.
- FilterSheet (BottomSheet implementation).
- SortSheet (BottomSheet implementation).

### Floating And Utility UI
- ContactBubbles (floating contact widget).

### Reusable UI Primitives Seen Across Screens
- Card.
- Btn.
- Input.
- Label.
- Price.
- ProductCard.
- VariantSwatch.
- Skeleton.
- ArtPiece.
- DongsonBorder.
- SectionHeading.
- Carousel.

## Patterns Designers Should Account For

- Sticky top navigation behavior and sticky filter rows.
- Horizontal scrolling regions (stories, tabs, carousels, photos).
- Multiple state designs per page: loading, empty, error, success.
- Status badge system for order lifecycle states.
- Mobile-first spacing, touch targets, and bottom-sheet interaction.
- Safe-area handling for mobile devices with notches.

## Note On Sections Directory

Files under src/components/sections exist as reusable section component
candidates/patterns. Current pages also implement some sections inline in
route files. Designers should treat this inventory as the source of truth for
what users currently see.
