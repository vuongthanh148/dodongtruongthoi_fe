# Findings: home-a, nav-grouped, campaign, cats, list-a, pdp-a, saved

Format: board-width | severity | owner | design says X, live shows Y | fix

## Differences

home-a-1440 | MED | CODE | Featured grid shows 4 cards in one row; design shows 8 (two rows of 4) | Make featured count follow the 4/3/3/2 grid (or document the cap; Step 2 calls it deliberate but it is not in Known gaps).
home-a-1440 | MED | DESIGN | Category strip: design shows 5 tiles in one row with counts; live shows 8 tiles (Tất cả + 7 API categories, two rows, most counts 0) | API-driven list is correct; update board or cap to 5.
home-a-1440 | MED | CODE | Stories has no DeskHeading: design shows "Từ làng nghề Đại Bái" title + "Xem tất cả" link; live shows only small eyebrow "Câu chuyện làng nghề" | Add DeskHeading (eyebrow, Lora title, link) like the other sections.
home-a-1440 | LOW | CODE | Hero primary CTA: design is solid red "Xem chi tiết →"; live is outline "Khám phá ngay →" | Restyle hero CTA to solid red, or confirm outline with design.
home-a-1440 | LOW | DESIGN | Hero eyebrow and side-tile copy differ: design "KHUYẾN MÃI" / "Bộ sưu tập" / "Quà tân gia"; live "TUYỂN CHỌN TINH HOA" / "Về Chúng Tôi" / "Chất Lượng Tuyệt Vời" | CMS content, no layout change.
home-a-1440 | LOW | CODE | Campaign eyebrow ("GIẢM 15% · 27/4/2026 – 27/5/2026") wraps to two lines in the 3-card row; design eyebrow is one line | Shorten date format or widen card at xl.
home-a-1440 | LOW | DESIGN | Campaigns: live shows 3 cards; board shows 2 (README allows 2–3) | Data-driven; no change.
home-a-1440 | LOW | DESIGN | DeskHeading rule: board draws a hairline; live draws dotted dongson ornament (README names a "dongson rule") | Live matches README wording; update board.
home-a-1440 | LOW | DESIGN | VisitBlock buttons: board shows larger full buttons; live uses compact buttons (status doc says compact is the user's follow-up mockup) | Keep live; update board.
home-a-768 | MED | DOC-KNOWN | Hero side tiles absent; design shows 2 tiles in 2 columns under the hero | Known gap 1 (needs placement field). Note: live 1440 does show side tiles, so the doc is stale there.
home-a-768 | MED | CODE | Trust bar is 4 columns; design and README say 2x2 at md | Use 2 columns at md, 4 at lg.
home-a-768 | MED | CODE | Header has no inline search row under logo; design (README md TopBar) has a full-width search row | Add md-only search row to TopBar.
home-a-768 | MED | CODE | Featured shows 4 cards (3+1); design shows 6 (two rows of 3) | Same count issue as 1440.
home-a-768 | MED | CODE | Stories shows one dark card; design shows two stacked ivory cards (README: 1 column at md) | Render both story cards at md and below.
home-a-768 | MED | CODE | Stories heading missing (same as 1440) | Add DeskHeading.
home-a-768 | MED | CODE | VisitBlock is centered with compact buttons; design is left-aligned with two full-width buttons side by side | Left-align block; make buttons flex-1 at md.
home-a-768 | LOW | DESIGN | Categories: board shows 5 tiles in one row; README says md = 3 columns; live shows 3 columns (matches README) | Fix board to 3 columns.
home-a-375 | MED | DOC-KNOWN | Hero side tiles absent; design shows 2 tiles in 2 columns under hero | Known gap 1.
home-a-375 | MED | CODE | Mobile header shows heart with badge but no cart icon; design shows search + cart with badge | Restore cart icon in TopBar, or confirm it is reachable elsewhere.
home-a-375 | MED | CODE | Stories shows one dark card; design shows two stacked ivory cards; heading missing | Render both cards and add DeskHeading.
home-a-375 | MED | CODE | VisitBlock centered with compact buttons; design left-aligned with full-width halves | Left-align; split buttons 50/50.
home-a-375 | LOW | CODE | Footer: live puts brand and socials on one row; design stacks socials under the brand | Stack socials below brand at sm.
nav-grouped-1440 | MED | DOC-KNOWN | Mega menu: design has 5 groups (Tranh đồng, Trống đồng, Đồ thờ cúng, Quà tặng with "Sắp có", Bán chạy), each with sub-links and "Tất cả … →"; live has 2 columns: a flat API category list and 2 large bestseller tiles | Known gap 3 (taxonomy vs API categories).
nav-grouped-1440 | LOW | CODE | Bán chạy: design shows two small tiles with "từ {price}"; live shows two large tiles | Shrink tiles to design size.
campaign-one-1440 | LOW | DESIGN | Board shows one campaign (28px title, CTA right); live shows 3 cards from data, so the single state is not reachable live | Data-driven; no change.
campaign-one-1440 | LOW | DESIGN | Heading rule: hairline in board vs dongson ornament in live (same as home) | Update board.
campaign-many-1440 | LOW | DESIGN | Board shows 2 cards; live shows 3 (data; README allows 2–3) | Data-driven; no change.
campaign-many-1440 | LOW | CODE | Eyebrow wraps to two lines at 3-card width (same as home) | Shorten date format or widen card.
campaign-one-375 | LOW | CODE | Live CTA stretches to full card width; design CTA is auto-width | Use auto-width CTA at sm.
campaign-one-375 | LOW | DESIGN | Single-card state not reachable live (3 cards from data) | Data-driven; no change.
campaign-many-375 | LOW | DESIGN | Board 2 cards vs live 3 in an 85% scroller (layout matches; count is data) | No change.
cats-1440 | MED | CODE | Page h1 "Danh mục sản phẩm" and subtitle missing; live shows only eyebrow "TẤT CẢ DANH MỤC" | Add PageTitle (36px h1 + sub).
cats-1440 | LOW | DESIGN | Board shows 5 tiles; live shows 8 with counts of 0 (API data) | Data-driven; no change.
cats-768 | MED | CODE | First tile is not full width; design uses 2 columns with first tile spanning both (README md rule) | Span first tile across 2 columns at md.
cats-768 | MED | CODE | Page h1 and subtitle missing | Add PageTitle.
cats-768 | MED | CODE | Header search row missing (see home-a-768) | Add md-only search row to TopBar.
cats-375 | MED | CODE | Row thumbnails are about 32px; design uses about 100px (README sm: 110px image) | Enlarge thumbnail to about 110px.
cats-375 | MED | CODE | Page h1 and subtitle missing; live shows top-bar title only | Add PageTitle.
cats-375 | LOW | CODE | Mobile header has no cart icon (see home-a-375) | Restore cart icon.
list-a-1440 | MED | CODE | Product cards have no rating stars and no colour swatches; design shows both (PDP data includes rating) | Add rating and swatch row to card, or confirm API fields and move to DESIGN.
list-a-1440 | LOW | CODE | Count line "4 / 4 sản phẩm" vs design "42 sản phẩm"; default sort "Nổi bật" vs "Phổ biến nhất" | Copy and format.
list-a-1440 | LOW | DESIGN | "Xem thêm sản phẩm" button absent; live shows all 4 products (data) | No change.
list-a-1440 | LOW | DESIGN | Board shows active filter chips; live default state has none | State only; no change.
list-a-768 | MED | CODE | Page h1 and count missing; live shows only top-bar title "Tất cả sản phẩm" | Add PageTitle.
list-a-768 | MED | CODE | Product cards have no rating or swatches (see list-a-1440) | Same fix.
list-a-768 | LOW | CODE | Filter bar: design has two full-width buttons "Bộ lọc (2)" and sort; live has small "Lọc" / "Sắp xếp" plus grid/list toggle, no count badge | Match filter bar; keep toggle only if wanted.
list-a-768 | MED | CODE | Header search row missing (see home-a-768) | Add md-only search row.
list-a-375 | MED | CODE | Page h1 and count missing (see list-a-768) | Add PageTitle.
list-a-375 | MED | CODE | Product cards have no rating or swatches | Same fix.
list-a-375 | LOW | CODE | Filter bar differs (see list-a-768) | Match design.
list-a-375 | MED | CODE | Mobile header has no cart icon (see home-a-375) | Restore cart icon.
pdp-a-1440 | MED | CODE | Gallery has no thumbnail strip; design shows 4 thumbnails under main image | Add thumbnail row at lg.
pdp-a-1440 | MED | CODE | "Màu nền" option row with swatches and "Nền Đỏ · miễn phí" missing from buy box | Add background-tone row after Khung.
pdp-a-1440 | LOW | CODE | Recap chip "Nền · Khung · Size" missing above options | Add chip.
pdp-a-1440 | MED | CODE | "Thông số chính" spec card (right of tabs, lg+) not rendered | Confirm with data; Step 4 says it was added.
pdp-a-1440 | LOW | CODE | Tabs read "Hướng dẫn" vs design "Ý nghĩa"; "Đánh giá" lacks "(64)" count | Copy and count.
pdp-a-1440 | LOW | CODE | CTA row: live adds "Đã lưu", puts price in Mua ngay label, and uses text button instead of heart icon | Align CTA row to design.
pdp-a-1440 | LOW | DESIGN | Related grid shows 3 products vs design 4 | Data-driven; no change.
pdp-a-1440 | LOW | CODE | Related eyebrow "CÙNG DANH MỤC" vs "GỢI Ý"; no "Xem thêm" link | Copy; add link.
pdp-a-768 | MED | CODE | Gallery has no thumbnail strip | Add thumbnail row.
pdp-a-768 | MED | CODE | "Màu nền" option row missing | Add row.
pdp-a-768 | LOW | CODE | Recap chip missing | Add chip.
pdp-a-768 | MED | CODE | Header: back-arrow bar; design has hamburger and search row | Add search row; keep back arrow only if intended.
pdp-a-768 | LOW | CODE | Related has no "Xem thêm" link; eyebrow copy differs | Add link; copy.
pdp-a-375 | MED | CODE | Gallery has no thumbnail strip | Add thumbnail row.
pdp-a-375 | MED | CODE | Related products are a horizontal scroller; design shows a 2-column grid | Use 2-column grid at sm.
pdp-a-375 | MED | CODE | Mobile header has no cart icon (heart and back arrow only) | Restore cart icon.
pdp-a-375 | LOW | CODE | Sticky bar: design shows "Tạm tính" with price and two buttons; live shows "Đã lưu", "Thêm vào giỏ", "Mua ngay · price" | Align sticky bar to design.
saved-1440 | MED | CODE | Page h1 "Sản phẩm đã lưu" and count missing; live shows eyebrow "1 TÁC PHẨM YÊU THÍCH" | Add PageTitle.
saved-1440 | LOW | DESIGN | Count 1 vs design 5 (data) | No change.
saved-1440 | LOW | CODE | Breadcrumb "Sản phẩm đã lưu" vs design "Đồ lưu" | Copy.
saved-768 | MED | CODE | Page h1 and count missing | Add PageTitle.
saved-768 | LOW | DESIGN | Count 1 vs design 4 (data) | No change.
saved-768 | MED | CODE | Header search row missing (see home-a-768) | Add md-only search row.
saved-375 | MED | CODE | Page h1 and count missing | Add PageTitle.
saved-375 | LOW | DESIGN | Count 1 vs design 4 (data) | No change.
saved-375 | MED | CODE | Mobile header has no cart icon (see home-a-375) | Restore cart icon.

## NO DIFF
- Footer (5-column at lg, 3 link columns at md, 2+1 at sm): matches on home, cats, list-a, pdp-a, saved at all widths except the sm brand/socials row (home-a-375 above).
- Home trust bar at 1440 and 375: 4 columns at lg, 2x2 at sm, copy matches design. Known gap 2 says the 3-item dark copy was kept; live shows the design's 4-item copy, so that doc entry looks stale.
- Home category scroller at 375 (30%-wide tiles) and campaign scroller at 375 (85% width): layout matches.
- cats-1440 6-column tile span pattern (first 2 span 3, others span 2): matches.
- list-a-1440 and list-a-768 product grid column count (3 columns): matches.
- saved-1440 4-column grid and "Thêm tất cả vào giỏ" action: matches.
- nav-grouped-768 and nav-grouped-375: no design board (README says 1440 only). Live shows no open menu at these widths, so nothing to compare.
- campaign-768 is live only (no design board); not compared.
- Not compared: list-a-1440 colour-swatch group and pdp-a-375 colour-swatch row are hidden behind the open bottom sheet or sticky bar in the captures (fixed-position artifact); re-capture to confirm.
- Not in scope for this pass: cart, checkout, orders, blog, article, contact, faq, guide, craft, order, lk-*.
