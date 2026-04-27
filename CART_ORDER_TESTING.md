# Cart & Order Feature — Testing Guide

**Implementation Date:** April 27, 2026  
**Status:** ✅ Ready for Testing

---

## Prerequisites

### 1. Backend Running
```bash
cd dodongtruongthoi_be
PORT=8080 JWT_SECRET=dev-secret go run ./cmd/server
```
Verify: http://localhost:8080/health → returns status

### 2. Frontend Running
```bash
cd dodongtruongthoi_fe
npm run dev
```
Verify: http://localhost:3000 → home page loads

---

## End-to-End Test Flow

### Step 1: Browse Product
1. Navigate to http://localhost:3000
2. Click on any product card
3. Product detail page loads with:
   - ✅ Title (e.g., "Tranh Đồng Sơn Nông Thôn")
   - ✅ Variant selectors (background tone, frame, size)
   - ✅ Price calculation based on size
   - ✅ Save variant button (heart icon)
   - ✅ "Add to Cart" button

### Step 2: Select Variants & Add to Cart
1. Select a background tone (click on color swatch)
2. Select a frame style (click on frame option)
3. Select a size (M, L, XL, etc.)
4. Click **"Thêm vào giỏ hàng"** (Add to Cart)
5. Page redirects to cart page

**Expected Result:**
- Cart page shows the product with:
  - ✅ Product title (full name, not ID)
  - ✅ Size label (e.g., "Kích thước: M")
  - ✅ Background tone label (e.g., "Tông màu: Nền Vàng")
  - ✅ Frame label (e.g., "Khung: Đồng")
  - ✅ Quantity: 1
  - ✅ Unit price & total price formatted correctly

### Step 3: Modify Cart
1. **Increase Quantity:** Click `+` button → quantity increases
2. **Decrease Quantity:** Click `−` button → quantity decreases
3. **Remove Item:** Click `Xóa` (Delete) → item removed
4. **Continue Shopping:** Click `Tiếp Tục Mua Sắm` → redirects to home
5. **Proceed to Checkout:** Click `Tiến Hành Thanh Toán` → goes to checkout

### Step 4: Fill Checkout Form
1. Navigate to checkout page
2. Fill in form:

| Field | Value | Required |
|-------|-------|----------|
| Số Điện Thoại | 0912345678 | ✅ Yes |
| Tên Khách Hàng | Nguyễn Văn A | ❌ No |
| Địa Chỉ | 123 Đường ABC | ❌ No |
| Ghi Chú | Please deliver carefully | ❌ No |

3. Order sidebar shows:
   - ✅ All cart items with proper labels
   - ✅ Subtotal & total (shipping fee shows "Contact after")
   - ✅ Info message: "Order will be pending confirmation. We will call you..."

### Step 5: Create Order
1. Click **"Đặt Hàng"** (Place Order)
2. Page shows loading state: "Đang xử lý..."

**Expected Result:**
- Page redirects to: `/orders/{orderId}`
- Shows success message in green box:
  - "✓ Đặt Hàng Thành Công!"
  - "Thank you. We will contact you..."

### Step 6: View Order Confirmation
Order detail page displays:
- ✅ Order ID (first 8 chars): "#XXXXXXXX"
- ✅ Creation date
- ✅ Status badge: "Chờ Xác Nhận" (Pending Confirmation) in yellow
- ✅ Customer phone
- ✅ Customer name (if provided)
- ✅ Delivery address (if provided)
- ✅ All order items with:
  - Product title
  - Size label
  - Variant labels
  - Quantity & unit price
  - Line item total

---

## Error Testing

### Test 1: Invalid Phone Number
1. Go to checkout
2. Leave phone empty or enter < 9 digits
3. Click "Đặt Hàng"
4. **Expected:** Error message appears in red box
   - "Vui lòng nhập số điện thoại hợp lệ (tối thiểu 9 chữ số)."

