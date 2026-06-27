export const SITE = {
  name: 'Hyper Advance Sdn Bhd',
  legalName: 'Hyper Advance Sdn Bhd',
  url: 'https://www.hyper-advance.com',
  email: 'admin@hyper-advance.com',
  phone: '+603-7498-0827',
  locale: 'en_MY',
  region: 'Malaysia',
  address: {
    street: 'Unit 4.03 & 4.04, Level 4, BICMA, Lot 2, Jalan 51A/243',
    city: 'Petaling Jaya',
    state: 'Selangor',
    postalCode: '46100',
    country: 'MY',
  },
};

/** Target keywords from SEO strategy — used in meta tags and on-page copy. */
export const TARGET_KEYWORDS = [
  'ELV contractor Malaysia',
  'extra low voltage',
  'ELV maintenance',
  'security system',
  'CCTV',
  'card access',
  'intercom',
  'Aiphone',
  'video intercom',
  'audio intercom',
  'IP intercom',
  'nurse call system',
  'IP nurse call system',
  'Austco',
  'public address system',
  'PA system',
  'announcement system',
  'IP PA system',
  'Amperes',
  'SMATV',
  'Fagor',
  'Ikusi',
  'lighting control system',
  'Lutron',
  'master clock',
  'Bodet',
  'audio visual system',
  'AV system',
  'isolated power supply',
  'IPS system',
  'fireman intercom',
  'digital call',
  'panic button',
  'intruder alarm',
  'Dahua',
  'Hikvision',
  'ZKTECO',
  'code blue',
];

export const SOLUTION_GROUPS = [
  {
    title: 'Security & Access Control',
    keywords: ['CCTV', 'Card Access', 'Intruder Alarm', 'Security System'],
    brands: 'Dahua, HIKVision, Bosch, ZKTeco, EntryPass, Paradox',
    systemIds: ['cctv', 'card-access', 'intruder-alarm'],
  },
  {
    title: 'Intercom & Communication',
    keywords: ['Intercom', 'Video Intercom', 'Audio Intercom', 'IP Intercom', 'Fireman Intercom'],
    brands: 'Aiphone, Mictron',
    systemIds: ['av-intercom', 'fireman-intercom', 'image-speak-through'],
  },
  {
    title: 'Healthcare & Nurse Call',
    keywords: ['Nurse Call System', 'IP Nurse Call', 'Digital Call', 'Panic Button', 'Code Blue', 'Call Bell'],
    brands: 'Austco, GMS, MYQ',
    systemIds: ['nurse-call', 'digital-call', 'panic-button'],
  },
  {
    title: 'Public Address & Announcement',
    keywords: ['Public Address System', 'PA System', 'Announcement System', 'IP PA System'],
    brands: 'Amperes',
    systemIds: ['public-address', 'image-speak-through'],
  },
  {
    title: 'SMATV & Signal Distribution',
    keywords: ['SMATV', 'Multiswitch', 'Tap and Splitter', 'Amplifier', 'Signal Booster'],
    brands: 'Fagor, Ikusi, Triax',
    systemIds: ['smatv'],
  },
  {
    title: 'Lighting & Building Automation',
    keywords: ['Lighting Control System', 'Scene Control', 'Dimming'],
    brands: 'Lutron',
    systemIds: ['lighting-control'],
  },
  {
    title: 'Audio Visual & Conference',
    keywords: ['AV System', 'Audio Visual System', 'Conference System', 'OT Tie Line'],
    brands: 'AMX, Abtus, Yamaha, Aten, Extron, Bosch',
    systemIds: ['audio-visual-system', 'ot-tie-line'],
  },
  {
    title: 'Time Synchronisation',
    keywords: ['Master Clock', 'Hospital Clock System'],
    brands: 'Bodet, National Time',
    systemIds: ['master-clock'],
  },
  {
    title: 'Hospital Critical Power (IPS)',
    keywords: ['IPS', 'Isolated Power Supply', 'Operating Theatre Power'],
    brands: 'Esa Grimma via HA Meditech',
    systemIds: [],
    href: '/#ha-meditech',
  },
  {
    title: 'ELV Contractor Services',
    keywords: ['ELV Contractor', 'ELV Maintenance', 'Extra Low Voltage'],
    brands: 'Hyper Advance — design, supply, install, commission & maintain',
    systemIds: [],
    href: '/#services',
  },
];

