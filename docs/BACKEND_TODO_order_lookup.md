# Backend TODO — secure order lookup

## Problem

Today, `GET` (via `getOrdersByPhone`) returns **full** order data — price, item
list, customer name, and delivery address — for any phone number, with no
verification step. Anyone who knows or guesses a customer's phone number can
see their name and address.

The frontend (`src/app/orders/page.tsx`) now implements the intended UI flow
(phone → masked list → verify by order code or OTP → detail, with a 5-attempt
lockout) **entirely client-side**, against the *current* API. This is a UI
mock only: the client already receives the full order payload from the first
request, and only hides fields in the rendered UI. A user with browser dev
tools can read the unmasked response directly. **This does not fix the
underlying issue** — it only matches the intended UX shape so the backend
team can implement the real thing behind the same UI.

## Required API changes

1. **`GET /orders?phone=...` (or equivalent) must return a masked summary
   only:**
   - `id` masked (e.g. `DH-2•••42` — keep first 4 and last 2 characters,
     redact the middle)
   - `date`, `status`, `productNames` (titles only, no price)
   - Must NOT include: `totalAmount`, `address`, `customerName`, per-item
     `unitPrice`, or full `phone`.

2. **New verification endpoint**, e.g. `POST /orders/:id/verify`:
   - Body: `{ phone, method: 'code' | 'otp', value: string }`
   - `method: 'code'`: `value` is the order code the customer received via
     SMS/Zalo at checkout. Compare server-side against the real order code
     for that phone + order id.
   - `method: 'otp'`: a 6-digit OTP sent via `POST /orders/:id/otp` (see
     below), single-use, ~5 minute expiry.
   - On success: return a short-lived session token (e.g. signed JWT, ~15
     minute expiry) scoped to that one order id + phone.
   - On failure: increment a per-(phone, order id) failed-attempt counter.
     After 5 failures, return a `423 Locked` (or similar) for **15 minutes**
     for that phone number, and the verify endpoint should refuse even
     correct answers during the lock window.

3. **`POST /orders/:id/otp`**: sends a 6-digit OTP via Zalo (preferred) or SMS
   to the phone on file for that order (never take a phone number from the
   request body — always use the one already on the order). 60-second resend
   cooldown per (phone, order id) enforced server-side, not just in the UI.

4. **`GET /orders/:id` (detail) must require the session token** from step 2
   as a header or query param, and must return partially masked `address` and
   `phone` even when authorized (e.g. `"•• ngõ •• Láng Hạ, Đống Đa, Hà Nội"`,
   `"0899 ••• 288"`) — full values should never leave the server for this
   flow. If a fully-unmasked internal view is needed (e.g. for staff), that
   must be a separate, authenticated-staff endpoint, not this one.

5. **Rate limiting**, independent of the attempt-lockout in point 2:
   - Per phone number: cap lookups (e.g. 20/hour).
   - Per IP: cap lookups (e.g. 50/hour) to slow down phone-number enumeration.

## Error codes the frontend needs

The frontend's `verify` call currently mocks these outcomes locally and needs
real equivalents from the API once it exists:
- Wrong code/OTP → `400` with `{ error: 'INVALID_CODE' | 'INVALID_OTP', attemptsRemaining: number }`
- Locked → `423` with `{ error: 'LOCKED', unlockAt: <ISO timestamp> }`
- Expired OTP → `400` with `{ error: 'OTP_EXPIRED' }`
- Expired verify session (on the detail page) → `401` with `{ error: 'SESSION_EXPIRED' }`, which the frontend should treat as "re-verify."

## Also flagged: `/orders/:id` direct-link access

`src/app/orders/[id]/page.tsx` is reachable directly (e.g. from the
post-checkout "Xem đơn hàng" link) and currently has **no verification gate
at all** — it calls `getOrderById` and renders full order data straight away.
Once the endpoints above exist, this route should also require the session
token from step 2, with the post-checkout success screen minting a one-time
token automatically (since the customer just entered their own data) rather
than forcing a fresh verify step right after placing the order.

## Out of scope for this change

The frontend does not change any request/response shapes on its own — see
the main responsive-layer handoff notes. This document exists so the FE
mock's shape lines up with what the backend should build next.
