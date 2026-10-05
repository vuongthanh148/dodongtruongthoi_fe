# Design vs live — capture brief

Output root: scratchpad/design-compare/
- design/<board-id>.png   (from the handoff HTML, solo board)
- live/<route-slug>-<width>.png (from the running app)

## Design boards
Source dir: /Users/stephen/Documents/Projects/dodongtruongthoi/dodongtruongthoi_fe/docs/design_handoff_desktop_responsive/
Open file:// URL of the HTML file + "#<board-id>" with the viewport set to the board width (1440 / 768 / 375). Solo mode renders one board at native width.
File per board group:
- Desktop - Home.html: nav-grouped (1440 only), home-a-{1440,768,375}, campaign-one-{1440,375}, campaign-many-{1440,375}, cats-{w}, list-a-{w}, pdp-a-{w}, saved-{w}
- Desktop - Mua hang.html: cart-{w}, checkout-{w}, orders-{w}, lk-list, lk-verify, lk-locked, lk-detail (all 1440), order-{w}
- Desktop - Noi dung.html: blog-{w}, article-{w}, contact-{w}, faq-{w}, guide-{w}, craft-{w}
Board ids are `<key>-<width>`. Screenshot the full page (fullPage true). Wait ~1.5s after load for fonts and images.

## Live routes (FE http://localhost:3000)
| Design board | Live route | Notes |
|---|---|---|
| nav-grouped | / | hover "Sản phẩm" at 1440 to open mega menu |
| home-a | / | fullPage |
| campaign-* | / | capture only the campaigns section; record how many campaigns exist |
| cats | /categories | |
| list-a | /products | also /categories/tranh-dong |
| pdp-a | /products/vinh-quy-bai-to | |
| saved | /saved | save one product first |
| cart | /cart | add one product first |
| checkout | /checkout | cart must have an item |
| orders | /orders | |
| lk-* | /orders | no live equivalent for these states; mark NOT_IMPLEMENTED, do not fake |
| order-{w} | /orders/{id} | get an id from a phone lookup via API (GET http://localhost:8080/api/v1/orders?phone=...) |
| blog | /cam-nang | |
| article | /cam-nang/chon-tranh-theo-menh | |
| contact | /lien-he | |
| faq | /faq | |
| guide | /huong-dan-mua-hang | |
| craft | /lang-nghe | |

Widths: 1440x900, 768x1024, 375x812 viewport.
Live state: use the test data set in the E2E report if needed. Do not place real orders outside the E2E rules. Do not change any code.

Report back: list of captured files, any route that failed to load or has no data, and any board you could not capture. Keep reply under 20 lines.
