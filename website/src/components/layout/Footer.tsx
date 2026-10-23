import { sectionIds, site } from '../../config/site'
import { useI18n } from '../../i18n/context'
import { Container } from '../ui/Container'

/** Read once at load; the page never lives long enough for this to go stale. */
const year = new Date().getFullYear()

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-ink text-fog">
      <Container className="flex flex-col gap-14 pt-16 pb-8 sm:pt-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <img
            src={`${import.meta.env.BASE_URL}brand/overtop-logo-reverse.png`}
            alt={`${site.name} | ${t.footer.tagline}`}
            width={601}
            height={576}
            loading="lazy"
            className="h-auto w-36"
          />

          <div className="grid gap-8 border-t border-deck pt-5 sm:grid-cols-3">
            <nav aria-label={t.a11y.primaryNav} className="flex flex-col gap-2">
              {sectionIds.map((id) => (
                <a key={id} href={`#${id}`} className="w-fit text-bone hover:text-flare">
                  {t.nav[id]}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-2">
              <span className="label text-[11px]">{t.contact.details.office}</span>
              <a
                href={site.address.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit leading-relaxed text-bone hover:text-flare"
              >
                {t.contact.details.address[0]}
                <br />
                {t.contact.details.address[1]}
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="label text-[11px]">{t.contact.details.phone}</span>
              {site.phones.map((phone) => (
                <a key={phone.href} href={phone.href} className="code w-fit text-[15px] text-bone hover:text-flare">
                  {phone.display}
                </a>
              ))}
              <span className="label mt-3 text-[11px]">{t.contact.details.email}</span>
              <a href={`mailto:${site.email}`} className="code w-fit text-[15px] text-flare hover:underline">
                {site.email}
              </a>
            </div>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="numeral overflow-hidden text-[clamp(4.5rem,17vw,15.5rem)] font-black whitespace-nowrap text-hull uppercase"
        >
          {site.address.city}
        </p>

        <div className="code flex flex-wrap justify-between gap-3 border-t border-deck pt-4 text-[11px] tracking-[0.04em] uppercase">
          <span>
            © {year} {site.name} · {t.footer.rights}
          </span>
        </div>
      </Container>
    </footer>
  )
}
