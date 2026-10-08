import useSWR from 'swr'
import { fetchCampaigns } from '@/lib/storefront-api'
import { SWR_KEYS } from '@/lib/swr-keys'

// One shared request for the campaign list. Every ProductCard and the home
// campaigns block read the same SWR entry, so the list is fetched once.
export function useCampaigns() {
  return useSWR(SWR_KEYS.campaigns, fetchCampaigns, { dedupingInterval: 60 * 1000 })
}