export const SYSTEM_SEO = {
  'av-intercom': {
    title: 'Aiphone Intercom & IP Video Intercom System Malaysia',
    description: 'Authorised Aiphone distributor in Malaysia. IP intercom, video intercom, and audio intercom for commercial towers, hospitals, highways, and residential developments.',
    keywords: ['intercom', 'Aiphone', 'video intercom', 'audio intercom', 'IP intercom', 'security system'],
  },
  'nurse-call': {
    title: 'Austco Nurse Call System & IP Nurse Call Malaysia',
    description: 'Austco nurse call and IP nurse call systems for hospitals and healthcare facilities. Tacera and Medicom platforms with digital call, code blue, and panic button integration.',
    keywords: ['nurse call system', 'IP nurse call system', 'Austco', 'digital call', 'panic button', 'code blue', 'call bell'],
  },
  'public-address': {
    title: 'Public Address System & IP PA System Malaysia | Amperes',
    description: 'Amperes PA system and IP PA system installation across Malaysia. Public address, announcement system, and emergency paging for commercial and healthcare sites.',
    keywords: ['public address system', 'PA system', 'announcement system', 'IP PA system', 'Amperes'],
  },
  'lighting-control': {
    title: 'Lutron Lighting Control System Malaysia',
    description: 'Lutron lighting control for hotels, residences, and commercial landmarks. Scene control, dimming, and shade automation by Hyper Advance.',
    keywords: ['lighting control system', 'Lutron', 'ELV contractor Malaysia'],
  },
  smatv: {
    title: 'SMATV System Malaysia | Fagor & Ikusi Headend',
    description: 'SMATV headend, multiswitch, tap and splitter, amplifier, and signal booster solutions. Fagor and Ikusi TV distribution for hotels, hospitals, and towers.',
    keywords: ['SMATV', 'Fagor', 'Ikusi', 'Triax', 'multiswitch', 'tap and splitter', 'amplifier', 'signal booster'],
  },
  'master-clock': {
    title: 'Master Clock System Malaysia | Bodet & National Time',
    description: 'Synchronised master clock systems for hospitals, schools, and campuses. Bodet and National Time distribution by Hyper Advance.',
    keywords: ['master clock', 'Bodet', 'National time', 'ELV'],
  },
  'card-access': {
    title: 'Card Access System Malaysia',
    description: 'Card access and door entry systems using ZKTeco, EntryPass, Bosch, Dahua, and HIKVision for offices, hospitals, and commercial buildings.',
    keywords: ['card access', 'ZKTECO', 'security system', 'access control'],
  },
  cctv: {
    title: 'CCTV & Security System Malaysia',
    description: 'CCTV surveillance design, supply, and installation with Dahua, HIKVision, and Bosch cameras for commercial, healthcare, and residential projects.',
    keywords: ['CCTV', 'Dahua', 'Hikvision', 'Bosch', 'security system'],
  },
  'audio-visual-system': {
    title: 'Audio Visual System & AV System Malaysia',
    description: 'AV system integration for boardrooms, auditoriums, and hospitals. AMX, Abtus, Yamaha, Aten, Extron, and Bosch conference solutions.',
    keywords: ['AV system', 'audio visual system', 'conference', 'AMX', 'Abtus', 'Yamaha', 'Aten', 'Extron', 'Bosch'],
  },
  'ot-tie-line': {
    title: 'OT Tie Line System for Hospital Teaching',
    description: 'Operating theatre tie line for live surgical teaching. AV routing with Abtus, Extron, Aten, and Amperes in hospital environments.',
    keywords: ['OT tie line', 'audio visual system', 'hospital AV'],
  },
  'digital-call': {
    title: 'Digital Call System for Healthcare',
    description: 'Digital call and staff communication for wards and clinics. GMS and MYQ platforms integrated with nurse call infrastructure.',
    keywords: ['digital call', 'GMS', 'myQ', 'nurse call system'],
  },
  'fireman-intercom': {
    title: 'Fireman Intercom System Malaysia',
    description: 'Fireman intercom for fire-fighting lifts and emergency communication. Mictron and ELV-compliant installations across Malaysia.',
    keywords: ['fireman intercom', 'Mictron', 'ELV', 'security system'],
  },
  'panic-button': {
    title: 'Panic Button System Malaysia',
    description: 'Panic button and emergency alert systems for hospitals, banks, and retail. Austco, Paradox, and Bosch integrations.',
    keywords: ['panic button', 'code blue', 'Austco', 'Paradox', 'Bosch'],
  },
  'intruder-alarm': {
    title: 'Intruder Alarm System Malaysia',
    description: 'Intruder alarm and perimeter detection with Paradox and integrated security systems for commercial and healthcare sites.',
    keywords: ['intruder alarm', 'Paradox', 'security system'],
  },
  'image-speak-through': {
    title: 'Image Speak Through System',
    description: 'Image speak through and visual intercom paging for secure facilities. Amperes-based ELV solutions in Malaysia.',
    keywords: ['image speak through', 'intercom', 'Amperes', 'PA system'],
  },
};

