import { useI18n } from '../../i18n/context'
import { Container } from '../ui/Container'
import { ImageSlot } from '../ui/ImageSlot'
import { SectionMarker } from '../ui/SectionMarker'

export function About() {
  const { t, alt } = useI18n()
  const { about } = t

  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-ink bg-concrete py-16 sm:py-24">
      <Container>
        <SectionMarker number="05" label={about.label} altLabel={alt.about.label} />

        <div className="grid gap-10 pt-8 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <h2 id="about-title" className="display-l">
              {about.title}
            </h2>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-[38rem] text-lg leading-relaxed text-deck text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
          <ImageSlot
            slot="about"
            alt={about.imageAlt}
            figure="FIG. 05 · OT/HQ"
            className="aspect-[4/3] w-full lg:col-span-5 lg:self-end"
          />
        </div>

        <h3 className="label mt-16 mb-4 text-slate">{about.principlesHeading}</h3>
        <ul className="grid border-t-2 border-ink sm:grid-cols-2 lg:grid-cols-4">
          {about.principles.map((principle, index) => (
            <li
              key={principle.title}
              className="flex flex-col gap-3 border-b border-line py-6 sm:pe-6 lg:border-b-0 lg:border-s lg:ps-6 lg:first:border-s-0 lg:first:ps-0"
            >
              <span className="code text-xs text-crimson">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-xl font-bold">{principle.title}</span>
              <span className="text-[15px] leading-relaxed text-deck text-pretty">{principle.body}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
