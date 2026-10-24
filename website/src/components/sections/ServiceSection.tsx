import type { ReactNode } from 'react'
import { serviceCodes, serviceIds, type ServiceId } from '../../config/site'
import { useI18n } from '../../i18n/context'
import { cn } from '../../lib/cn'
import { Container } from '../ui/Container'
import { ImageSlot } from '../ui/ImageSlot'
import { SectionMarker } from '../ui/SectionMarker'

interface ServiceSectionProps {
  id: ServiceId
  tone?: 'bone' | 'ink'
  /** Put the image column first on wide screens, for rhythm down the page. */
  flip?: boolean
  /** Full-width content under the two columns (e.g. the route steps). */
  footer?: ReactNode
}

/** One service: title + lede, what we handle, a photo slot and the documents sheet. */
export function ServiceSection({ id, tone = 'bone', flip = false, footer }: ServiceSectionProps) {
  const { t, alt } = useI18n()
  const service = t.services[id]
  const number = String(serviceIds.indexOf(id) + 1).padStart(2, '0')
  const dark = tone === 'ink'

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('py-16 sm:py-24', dark ? 'bg-ink text-bone' : 'border-t border-ink')}
    >
      <Container>
        <SectionMarker
          number={number}
          label={service.name}
          altLabel={alt.services[id].name}
          tone={dark ? 'dark' : 'light'}
        />

        <div data-reveal className="grid gap-6 pt-8 pb-12 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pb-16">
          <h2 id={`${id}-title`} className="display-l lg:col-span-7">
            {service.title}
          </h2>
          <p
            className={cn(
              'text-lg leading-relaxed text-pretty lg:col-span-5',
              dark ? 'text-fog' : 'text-deck',
            )}
          >
            {service.lede}
          </p>
        </div>

        <div data-reveal className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className={cn('lg:col-span-7', flip && 'lg:order-2')}>
            <h3 className={cn('label mb-4', dark ? 'text-fog' : 'text-slate')}>{service.scopeHeading}</h3>
            <ol className={cn('border-t-2', dark ? 'border-bone' : 'border-ink')}>
              {service.scope.map((item, index) => (
                <li
                  key={item.title}
                  className={cn(
                    'grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 border-b py-5 sm:grid-cols-[3.5rem_minmax(0,14rem)_minmax(0,1fr)] sm:gap-x-6',
                    dark ? 'border-deck' : 'border-line',
                  )}
                >
                  <span className={cn('code pt-1 text-xs', dark ? 'text-flare' : 'text-crimson')}>
                    {`${serviceCodes[id].split('/')[1]}.${index + 1}`}
                  </span>
                  <span className="text-lg leading-snug font-bold">{item.title}</span>
                  <span
                    className={cn(
                      'col-start-2 text-[15px] leading-relaxed text-pretty sm:col-start-3',
                      dark ? 'text-fog' : 'text-deck',
                    )}
                  >
                    {item.body}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className={cn('flex flex-col gap-6 lg:col-span-5', flip && 'lg:order-1')}>
            <ImageSlot
              slot={id}
              alt={service.imageAlt}
              tone={dark ? 'ink' : 'concrete'}
              className="aspect-[4/3] w-full"
            />
            {service.documents && <DocumentSheet id={id} {...service.documents} />}
          </div>
        </div>

        {footer && <div data-reveal className="pt-16 sm:pt-20">{footer}</div>}
      </Container>
    </section>
  )
}

/** Documents as a ruled white sheet — the "paperwork" the customer will recognise. */
function DocumentSheet({ id, heading, items }: { id: ServiceId; heading: string; items: string[] }) {
  const prefix = serviceCodes[id].split('/')[1]
  return (
    <div className="border border-ink bg-sheet">
      <h3 className="label border-b border-ink px-5 py-3 text-slate">{heading}</h3>
      <ul>
        {items.map((item, index) => (
          <li
            key={item}
            className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-3 border-b border-line px-5 py-3.5 last:border-b-0"
          >
            <span className="code text-xs text-slate">{`D-${prefix}-${index + 1}`}</span>
            <span className="text-[15px] leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