export const DISTRIBUTOR_SEO = {
  aiphone: {
    title: 'Aiphone Authorised Distributor Malaysia',
    description: 'Hyper Advance is the authorised Aiphone distributor in Malaysia — IP intercom, video intercom, and IX Series for towers, hospitals, and highways.',
    keywords: ['Aiphone', 'intercom', 'IP intercom', 'video intercom'],
  },
  austco: {
    title: 'Austco Nurse Call Authorised Distributor Malaysia',
    description: 'Authorised Austco distributor for nurse call, IP nurse call, digital call, and healthcare communication systems across Malaysia.',
    keywords: ['Austco', 'nurse call system', 'IP nurse call system'],
  },
  amperes: {
    title: 'Amperes PA System Authorised Distributor Malaysia',
    description: 'Amperes public address, IP PA, and announcement systems — designed, supplied, and installed by Hyper Advance across Malaysia.',
    keywords: ['Amperes', 'PA system', 'public address system', 'IP PA system'],
  },
  lutron: {
    title: 'Lutron Lighting Control Authorised Distributor Malaysia',
    description: 'Authorised Lutron distributor for lighting control in hotels, residences, and prestige commercial developments.',
    keywords: ['Lutron', 'lighting control system'],
  },
  fagor: {
    title: 'Fagor SMATV Authorised Distributor Malaysia',
    description: 'Fagor and Ikusi SMATV headend, multiswitch, and signal distribution for hotels, hospitals, and residential towers.',
    keywords: ['Fagor', 'Ikusi', 'SMATV', 'multiswitch'],
  },
  bodet: {
    title: 'Bodet Master Clock Authorised Distributor Malaysia',
    description: 'Bodet master clock and time synchronisation for hospitals, schools, and commercial campuses in Malaysia.',
    keywords: ['Bodet', 'master clock', 'National time'],
  },
  'esa-grimma': {
    title: 'Esa Grimma IPS System Malaysia | HA Meditech',
    description: 'Isolated power supply (IPS) for hospital operating theatres. Esa Grimma IPS via HA Meditech — sole distributor in Malaysia.',
    keywords: ['IPS', 'isolated power supply', 'Esa Grimma', 'hospital ELV'],
  },
};

export const PAGE_SEO = {
  home: {
    title: 'ELV Contractor Malaysia | CCTV, Intercom, Nurse Call & PA System — Hyper Advance',
    description: 'Hyper Advance — Malaysia ELV contractor & authorised distributor since 1995. CCTV, card access, Aiphone intercom, Austco nurse call, Amperes PA system, Lutron lighting, Fagor SMATV, ELV maintenance & installation.',
    keywords: TARGET_KEYWORDS,
  },
  projects: {
    title: 'ELV Project References Malaysia | Hyper Advance Portfolio',
    description: 'Browse Hyper Advance ELV project references — hospitals, towers, hotels, and commercial sites with intercom, nurse call, PA, CCTV, card access, SMATV, and lighting control.',
    keywords: ['ELV contractor', 'project reference', 'intercom', 'nurse call', 'CCTV', 'Malaysia'],
  },
  systems: {
    title: 'ELV Systems Malaysia | Intercom, Nurse Call, PA, CCTV & More',
    description: 'Complete extra low voltage systems in Malaysia — intercom, nurse call, public address, SMATV, lighting control, CCTV, card access, AV, and master clock.',
    keywords: ['ELV', 'extra low voltage', 'intercom', 'nurse call', 'PA system', 'CCTV', 'SMATV'],
  },
  distributors: {
    title: 'Authorised ELV Brand Distributors Malaysia | Hyper Advance',
    description: 'Authorised distributor for Aiphone, Austco, Amperes, Lutron, Fagor, Bodet, and Esa Grimma IPS in Malaysia.',
    keywords: ['Aiphone', 'Austco', 'Amperes', 'Lutron', 'Fagor', 'ELV distributor Malaysia'],
  },
};

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phone,
    image: `${SITE.url}/assets/brand/hyper-advance-logo.png`,
    description: PAGE_SEO.home.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    areaServed: { '@type': 'Country', name: 'Malaysia' },
    foundingDate: '1995',
    knowsAbout: TARGET_KEYWORDS.slice(0, 20),
  };
}

export function serviceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Extra Low Voltage (ELV) Systems Integration',
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: 'Malaysia',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'ELV Systems',
      itemListElement: SOLUTION_GROUPS.map((g, i) => ({
        '@type': 'Offer',
        position: i + 1,
        itemOffered: {
          '@type': 'Service',
          name: g.title,
          description: `${g.keywords.join(', ')} — ${g.brands}`,
        },
      })),
    },
  };
}
