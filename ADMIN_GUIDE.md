# Admin CMS Usage Guide

## Quick Start

### 1. Access the Admin Panel

**URL:** `http://localhost:3000/admin/login`

### 2. Login Credentials

| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `admin123` |

After login, your session token is stored in browser localStorage and automatically included in all admin API requests.

---

## Dashboard & Navigation

### Main Menu (Left Sidebar)

Once logged in, you'll see the main navigation menu with these sections:

```
DDTT Admin
Content Management

├── 📊 Dashboard        /admin
├── 📦 Products         /admin/products
├── 🏷️  Categories       /admin/categories
├── 🎨 Banners          /admin/banners
├── 📞 Contacts         /admin/contacts
├── 🎯 Campaigns        /admin/campaigns
├── 📋 Orders           /admin/orders
├── ⭐ Reviews          /admin/reviews
├── ⚙️  Settings         /admin/settings
└── 🚪 Logout
```

### Navigation Behavior

- **Active page highlight:** Current page shows with dark red background (#7f1d1d)
- **Sub-page routing:** If on `/admin/products/[id]`, the Products menu item stays highlighted
- **Mobile (< 768px):** Sidebar hides by default; tap ☰ button to open as overlay drawer

---

## Feature Modules

### 📊 Dashboard (`/admin`)

**Purpose:** Overview of key metrics and recent activity

**Displays:**
- Product count
- Total orders
- Pending reviews
- Recent orders summary
- Active campaigns

**Actions:**
- View complete lists by clicking on each section

---

### 📦 Products (`/admin/products`)

**Purpose:** Manage product catalog

**Features:**

#### View Products
- Table list with all products
- Shows: Title, Category, Price, Active status
- Filter by category (coming soon)

#### Create Product
1. Click "New Product"
2. Fill form:
   - **Title:** Product name (required)
   - **Subtitle:** Short description
   - **Category:** Select from dropdown
   - **Base Price:** in VND
   - **Description:** Full product details
   - **Meaning:** Cultural/feng shui significance
   - **Default Colors:** Background tone and frame
   - **Variants:** Size, color, frame options
   - **Badge:** "bestseller", "new", "sale"
   - **Active:** Toggle to publish/unpublish
3. Click "Create Product"
4. Toast notification confirms success

#### Edit Product
1. Click "Edit" on any product
2. Modify any field
3. Click "Update Product"
4. Toast notification confirms

#### Delete Product
1. Click "Delete" on any product
2. Confirm deletion
3. Product is removed (no undo!)

#### Upload Images
1. Go to product detail page
2. Click "Upload Images"
3. Select images for different variant combinations (color + frame)
4. Images are uploaded to Cloudinary CDN

**Tips:**
- Always provide category and price
- Use meaningful product titles for search
- Add multiple images per variant for better UX

---

### 🏷️ Categories (`/admin/categories`)

**Purpose:** Organize products into collections

**Features:**

#### View Categories
- List of all categories
- Shows: Name, Description, Active status, Sort order

#### Create Category
1. Click "New Category"
2. Fill:
   - **Name:** Category name (required)
   - **Slug:** URL-friendly identifier (auto-generated)
   - **Description:** What's in this category
   - **Tone:** Color scheme (gold, bronze, etc.)
   - **Sort Order:** Display priority (lower = first)
   - **Active:** Publish/unpublish
3. Click "Create Category"

#### Edit Category
1. Click "Edit"
2. Modify details
3. Click "Update Category"

#### Delete Category
1. Click "Delete"
2. Confirm deletion
3. ⚠️ All products in this category will also be deleted

**Tips:**
- Use sort_order to control category appearance order
- Tone affects UI color theming in storefront
- Keep category names short (< 30 chars)

---

### 🎨 Banners (`/admin/banners`)

**Purpose:** Create promotional banners for homepage carousel

**Features:**

#### View Banners
- List with title, subtitle, and active status
- Sort order determines carousel position

#### Create Banner
1. Click "New Banner"
2. Fill:
   - **Title:** Banner headline
   - **Subtitle:** Supporting text
   - **Image URL:** Link to banner image (Cloudinary)
   - **Link URL:** Where banner clicks go
   - **Sort Order:** Carousel position (lower = first)
   - **Active:** Show/hide in carousel
3. Click "Create Banner"

#### Edit Banner
1. Click "Edit"
2. Update any field
3. Click "Update Banner"

#### Delete Banner
1. Click "Delete"
2. Confirm deletion

**Tips:**
- Use sort_order to arrange carousel
- Recommended image: 1200x400px
- URLs can be: `/products/[id]`, `/categories/[id]`, external links, or absolute URLs

---

### 📞 Contacts (`/admin/contacts`)

**Purpose:** Manage customer communication channels

**Features:**

#### View Contacts
- List of platforms (Zalo, Messenger, Facebook, etc.)
- Shows: Platform, Label, URL, Sort order

#### Create Contact
1. Click "New Contact"
2. Fill:
   - **Platform:** Name (zalo, messenger, facebook, etc.)
   - **Label:** Display text
   - **URL:** Link to contact (tel:, https://, mailto:, etc.)
   - **Sort Order:** Menu position
   - **Active:** Show/hide
3. Click "Create Contact"

#### Edit/Delete
1. Click "Edit" or "Delete"
2. Make changes or confirm deletion

**Tips:**
- For phone: `tel:+84901234567`
- For email: `mailto:info@example.com`
- For Zalo: `https://zalo.me/0901234567`
- For Messenger: `https://m.me/pageusername`

---

### 🎯 Campaigns (`/admin/campaigns`)

**Purpose:** Run promotional campaigns with discounts

**Features:**

#### View Campaigns
- Table with: Name, Discount Type, Discount Value, Duration, Status

#### Create Campaign
1. Click "New Campaign"
2. Fill:
   - **ID:** Unique identifier (create only)
   - **Name:** Campaign name
   - **Discount Type:** "percentage" or "fixed_amount"
   - **Discount Value:** 30 (for 30%) or 500000 (for 500k VND)
   - **Starts At:** Date/time when discount begins
   - **Ends At:** Date/time when discount expires
   - **Description:** Campaign details
   - **Active:** Enable/disable campaign
3. Click "Create Campaign"
4. Click "Products" button to assign products to campaign

#### Assign Products to Campaign
1. Click "Products" button next to campaign
2. Modal appears with all products
3. Check boxes for products to include in campaign
4. Click "Save Products (N)"
5. Toast confirms: "Campaign products updated"

#### Edit Campaign
1. Click "Edit"
2. Update details (note: ID cannot change)
3. Click "Update Campaign"

#### Delete Campaign
1. Click "Delete"
2. Confirm deletion

**Tips:**
- Campaign discounts apply at checkout if active and in date range
- Multiple campaigns can run simultaneously
- You can edit campaigns even after they start
- Products must exist before adding to campaigns

---

### 📋 Orders (`/admin/orders`)

**Purpose:** Track and manage customer orders

**Features:**

#### View Orders
- **Filter Tabs:** All, Chờ xác nhận (pending), Đã xác nhận (confirmed), Đang xử lý (processing), Đang giao (shipped), Hoàn thành (completed), Đã hủy (cancelled)
- Each order shows:
  - Order ID
  - Customer name & phone
  - Order date/time
  - Total amount (VND)
  - Items ordered

#### Update Order Status
1. Select new status from dropdown
2. (Optional) Add admin note in textarea
3. Click "Update Status"
4. Toast confirms: "Order status updated"

#### Order Lifecycle
```
pending_confirm → confirmed → processing → shipped → completed
                                                ↓
                                           cancelled (any state)
```

#### Mobile View
- On screens < 768px:
  - Sidebar hides automatically
  - Tap ☰ button to open menu
  - Order cards expand to full width
  - All controls remain accessible

**Tips:**
- Always confirm order before processing
- Add notes for special shipping/handling instructions
- Shipping address is in customer's original order note
- Once marked "completed", order appears in customer's order history

---

### ⭐ Reviews (`/admin/reviews`)

**Purpose:** Moderate customer product reviews

**Features:**

#### View Reviews
- **Filter Tabs:** All, Pending, Approved
- Each review shows:
  - Reviewer name
  - Product ID (which product reviewed)
  - Rating (1-5 stars)
  - Comment preview (truncated)
  - Review date

#### Moderate Reviews
1. Reviews start in "Pending" state
2. Click "Approve" to publish (green button)
3. Click "Reject" to unpublish (red button)
4. Toast confirms action
5. Click "Delete" to remove permanently

#### States
- **Pending:** Hidden from storefront until approved
- **Approved:** Visible to all customers
- **Rejected:** Hidden from customers (but still in database)

**Tips:**
- Review all new reviews regularly
- Look for spam, profanity, or inappropriate content
- Rating stars displayed: ★★★★☆ for 4-star review
- Empty comment shows: "No comment"

---

### ⚙️ Settings (`/admin/settings`)

**Purpose:** Configure site-wide settings

**Features:**

#### Available Settings
- **Shop Name:** Your business name (displayed in storefront)
- **Hotline:** Primary phone number for customer support
- **Active Theme:** Current UI theme (default, dark, etc.)

#### Update Settings
1. Click field to edit
2. Enter new value
3. Click "Update Settings"
4. Toast confirms: "Settings updated"

**Tips:**
- Shop name appears in header and emails
- Hotline is clickable on mobile (tel: link)
- Theme change applies immediately to storefront

---

## Common Workflows

### Launching a Sale Campaign

1. **Create Campaign**
   - Go to Campaigns → "New Campaign"
   - Name: "Summer Sale 2026"
   - Discount Type: "percentage"
   - Discount Value: 20
   - Starts At: [Select date]
   - Ends At: [Select date 2 weeks later]
   - Active: ✓

2. **Add Products**
   - Click "Products" on the campaign
   - Select products to include in sale
   - Click "Save Products"

3. **Create Banner (Optional)**
   - Go to Banners → "New Banner"
   - Title: "Summer Sale"
   - Image: [Upload promotional image]
   - Link: `/collections/sale` or specific category
   - Active: ✓

4. **Verify**
   - Check storefront to see discounts applied

---

### Processing a Customer Order

1. **Review Order**
   - Go to Orders → Click filter tab for "Chờ xác nhận" (pending)
   - Click order to view details
   - Verify customer info and items

2. **Confirm Order**
   - Click status dropdown → select "Đã xác nhận" (confirmed)
   - Add note: "Payment received" or shipping notes
   - Click "Update Status"

3. **Prepare Shipment**
   - Status dropdown → "Đang xử lý" (processing)
   - Note: "Package ready for shipment"

4. **Ship Order**
   - Status dropdown → "Đang giao" (shipped)
   - Note: "Order shipped with [courier], tracking: [number]"

5. **Complete Order**
   - Once customer confirms delivery
   - Status dropdown → "Hoàn thành" (completed)
   - Order appears in customer's history

---

### Moderating Product Reviews

1. **Find Pending Reviews**
   - Go to Reviews → Click "Pending" tab
   - See all unmoderated reviews

2. **Review Content**
   - Click reviewer name to see full comment
   - Check for spam, profanity, etc.

3. **Approve or Reject**
   - Click "Approve" (green) to publish
   - Click "Reject" (red) to hide
   - Toast confirms action

4. **Monitor Ratings**
   - Go to "All" tab
   - Approved reviews are visible to customers
   - Poor ratings help improve products

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Navigate between fields |
| `Enter` | Submit form |
| `Escape` | Close modal/drawer (on mobile) |

---

## Error Messages & Troubleshooting

### "Missing Bearer Token"
- **Cause:** Not logged in or token expired
- **Fix:** Go to /admin/login and log in again

### "Product Not Found"
- **Cause:** Trying to access deleted product
- **Fix:** Go back to products list and refresh

### "Order with this ID doesn't exist"
- **Cause:** Order was deleted or ID is incorrect
- **Fix:** Check order ID and try again

### "No reviews found"
- **Cause:** No reviews match current filter
- **Fix:** Check different filter tab or create more reviews

### Mobile Menu Not Showing
- **Cause:** Viewport is desktop-sized (>768px)
- **Fix:** Resize browser or test on phone-sized device

---

## Best Practices

✅ **DO:**
- Regularly check pending orders and reviews
- Keep product descriptions accurate and detailed
- Use meaningful product titles for search
- Test new campaigns before launch
- Keep customer contact info updated
- Monitor order status regularly
- Review customer feedback for insights

❌ **DON'T:**
- Delete products in active campaigns
- Leave orders in "pending_confirm" too long
- Edit products while customer is viewing them
- Create duplicate products
- Use misleading discounts
- Forget to activate new content

---

## Support & Feedback

For issues or feature requests:
- Check the TEST_REPORT.md for known working features
- Review code comments in admin handlers
- Check browser console for errors (F12)
- Contact development team with screenshots

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Apr 25, 2026 | Initial release with all core features |

---

**Last Updated:** April 25, 2026
**Admin CMS Status:** ✅ Production Ready
