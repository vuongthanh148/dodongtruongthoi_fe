# UI Verification Report (Width 475px)

Date: 2026-04-29
Scope: Home page (`/`) at fixed viewport width 475px.
Reference screenshot: `./.screenshots/home-475w-final.png`

## Plan Completion Status

- [x] Phase 1 shared shell updates
- [x] Phase 2 new UI primitives/components
- [x] Phase 3 home section rewrites
- [x] Phase 4 home page wiring
- [x] Final alignment: customer photos moved to dedicated section component (`src/components/sections/CustomerPhotosSection.tsx`)

Conclusion: The implementation plan is now fully applied in code.

## Verification Findings (Need Follow-up Plan)

### 1) Hero appears visually empty when banner data is absent
- Severity: Medium
- Area: Top hero (`BannerSection`)
- Observation: At 475px, hero can look like a large dark block when no banner image/content is available.
- Impact: First screen has weak visual intent and can lower perceived quality.
- Suggested next-plan direction:
  - Add explicit empty-state artwork/text CTA in `BannerSection` fallback.
  - Consider reducing hero height at 475px when banner list is empty.

### 2) Decorative divider clipping at right edge
- Severity: Low
- Area: Dong Son divider section
- Observation: Divider motifs appear cut/truncated near the right boundary at this width.
- Impact: Minor polish issue; visual rhythm is interrupted.
- Suggested next-plan direction:
  - Review overflow and background sizing rules in divider styles.
  - Tune spacing/padding for widths around 460-500px.

### 3) Category cards show placeholders and zero counts in current data state
- Severity: Medium
- Area: `CategoriesSection`
- Observation: Category visual uses placeholder tile and product counts can display `0`.
- Impact: Homepage appears under-populated even if layout is correct.
- Suggested next-plan direction:
  - Replace placeholder block with real category artwork/icon mapping.
  - Revisit count derivation/fallback data strategy when products are loading/empty.

### 4) Floating contact bubbles overlap content interaction zone
- Severity: Medium
- Area: `ContactBubbles`
- Observation: On 475px, bubbles can visually overlap lower-page content and potential tap targets.
- Impact: Risk of accidental taps and reduced readability near bottom-right area.
- Suggested next-plan direction:
  - Add width-aware offset/size adjustments for <= 475px.
  - Optionally collapse into one expandable FAB on small screens.

### 5) Featured products can show empty-state block
- Severity: Medium
- Area: `FeaturedProductsSection`
- Observation: Section can render empty-state text if product data is absent.
- Impact: Mid-page loses merchandising value.
- Suggested next-plan direction:
  - Add curated fallback products.
  - Or hide section until minimum data threshold is available.

## Recommended Next Planning Pack

1. Mobile hero empty-state spec (content + height behavior).
2. Divider rendering fix acceptance criteria for 475px.
3. Category card data/art direction (non-placeholder).
4. `ContactBubbles` mobile behavior spec (single FAB vs stacked buttons).
5. Featured section fallback strategy (hide vs curated fallback).

## Validation Notes

- Build status after final refactor: `npm run build` succeeded.
- The report intentionally captures unresolved UI polish/data-state issues so they can be planned as a separate phase.
