# Go-live checklist — Đồ Đồng Trường Thơi

Scope: storefront (`dodongtruongthoi_fe`, Vercel), API (`dodongtruongthoi_be`, Render), database (Neon Postgres), images (Cloudinary), and the business operations around them.

Status key: `[ ]` not done · `[x]` done · `[~]` partly done · `[!]` blocker before launch

Last reviewed: 2026-10-05.

---

## 0. Where we are today

What is already in place:

- Storefront and API are deployed (Vercel and Render, free tiers). Both respond on production.
- Production backend has the newest code: `/api/v1/orders/verify` and `/api/v1/contacts/messages` are live. Migrations 001–015 are applied on startup.
- Order pricing is computed on the server. Client-sent prices are ignored.
- Order lookup is verified on the server: per-order codes, 5 attempts, 15-minute lock, order-bound tokens.
- Contact form stores messages; admin inbox lists them.
- Campaign discounts apply to product, cart, and checkout.

What is still open (from the E2E testing and code review):

- [!] **Existing orders have lookup codes nobody has seen.** Migration 015 generated random codes for orders created before the change. Customers with those orders cannot look them up. See section 5.
- [!] **Auto-deploy is on.** `render.yaml` has `autoDeploy: true`, so every push to `main` deploys to production. There is no staging step yet.
- [!] **Production test data.** Test orders, contact messages, reviews, and probe campaigns exist in the production database (see section 4).
- [!] **Admin account.** Production admin credentials must be set in Render, and must not be `admin / admin123`.
- [ ] `require is not defined` console error on the admin product edit page. Not visible in the tested flows, cause not found.
- [ ] Share buttons, bank transfer instructions, and campaign badges (proposed, not built).
- [ ] Admin orders search, pagination, and detail page (proposed, not built).
- [ ] Buyer cancel is limited to pending and confirmed orders. Confirm this rule with the business.
- [ ] Checkout confirmation screen was type-checked, not tested end to end after the lookup change.
- [ ] Free-tier cold starts (30–50 seconds) on first request after idle.

---

## 1. Decisions the owner must make before launch

Nothing below can be decided by engineering alone. Put each answer in writing.

- [ ] Who is the business owner, and who answers orders and calls day to day?
- [ ] Does the 30-minute confirmation promise on the site ("Nhân viên sẽ gọi xác nhận đơn trong 30 phút") stay? If yes, who is on duty during opening hours?
- [ ] Opening hours on the site: T2–CN 7:30–18:00 is shown. Is that correct for every channel?
- [ ] Payment: COD and bank transfer only, with no gateway. Confirm this is the plan for launch.
- [ ] Bank account for transfers: which account, which bank, and who reconciles incoming transfers?
- [ ] Refund and cancellation policy: who approves refunds, and how are they paid?
- [ ] Can buyers cancel after confirmation? The current rule allows cancel only from pending or confirmed.
- [ ] Legacy orders (created before migration 015): send the lookup code to each buyer (by Zalo/SMS), or give them another way to look up the order?
- [ ] Is a VAT invoice issued to buyers? Who issues it?
- [ ] Which real phone number and Zalo number appear on the site (hotline `0899012288` is in the admin settings)?
- [ ] Which products go live at launch? Remove any demo or placeholder products and images.
- [ ] Which customer photos and stories are real? Replace stock images before launch.

---

## 2. Environments and infrastructure

- [!] **Staging environment.** A second Neon branch, a second Render service, and a second Vercel project (or preview deployments) pointing at staging. Test every release there first.
- [!] **Turn off auto-deploy on production**, or gate it behind a manual approval. Deploy production from a tagged commit.
- [ ] Use a release branch or tags (`v1.0.0`, `v1.0.1`) so you know exactly what runs in production.
- [ ] Custom domain for the storefront (e.g. `dodongtruongthoi.vn`) with HTTPS on Vercel.
- [ ] Custom domain for the API (e.g. `api.dodongtruongthoi.vn`) on Render, with HTTPS. Update `NEXT_PUBLIC_API_URL` and `CORS_ORIGINS` to match.
- [ ] Redirect `www` to the main domain (or the reverse), and redirect the old `*.vercel.app` and `*.onrender.com` URLs.
- [ ] Decide when to leave free tiers: Render free and Neon free sleep when idle. Checkout should not wait 30–50 seconds. Price a paid tier for the API database.
- [ ] Keep-warm ping (cron-job.org → `GET /health` every 10 minutes) if you stay on free tiers. It reduces cold starts but does not remove them.
- [ ] Region: Neon and Render in the same region (Singapore is closest to Vietnam), so API calls to the database are fast.
- [ ] Document who has login access to Vercel, Render, Neon, Cloudinary, GitHub, and the domain registrar. Use a shared password manager, not personal notes.
- [ ] Enable two-factor authentication on every one of those accounts.

