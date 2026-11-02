import type { SectionId, ServiceId } from '../config/site'
import type { PortId } from '../content/globe'

export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]

export interface ScopeItem {
  title: string
  body: string
}

export interface ServiceCopy {
  /** Short name used in the nav and the service index. */
  name: string
  title: string
  /** The closing part of the title, set in red. */
  titleAccent: string
  lede: string
  scopeHeading: string
  scope: ScopeItem[]
  /** A featured product, shown under the scope list. */
  product?: ProductCopy
  imageAlt: string
  /** Alt text for a second photo under the first, where a section has one. */
  imageAlt2?: string
}

export interface ProductCopy {
  heading: string
  name: string
  /** The standard the product is made to, shown as a tag next to the name. */
  standard: string
  description: string
  specs: Array<{ label: string; value: string }>
  cta: string
  imageAlt: string
  /** Alt text for the three smaller photos: detail, wrapped coils, crate. */
  galleryAlts: [string, string, string]
}

/**
 * Every language file must satisfy this shape, so a missing translation
 * is a type error rather than a blank on the page.
 */
export interface Dictionary {
  /**
   * Search and share copy. Worded for what people type into Google
   * ("customs clearance", "تخليص جمركي"), which can differ from the on-page names.
   */
  meta: {
    title: string
    description: string
    /** og:locale, e.g. en_US. */
    ogLocale: string
    shareTitle: string
    shareDescription: string
    shareImageAlt: string
    /** Service names in the structured data, in search wording. */
    serviceNames: Record<ServiceId, string>
  }
  a11y: {
    skipToContent: string
    openMenu: string
    closeMenu: string
    primaryNav: string
    home: string
    backToTop: string
    /** Label for the sticky call/WhatsApp bar on phones. */
    quickContact: string
  }
  nav: Record<SectionId, string>
  languageSwitch: { label: string; target: Locale; short: string }
  cta: { quote: string; call: string; whatsapp: string }
  hero: {
    titleLines: [string, string]
    titleAccent: string
    lede: string
    imageAlt: string
  }
  network: {
    title: string
    lede: string
    /** Screen-reader description of the whole chart. */
    mapLabel: string
    legend: { egypt: string; sea: string; air: string }
    hint: string
    ports: Record<PortId, string>
  }
  servicesIndex: { title: string }
  services: Record<ServiceId, ServiceCopy>
  route: {
    heading: string
    steps: ScopeItem[]
  }
  about: {
    title: string
    paragraphs: string[]
    principlesHeading: string
    principles: ScopeItem[]
    imageAlt: string
  }
  contact: {
    title: string
    lede: string
    form: {
      heading: string
      name: string
      phone: string
      service: string
      serviceOptions: Record<ServiceId | 'other', string>
      message: string
      messagePlaceholder: string
      sendEmail: string
      note: string
      emailSubject: string
      errors: { name: string; phone: string }
      /** Shown after "Send by email", in case no mail app opens. */
      sent: {
        title: string
        body: string
        copyEmail: string
        copied: string
      }
    }
    details: {
      office: string
      /** Street, then city — shown on separate lines. */
      address: [string, string]
      phone: string
      email: string
      openMap: string
    }
  }
  footer: { rights: string }
}
