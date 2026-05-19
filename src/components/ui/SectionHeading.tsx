import { IconChevron } from '@/components/icons'
import { DongsonBorder } from '@/components/ui/DongsonBorder'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  action?: string
  onActionClick?: () => void
}

export function SectionHeading({ eyebrow, title, action, onActionClick }: SectionHeadingProps) {
  return (
    <div className="mb-3 px-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <div
              style={{
                marginBottom: 6,
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--bronze)',
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1.05,
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </div>
        </div>
        {action ? (
          <button
            type="button"
            onClick={onActionClick}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              color: 'var(--accent)',
              fontFamily: 'var(--font-lora), serif',
              fontStyle: 'italic',
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap',
            }}
          >
            {action} <IconChevron size={12} color="var(--accent)" />
          </button>
        ) : null}
      </div>
      <div style={{ marginTop: 10 }}>
        <DongsonBorder />
      </div>
    </div>
  )
}
