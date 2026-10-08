'use client'

import { ContentState } from '@/components/content/ContentState'

export default function Error({ unstable_retry }: { unstable_retry: () => void }) {
  return <ContentState kind="faq" state="error" onRetry={() => unstable_retry()} />
}
