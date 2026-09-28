import { test, expect } from '@playwright/test'

// Smoke test: no route should ever produce horizontal overflow, at any of the
// four breakpoints the responsive-layer handoff targets. This does not check
// visual fidelity — just the most common responsive-layout footgun.
// Run with: npx playwright test (dev server must be reachable at baseURL)

const WIDTHS = [375, 768, 1024, 1440]

const ROUTES = [
  '/',
  '/products',
  '/categories',
  '/categories/tranh-phong-thuy',
  '/products/some-product',
  '/saved',
  '/cart',
  '/checkout',
  '/orders',
  '/faq',
  '/huong-dan-mua-hang',
  '/lang-nghe',
  '/cam-nang',
  '/cam-nang/kich-thuoc-tranh',
  '/lien-he',
]

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    test(`${route} has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(route)
      await page.waitForLoadState('networkidle')

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))

      expect(
        scrollWidth,
        `document.documentElement.scrollWidth (${scrollWidth}) exceeds clientWidth (${clientWidth}) at ${width}px on ${route}`
      ).toBeLessThanOrEqual(clientWidth)
    })
  }
}
