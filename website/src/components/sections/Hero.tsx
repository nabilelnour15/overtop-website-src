import { site } from '../../config/site'
import { useI18n } from '../../i18n/context'
import { buttonStyles } from '../ui/button'
import { ButtonGlyph } from '../ui/ButtonGlyph'
import { Container } from '../ui/Container'
import { ImageSlot } from '../ui/ImageSlot'

export function Hero() {
  const { t, alt, altLocale } = useI18n()
  const mobile = site.phones[1]

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-ink">
      <Container className="relative pt-10 sm:pt-14">
        <div className="label flex flex-wrap justify-between gap-3 border-t-2 border-ink pt-3">
          <span>{t.hero.eyebrow}</span>
          <span lang={altLocale} className="label hidden opacity-80 sm:inline">
            {alt.hero.eyebrow}
          </span>
        </div>

        <h1 id="hero-title" className="display-hero mt-8 sm:mt-10">
          {t.hero.titleLines[0]}
          <br />
          {t.hero.titleLines[1]} <span className="text-brand">{t.hero.titleAccent}</span>
        </h1>

        <div className="flex flex-wrap items-end justify-between gap-8 pt-10 pb-12 sm:pt-12 sm:pb-14">
          <p className="max-w-[32rem] flex-[1_1_22rem] text-lg leading-relaxed text-pretty sm:text-[19px]">
            {t.hero.lede}
          </p>
          <div className="grid w-full gap-3 sm:flex sm:w-auto">
            <a href="#contact" className={buttonStyles('primary', 'h-[60px] justify-between sm:justify-center')}>
              {t.cta.quote}
              <ButtonGlyph />
            </a>
            <a
              href={mobile.href}
              className="code inline-flex h-[60px] items-center justify-center gap-3 border-2 border-ink px-5 text-sm whitespace-nowrap transition-colors duration-150 hover:bg-ink hover:text-bone"
            >
              <span aria-hidden="true" className="size-2 bg-brand" />
              {mobile.display}
            </a>
          </div>
        </div>
      </Container>

      <ImageSlot
        slot="hero"
        alt={t.hero.imageAlt}
        priority
        accent
        className="h-[clamp(220px,38vw,460px)] border-x-0 border-b-0"
      />
    </section>
  )
}
