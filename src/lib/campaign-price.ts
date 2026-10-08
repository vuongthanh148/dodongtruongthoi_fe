// Single source for campaign display rules (HANDOFF "Behaviour rules (batch 2)").
// Display only: the server prices orders. Keep this file free of imports so it
// can be compiled and asserted on its own.

export interface CampaignRule {
  id: string
  name: string
  description?: string | null
  discountType: 'percentage' | 'fixed_amount'
  discountValue: number
  startsAt: string
  endsAt: string
  isActive: boolean
}

export interface ProductPriceInput {
  price: number
  discountPrice?: number
  campaignId?: string
}

export interface ProductSale {
  /** Sale price shown on the card (multiple of 1 000 VND). */
  sale: number
  /** Badge number without the sign, e.g. "15" or "5.88". */
  percent: string
  /** The campaign that gives the sale, when it is known from the campaign list. */
  campaign: CampaignRule | null
}

const DAY_MS = 24 * 60 * 60 * 1000

/** Campaigns ending within this many days show "Còn n ngày" in the accent colour. */
export const SOON_DAYS = 3

/** Active and inside its start/end window. Past start dates are live. */
export function isCampaignLive(campaign: CampaignRule, now: Date = new Date()): boolean {
  if (!campaign.isActive) return false
  const start = Date.parse(campaign.startsAt)
  const end = Date.parse(campaign.endsAt)
  if (Number.isNaN(start) || Number.isNaN(end)) return false
  const t = now.getTime()
  return t >= start && t <= end
}

/** Discount as a share of the list price. A fixed amount becomes its equivalent share. */
function effectiveRate(price: number, campaign: CampaignRule): number {
  if (price <= 0) return 0
  const raw =
    campaign.discountType === 'percentage'
      ? campaign.discountValue / 100
      : campaign.discountValue / price
  return Math.min(Math.max(raw, 0), 1)
}

/** Round to the nearest 1 000 VND: round(v / 1000) * 1000. */
export function roundToThousand(value: number): number {
  return Math.round(value / 1000) * 1000
}

/** sale = round(price × (1 − pct/100) / 1000) × 1000. */
export function salePrice(price: number, campaign: CampaignRule): number {
  return roundToThousand(price * (1 - effectiveRate(price, campaign)))
}

/** Equivalent discount in percent, rounded to 2 decimals (e.g. 5.88). */
export function discountPercent(price: number, campaign: CampaignRule): number {
  return Math.round(effectiveRate(price, campaign) * 10000) / 100
}

/** "15" for whole numbers, "5.88" otherwise. */
export function formatPercent(percent: number): string {
  return String(Number(percent.toFixed(2)))
}

/** Whole days left, rounded up. Caller checks isCampaignLive first. */
export function daysLeft(campaign: CampaignRule, now: Date = new Date()): number {
  return Math.ceil((Date.parse(campaign.endsAt) - now.getTime()) / DAY_MS)
}

const SHOP_TIME_ZONE = 'Asia/Ho_Chi_Minh'
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: SHOP_TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

/** dd/mm/yyyy on the shop's calendar (Asia/Ho_Chi_Minh), whatever the visitor's time zone. */
export function formatDateVi(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

/** End-date line for a card. Under 3 days: "Còn n ngày · kết thúc ngày …" in the accent colour. */
export function campaignEndLine(
  campaign: CampaignRule,
  now: Date = new Date()
): { text: string; soon: boolean } {
  const date = formatDateVi(campaign.endsAt)
  const n = daysLeft(campaign, now)
  if (n <= SOON_DAYS) {
    return { text: `Còn ${n} ngày · kết thúc ngày ${date}`, soon: true }
  }
  return { text: `Kết thúc ngày ${date}`, soon: false }
}

/** Server rule (backend usecase): percentage truncates to an integer, fixed amount subtracts. */
function serverSale(price: number, campaign: CampaignRule): number {
  const out =
    campaign.discountType === 'percentage'
      ? price - Math.floor((price * campaign.discountValue) / 100)
      : price - campaign.discountValue
  return Math.max(out, 0)
}

const MATCH_TOLERANCE = 1000

/**
 * Sale for one product on the storefront. The API gives only discount_price, with no
 * campaign id. The live campaign whose server price matches discount_price is the one
 * applied. If several match, the higher discount wins (overlap rule). Returns null when
 * the product has no sale.
 */
export function resolveProductSale(
  product: ProductPriceInput,
  campaigns: CampaignRule[],
  now: Date = new Date()
): ProductSale | null {
  const { price, discountPrice, campaignId } = product
  if (discountPrice === undefined || price <= 0 || discountPrice >= price) return null

  let best: CampaignRule | null = null
  if (campaignId) {
    best = campaigns.find((c) => c.id === campaignId && isCampaignLive(c, now)) ?? null
  } else {
    let bestRate = -1
    for (const campaign of campaigns) {
      if (!isCampaignLive(campaign, now)) continue
      if (Math.abs(serverSale(price, campaign) - discountPrice) > MATCH_TOLERANCE) continue
      const rate = effectiveRate(price, campaign)
      if (rate > bestRate) {
        best = campaign
        bestRate = rate
      }
    }
  }

  if (best) {
    return {
      sale: salePrice(price, best),
      percent: formatPercent(discountPercent(price, best)),
      campaign: best,
    }
  }

  // No live campaign matches (list not loaded yet, or stale): show the server price
  // rounded to 1 000 VND, without an end date.
  const percent = Math.round((1 - discountPrice / price) * 10000) / 100
  return {
    sale: roundToThousand(discountPrice),
    percent: formatPercent(percent),
    campaign: null,
  }
}

/** "Giảm 15%" or "Giảm 500.000đ" for campaign cards. */
export function campaignDiscountLabel(campaign: CampaignRule, formatAmount: (n: number) => string): string {
  return campaign.discountType === 'percentage'
    ? `Giảm ${campaign.discountValue}%`
    : `Giảm ${formatAmount(campaign.discountValue)}`
}

/**
 * Price for one variant on the product page and saved list. `base` is the variant's list
 * price (size and options resolved); the campaign that the product matches is applied to it.
 * With no live campaign match the list price is shown.
 */
export function variantSale(
  base: number,
  product: ProductPriceInput,
  campaigns: CampaignRule[],
  now: Date = new Date()
): { price: number; percent: string | null; campaign: CampaignRule | null } {
  const sale = resolveProductSale(product, campaigns, now)
  if (!sale?.campaign || base <= 0) return { price: base, percent: null, campaign: null }
  return {
    price: salePrice(base, sale.campaign),
    percent: formatPercent(discountPercent(base, sale.campaign)),
    campaign: sale.campaign,
  }
}
