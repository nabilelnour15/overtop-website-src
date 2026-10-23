import { useEffect, useId, useRef, useState } from 'react'
import { sectionIds, site } from '../../config/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useI18n } from '../../i18n/context'
import { cn } from '../../lib/cn'
import { CloseIcon, MenuIcon, PlayGlyph, WhatsAppIcon } from '../ui/icons'
import { buttonStyles } from '../ui/button'
import { LanguageToggle } from './LanguageToggle'

function Logo() {
  const { t } = useI18n()
  return (
    <a href="#top" aria-label={t.a11y.home} className="flex shrink-0 items-center gap-3 py-3">
      <img src={`${import.meta.env.BASE_URL}brand/overtop-mark.png`} alt="" width={34} height={32} className="h-8 w-auto" />
      <img src={`${import.meta.env.BASE_URL}brand/overtop-wordmark.png`} alt="" width={110} height={18} className="h-[18px] w-auto" />
    </a>
  )
}

export function Header() {
  const { t } = useI18n()
  const active = useActiveSection(sectionIds)
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  // Mobile menu: lock page scroll, move focus in, close on Escape.
  useEffect(() => {
    if (!open) return
    const toggle = toggleRef.current
    document.body.style.overflow = 'hidden'
    firstLinkRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      toggle?.focus()
    }
  }, [open])

  // Close the mobile menu if the viewport grows into the desktop layout.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 80rem)')
    const onChange = () => desktop.matches && setOpen(false)
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-ink bg-bone">
      <div className="mx-auto flex h-[var(--header-height)] max-w-[1240px] items-stretch justify-between ps-4 sm:ps-6 xl:pe-0">
        <Logo />

        {/* Desktop: nav cells divided by hairlines; active = 3px red underline. */}
        <nav aria-label={t.a11y.primaryNav} className="hidden items-stretch text-[15px] font-semibold xl:flex">
          {sectionIds.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? 'location' : undefined}
              className={cn(
                'flex items-center border-s border-line px-4 2xl:px-5',
                'transition-[box-shadow,background-color] duration-150 hover:bg-concrete',
                active === id && 'shadow-[inset_0_-3px_0_var(--color-brand)]',
              )}
            >
              {t.nav[id]}
            </a>
          ))}
          <LanguageToggle className="border-s border-line" />
          <a
            href="#contact"
            className="action-type flex items-center gap-3 bg-brand px-6 text-white transition-colors duration-150 hover:bg-brand-hover"
          >
            {t.cta.quote}
            <PlayGlyph size={12} />
          </a>
        </nav>

        {/* Below desktop: language + menu button. */}
        <div className="flex items-stretch xl:hidden">
          <LanguageToggle className="border-s border-line" />
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            onClick={() => setOpen((value) => !value)}
            className="flex w-[var(--header-height)] cursor-pointer items-center justify-center border-s border-ink bg-ink text-bone"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="fixed inset-x-0 top-[var(--header-height)] bottom-0 overflow-y-auto overscroll-contain bg-bone xl:hidden"
      >
        <nav aria-label={t.a11y.primaryNav} className="flex flex-col px-4 pt-2 pb-8 sm:px-6">
          <ol>
            {sectionIds.map((id, index) => (
              <li key={id} className="border-b border-line">
                <a
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={`#${id}`}
                  onClick={close}
                  aria-current={active === id ? 'location' : undefined}
                  className="flex min-h-16 items-center gap-4 py-3"
                >
                  <span className="code w-8 text-xs text-slate">{String(index + 1).padStart(2, '0')}</span>
                  <span className="display-m flex-1">{t.nav[id]}</span>
                  <PlayGlyph size={12} className={active === id ? 'text-brand' : 'text-line'} />
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a href={site.phones[1].href} className={buttonStyles('outline')}>
              {t.cta.call} <span className="code text-sm normal-case">{site.phones[1].display}</span>
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles('ink')}
            >
              <WhatsAppIcon /> {t.cta.whatsapp}
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
