# Design update request: delivered-order status banner

Page: order detail (`/orders/{id}`), desktop 1440.

Live has a status banner for orders whose status is `completed` (delivered). The design board `order-1440` has no delivered state.

Please add the delivered state to the design:
- Banner at the top of the order content, green tint (live: background `rgba(0,150,80,0.08)`, border `rgba(0,150,80,0.25)`).
- Truck icon in a round green-tinted chip.
- Headline: "Giao hàng thành công" (bold). Sub-line: "Cảm ơn bạn đã tin tưởng Đồ Đồng Trường Thơi."

Files:
- live-delivered-banner-1440.png: current live banner (the request).
- design-order-1440-reference.png: current design board for context. It has no delivered state.

Also checked at 768 and 375: same banner, stacked full width.
