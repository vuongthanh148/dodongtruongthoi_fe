'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/**
 * useSearchParams() must sit under a Suspense boundary, but Next streams that
 * boundary's content separately and only patches it in via client JS — so a
 * crawler that doesn't run JS sees nothing in it. Isolating the hook here lets
 * the rest of the page render eagerly (and stay visible to crawlers) while
 * this invisible leaf reports the real params up once mounted.
 */
export function SearchParamsBridge({ onParams }: { onParams: (params: URLSearchParams) => void }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    onParams(searchParams)
  }, [searchParams, onParams])

  return null
}
