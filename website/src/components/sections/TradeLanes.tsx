import { useMemo } from 'react'
import { site } from '../../config/site'
import { INLAND_WATER, LANDMASS, LANES, LANES_VIEW, PORTS } from '../../content/trade-lanes'
import { useI18n } from '../../i18n/context'
import { Container } from '../ui/Container'
import HalftoneRoutes from '../ui/halftone-routes'
import { SectionMarker } from '../ui/SectionMarker'

/**
 * The trade-lanes band between the hero and the services: Alexandria's sea
 * lanes printed as a halftone chart, on ink.
 */
export function TradeLanes() {
  const { t, alt } = useI18n()
  const ports = useMemo(() => PORTS.map((port) => ({ ...port, name: t.network.ports[port.id] })), [t])

  return (
    <section aria-labelledby="lanes-title" className="bg-ink text-bone">
      <Container className="pt-16 pb-10 sm:pt-24 sm:pb-14">
        <SectionMarker number={site.portCode} label={t.network.label} altLabel={alt.network.label} tone="dark" />
        <div className="grid gap-6 pt-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end md:gap-12">
          <h2 id="lanes-title" className="display-l">
            {t.network.title}
          </h2>
          <p className="max-w-[30rem] text-[17px] leading-relaxed text-pretty text-fog">{t.network.lede}</p>
        </div>
      </Container>

      <HalftoneRoutes
        land={LANDMASS}
        water={INLAND_WATER}
        lanes={LANES}
        ports={ports}
        view={LANES_VIEW}
        label={t.network.mapLabel}
        className="border-t border-deck"
      >
        <div className="mt-auto border-t border-deck bg-ink/85">
          <Container className="label flex flex-wrap items-center gap-x-8 gap-y-2 py-4 text-fog">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="size-2.5 bg-brand" />
              {t.network.legend.origin}
              <span className="code text-bone">{site.portCode}</span>
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="h-0.5 w-6 bg-brand" />
              {t.network.legend.sea}
            </span>
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-0.5 w-6 bg-[repeating-linear-gradient(90deg,var(--color-bone)_0_4px,transparent_4px_8px)]"
              />
              {t.network.legend.road}
            </span>
            <span className="ms-auto hidden tracking-normal normal-case md:inline">{t.network.hint}</span>
          </Container>
        </div>
      </HalftoneRoutes>
    </section>
  )
}
