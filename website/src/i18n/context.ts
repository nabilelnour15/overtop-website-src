import { createContext, useContext } from 'react'
import type { Dictionary, Locale } from './types'

export interface LanguageContextValue {
  locale: Locale
  dir: 'ltr' | 'rtl'
  /** Strings for the active language. */
  t: Dictionary
  setLocale: (locale: Locale) => void
  /** The other language — used for the bilingual section markers. */
  altLocale: Locale
  alt: Dictionary
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)

export function useI18n(): LanguageContextValue {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useI18n must be used inside <LanguageProvider>')
  return value
}
