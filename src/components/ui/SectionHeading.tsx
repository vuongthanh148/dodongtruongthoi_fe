import { IconChevron } from '@/components/icons'
import { Heading } from '@/components/ui/Heading'
import { Label } from '@/components/ui/Label'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  action?: string
  onActionClick?: () => void
}

export function SectionHeading({ eyebrow, title, action, onActionClick }: SectionHeadingProps) {
  return (
    <div className="mb-3 px-4">
      <div className="flex items-baseline justify-between">
        <div>
          {eyebrow ? (
            <Label className="mb-1">
              {eyebrow}
            </Label>
          ) : null}
          <Heading size="lg">{title}</Heading>
        </div>
        {action ? (
          <button
            type="button"
            onClick={onActionClick}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent)',
              fontFamily: 'var(--font-lora), serif',
              fontStyle: 'italic',
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {action} <IconChevron size={12} color="var(--accent)" />
          </button>
        ) : null}
      </div>
      <div className="dongson-rule mt-2.5" />
    </div>
  )
}