---

## 3. Secrets and configuration

- [!] `ADMIN_USERNAME` and `ADMIN_PASSWORD` set on Render to a strong password (16+ characters, unique). Do not use `admin123` or `admin123456`.
- [ ] `JWT_SECRET` is generated by Render (`generateValue: true`). Confirm it is set and not blank.
- [ ] Cloudinary API key and secret: if they were ever pasted into chat, email, or a commit, rotate them in the Cloudinary dashboard and update Render.
- [ ] Neon `DATABASE_URL` uses `sslmode=require`. Rotate the database password if it was ever shared.
- [ ] No secret is committed to git. Run a secret scan on both repositories (`gitleaks` or GitHub secret scanning) before launch.
- [ ] `.env` files are in `.gitignore` in both repos. Confirm with `git check-ignore .env`.
- [ ] `APP_ENV=production` on Render. Confirm the app turns off debug output in production.
- [ ] `CORS_ORIGINS` lists only the real storefront and admin domains, not `*`.
- [ ] Remove or disable any dev-only route or fallback in production. The admin login fallback (fake token, hardcoded credentials) was removed; confirm the deployed build has the fix.

---

## 4. Production data hygiene

Clear test data before the first real customer. Nothing here should be deleted without looking first.

- [ ] **Test orders:** search for phone numbers starting `0988` and names starting `E2E`, `Test`, `Price`, `Phone`. Cancel or remove each one (ask before deleting).
- [ ] **Contact messages:** delete `E2E Contact Check`, `E2E Final Contact`, and `Test Khách` records.
- [ ] **Reviews:** delete any `E2E Review` entries.
- [ ] **Campaigns:** remove probe campaigns (`E2E Discount Probe`, `DBG probe`, `E2E P1 …`). Campaign delete is a soft delete, so these rows stay inactive in the database. Decide whether to purge them with SQL.
- [ ] **Products:** remove any product created for testing (`e2e-p1-test-product`, `e2e-bug006-product`). Confirm each returns 404 on the public API.
- [ ] **Campaign membership:** confirm no product is still attached to an old campaign.
- [ ] **Settings:** `active_theme` is `default`. Shop name and hotline are the real values.
- [ ] **Stock content:** `admin/customer-photos` holds stock placeholder photos. Replace with real customer photos or hide the section.
- [ ] **Dashboard counts:** after cleanup, the dashboard numbers should match the real business.
- [ ] Take a database backup **before** the cleanup (see section 6), so you can undo a mistake.

---

## 5. Database and migrations

- [!] **Legacy lookup codes.** Migration 015 gave every existing order a random code. Those codes were never sent to customers. Options, pick one and document it:
  1. Send each customer with an open order their code by Zalo or SMS, with a short message. Easy if the order list is short.
  2. Let legacy orders be looked up by phone and the last four digits of the phone number instead. Weaker, but better than nothing.
  3. Have staff look up the code in the admin for any customer who asks, and read it to them by phone.
- [ ] Run migrations on **staging first**. Confirm `migrations/` is applied in order (001 → 015) and no migration fails.
- [ ] Confirm the migration runner is idempotent: a second restart changes nothing.
- [ ] Record each migration's purpose in `docs/migrations.md` (one line each).
- [ ] Migrations cannot be undone automatically. For each one, write down how to reverse it by hand. Keep migrations backward-compatible: a new column is safe, a dropped column is not, until the old app version is gone.
- [ ] Add indexes for the queries that will grow: `orders(phone)`, `orders(status, created_at)`, `contact_messages(handled, created_at)`, `reviews(product_id)`, `campaign_products(campaign_id)`.
- [ ] Check the connection pool size against the Neon free plan limit.
- [ ] Remove the seeded test data scripts (`scripts/seed-test-data.sql`) from any production path. Confirm nothing runs them automatically.

---

## 6. Backups and recovery

