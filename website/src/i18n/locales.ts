import { ar } from './ar'
import { en } from './en'
import { locales, type Dictionary, type Locale } from './types'

export const dictionaries: Record<Locale, Dictionary> = { en, ar }
export const defaultLocale: Locale = 'en'

export function localeDir(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

/** Each language is its own page: English at the base path, Arabic under /ar/. */
export function localePath(locale: Locale): string {
  const base = import.meta.env.BASE_URL
  return locale === defaultLocale ? base : `${base}${locale}/`
}

/** The language a path belongs to, e.g. "/ar/" → "ar". */
export function localeFromPath(pathname: string): Locale {
  const base = import.meta.env.BASE_URL
  const first = pathname.startsWith(base) ? pathname.slice(base.length).split('/')[0] : ''
  return (locales as readonly string[]).includes(first) ? (first as Locale) : defaultLocale
}
