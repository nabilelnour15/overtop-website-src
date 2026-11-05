import type { Dictionary } from "./types";

export const en: Dictionary = {
  meta: {
    title:
      "Overtop | Import, Export, Customs Clearance & Freight in Egypt · Since 2017",
    description:
      "Import, export, customs clearance and consulting, sea and air freight and door-to-door transport through every Egyptian port, since 2017. One team for the paperwork, the port and the road. Get a quote.",
    ogLocale: "en_US",
    shareTitle: "Overtop | Import, export, customs & freight across Egypt",
    shareDescription:
      "Sea and air freight, customs clearance and consulting, import, export and door-to-door transport through every Egyptian port. Since 2017.",
    shareImageAlt:
      "Overtop: every Egyptian port, straight to your door. Import, export, customs and transport since 2017.",
    serviceNames: {
      import: "Import clearance & delivery",
      export: "Export clearance & shipping",
      transport: "Freight, logistics & transport",
      customs: "Customs clearance & consulting",
    },
  },
  a11y: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    primaryNav: "Primary",
    home: "Overtop: back to top",
    backToTop: "Back to top",
    quickContact: "Quick contact",
  },
  nav: {
    import: "Import",
    export: "Export",
    transport: "Transport & Logistics",
    customs: "Custom Services",
    about: "About Us",
    contact: "Contact Us",
  },
  languageSwitch: { label: "Switch to Arabic", target: "ar", short: "عربي" },
  cta: {
    quote: "Request a quote",
    call: "Call",
    whatsapp: "WhatsApp",
  },
  hero: {
    titleLines: ["Every port", "Straight to your"],
    titleAccent: "door.",
    lede: "Since 2017, Overtop has cleared, moved and delivered cargo by sea, air and road through every port in Egypt and beyond. One team accountable for the paperwork, the port and the road.",
    imageAlt:
      "A container ship arriving at a port with gantry cranes, and a cargo aircraft overhead",
  },
  network: {
    title: "All ports. Lanes to every continent.",
    lede: "Sea and air cargo shipped through Europe, the Gulf, Asia, Africa, the Americas and Australia. We handle the paperwork and the port on this end, and the truck to your door.",
    mapLabel:
      "Rotating globe with sea lanes from the Egyptian ports of Port Said, Damietta, Ain Sokhna and Safaga, and air lanes from Cairo, to ports in Europe, the Americas, Africa, the Gulf, Asia and Australia.",
    legend: { egypt: "Egyptian ports", sea: "Sea lanes", air: "Air lanes" },
    hint: "Drag to turn the globe.",
    ports: {
      portSaid: "Port Said",
      damietta: "Damietta",
      sokhna: "Ain Sokhna",
      safaga: "Safaga",
      cairo: "Cairo Airport",
      rotterdam: "Rotterdam",
      antwerp: "Antwerp",
      hamburg: "Hamburg",
      genoa: "Genoa",
      valencia: "Valencia",
      piraeus: "Piraeus",
      istanbul: "Istanbul",
      newYork: "New York",
      houston: "Houston",
      santos: "Santos",
      vancouver: "Vancouver",
      lagos: "Lagos",
      durban: "Durban",
      jeddah: "Jeddah",
      jebelAli: "Jebel Ali",
      mumbai: "Mumbai",
      mombasa: "Mombasa",
      colombo: "Colombo",
      singapore: "Singapore",
      hongKong: "Hong Kong",
      shanghai: "Shanghai",
      busan: "Busan",
      tokyo: "Tokyo",
      sydney: "Sydney",
    },
  },
  servicesIndex: {
    title: "Use one service. Or hand us the whole chain.",
  },
  services: {
    import: {
      name: "Import",
      title: "Import,",
      titleAccent: "without the waiting.",
      lede: "We prepare the file before your goods sail, settle duties and clear the cargo at port, then deliver it to your warehouse.",
      scopeHeading: "What we handle",
      scope: [
        {
          title: "Pre-shipment check",
          body: "We review the invoice, packing list and HS codes with you before loading, so nothing is held on arrival.",
        },
        {
          title: "Duties & taxes",
          body: "A clear calculation of customs duties and VAT on the declared value, with no surprises at release.",
        },
        {
          title: "Port release",
          body: "Declaration filing, inspection attendance and release from the terminal.",
        },
        {
          title: "Delivery",
          body: "Our trucks take the cargo from the port to your door.",
        },
      ],
      imageAlt:
        "A gantry crane lifting a container off a ship at an Egyptian port",
    },
    export: {
      name: "Export",
      title: "Goods,",
      titleAccent: "out to the world.",
      lede: "Export declarations, certificates and bookings handled from your factory gate to the vessel.",
      scopeHeading: "What we handle",
      scope: [
        {
          title: "Export declaration",
          body: "We file the export declaration and follow it through customs until the goods are cleared to load.",
        },
        {
          title: "Certificates",
          body: "Certificate of origin and the other certificates your buyer’s country asks for.",
        },
        {
          title: "Booking & loading",
          body: "Space with the shipping line or airline, empty container pick-up and loading at your site.",
        },
        {
          title: "Port handling",
          body: "Gate-in, inspection and loading on the vessel, with the bill of lading sent to you.",
        },
      ],
      // TODO: confirm the standard with the factory's mill certificate. EN 12166 is the standard for copper
      // wire for general purposes; 8 mm continuous-cast rod is usually specified to EN 1977 (CW004A).
      product: {
        heading: "Featured product",
        name: "Copper wire rod, 8 mm",
        standard: "EN 12166",
        description:
          "Bright copper wire rod in 8 mm coils, for drawing into electrical wire and cable. We prepare the export file, the certificates, the packing and the shipment through any port.",
        specs: [
          { label: "Product", value: "Copper wire rod" },
          { label: "Diameter", value: "8 mm" },
          { label: "Standard", value: "EN 12166" },
          {
            label: "Material",
            value: "Electrolytic copper (Cu-ETP), 99.90% Cu min.",
          },
          { label: "Form", value: "Coils on wooden pallets" },
          { label: "Packing", value: "Strapped and wrapped for sea freight" },
          { label: "Use", value: "Drawing into electrical wire and cable" },
        ],
        cta: "Request a quote for this product",
        imageAlt: "Pallets of strapped copper wire rod coils in a warehouse",
        galleryAlts: [
          "Close-up of the winding of a copper wire rod coil",
          "Copper wire rod coils wrapped in film and strapped on pallets",
          "A worker checking copper coils packed in a wooden crate",
        ],
      },
      imageAlt:
        "A forklift loading copper coils into a container beside a ship",
    },
    transport: {
      name: "Transport & Logistics",
      title: "Every mode.",
      titleAccent: "Door to door.",
      lede: "Sea, air and road freight, with the containers, packing and lashing that go with it, from your door to the port or all the way to the buyer.",
      scopeHeading: "What we handle",
      scope: [
        {
          title: "Door to door",
          body: "One shipment, one team, from the sender’s door to the receiver’s door.",
        },
        {
          title: "Port to door",
          body: "Cleared cargo goes straight from the terminal to your address, with no hand-over to another company.",
        },
        {
          title: "Door to port",
          body: "Pick-up at your factory or warehouse and delivery to the terminal in time for the cut-off.",
        },
        {
          title: "Cargo handling",
          body: "Loading, unloading and moving your cargo with the right equipment, checked at every stage.",
        },
        {
          title: "Containers",
          body: "20 ft and 40 ft containers, standard and high-cube, to and from every port.",
        },
        {
          title: "Packing",
          body: "Export packing, palletising and wrapping that suits the cargo and the journey.",
        },
        {
          title: "Lashing & securing",
          body: "Cargo lashed, blocked and braced inside the container and on the truck, so it arrives as it left.",
        },
        {
          title: "Sea freight",
          body: "Full and part container loads, bulk and break-bulk, booked with the major shipping lines.",
        },
        {
          title: "Air freight",
          body: "Urgent and high-value cargo by air from airports, with the customs file ready.",
        },
        {
          title: "Road & inland haulage",
          body: "Our trucks between the ports, your factory and your warehouse, with updates by phone or WhatsApp.",
        },
      ],
      imageAlt:
        "Overtop truck on a highway at dusk, with a container ship and a cargo aircraft behind",
      imageAlt2:
        "A worker tightening a ratchet strap on crates inside a container",
    },
    customs: {
      name: "Custom Services",
      title: "Customs,",
      titleAccent: "handled.",
      lede: "Clearance and consulting with Customs: classification, declarations, inspection and advice, handled by people who do it every day.",
      scopeHeading: "What we handle",
      scope: [
        {
          title: "Customs consulting",
          body: "Advice before you ship: classification, duties, procedures and the documents your goods need.",
        },
        {
          title: "Tariff classification",
          body: "The right HS code for your goods, so the duty is right the first time.",
        },
        {
          title: "Customs declaration",
          body: "We prepare and file the declaration and answer the customs officers’ questions.",
        },
        {
          title: "Inspection",
          body: "We attend the inspection with your cargo and coordinate any samples or checks.",
        },
        {
          title: "Release & follow-up",
          body: "If a shipment is held, we find out why and resolve it.",
        },
      ],
      imageAlt:
        "Two inspectors checking packed cartons against a tablet at a container door",
    },
  },
  route: {
    heading: "How a shipment moves",
    steps: [
      {
        title: "Brief",
        body: "Goods, origin, destination, timing. A call or a message.",
      },
      {
        title: "Quote & papers",
        body: "A clear price and the exact list of documents needed.",
      },
      {
        title: "Clearance",
        body: "We file, attend inspection and secure release.",
      },
      {
        title: "Delivered",
        body: "Our trucks take it to the door. You get the proof.",
      },
    ],
  },
  about: {
    title: "One desk for the paperwork, the port and the road.",
    paragraphs: [
      "Overtop is an Egyptian company working since 2017 in export, import, transport and customs services, through every port.",
      "Instead of passing your cargo between a customs broker, a forwarder and a trucking company, you deal with one team that sees the whole journey, and answers for it.",
    ],
    principlesHeading: "How we work",
    principles: [
      {
        title: "One contact",
        body: "The same person follows your shipment from the first call to delivery.",
      },
      {
        title: "Price first",
        body: "You get a clear quote before we start. No hidden charges at release.",
      },
      {
        title: "Papers early",
        body: "Documents are checked before the goods move. That is where delays begin.",
      },
      {
        title: "Every port",
        body: "We work through all ports and airports, not just one.",
      },
    ],
    imageAlt: "An Overtop team member on a call at a desk overlooking a port",
  },
  contact: {
    title: "Cargo landing soon?",
    lede: "Tell us what you’re moving. We reply with a price and the exact documents needed.",
    form: {
      heading: "Quote request",
      name: "Full name",
      phone: "Phone",
      service: "Service",
      serviceOptions: {
        import: "Import",
        export: "Export",
        transport: "Transport & logistics",
        customs: "Custom services",
        other: "Not sure yet",
      },
      message: "Cargo details",
      messagePlaceholder: "What are you shipping, from where, and when?",
      sendEmail: "Send by email",
      note: "The button opens your own email app with the message ready to send.",
      emailSubject: "Quote request",
      errors: {
        name: "Please enter your name.",
        phone:
          "Please enter a phone number we can call back (at least 7 digits).",
      },
      sent: {
        title: "Your email app should open now.",
        body: "Nothing opened? Copy our address into your own email.",
        copyEmail: "Copy email address",
        copied: "Copied",
      },
    },
    details: {
      office: "Office",
      address: ["68 El Houria Ave", "Alexandria, Egypt"],
      phone: "Telephone",
      email: "Email",
      openMap: "Open in Maps",
    },
  },
  footer: {
    rights: "All rights reserved.",
  },
};
