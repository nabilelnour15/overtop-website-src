import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { LanguageContext, type LanguageContextValue } from './context'
import { dictionaries, localeDir, localePath } from './locales'
import type { Locale } from './types'

/**
 * The page's language comes from its URL (/ or /ar/), so the pre-rendered HTML
 * and the first client render always agree. Switching swaps the text in place
 * and moves the address to the other language's page.
 */
export function LanguageProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale)
  const t = dictionaries[locale]
  const dir = localeDir(locale)

  // Keep <html>, the title and the address in step with the language.
  // Layout effect: direction must be set before first paint, or Arabic flashes LTR.
  useLayoutEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = dir
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)

    const path = localePath(locale)
    if (window.location.pathname !== path) {
      window.history.replaceState(null, '', path + window.location.hash)
    }
  }, [locale, dir, t])

  const switchLocale = useCallback((next: Locale) => setLocale(next), [])

  const value = useMemo<LanguageContextValue>(() => {
    const altLocale: Locale = locale === 'en' ? 'ar' : 'en'
    return { locale, dir, t, setLocale: switchLocale, altLocale, alt: dictionaries[altLocale] }
  }, [locale, dir, t, switchLocale])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
