import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { site } from './config/site'
import { LanguageProvider } from './i18n/LanguageProvider'
import { localeDir, localePath } from './i18n/locales'
import { locales, type Locale } from './i18n/types'
import { pageUrl, renderHead } from './seo/head'

/** Build-time only: scripts/prerender.mjs turns each language into a full HTML page with this. */
export function renderPage(locale: Locale) {
  return {
    html: renderToString(
      <StrictMode>
        <LanguageProvider initialLocale={locale}>
          <App />
        </LanguageProvider>
      </StrictMode>,
    ),
    head: renderHead(locale),
    lang: locale,
    dir: localeDir(locale),
    /** Output folder for the page, relative to dist/ ("" or "ar/"). */
    folder: localePath(locale).slice(import.meta.env.BASE_URL.length),
  }
}

export { locales, pageUrl, site }
