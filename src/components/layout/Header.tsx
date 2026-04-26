import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'
import { Container } from '@/components/layout/Container'

function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            {SITE_NAME}
          </Link>
          <span className="text-sm text-gray-600">Handcrafted Bronze Art</span>
        </div>
      </Container>
    </header>
  )
}

export { Header }
