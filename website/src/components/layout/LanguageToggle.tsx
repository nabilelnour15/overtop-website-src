import type { MouseEvent } from 'react'
import { useI18n } from '../../i18n/context'
import { localePath } from '../../i18n/locales'
import { cn } from '../../lib/cn'

/**
 * Switches EN ⇄ AR. Labelled in the target language so each audience can find it.
 * A real link to the other language's page, so search engines can follow it;
 * a plain click swaps the text in place without a reload.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { t, setLocale } = useI18n()
  const { target, short, label } = t.languageSwitch

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    setLocale(target)
  }

  return (
    <a
      href={localePath(target)}
      hrefLang={target}
      onClick={onClick}
      lang={target}
      aria-label={label}
      className={cn(
        'flex min-h-11 min-w-11 cursor-pointer items-center justify-center px-5 font-semibold text-slate',
        'transition-colors duration-150 hover:bg-concrete hover:text-ink',
        target === 'ar' ? 'font-[family-name:var(--font-arabic)]' : 'code text-sm',
        className,
      )}
    >
      {short}
    </a>
  )
}
