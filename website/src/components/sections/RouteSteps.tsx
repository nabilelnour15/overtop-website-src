import { useI18n } from '../../i18n/context'
import { cn } from '../../lib/cn'

/** Four stops along a rule, each marked with a ▲ — read on ink. */
export function RouteSteps() {
  const { t } = useI18n()
  const { heading, steps } = t.route

  return (
    <div>
      <h3 className="label mb-10 text-fog">{heading}</h3>
      <ol className="grid gap-x-0 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const last = index === steps.length - 1
          return (
            <li
              key={step.title}
              className={cn('flex flex-col gap-3 border-t-2 pe-6', last ? 'border-bone' : 'border-brand')}
            >
              <span
                aria-hidden="true"
                className={cn(
                  '-mt-[9px] size-0 border-x-[9px] border-b-[15px] border-x-transparent',
                  last ? 'border-b-bone' : 'border-b-brand',
                )}
              />
              <span className="label text-fog">
                <span className="code">{String(index + 1).padStart(2, '0')}</span>
              </span>
              <span className="display-m">{step.title}</span>
              <span className="text-[15px] leading-relaxed text-fog text-pretty">{step.body}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
