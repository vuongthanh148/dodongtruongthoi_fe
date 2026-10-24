import useSWR from 'swr'
import { fetchCampaigns, type Campaign } from '@/lib/storefront-api'
import { SWR_KEYS } from '@/lib/swr-keys'

// One shared request for the campaign list. Every ProductCard and the home
// campaigns block read the same SWR entry, so the list is fetched once.
export function useCampaigns(options?: { fallbackData?: Campaign[] }) {
  return useSWR(SWR_KEYS.campaigns, fetchCampaigns, {
    dedupingInterval: 60 * 1000,
    fallbackData: options?.fallbackData,
  })
}
