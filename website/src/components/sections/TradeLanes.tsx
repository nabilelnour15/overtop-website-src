import { useMemo } from 'react'
import { AIR_LANES, EGYPT_PORTS, WORLD_PORTS } from '../../content/globe'
import { useI18n } from '../../i18n/context'
import { Container } from '../ui/Container'
import { Globe, type GlobeLane, type GlobePoint } from '../ui/Globe'

const byId = Object.fromEntries([...EGYPT_PORTS, ...WORLD_PORTS].map((port) => [port.id, port]))
const at = (id: string) => [byId[id].lon, byId[id].lat] as const

/** Sea lanes from each world port's Egyptian hub, plus the air lanes from Cairo. */
const LANES: GlobeLane[] = [
  ...WORLD_PORTS.map((port) => ({ kind: 'sea' as const, from: at(port.hub), to: at(port.id) })),
  ...AIR_LANES.map((id) => ({ kind: 'air' as const, from: at('cairo'), to: at(id) })),
]

/**
 * The trade-lanes band between the hero and the services: a globe with
 * Egypt's ports connected by sea and air to ports around the world, on ink.
 */
export function TradeLanes() {
  const { t, locale } = useI18n()
  const points = useMemo<GlobePoint[]>(
    () => [
      ...EGYPT_PORTS.map((port) => ({ ...port, name: t.network.ports[port.id], egypt: true })),
      ...WORLD_PORTS.map((port) => ({ ...port, name: t.network.ports[port.id] })),
    ],
    [t],
  )

  return (
    <section aria-labelledby="lanes-title" className="border-t-2 border-ink bg-ink text-bone">
      <Container className="pt-16 pb-6 sm:pt-24">
        <div data-reveal className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end md:gap-12">
          <h2 id="lanes-title" className="display-l">
            {t.network.title}
          </h2>
          <p className="max-w-[30rem] text-[17px] leading-relaxed text-pretty text-fog">{t.network.lede}</p>
        </div>
      </Container>

      <div className="mx-auto max-w-[62rem] px-2 sm:px-6">
        <Globe points={points} lanes={LANES} label={t.network.mapLabel} rtl={locale === 'ar'} />
      </div>

      <div className="border-t border-deck bg-ink/85">
        <Container className="label flex flex-wrap items-center gap-x-8 gap-y-2 py-4 text-fog">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 bg-brand" />
            {t.network.legend.egypt}
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-0.5 w-6 bg-flare" />
            {t.network.legend.sea}
          </span>
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-0.5 w-6 bg-[repeating-linear-gradient(90deg,var(--color-bone)_0_4px,transparent_4px_8px)]"
            />
            {t.network.legend.air}
          </span>
          <span className="ms-auto hidden tracking-normal normal-case md:inline">{t.network.hint}</span>
        </Container>
        <Container className="pb-6 text-[15px] leading-relaxed text-pretty text-fog">
          {EGYPT_PORTS.map((port) => t.network.ports[port.id]).join(' · ')}
        </Container>
      </div>
    </section>
  )
}
