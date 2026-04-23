import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Container } from '@/components/layout/Container'
import { SITE_NAME } from '@/lib/constants'
import { Rocket } from 'lucide-react'

export default function Home() {
  return (
    <Container className="py-16">
      <div className="flex flex-col items-center gap-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Rocket className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {SITE_NAME}
          </h1>
          <p className="text-xl text-gray-500">Project base is ready 🚀</p>
        </div>

        <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            header={<h2 className="font-semibold text-gray-900">Primary Button</h2>}
            footer={<p className="text-xs text-gray-500">variant=&quot;primary&quot;</p>}
          >
            <Button variant="primary" size="md">
              Click me
            </Button>
          </Card>

          <Card
            header={<h2 className="font-semibold text-gray-900">Secondary Button</h2>}
            footer={<p className="text-xs text-gray-500">variant=&quot;secondary&quot;</p>}
          >
            <Button variant="secondary" size="md">
              Click me
            </Button>
          </Card>

          <Card
            header={<h2 className="font-semibold text-gray-900">Outline Button</h2>}
            footer={<p className="text-xs text-gray-500">variant=&quot;outline&quot;</p>}
          >
            <Button variant="outline" size="md">
              Click me
            </Button>
          </Card>
        </div>

        <div className="w-full max-w-md">
          <Card header={<h2 className="font-semibold text-gray-900">Input Demo</h2>}>
            <div className="flex flex-col gap-4">
              <Input label="Name" placeholder="Enter your name" />
              <Input label="Email" type="email" placeholder="you@example.com" />
              <Input label="With Error" error="This field is required" placeholder="Shows error state" />
            </div>
          </Card>
        </div>
      </div>
    </Container>
  )
}
