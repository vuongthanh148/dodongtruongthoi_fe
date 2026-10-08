// Product page links and share targets. Share uses standard web share URLs, no SDK.

/** Path for a product page, keeping the chosen size and variant options in the query. */
export function productPath(
  productId: string,
  options: { sizeId?: string; attrs?: Record<string, string> } = {}
): string {
  const params = new URLSearchParams()
  if (options.sizeId) params.set('sizeId', options.sizeId)
  for (const [key, value] of Object.entries(options.attrs ?? {})) {
    if (value) params.set(key, value)
  }
  const query = params.toString()
  return query ? `/products/${productId}?${query}` : `/products/${productId}`
}

/** Facebook sharer (standard web URL). */
export function facebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
}

/**
 * Zalo share. Zalo has no SDK here; this is the web share entry point with the page URL.
 * Confirm the exact endpoint against Zalo's current share docs before launch.
 */
export function zaloShareUrl(url: string): string {
  return `https://zalo.me/share?u=${encodeURIComponent(url)}`
}

/** Messenger deep link (opens the app on phones). Desktop has no web sharer without a Facebook app id. */
export function messengerShareUrl(url: string): string {
  return `fb-messenger://share/?link=${encodeURIComponent(url)}`
}