- [ ] Neon point-in-time restore is enabled. Check the retention window on your plan (free plans have a short window).
- [ ] Take a manual backup before each release: `pg_dump` from Neon to a file stored off the provider (a private cloud drive or a second account).
- [ ] **Restore test:** restore the backup into a scratch Neon branch and check the orders and products are there. Do this once before launch and write the steps down.
- [ ] Cloudinary images: keep a copy of originals outside Cloudinary (the product images are the business's own assets).
- [ ] Recovery time target and recovery point target written down (e.g. "back online within 4 hours; lose at most 1 hour of orders"). Confirm the free plans can meet it; if not, say so to the owner.
- [ ] Know how to export orders to a spreadsheet if the database is unavailable (CSV export is in the CMS plan, see section 12).

---

## 7. Deployment and release process

- [ ] Every release is tagged and has release notes (what changed, which migrations, any manual step).
- [ ] Release order: backend first (migrations are applied on startup), then frontend. Never ship a frontend that calls an endpoint the backend does not have yet.
- [ ] Staging sign-off checklist before each production release:
  - [ ] All E2E journeys in `docs/e2e-user-journey-report.md` pass on staging.
  - [ ] Backup taken.
  - [ ] Migrations reviewed.
- [ ] **Rollback plan:** Render can redeploy the previous build. Vercel can promote the previous deployment. Write down the exact clicks.
- [ ] Post-deploy smoke test (run within 10 minutes of each release):
  - [ ] `GET /health` returns 200.
  - [ ] Home page loads with products and categories.
  - [ ] Product page shows a price.
  - [ ] Add to cart and open checkout.
  - [ ] Admin login with the real account (not a test account) and load the orders list.
  - [ ] Contact form returns 201 for a valid submission (use a test message and mark it handled).
- [ ] Freeze releases in the last 48 hours before launch, except for fixes.

---

## 8. Testing and quality gate

- [ ] CI runs on every push and blocks merges on failure: `go build`, `go vet`, `go test ./...`, `tsc --noEmit`, `eslint`, and `next build`.
- [ ] Automated smoke tests (Playwright) for the critical journeys: browse → cart → checkout → order created; order lookup with the right code; admin login and status change.
- [ ] Manual regression on phone (at least two real devices: one iOS, one Android) for checkout and lookup.
- [ ] Browser coverage: Chrome, Safari (iOS), Samsung Internet or Chrome Android, and Facebook/Zalo in-app browsers (most traffic will come from these).
- [ ] Accessibility: keyboard navigation through checkout, colour contrast on text, and labels on all form fields.
- [ ] Load test the API at expected peak (e.g. 50 concurrent checkouts) on staging. Check the cold-start behaviour under that load.
- [ ] Known open bugs are either fixed or written down with an owner and a date.

---

## 9. Monitoring, logs, and alerts

- [ ] **Uptime monitoring:** an external check on `https://api.../health` and on the storefront home page, every 1–5 minutes, alerting by email or Zalo to the owner (UptimeRobot or Better Stack free tier).
- [ ] **Error tracking** in both apps (Sentry or similar): frontend JavaScript errors and backend 5xx responses.
- [ ] **Structured logs** on the API: request ID, route, status, latency. Keep at least 14 days.
- [ ] Never log full phone numbers, addresses, or lookup codes. Mask them in logs.
- [ ] **Business alerts:** notify the owner when a new order arrives and when a contact message arrives (email or Zalo). Otherwise orders sit unseen.
- [ ] **Dashboards:** orders per day, revenue per day, failed checkouts, failed lookups, and contact messages per day.
- [ ] Database health: connection count and storage used. Alert before the free-tier storage limit.
- [ ] Certificate expiry: check HTTPS certificates expire automatically (Vercel and Render manage them; confirm for the custom domains).
- [ ] Know where logs live for Render and Vercel, and who can read them.

---

## 10. Security

Application
- [ ] Admin tokens are short-lived. Check the expiry and refresh flow works; expired tokens redirect to login.
- [ ] Admin login has rate limiting per IP (currently none). Add it before launch.
- [ ] Order creation (`POST /orders`), contact form (`POST /contacts/messages`), and lookup verify (`POST /orders/verify`) each have a per-IP rate limit. Spam and guessing attacks are the main risk.
- [ ] Input validation on every public endpoint (length limits, allowed characters). The contact form and order notes accept free text: limit the length.
- [ ] Output escaping: review fields that are shown back to staff (customer name, note, contact message) for script injection.
- [ ] Admin pages: every route is behind the auth guard, including `/admin/contact-messages` and `/admin/products/new`. Test each one logged out.
- [ ] API: every admin endpoint returns 401 without a token. Test each one with curl.
- [ ] Order and lookup endpoints: confirm `GET /orders/{id}` and `POST /orders/{id}/cancel` return 401 without the order token, and that a token for one order cannot read another.
- [ ] CORS limited to real domains.
- [ ] HTTP security headers on the storefront (Content-Security-Policy, X-Frame-Options, Referrer-Policy). Check with securityheaders.com.
- [ ] Cookies and tokens: confirm where the admin token is stored (browser storage vs. httpOnly cookie) and document the trade-off.
- [ ] Dependency audit: `npm audit` and `govulncheck` (Go) run before launch. Fix high and critical findings.
- [ ] Dependencies pinned (`package-lock.json`, `go.sum`) and committed.

Infrastructure
- [ ] Two-factor authentication on GitHub, Vercel, Render, Neon, Cloudinary, and the domain registrar.
- [ ] Access list reviewed: remove anyone who no longer works on the project.
- [ ] Database is not reachable from the public internet except from Render (Neon restricts by default; confirm).
- [ ] Repositories: branch protection on `main` (require a pull request or at least passing CI).

Penetration test
- [ ] Before launch, run a basic test on staging: OWASP Top 10 checklist, the order lookup brute-force path, the admin login path, and price tampering on checkout (already fixed; re-check after each release).

---

## 11. Privacy and personal data (Vietnam)

The site stores customer names, phone numbers, and delivery addresses. These are personal data under Vietnam's personal data protection decree (Nghị định 13/2023/NĐ-CP). Confirm the exact obligations with a lawyer or your accountant.

- [ ] **Privacy policy page** (`/chinh-sach-bao-mat` or equivalent) describing what is collected, why, how long it is kept, who sees it, and how to request deletion or correction.
- [ ] **Consent at checkout:** a clear, unticked-by-default checkbox or statement, linked to the privacy policy, before the order is submitted.
- [ ] **Contact form:** the same consent wording, linked to the privacy policy.
- [ ] **Retention:** decide how long orders and contact messages are kept, and delete them after that period. Write the rule down.
- [ ] **Data deletion requests:** a process (a phone number or email to call, and a way to find and delete the buyer's records). Test it once.
- [ ] **Access control:** only staff who need customer data can see it. Use separate admin accounts (see section 12).
- [ ] **Breach response:** if data leaks, who is told, how fast, and what is said. Write a short plan.
- [ ] **Third parties:** list every service that receives personal data (Vercel, Render, Neon, Cloudinary, Zalo, any analytics or ads pixel). Mention them in the privacy policy.
- [ ] **Analytics and ads pixels** (Facebook Pixel, Google Analytics): decide whether they run, and whether consent is needed before they load.
- [ ] Cookies: list which cookies and storage items the site sets (localStorage keys: cart, saved products, lookup state) and mention them in the policy.

---

## 12. Storefront readiness (user web)

Content
- [ ] Real product titles, descriptions, prices, images, and sizes for every product on sale.
- [ ] Remove or hide products that are not ready (no placeholder art or demo text).
- [ ] Real customer photos and stories, or hide those sections.
- [ ] FAQ, buying guide, and "về chúng tôi" pages reviewed by the owner for accuracy.
- [ ] Hotline, Zalo, address, and map embed checked against the real showroom.
- [ ] Footer links: every link goes somewhere real. No dead links to pages that do not exist.

Behaviour
- [ ] Every page works at 375, 768, and 1440 widths (the responsive sweep passed; repeat after each release).
- [ ] Empty states: no categories, no products, no search results, no saved items, no order found.
- [ ] Error states: API down, slow network, expired lookup session. Each shows a clear message and a way forward (call, Zalo, or retry).
- [ ] Checkout: validation messages are clear; the phone number format is checked; the order confirmation shows the order code and what happens next.
- [ ] Confirm the checkout confirmation screen works end to end (it was not tested after the lookup change).
- [ ] Order lookup: right code, wrong code, lock, reload, direct link without a code. Each one tested on phone.
- [ ] Cart and saved items persist after reload and after closing the tab.
- [ ] Price shown on product page = price in cart = price in checkout = price in the order. Test with and without an active campaign.

SEO and sharing
- [ ] Page titles and meta descriptions unique per page (home, categories, products, articles).
- [ ] Open Graph and Twitter image tags for sharing on Zalo and Facebook (product image and title).
- [ ] `sitemap.xml` and `robots.txt` generated and submitted to Google Search Console.
- [ ] Google Business Profile for the showroom (address, hours, phone, photos).
- [ ] Structured data: product price and availability, breadcrumbs (breadcrumbs already emit JSON-LD).
- [ ] Favicon, app icons, and the browser theme colour.
- [ ] 404 page and 500 error page styled to match the site.

Performance
- [ ] Lighthouse mobile score checked on the home page and one product page. Fix anything red.
- [ ] Images served in modern formats and sized for the card they appear in (Cloudinary transforms).
- [ ] Fonts loaded without blocking the page.
- [ ] No console errors on any page in production (the `require is not defined` error on the admin edit page should be fixed).

Analytics
- [ ] Analytics installed (Google Analytics 4 or similar), with goals: checkout started, order placed, lookup used, contact form sent.
- [ ] Ads pixel installed if ads will run (after the consent decision in section 11).

---

## 13. Admin / CMS readiness

- [ ] Each staff member has their own admin account. Retire the shared account.
- [ ] Roles decided: at least "owner" (everything) and "staff" (orders, contact messages, reviews, no settings or staff management). Build the role check if it does not exist.
- [ ] Password policy for staff accounts, and a way to reset a password without the database.
- [ ] Audit log for status changes, price changes, campaign changes, and deletions (planned; see the enhancement list).
- [ ] Orders: search, date filter, pagination, detail page, and CSV export before the first busy day. Without search, staff cannot find an order quickly.
- [ ] Contact inbox: staff know it exists and check it on a schedule. The owner gets an alert for new messages (section 9).
- [ ] Reviews: staff approve or reject within one business day. Set the rule.
- [ ] Campaigns: a staff member can create one without help, and the form warns about past dates.
- [ ] Products: a staff member can add a product with images, sizes, SKUs, and prices, and see it on the storefront. Tested.
- [ ] Settings: theme, shop name, and hotline. Only the owner changes the theme.
- [ ] Staff training: a 30-minute walk-through, and a one-page guide for the common tasks (confirm an order, update status, handle a message, add a product).
- [ ] The admin works on the phone staff will use (check at 390 wide).

---

## 14. Orders and operations (the business process)

- [ ] Written process for every new order: who is notified, who calls the buyer, how fast, what is confirmed.
- [ ] Status meanings agreed with the team: `pending_confirm` → `confirmed` → `processing` → `shipped` → `completed`, and `cancelled`. Who moves each status, and when.
- [ ] Delivery: who delivers, the delivery fee rule (if any), and what the buyer is told.
- [ ] Showroom pickup: a clear process for "Tại showroom", including when the buyer can collect and what they bring.
- [ ] Stock: how the team knows an item is available. If there is no stock tracking, the site must say so, or the process must cover "call to confirm availability".
- [ ] Returns and damaged goods: who approves, how the buyer sends photos, and how the replacement or refund works.
- [ ] Customer service channels: phone, Zalo, email. Response time promised on the site must match the real capacity.
- [ ] Holiday calendar: Tết (Lunar New Year) and other holidays. Decide how the site and the team behave, and show the schedule on the site.
- [ ] Peak planning: festival and gift seasons. Plan extra staff and stock.

---

## 15. Payments and money

- [ ] Payment methods offered at launch: COD and bank transfer. No card gateway yet.
- [ ] **Bank transfer reconciliation:** how a transfer is matched to an order (order code as the memo, checked against the bank statement each day). Write the steps.
- [ ] Bank transfer details are shown on the site only after the owner confirms the account (see section 1).
- [ ] COD: who collects the cash, when it is reconciled, and what happens to unpaid COD orders.
- [ ] Prices: VAT included or excluded, stated on the site.
- [ ] Discounts: campaign rules are stated clearly. An order keeps the price it was placed at.
- [ ] Refunds: process and the account the money goes back to.
- [ ] Daily close: totals of orders, transfers received, and COD collected match each day.
- [ ] Accounting: the accountant has the export format they need.

---

## 16. Legal (Vietnam, to confirm with a lawyer or accountant)

- [ ] **Website trade registration:** an e-commerce website selling goods online generally must register or notify with the Ministry of Industry and Trade (Bộ Công Thương). Confirm the current requirement and file it. The registration link goes on the site footer.
- [ ] **Business registration:** the registered business name, tax code, and address shown on the site.
- [ ] **Terms of sale:** what the buyer agrees to, how orders are formed, cancellation, delivery, and disputes.
- [ ] **Return and refund policy:** conditions, timing, and who pays the return shipping.
- [ ] **Consumer protection:** check the current consumer protection law's requirements for online sales (information shown before purchase, right to cancel, complaint route).
- [ ] **Invoices:** decide whether VAT e-invoices are issued, and through which provider.
- [ ] **Product claims:** every claim about craftsmanship, age, origin, or feng shui meaning must be true and supportable. Keep evidence.
- [ ] **Image rights:** the photos on the site are owned by the business or licensed. Stock images are labelled or removed.
- [ ] **Trademark:** the brand name and logo are registered, or the risk is accepted in writing.

---

## 17. Support and communication

- [ ] One support phone number and one Zalo number, both listed on the site.
- [ ] Support hours match the hours on the site.
- [ ] Auto-reply or a status message outside hours (Zalo or the contact form response: "chúng tôi sẽ liên hệ trong giờ làm việc").
- [ ] Complaint route: the buyer knows how to escalate.
- [ ] Email address for legal and privacy requests, monitored.
- [ ] Owner's personal number is not the only support channel.

---

## 18. Launch plan

**T-14 days**
- [ ] Open decisions in section 1 answered in writing.
- [ ] Staging environment ready. Full E2E run on staging.
- [ ] Legal items started (section 16). Privacy policy drafted (section 11).
- [ ] Product content and images signed off by the owner.

**T-7 days**
- [ ] Production data cleanup (section 4) done, after a backup.
- [ ] Legacy order code plan executed (section 5).
- [ ] Monitoring and alerts live (section 9). Test each alert once.
- [ ] Restore test done (section 6).
- [ ] Staff training done (section 13).
- [ ] Security checks done (section 10), and the high and critical findings fixed.

**T-2 days**
- [ ] Release freeze (section 7).
- [ ] Custom domains and HTTPS working.
- [ ] Final smoke test on staging matches production configuration.

**Launch day**
- [ ] Backup taken immediately before the release.
- [ ] Release backend, then frontend. Run the smoke test (section 7).
- [ ] Owner, developer, and one staff member available for the first four hours.
- [ ] Watch error tracking, logs, and the order alert.
- [ ] Place one real test order from a phone (then cancel it) and confirm the alert and the confirmation.
- [ ] Announce to the public only after the smoke test passes.

**T+1 to T+7 days**
- [ ] Daily check: errors, failed checkouts, order backlog, contact messages not answered.
- [ ] Daily reconciliation of orders, transfers, and COD (section 15).
- [ ] Collect buyer feedback and fix the top three issues.
- [ ] Review monitoring: which alerts were noise, which were missing.

---

## 19. After launch (ongoing)

- [ ] Weekly: dependency updates, backup restore spot check, review of open bugs.
- [ ] Monthly: cost review (free tiers and paid plans), security review, privacy request log review.
- [ ] Quarterly: restore test, staff access review, legal and policy review.
- [ ] Keep the runbook (section 20) current after every incident.

---

## 20. Runbook (write this before launch)

One page per item. Each one answers: what happened, how to check, what to do, who to call.

- [ ] The site is down (storefront, API, or both).
- [ ] Checkout fails for buyers.
- [ ] Admin login does not work, or a staff member is locked out.
- [ ] Database is full or unreachable.
- [ ] An order was placed at the wrong price (check the price rule, then the order).
- [ ] A bad release: how to roll back the frontend and the backend.
- [ ] A bad migration.
- [ ] Spam flood on the contact form or order endpoints.
- [ ] A buyer cannot look up their order.
- [ ] A data deletion request.
- [ ] A suspected data leak.
- [ ] Cloudinary or image upload fails.
- [ ] Zalo or hotline unreachable.

---

## 21. Glossary (for a first release)

- **Staging:** a copy of the system used for testing before production.
- **Production (prod):** the live system real customers use.
- **Migration:** a change to the database structure, applied by code. Hard to undo.
- **Rollback:** returning to the previous version of the app.
- **Environment variable:** a setting kept outside the code (passwords, keys, URLs).
- **Secret:** a value that gives access (passwords, API keys, JWT secret). Never commit it.
- **Backup / restore:** a copy of the data, and the process of putting it back.
- **Uptime monitor:** a service that checks your site from outside and alerts you when it is down.
- **Rate limit:** a cap on how many requests one client can make in a time window.
- **CORS:** the list of websites allowed to call the API from a browser.
- **HTTPS:** the encrypted connection the browser uses. Required for production.
- **Cold start:** the delay when a free-tier server wakes up after being idle.
