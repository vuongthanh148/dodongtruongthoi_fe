import { SITE_NAME } from '@/lib/constants'
import { Container } from '@/components/layout/Container'

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <Container>
        <div className="flex h-16 items-center justify-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}

export { Footer }
