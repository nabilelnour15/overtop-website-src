import type { Dictionary } from './types'

export const en: Dictionary = {
  meta: {
    title: 'Overtop | Customs Clearance, Import, Export & Transport · Alexandria, Egypt',
    description:
      'Customs clearance, import, export and inland trucking through Alexandria port, Egypt. One team for the paperwork, the port and the road. Get a quote.',
    ogLocale: 'en_US',
    shareTitle: 'Overtop | Customs clearance & freight through Alexandria',
    shareDescription:
      'Import, export, customs clearance and port-to-door trucking in Alexandria, Egypt. One team, one quote.',
    shareImageAlt: 'Overtop: from the quay to your door. Customs clearance, import, export and transport in Alexandria, Egypt.',
    serviceNames: {
      import: 'Import clearance & delivery',
      export: 'Export clearance & shipping',
      transport: 'Container trucking & inland transport',
      customs: 'Customs clearance',
    },
  },
  a11y: {
    skipToContent: 'Skip to content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    primaryNav: 'Primary',
    home: 'Overtop: back to top',
    backToTop: 'Back to top',
    quickContact: 'Quick contact',
  },
  nav: {
    import: 'Import',
    export: 'Export',
    transport: 'Transportation',
    customs: 'Custom Services',
    about: 'About Us',
    contact: 'Contact Us',
  },
  languageSwitch: { label: 'Switch to Arabic', target: 'ar', short: 'عربي' },
  cta: {
    quote: 'Request a quote',
    call: 'Call',
    whatsapp: 'WhatsApp',
    details: 'Details',
  },
  hero: {
    eyebrow: 'Export · Import · Transport · Custom services',
    titleLines: ['From the quay', 'to your'],
    titleAccent: 'door.',
    lede: 'Overtop clears, moves and delivers cargo through Alexandria. One team accountable for the paperwork, the port and the road.',
    imageAlt: 'Overtop truck carrying a container at Alexandria port',
  },
  network: {
    label: 'Trade lanes',
    title: 'One port. Lanes to four continents.',
    lede: 'Cargo for Europe, the Gulf, Asia, Africa and the Americas sails from Alexandria. We handle the paperwork and the port on this end, and the truck to your door.',
    mapLabel:
      'Map of common sea lanes from Alexandria to Rotterdam, Antwerp, Hamburg, Genoa, Valencia, Piraeus, Istanbul, New York, Jeddah, Jebel Ali, Mumbai, Mombasa, Colombo, Singapore, Hong Kong, Shanghai and Busan, with the road to Cairo.',
    legend: { origin: 'Alexandria', sea: 'Common sea lanes', road: 'Our trucks, inland' },
    hint: 'Move across the map to look closer. Tap to send a ping.',
    ports: {
      alexandria: 'Alexandria',
      cairo: 'Cairo',
      rotterdam: 'Rotterdam',
      antwerp: 'Antwerp',
      hamburg: 'Hamburg',
      genoa: 'Genoa',
      valencia: 'Valencia',
      piraeus: 'Piraeus',
      istanbul: 'Istanbul',
      newYork: 'New York',
      jeddah: 'Jeddah',
      jebelAli: 'Jebel Ali',
      mumbai: 'Mumbai',
      mombasa: 'Mombasa',
      colombo: 'Colombo',
      singapore: 'Singapore',
      hongKong: 'Hong Kong',
      shanghai: 'Shanghai',
      busan: 'Busan',
    },
  },
  servicesIndex: {
    label: 'Services',
    title: 'Use one service. Or hand us the whole chain.',
  },
  services: {
    import: {
      name: 'Import',
      title: 'Import into Egypt, without the waiting.',
      lede: 'We prepare the file before your goods sail, settle duties and clear the cargo at port, then deliver it to your warehouse.',
      scopeHeading: 'What we handle',
      scope: [
        {
          title: 'Pre-shipment check',
          body: 'We review the invoice, packing list and HS codes with you before loading, so nothing is held on arrival.',
        },
        {
          title: 'Duties & taxes',
          body: 'A clear calculation of customs duties and VAT on the declared value, with no surprises at release.',
        },
        {
          title: 'Port release',
          body: 'Declaration filing, inspection attendance and release from the terminal.',
        },
        {
          title: 'Delivery',
          body: 'Our trucks take the cargo from the port to your door.',
        },
      ],
      documents: {
        heading: 'Documents we prepare with you',
        items: [
          'ACID number (Advance Cargo Information)',
          'Commercial invoice & packing list',
          'Bill of lading / air waybill',
          'Certificate of origin',
          'Import approvals & permits, where required',
        ],
      },
      imageAlt: 'Containers being unloaded at Alexandria port',
    },
    export: {
      name: 'Export',
      title: 'Egyptian goods, out to the world.',
      lede: 'Export declarations, certificates and bookings handled from your factory gate to the vessel.',
      scopeHeading: 'What we handle',
      scope: [
        {
          title: 'Export declaration',
          body: 'We file the export declaration and follow it through customs until the goods are cleared to load.',
        },
        {
          title: 'Certificates',
          body: 'Certificate of origin and the other certificates your buyer’s country asks for.',
        },
        {
          title: 'Booking & loading',
          body: 'Space with the shipping line, empty container pick-up and loading at your site.',
        },
        {
          title: 'Port handling',
          body: 'Gate-in, inspection and loading on the vessel, with the bill of lading sent to you.',
        },
      ],
      documents: {
        heading: 'Documents we prepare with you',
        items: [
          'Commercial invoice & packing list',
          'Export declaration',
          'Certificate of origin',
          'Bill of lading',
          'Product certificates, where the buyer requires them',
        ],
      },
      imageAlt: 'Truck with a red container arriving at the terminal gate',
    },
    transport: {
      name: 'Transportation',
      title: 'Our trucks. Port to door.',
      lede: 'Inland trucking and container haulage between the port, your factory and your warehouse.',
      scopeHeading: 'What we handle',
      scope: [
        {
          title: 'Container haulage',
          body: '20 ft and 40 ft containers to and from the Alexandria port terminals.',
        },
        {
          title: 'Port-to-door delivery',
          body: 'Cleared cargo goes straight from the terminal to your address, with no hand-over to another company.',
        },
        {
          title: 'Loading coordination',
          body: 'We schedule the truck with your warehouse so loading and unloading happen on time.',
        },
        {
          title: 'Updates on the way',
          body: 'You hear from us at every stop, by phone or WhatsApp.',
        },
      ],
      imageAlt: 'Overtop truck on the road out of Alexandria',
    },
    customs: {
      name: 'Custom Services',
      title: 'Customs, handled.',
      lede: 'Clearance with Egyptian Customs: classification, declarations and inspection, handled by people who do it every day.',
      scopeHeading: 'What we handle',
      scope: [
        {
          title: 'Tariff classification',
          body: 'The right HS code for your goods, so the duty is right the first time.',
        },
        {
          title: 'Customs declaration',
          body: 'We prepare and file the declaration and answer the customs officers’ questions.',
        },
        {
          title: 'Inspection',
          body: 'We attend the inspection with your cargo and coordinate any samples or checks.',
        },
        {
          title: 'Release & follow-up',
          body: 'If a shipment is held, we find out why and resolve it.',
        },
      ],
      documents: {
        heading: 'What we need from you',
        items: [
          'Commercial invoice',
          'Packing list',
          'Bill of lading / air waybill',
          'Certificate of origin',
          'Company tax card & commercial register',
        ],
      },
      imageAlt: 'Customs inspection of a container',
    },
  },
  route: {
    heading: 'How a shipment moves',
    steps: [
      { title: 'Brief', body: 'Goods, origin, destination, timing. A call or a message.' },
      { title: 'Quote & papers', body: 'A clear price and the exact list of documents needed.' },
      { title: 'Clearance', body: 'We file, attend inspection and secure release.' },
      { title: 'Delivered', body: 'Our trucks take it to the door. You get the proof.' },
    ],
  },
  about: {
    label: 'About us',
    title: 'One desk for the paperwork, the port and the road.',
    paragraphs: [
      'Overtop is an Alexandria company working in export, import, transport and customs services.',
      'Instead of passing your cargo between a customs broker, a forwarder and a trucking company, you deal with one team that sees the whole journey, and answers for it.',
    ],
    principlesHeading: 'How we work',
    principles: [
      { title: 'One contact', body: 'The same person follows your shipment from the first call to delivery.' },
      { title: 'Price first', body: 'You get a clear quote before we start. No hidden charges at release.' },
      { title: 'Papers early', body: 'Documents are checked before the goods move. That is where delays begin.' },
      { title: 'Alexandria-based', body: 'Our office is minutes from the port, not a call centre away.' },
    ],
    imageAlt: 'The Overtop team at the office in Alexandria',
  },
  contact: {
    label: 'Contact us',
    title: 'Cargo landing soon?',
    lede: 'Tell us what you’re moving. We reply with a price and the exact documents needed.',
    form: {
      heading: 'Quote request',
      name: 'Full name',
      phone: 'Phone',
      service: 'Service',
      serviceOptions: {
        import: 'Import',
        export: 'Export',
        transport: 'Transportation',
        customs: 'Custom services',
        other: 'Not sure yet',
      },
      message: 'Cargo details',
      messagePlaceholder: 'What are you shipping, from where, and when?',
      sendEmail: 'Send by email',
      sendWhatsapp: 'Send on WhatsApp',
      note: 'Both buttons open your own email or WhatsApp app with the message ready to send.',
      emailSubject: 'Quote request',
      errors: {
        name: 'Please enter your name.',
        phone: 'Please enter a phone number we can call back (at least 7 digits).',
      },
      sent: {
        title: 'Your email app should open now.',
        body: 'Nothing opened? Send the same message on WhatsApp, or copy our address into your own email.',
        copyEmail: 'Copy email address',
        copied: 'Copied',
      },
    },
    details: {
      office: 'Office',
      address: ['68 El Houria Ave', 'Alexandria, Egypt'],
      phone: 'Telephone',
      email: 'Email',
      openMap: 'Open in Maps',
    },
  },
  footer: {
    tagline: 'Export · Import · Transport · Custom services',
    rights: 'All rights reserved.',
  },
}
