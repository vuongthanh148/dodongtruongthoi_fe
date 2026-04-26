'use client'

import { SWRConfig } from 'swr'

export default function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        dedupingInterval: 5 * 60 * 1000, // 5 min default cache
      }}
    >
      {children}
    </SWRConfig>
  )
}
