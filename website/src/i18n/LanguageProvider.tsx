import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { ar } from './ar'
import { en } from './en'
import { LanguageContext, type LanguageContextValue } from './context'
import { locales, type Dictionary, type Locale } from './types'

const dictionaries: Record<Locale, Dictionary> = { en, ar }
const rtlLocales: ReadonlySet<Locale> = new Set(['ar'])
const STORAGE_KEY = 'overtop.locale'

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

/** URL (?lang=ar) wins, then the visitor's last choice, then English. */
function readInitialLocale(): Locale {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (isLocale(fromUrl)) return fromUrl
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // Storage can be blocked; English is a fine fallback.
  }
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)
  const t = dictionaries[locale]
  const dir = rtlLocales.has(locale) ? 'rtl' : 'ltr'

  // Keep <html>, the title and the shareable URL in step with the language.
  // Layout effect: direction must be set before first paint, or Arabic flashes LTR.
  useLayoutEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = dir
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)

    const url = new URL(window.location.href)
    if (locale === 'en') url.searchParams.delete('lang')
    else url.searchParams.set('lang', locale)
    window.history.replaceState(null, '', url)
  }, [locale, dir, t])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Ignore: the choice still applies for this visit.
    }
  }, [])

  const value = useMemo<LanguageContextValue>(() => {
    const altLocale: Locale = locale === 'en' ? 'ar' : 'en'
    return { locale, dir, t, setLocale, altLocale, alt: dictionaries[altLocale] }
  }, [locale, dir, t, setLocale])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
