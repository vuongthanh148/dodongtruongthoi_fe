# Buy flow compare: cart, checkout, orders, order (1440 / 768 / 375)

Totals: 55 lines. HIGH 10, MED 23, LOW 22. Owner: CODE 50, DESIGN 4 (LOW), DOC-KNOWN 1 (LOW). lk-* boards NOT COMPARED (live /orders shows only the phone-entry state).

Format: board-width | SEV | OWNER | design vs live | fix

cart-1440 | MED | CODE | breadcrumb at x=112, title at x=80 | align to container edge
cart-1440 | MED | CODE | table starts x=96, not x=80 | remove inner inset
cart-1440 | MED | CODE | title ~28px, spec 36px | PageTitle 36px at lg+
cart-1440 | MED | CODE | showroom buttons ~97px, "Chỉ đường" touches border; design ~185px | min-width/padding for VisitBlock buttons
cart-1440 | LOW | CODE | table headers plain, not uppercase mono; thumb 90px vs 120px | label-mono headers, 120px thumb
cart-1440 | LOW | CODE | total label uppercase mono; CTA has arrow not in design | match label, drop arrow
cart-1440 | LOW | CODE | header search ~320px vs 220px pill; "Liên hệ" clipped (shared shell) | constrain search width
cart-1440 | LOW | CODE | footer headings not uppercase gold label style | label-mono footer headings
cart-1440 | LOW | DOC-KNOWN | footer shows 7 category links incl. "Tranh Phong Cảnh 122507" vs design 4 | Known gap 3; applies to all pages
cart-768 | HIGH | CODE | mobile header (centred title, no logo/tagline) instead of md header | render md header
cart-768 | MED | CODE | breadcrumb x=48, cards inset x=40, design 24px gutter | align to 24px gutter
cart-768 | LOW | CODE | extra "Tiếp tục mua sắm" button in summary; CTA arrow | remove duplicate
cart-768 | MED | CODE | total stacked label above price; design is label-left/price-right row | row layout
cart-768 | MED | CODE | showroom centred and stacked; design left-aligned info row + 2-button grid | left-align VisitBlock at md
cart-375 | HIGH | CODE | header: title + heart only; no logo, search, or cart icon; design has all | restore sm header icons
cart-375 | HIGH | CODE | sticky bottom bar (total + CTA) absent; no bottom-bar component in src | implement sm sticky bar
cart-375 | MED | CODE | footer brand wraps 3 lines; social icons beside brand not below | constrain width, move icons below
cart-375 | LOW | CODE | item price inline beside stepper; design puts it below name | move price
checkout-1440 | MED | CODE | CTA under form in left column plus extra "Quay lại giỏ hàng"; design has CTA in sticky summary | move CTA to summary
checkout-1440 | MED | CODE | title ~26px, spec 36px | PageTitle 36px
checkout-1440 | LOW | CODE | summary shows product card and "Thanh toán: Xác nhận sau" row; design shows items list and "Lắp đặt" row | match summary rows
checkout-1440 | LOW | DESIGN | live adds banner "trong 1–2 giờ"; design has none; conflicts with cart's "30 phút" | product decision, make copy consistent
checkout-1440 | LOW | CODE | terms line under CTA missing | add it
checkout-1440 | LOW | CODE | ghi chú textarea vs single-line input; required asterisk not in design | match design input
checkout-768 | HIGH | CODE | mobile header (centred title, no logo) | as cart-768
checkout-768 | MED | CODE | form before items; design puts items first at md/sm | reorder at md/sm
checkout-768 | MED | CODE | CTA stacked above items; design has CTA at bottom of summary | move CTA
checkout-768 | MED | CODE | showroom centred and stacked | as cart-768
checkout-375 | HIGH | CODE | header: title + heart only; no logo, search, cart | as cart-375
checkout-375 | HIGH | CODE | sticky bottom bar absent | as cart-375
checkout-375 | MED | CODE | form before items at sm | reorder at sm
checkout-375 | MED | CODE | footer brand wraps | as cart-375
orders-1440 | MED | CODE | design is narrow centred column (~560px at x=202): order title, subtitle, stepper, input; live is full-width at x=80 with stepper above title | reorder and narrow
orders-1440 | LOW | CODE | header lookup pill outlined; design shows active filled red | active state
orders-1440 | LOW | CODE | extra label, arrow on "Tra cứu →", underlined "Dùng số mẫu" | remove extras
orders-1440 | LOW | CODE | showroom buttons cramped | as cart-1440
orders-768 | HIGH | CODE | mobile header, centred title, no logo | as cart-768
orders-768 | MED | CODE | stepper above title; design is title, subtitle, stepper, input | reorder
orders-768 | MED | CODE | showroom centred | as cart-768
orders-768 | LOW | CODE | extra input label; pill button, design 6px radius | remove label, 6px radius
orders-375 | HIGH | CODE | header: title only; no logo, search, cart | as cart-375
orders-375 | MED | CODE | showroom centred | as cart-768 at sm
orders-375 | LOW | CODE | "Tra cứu" solid red when empty; design shows disabled muted state | disabled until valid input
orders-375 | LOW | CODE | footer brand wraps | as cart-375
order-1440 | LOW | DESIGN | live adds green "Giao hàng thành công" banner on delivered order; design has none | keep banner, add to design
order-1440 | LOW | CODE | showroom buttons cramped | as cart-1440
order-768 | HIGH | CODE | mobile header, centred "Chi Tiết Đơn Hàng"; no logo, no heart icon | as cart-768, restore heart
order-768 | LOW | DESIGN | delivered banner added in live | as order-1440
order-768 | LOW | CODE | back links "← Tra cứu đơn khác / Tiếp tục mua sắm" touch showroom band; design has none at 768 | remove or add spacing
order-768 | MED | CODE | showroom centred | as cart-768
order-375 | HIGH | CODE | header: title only; no logo, search, cart | as cart-375
order-375 | MED | CODE | stepper horizontal with wrapped labels; README wants vertical checklist on sm | vertical stepper at sm
order-375 | MED | CODE | product rows squeeze name to 3 lines and meta to 4; price pushed right | full-width text at sm
order-375 | LOW | DESIGN | delivered banner added | as order-1440
order-375 | LOW | CODE | back links cramped against showroom | as order-768
order-375 | MED | CODE | showroom centred; buttons half-width, "Chỉ đường" clipped | two equal columns

NO DIFF: none. No board matched at all widths.

Key cross-page causes:
1. md/sm header uses the mobile title pattern on all four pages (fix once in shell).
2. VisitBlock centred at md/sm instead of left-aligned (fix once in component).
3. Sticky sm bottom bar not implemented for cart and checkout (no component in src).
