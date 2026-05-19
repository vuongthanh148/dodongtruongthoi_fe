'use client'

import { SWRConfig } from 'swr'

export default function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        dedupingInterval: process.env.NODE_ENV === 'development' ? 0 : 5 * 60 * 1000,
      }}
    >
      {children}
    </SWRConfig>
  )
}
