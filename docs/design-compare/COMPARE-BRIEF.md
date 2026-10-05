# Design vs live compare — brief for comparison agents

Files:
- Design board PNGs: ./design/<board-id>.png  (full page, native width 1440/768/375)
- Live PNGs: ./live/<slug>-<width>.png  (full page; `campaign-<w>.png` is a crop of the campaigns section only; `nav-grouped-<w>.png` is the home page with mega menu open at 1440 only, so check widths carefully)
- Design source (read only, if you need the exact value): /Users/stephen/Documents/Projects/dodongtruongthoi/dodongtruongthoi_fe/docs/design_handoff_desktop_responsive/README.md (spec) and app/*.jsx (values)
- Live source (read only): /Users/stephen/Documents/Projects/dodongtruongthoi/dodongtruongthoi_fe/src

Mapping of design board → live file:
home-a→home-a, nav-grouped→nav-grouped (1440), campaign-one/many→campaign (1440/375; live has one list, judge by count), cats→cats, list-a→list-a, pdp-a→pdp-a, saved→saved, cart→cart, checkout→checkout, orders→orders, lk-list/verify/locked/detail→NOT CAPTURED LIVE (state-machine boards; mark "not compared" unless the live page shows the same state), order→order, blog→blog, article→article, contact→contact, faq→faq, guide→guide, craft→craft.

Rules:
- Compare LAYOUT, spacing, column counts, section order, typography scale, colors, buttons, and visible copy. Ignore: placeholder images/gradients (design uses placeholders; live uses real product photos), map iframes (blank in headless), mock data values (prices, names), fixed-position artifacts in full-page captures.
- A difference is real when it is visible at that width. Do not guess; cite what you see.
- For each difference, decide owner:
  - CODE: design is the target and the code is wrong or missing something.
  - DESIGN: the design is inconsistent with its own README, or live behavior is required by real data (e.g. the design shows a fixed count the API cannot give), or the code is clearly the better answer. Explain why.
  - DOC-KNOWN: already listed under "Known gaps" in fe/docs/DESKTOP_RESPONSIVE_STATUS.md. Check that file first; it lists deliberate deviations.
- Severity: HIGH (broken layout, overflow, hidden content, wrong structure), MED (wrong spacing/order/columns visibly off), LOW (minor spacing/color/copy).

Output: write your findings to the file named in your task, in this exact format, one line per difference:
`<board>-<width> | <HIGH|MED|LOW> | <CODE|DESIGN|DOC-KNOWN> | <what differs: design says X, live shows Y> | <fix suggestion, one line>`
Also a section "NO DIFF" listing boards that matched at all widths.
Reply under 12 lines: counts per severity and owner, and the file path.
