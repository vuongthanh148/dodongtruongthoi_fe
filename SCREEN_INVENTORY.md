# User-Facing Screen Inventory

This document lists the visible sections and major components for the user-facing frontend screens only. It is organized by route and includes route shells, overlays, modals, drawers, and other shared UI pieces that affect the page structure. Admin CMS screens are intentionally omitted.

## Root Shell And Special Pages

### `src/app/layout.tsx`
- `SWRProvider`
- Font loading for Cormorant, Be Vietnam Pro, Lora, and JetBrains Mono
- Theme provider that reads `active_theme` from settings

### `src/app/error.tsx`
- Error heading and message
- Retry button

### `src/app/not-found.tsx`
- 404 message
- Back to home link

## User-Facing Routes

### `/` Home
- `TopBar` with logo, menu, search, and saved triggers
- `SearchOverlay` with categories and featured products
- Banner carousel section with gradient overlay and CTA
- Customer photos carousel section with captions
- Categories grid section with `ArtPiece`, category name, and product count
- Campaigns section with red gradient cards, discount text, dates, and CTA
- Featured products section with product cards in a 2-column grid
- Stories carousel section with horizontally scrollable story cards
- Store locations section with store cards and map links
- `Footer`
- `ContactBubbles`
- `MenuDrawer`

### `/categories/[id]` Category Listing
- `TopBar` with back button
- Category selector tabs in a horizontal scroll row
- Search input field
- Filter button
- Sort button
- `FilterSheet` bottom sheet with price range, rating, and apply/clear actions
- `SortSheet` bottom sheet with featured, price, and rating options
- Product grid with `ProductCard` items
- Skeleton loaders while data is loading

### `/products/[id]` Product Detail
- `TopBar` with back button
- Image carousel with touch gestures and thumbnail indicators
- `CompareModal` overlay for comparing variants and specs
- Product title, subtitle, price, and rating block
- Variant swatches section
  - Background tone swatches
  - Frame swatches
  - Size selector
- Description tab
- Guide tab
- Specs tab with purpose and zodiac information
- Reviews tab with star ratings and reviewer comments
- Action button row
  - Save to wishlist
  - Add to cart
  - Compare
- Related products carousel / grid
- Recently viewed products carousel / grid
- `MenuDrawer`

### `/cart` Shopping Cart
- `TopBar` with title, menu, and saved shortcut
- Cart items list
  - Product title
  - Size label
  - Background tone label
  - Frame label
  - Quantity controls
  - Unit price x quantity
  - Remove button
- Empty cart state with continue-shopping CTA
- Cart summary block
  - Subtotal
  - Continue shopping button
  - Proceed to checkout button
- `FooterMinimal`
- `MenuDrawer`

### `/checkout` Checkout Form
- `TopBar` with title, menu, and saved shortcut
- Order form column
  - Phone number input
  - Customer name input
  - Address input
  - Notes textarea
  - Error message area
  - Back to cart button
  - Submit / place order button
- Order items sidebar
  - Item list with quantities and prices
  - Subtotal display
- `FooterMinimal`
- `MenuDrawer`

### `/saved` Saved Products
- `TopBar` with back button and title
- Heading with saved count
- Empty state with drum mark, message, and home link
- Saved products grid
  - Product cards
  - Saved variants shown per product

### `/orders` Order Lookup
- `TopBar` with back button, menu, and saved shortcut
- Search form with phone input and submit button
- Error message area
- Info box shown before the first search
- Orders list after search
  - Order ID
  - Date
  - Status badge
  - Preview of first items
  - "+ N more" indicator when applicable
  - Total price
  - Link to order detail
- No results message
- `FooterMinimal`
- `MenuDrawer`

### `/orders/[id]` Order Detail
- `TopBar` with back button, menu, and saved shortcut
- Success message banner for `pending_confirm`
- Order header with order ID, creation date, and status badge
- Customer info grid
  - Phone
  - Customer name
  - Address
  - Note
- Order items list
  - Product title
  - Size label
  - Background tone label
  - Frame label
  - Quantity
  - Subtotal per line item
- Order total block
- `FooterMinimal`
- `MenuDrawer`

### `/faq` FAQ
- `TopBar` with back button and title
- FAQ intro card
- FAQ items list with collapsible Q/A cards
- `FooterMinimal`

### `/lang-nghe` Craft Village Story
- `TopBar` with back button and title
- Story intro card
- `ArtPiece` display card
- History card
- Craftsmen card
- Heritage card
- `FooterMinimal`

### `/huong-dan-mua-hang` Buying Guide
- `TopBar` with back button and title
- Step 1 card for choosing size
- Step 2 card for choosing material / background
- Step 3 card for ordering process
- Step 4 card for warranty policy
- Step 5 card for return policy
- `FooterMinimal`

## Reusable Section Components

### `src/components/sections/BannerSection.tsx`
- Banner carousel with `Carousel`
- Gradient image overlay
- Title, subtitle, and CTA button area

### `src/components/sections/CustomerPhotosSection.tsx`
- Section heading and intro text
- Customer photo `Carousel`
- Captions overlaid on the image card

### `src/components/sections/CategoriesSection.tsx`
- Section heading
- Responsive category grid
- Category tile with image placeholder area, name, and product count

### `src/components/sections/CampaignsSection.tsx`
- Campaign heading / intro
- Campaign cards with discount information and call to action

### `src/components/sections/FeaturedProductsSection.tsx`
- Section heading
- Featured product grid or carousel layout
- Product cards with pricing and badges

### `src/components/sections/StoriesSection.tsx`
- Story section heading
- Horizontal story cards with imagery and narrative text

### `src/components/sections/StoreLocationsSection.tsx`
- Store location heading
- Store cards / location grid
- Map and contact links

## Shared Layout And UI Components

### `TopBar`
- Logo mark on applicable screens
- Back button when applicable
- Page title
- Menu button
- Search button when applicable
- Saved count badge and link when applicable
- Sticky header with scroll shadow

### `MenuDrawer`
- Header with close button and title
- Explore section with home link
- Account section with saved products, cart, and my orders
- Info section with craft story, buying guide, FAQ, shipping and warranty, and contact
- Categories section with dynamic category links
- Contact section with phone, address, and email
- Social icons for Zalo, Messenger, Facebook, and TikTok

### `Footer`
- Brand block with logo, site name, and tagline
- Social icons
- Links grid
- Bottom bar with copyright and payment methods

### `FooterMinimal`
- Reduced footer variant used on shorter content pages

### `ContactBubbles`
- Floating action buttons for Zalo, Messenger, phone, and similar contact actions

### `SearchOverlay`
- Search modal
- Category shortcuts
- Featured products results area

### `Carousel`
- Swipe / drag area
- Optional navigation arrows
- Optional dot indicators
- Auto-scroll support

### `ProductCard`
- Product image or artwork
- Title and supporting text
- Price and badges when applicable

### `SectionHeading`
- Section title
- Supporting subtitle or action area

### `Card`, `Btn`, `Input`, `Label`, `Skeleton`, `BottomSheet`, `VariantSwatch`, `Price`
- Shared presentation and form building blocks used across screens
