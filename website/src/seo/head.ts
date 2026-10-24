import { serviceIds, site } from '../config/site'
import { defaultLocale, dictionaries, localePath } from '../i18n/locales'
import { locales, type Locale } from '../i18n/types'

/** Absolute address of a language's page, e.g. https://overtopcompany.com/ar/ */
export function pageUrl(locale: Locale): string {
  return new URL(localePath(locale), site.url).href
}

/** Absolute address of a file in public/. */
function assetUrl(path: string): string {
  return new URL(path, site.url).href
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const meta = (attr: 'name' | 'property', key: string, content: string) =>
  `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`

/** Business facts for Google: who we are, where, how to reach us and what we offer. */
function structuredData(locale: Locale): string {
  const t = dictionaries[locale]
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${site.url}#business`,
        name: site.name,
        alternateName: site.nameAr,
        description: t.meta.description,
        url: site.url,
        logo: assetUrl('brand/overtop-logo.png'),
        image: assetUrl(`share/share-${locale}.jpg`),
        email: site.email,
        telephone: site.phones.map((phone) => phone.href.replace('tel:', '')),
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address.street,
          addressLocality: site.address.city,
          addressCountry: 'EG',
        },
        hasMap: site.address.mapUrl,
        areaServed: { '@type': 'Country', name: 'Egypt' },
        knowsLanguage: ['en', 'ar'],
        makesOffer: serviceIds.map((id) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: t.meta.serviceNames[id], description: t.services[id].lede },
        })),
        ...(site.socialProfiles.length > 0 && { sameAs: site.socialProfiles }),
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}#website`,
        url: site.url,
        name: site.name,
        inLanguage: locales,
        publisher: { '@id': `${site.url}#business` },
      },
    ],
  }
  // "<" escaped so the JSON can never close the <script> tag early.
  return JSON.stringify(graph).replace(/</g, '\\u003c')
}

/** Every search and share tag for one language's page, as HTML for <head>. */
export function renderHead(locale: Locale): string {
  const { meta: copy } = dictionaries[locale]
  const url = pageUrl(locale)
  const image = assetUrl(`share/share-${locale}.jpg`)
  const otherLocales = locales.filter((other) => other !== locale)

  return [
    `<title>${escapeAttr(copy.title)}</title>`,
    meta('name', 'description', copy.description),
    `<link rel="canonical" href="${url}" />`,
    ...locales.map((each) => `<link rel="alternate" hreflang="${each}" href="${pageUrl(each)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${pageUrl(defaultLocale)}" />`,

    // Facebook, WhatsApp, LinkedIn, Telegram… all read Open Graph.
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', site.name),
    meta('property', 'og:url', url),
    meta('property', 'og:title', copy.shareTitle),
    meta('property', 'og:description', copy.shareDescription),
    meta('property', 'og:locale', copy.ogLocale),
    ...otherLocales.map((other) => meta('property', 'og:locale:alternate', dictionaries[other].meta.ogLocale)),
    meta('property', 'og:image', image),
    meta('property', 'og:image:type', 'image/jpeg'),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', copy.shareImageAlt),

    // X (Twitter) reads its own tags first, then falls back to Open Graph.
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', copy.shareTitle),
    meta('name', 'twitter:description', copy.shareDescription),
    meta('name', 'twitter:image', image),
    meta('name', 'twitter:image:alt', copy.shareImageAlt),

    `<script type="application/ld+json">${structuredData(locale)}</script>`,
  ].join('\n    ')
}
