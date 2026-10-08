import { Container } from '@/components/layout/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { CRAFT_DETAIL_COPY, CRAFT_STEPS } from '@/lib/content-data'

// "Chi tiết thủ công": the six craft steps (list A) from content-data.ts.
export function CraftDetailSection() {
  if (CRAFT_STEPS.length === 0) return null

  return (
    <Container>
      <section className="mt-10 md:mt-14 lg:mt-16 xl:mt-[72px]">
        <SectionTitle eyebrow={CRAFT_DETAIL_COPY.eyebrow} title={CRAFT_DETAIL_COPY.title} />
        <div className="border-t pt-5 md:pt-6" style={{ borderColor: 'var(--border)' }}>
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4 md:mb-6">
            <div className="text-[16px] font-semibold md:text-[17px]" style={{ color: 'var(--text-primary)' }}>
              {CRAFT_DETAIL_COPY.stepsTitle}
            </div>
            <div className="max-w-[560px] text-[14px] leading-[1.5]" style={{ color: 'var(--text-muted-strong)' }}>
              {CRAFT_DETAIL_COPY.note}
            </div>
          </div>
          <ol className="m-0 grid list-none grid-cols-2 gap-x-3.5 gap-y-[18px] p-0 md:grid-cols-3 md:gap-x-5 md:gap-y-6 xl:grid-cols-6">
            {CRAFT_STEPS.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-1.5">
                <span
                  className="grid h-[30px] w-[30px] place-items-center rounded-full border text-[15px]"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)', fontFamily: 'var(--font-body)' }}
                >
                  {i + 1}
                </span>
                <div className="mt-1 text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {step.title}
                </div>
                <div className="text-[14px] leading-[1.5] text-pretty" style={{ color: 'var(--text-muted-strong)' }}>
                  {step.body}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Container>
  )
}
