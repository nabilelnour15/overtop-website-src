import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './i18n/LanguageProvider'
import { localeFromPath, localePath } from './i18n/locales'
import { locales, type Locale } from './i18n/types'
import './index.css'

// Old shared links used ?lang=ar; send them to the language's own page.
const legacyLang = new URLSearchParams(window.location.search).get('lang')
if (legacyLang && (locales as readonly string[]).includes(legacyLang)) {
  window.location.replace(localePath(legacyLang as Locale) + window.location.hash)
} else {
  const container = document.getElementById('root')!
  const app = (
    <StrictMode>
      <LanguageProvider initialLocale={localeFromPath(window.location.pathname)}>
        <App />
      </LanguageProvider>
    </StrictMode>
  )

  // Production pages arrive pre-rendered (scripts/prerender.mjs); the dev server sends an empty root.
  if (container.firstElementChild) hydrateRoot(container, app)
  else createRoot(container).render(app)
}
