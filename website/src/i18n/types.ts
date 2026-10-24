import type { SectionId, ServiceId } from '../config/site'
import type { PortId } from '../content/trade-lanes'

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
  lede: string
  scopeHeading: string
  scope: ScopeItem[]
  /** Ruled document list. Transport shows the shipment route instead. */
  documents?: { heading: string; items: string[] }
  imageAlt: string
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
  cta: { quote: string; call: string; whatsapp: string; details: string }
  hero: {
    eyebrow: string
    titleLines: [string, string]
    titleAccent: string
    lede: string
    imageAlt: string
  }
  network: {
    label: string
    title: string
    lede: string
    /** Screen-reader description of the whole chart. */
    mapLabel: string
    legend: { origin: string; sea: string; road: string }
    hint: string
    ports: Record<PortId, string>
  }
  servicesIndex: { label: string; title: string }
  services: Record<ServiceId, ServiceCopy>
  route: {
    heading: string
    steps: ScopeItem[]
  }
  about: {
    label: string
    title: string
    paragraphs: string[]
    principlesHeading: string
    principles: ScopeItem[]
    imageAlt: string
  }
  contact: {
    label: string
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
      sendWhatsapp: string
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
  footer: { tagline: string; rights: string }
}
