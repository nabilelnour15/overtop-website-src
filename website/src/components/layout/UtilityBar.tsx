import { site } from '../../config/site'
import { useI18n } from '../../i18n/context'
import { Container } from '../ui/Container'

/** Thin ink strip above the header: where we are and how to reach us. */
export function UtilityBar() {
  const { t } = useI18n()
  const [landline] = site.phones
  return (
    <div className="hidden bg-ink text-fog md:block">
      <Container className="label flex justify-between gap-4 py-2">
        <span>
          {t.contact.details.address.join(' · ')}
        </span>
        <span className="code flex gap-3">
          <a href={landline.href} className="text-bone hover:text-flare">
            {landline.display}
          </a>
          <span aria-hidden="true">·</span>
          <a href={`mailto:${site.email}`} className="text-bone hover:text-flare">
            {site.email}
          </a>
        </span>
      </Container>
    </div>
  )
}
