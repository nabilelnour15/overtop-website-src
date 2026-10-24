import { useEffect, useState } from 'react'
import { site } from '../../config/site'
import { useI18n } from '../../i18n/context'
import { cn } from '../../lib/cn'
import { WhatsAppIcon } from '../ui/icons'

/**
 * Call / WhatsApp pinned to the bottom of the screen on phones. It waits until
 * the hero (which has its own call button) scrolls away, and steps aside again
 * once the contact section or the footer is on screen.
 */
export function MobileContactBar() {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)
  const mobile = site.phones[1]

  useEffect(() => {
    const hero = document.getElementById('hero')
    const targets = [hero, document.getElementById('contact'), document.querySelector('footer')].filter(
      (el): el is HTMLElement => el !== null,
    )
    if (targets.length === 0) return

    const onScreen = new Map<Element, boolean>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) onScreen.set(entry.target, entry.isIntersecting)
      setVisible(targets.every((el) => !onScreen.get(el)))
    })
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label={t.a11y.quickContact}
      aria-hidden={!visible || undefined}
      inert={!visible}
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t-2 border-ink bg-bone pb-[env(safe-area-inset-bottom)] md:hidden',
        'transition-transform duration-200 ease-out',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <a href={mobile.href} className="action-type flex h-14 items-center justify-center gap-3 border-e-2 border-ink">
        <span aria-hidden="true" className="size-2 bg-brand" />
        {t.cta.call}
      </a>
      <a
        href={`https://wa.me/${site.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="action-type flex h-14 items-center justify-center gap-3 bg-brand text-white active:bg-brand-pressed"
      >
        <WhatsAppIcon />
        {t.cta.whatsapp}
      </a>
    </nav>
  )
}
