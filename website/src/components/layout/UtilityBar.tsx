import { site } from '../../config/site'
import { useI18n } from '../../i18n/context'
import { Container } from '../ui/Container'

/** Thin ink strip above the header: where we are and how to reach us. */
export function UtilityBar() {
  const { t } = useI18n()
  const [landline] = site.phones
  return (
    <div className="hidden bg-ink text-fog md:block">
      <Container className="label flex items-center justify-between gap-4">
        <span className="py-2">
          {t.contact.details.address.join(' · ')}
        </span>
        <span className="code flex items-center gap-3">
          <a href={landline.href} className="flex min-h-11 items-center text-bone hover:text-flare">
            {landline.display}
          </a>
          <span aria-hidden="true">·</span>
          <a href={`mailto:${site.email}`} className="flex min-h-11 items-center text-bone hover:text-flare">
            {site.email}
          </a>
        </span>
      </Container>
    </div>
  )
}
