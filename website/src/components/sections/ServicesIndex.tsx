import { serviceCodes, serviceIds } from '../../config/site'
import { useI18n } from '../../i18n/context'
import { cn } from '../../lib/cn'
import { Container } from '../ui/Container'
import { PlayGlyph } from '../ui/icons'
import { SectionMarker } from '../ui/SectionMarker'

/**
 * The service index — a ruled table of the four services instead of icon cards.
 * Each row jumps to its section; rows invert to ink on hover.
 */
export function ServicesIndex() {
  const { t, alt } = useI18n()

  return (
    <section aria-labelledby="services-title" className="py-16 sm:py-24">
      <Container>
        <SectionMarker number="00" label={t.servicesIndex.label} altLabel={alt.servicesIndex.label} />
        <h2 id="services-title" className="display-l max-w-[48rem] pt-8 pb-10">
          {t.servicesIndex.title}
        </h2>

        <ol className="border-t border-ink">
          {serviceIds.map((id, index) => {
            const service = t.services[id]
            const last = index === serviceIds.length - 1
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={cn(
                    'group -mx-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-6 sm:-mx-6 sm:px-6',
                    'md:grid-cols-[5rem_6rem_minmax(0,1.1fr)_minmax(0,1.4fr)_auto] md:gap-x-8',
                    'transition-colors duration-150 hover:bg-ink hover:text-bone',
                    last ? 'border-b border-ink' : 'border-b border-line',
                  )}
                >
                  <span className="numeral text-5xl sm:text-6xl group-hover:text-flare">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="code hidden text-[13px] text-slate group-hover:text-fog md:block">
                    {serviceCodes[id]}
                  </span>
                  <span className="display-m">{service.name}</span>
                  <span className="col-span-3 text-[15px] leading-relaxed text-deck text-pretty group-hover:text-fog md:col-span-1 md:row-start-1 md:col-start-4">
                    {service.lede}
                  </span>
                  <PlayGlyph className="col-start-3 row-start-1 text-brand group-hover:text-flare md:col-start-5" />
                </a>
              </li>
            )
          })}
        </ol>
      </Container>
    </section>
  )
}
