/**
 * Company facts that don't change between languages.
 * Source: OVERTOP LETTER.pdf (company letterhead).
 */
export const site = {
  name: 'Overtop',
  nameAr: 'أوفرتوب',
  /** Public address, ending in "/" — set in .env so the domain can change in one place. */
  url: import.meta.env.VITE_SITE_URL,
  /**
   * Official profile links (Facebook, LinkedIn, Instagram…). Listed in the
   * structured data so search engines connect them to the site.
   */
  socialProfiles: [] as string[],
  email: 'info@overtopcompany.com',
  phones: [
    { display: '(002) 034842894', href: 'tel:+2034842894', kind: 'landline' },
    { display: '(002) 01006934433', href: 'tel:+201006934433', kind: 'mobile' },
  ],
  /** WhatsApp number in international format, digits only. */
  whatsapp: '201006934433',
  address: {
    street: '68 El Houria Ave',
    city: 'Alexandria',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=68+El+Houria+Ave+Alexandria+Egypt',
  },
  portCode: 'EGALY',
} as const

/** Page sections, in scroll order. The id doubles as the URL hash. */
export const sectionIds = ['import', 'export', 'transport', 'customs', 'about', 'contact'] as const
export type SectionId = (typeof sectionIds)[number]

export const serviceIds = ['import', 'export', 'transport', 'customs'] as const
export type ServiceId = (typeof serviceIds)[number]

export const serviceCodes: Record<ServiceId, string> = {
  import: 'OT/IMP',
  export: 'OT/EXP',
  transport: 'OT/TRN',
  customs: 'OT/CUS',
}
