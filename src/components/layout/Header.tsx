import Link from 'next/link'
import { SITE_NAME, NAV_ITEMS } from '@/lib/constants'
import { Container } from '@/components/layout/Container'

function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            {SITE_NAME}
          </Link>
          <nav>
            <ul className="flex gap-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  )
}

export { Header }