### Test 2: Network Error
1. Stop backend server
2. Try to place order
3. **Expected:** Error message
   - "Có lỗi khi kết nối. Vui lòng thử lại."

### Test 3: Empty Cart
1. Clear localStorage: `ddtt_cart`
2. Navigate to `/checkout`
3. **Expected:** Redirect to cart page (empty)

---

## Order Lookup Test

### Retrieve Order by Phone
1. Navigate to http://localhost:3000/orders
2. Enter phone number used in checkout: `0912345678`
3. Click **"Tìm"** (Search)
4. **Expected:**
   - List of orders for that phone
   - Order shows:
     - Order ID (truncated)
     - Status badge
     - Date created
     - Total amount
   - Click order to view full details

---

## Data Verification

### Cart Item Storage (localStorage)
Open browser DevTools → Application → Local Storage → ddtt_cart

**Expected Format:**
```json
[
  {
    "productId": "countryside-painting",
    "productTitle": "Tranh Đồng Sơn Nông Thôn",
    "sizeId": "size-m",
    "sizeLabel": "M",
    "bgTone": "gold",
    "bgToneLabel": "Nền Vàng",
    "frame": "bronze",
    "frameLabel": "Khung Đồng",
    "quantity": 1,
    "unitPrice": 11200000,
    "variantImageUrl": null
  }
]
```

### Backend Database Verification
Check that order was created:
```bash
# In backend terminal, query database:
psql dodongtruongthoi -c "SELECT id, phone, status, total_amount FROM orders WHERE phone = '0912345678';"
```

**Expected:** Order exists with:
- Status: `pending_confirm`
- Phone: `0912345678`
- total_amount: sum of order items

---

## Admin Verification

### Check Admin Dashboard
1. Navigate to http://localhost:3000/admin/login
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Go to **Orders** tab
4. **Expected:**
   - New order appears in list
   - Status shows "Chờ Xác Nhận" (yellow badge)
   - Click order to see details
   - Admin can update status

---

## Success Checklist

| Item | Status | Notes |
|------|--------|-------|
| Product detail → Add to cart | ✅ | Redirects to cart |
| Cart displays correct labels | ✅ | Product title, size label shown |
| Checkout form validation | ✅ | Phone required & validated |
| Order creation | ✅ | API called successfully |
| Order confirmation page | ✅ | Shows status badge |
| Order lookup by phone | ✅ | Retrieves orders from API |
| Admin sees new order | ✅ | Appears in admin dashboard |
| Status updates work | ✅ | Can change status to "confirmed" |

---

## Troubleshooting

### Issue: Cart shows empty
**Solution:** Check localStorage `ddtt_cart` key, verify add-to-cart button click works

### Issue: Checkout form disappears
**Solution:** Check browser console for JavaScript errors, verify useEffect dependencies

### Issue: Order creation fails silently
**Solution:** 
1. Check backend logs: `docker compose logs backend`
2. Verify API endpoint: `curl http://localhost:8080/api/v1/orders`
3. Check network tab in DevTools

### Issue: Product labels are empty (showing undefined)
**Solution:** 
1. Verify BG_TONES and FRAME_STYLES arrays in `src/lib/data.ts`
2. Check that product sizes array includes names
3. Ensure `bgToneLabel`, `frameLabel` are passed to CartItem

---

## Performance Notes

- Cart operations are instant (localStorage)
- Order creation should complete within 1-2 seconds
- Order lookup may take 1-3 seconds depending on DB
- All API calls include proper error handling

---

## Next Steps (Phase 6+)

- [ ] Add email notification on order creation
- [ ] SMS notification when status changes
- [ ] Implement shipping fee calculation
- [ ] Add order cancellation flow
- [ ] Implement payment gateway (if needed)
- [ ] Add order tracking timeline

---

**Last Updated:** April 27, 2026  
**Ready for User Testing** ✅
