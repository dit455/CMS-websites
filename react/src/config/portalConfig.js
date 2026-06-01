export const CMS_ENABLED = import.meta.env.VITE_ENABLE_CMS === 'true';

export const DOCUMENT_CATEGORIES = ['Guidelines', 'Orders', 'Templates', 'Reports', 'Tenders'];

export const DOCUMENT_UNAVAILABLE_MESSAGE =
  'This document file is not attached yet. Please contact the helpdesk for an official copy.';

export const EXTERNAL_GOVERNMENT_PORTALS = [
  { name: 'Puducherry State Portal', url: 'https://py.gov.in' },
  { name: 'e-District Puducherry', url: 'https://edistrict.py.gov.in' },
  { name: 'Digital India', url: 'https://digitalindia.gov.in' },
  { name: 'National Portal of India', url: 'https://india.gov.in' },
  { name: 'Ease of Doing Business', url: '#eodb' },
];

export const GOVERNMENT_PARTNER_PORTALS = [
  {
    name: 'Digital India',
    logo: 'Digital India',
    initials: 'DI',
    logoImage: 'https://www.mygov.in/themes/custom/mygov_radix/src/assets/images/digital-india-logo.png',
    logoAlt: 'Digital India logo',
    description: 'Flagship digital transformation programme of the Government of India.',
    url: 'https://www.digitalindia.gov.in/',
    tone: 'purple',
  },
  {
    name: 'Swachh Bharat Mission',
    logo: 'Swachh Bharat',
    initials: 'SB',
    logoImage: 'https://swachhbharatmission.ddws.gov.in/themes/custom/repo-theme-master/images/swach-bharat.png',
    logoAlt: 'Swachh Bharat Mission logo',
    description: 'National sanitation and cleanliness mission platform.',
    url: 'https://swachhbharatmission.ddws.gov.in/',
    tone: 'emerald',
  },
  {
    name: 'MeitY',
    logo: 'MeitY',
    initials: 'ME',
    logoImage: 'https://www.mygov.in/themes/custom/mygov_radix/src/assets/images/Meity_logo.png',
    logoAlt: 'Ministry of Electronics and Information Technology logo',
    description: 'Ministry of Electronics and Information Technology.',
    url: 'https://www.meity.gov.in/',
    tone: 'blue',
  },
  {
    name: 'National Informatics Centre',
    logo: 'NIC',
    initials: 'NI',
    logoImage: 'https://www.uxdt.nic.in/wp-content/uploads/2020/06/BILINGUAL-FULL-LENGTH-VERSION-blue-01.png',
    logoAlt: 'National Informatics Centre logo',
    description: 'Technology partner for digital government infrastructure.',
    url: 'https://www.nic.in/',
    tone: 'purple',
  },
  {
    name: 'Government of Puducherry',
    logo: 'Puducherry',
    initials: 'PY',
    logoImage: 'https://www.py.gov.in/sites/all/themes/chh/images/logo-02.jpg',
    logoAlt: 'Government of Puducherry logo',
    description: 'Official government portal for the Union Territory.',
    url: 'https://py.gov.in/',
    tone: 'blue',
  },
  {
    name: 'eProcurement',
    logo: 'eProcure',
    initials: 'EP',
    logoImage: 'https://www.uxdt.nic.in/wp-content/uploads/2021/05/gepnic-gepnic-logo-02-01.jpg',
    logoAlt: 'Government eProcurement System of NIC logo',
    description: 'Central Public Procurement and tendering platform.',
    url: 'https://eprocure.gov.in/eprocure/app',
    tone: 'emerald',
  },
  {
    name: 'Common Services Centres',
    logo: 'CSC',
    initials: 'CS',
    logoImage: 'https://csc.gov.in/assets/images/csc_name.png',
    logoAlt: 'Common Services Centres logo',
    description: 'Digital access points for citizen services across India.',
    url: 'https://csc.gov.in/',
    tone: 'purple',
  },
  {
    name: 'National Portal of India',
    logo: 'India.gov.in',
    initials: 'IN',
    logoImage: 'https://www.mygov.in/themes/custom/mygov_radix/src/assets/images/india-gov-logo.png',
    logoAlt: 'National Portal of India logo',
    description: 'Unified national gateway for government information and services.',
    url: 'https://www.india.gov.in/',
    tone: 'blue',
  },
  {
    name: 'DigiLocker',
    logo: 'DigiLocker',
    initials: 'DL',
    logoImage: 'https://www.py.gov.in/sites/default/files/digilocker.png',
    logoAlt: 'DigiLocker logo',
    description: 'Digital document wallet for verified citizen records.',
    url: 'https://www.digilocker.gov.in/',
    tone: 'emerald',
  },
  {
    name: 'UMANG',
    logo: 'UMANG',
    initials: 'UM',
    logoImage: 'https://www.uxdt.nic.in/wp-content/uploads/2020/06/Umang_Preview.png',
    logoAlt: 'UMANG logo',
    description: 'Unified mobile access to government services.',
    url: 'https://web.umang.gov.in/landing/',
    tone: 'purple',
  },
  {
    name: 'Government e Marketplace',
    logo: 'GeM',
    initials: 'GM',
    logoImage: 'https://www.uxdt.nic.in/wp-content/uploads/2020/06/GEM.png',
    logoAlt: 'Government e Marketplace logo',
    description: 'Public procurement marketplace for government buyers.',
    url: 'https://gem.gov.in/',
    tone: 'blue',
  },
  {
    name: 'MyGov',
    logo: 'MyGov',
    initials: 'MG',
    logoImage: 'https://www.mygov.in/themes/custom/mygov_radix/src/assets/images/logo.svg',
    logoAlt: 'MyGov logo',
    description: 'Citizen engagement platform for participatory governance.',
    url: 'https://www.mygov.in/',
    tone: 'emerald',
  },
];

export const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/' },
  { label: 'Twitter', href: 'https://twitter.com/' },
  { label: 'YouTube', href: 'https://www.youtube.com/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
];

export const FOOTER_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'About Us', href: '#about-detail' },
  { label: 'Services', href: '#services' },
  { label: 'Resource Centre', href: '#documents' },
  { label: 'Notifications', href: '#notifications' },
  { label: 'Tenders', href: '#tenders' },
  { label: 'RTI', href: '#rti' },
  { label: 'Grievance Portal', href: '#grievances' },
  { label: 'Contact Us', href: '#contact' },
];

export const MANDATORY_FOOTER_LINKS = [
  { label: 'Privacy Policy', href: '#privacy-policy' },
  { label: 'Copyright Policy', href: '#copyright-policy' },
  { label: 'Hyperlinking Policy', href: '#hyperlinking-policy' },
  { label: 'Terms & Conditions', href: '#terms-and-conditions' },
  { label: 'Accessibility Statement', href: '#accessibility-statement' },
  { label: 'Website Policies', href: '#website-policies' },
  { label: 'Disclaimer', href: '#disclaimer' },
  { label: 'Help', href: '#contact' },
  { label: 'Sitemap', href: '#sitemap' },
  { label: 'Feedback', href: '#grievances' },
  { label: 'Contact Us', href: '#contact' },
  { label: 'Web Information Manager', href: '#web-information-manager' },
];

export const GRIEVANCE_STORAGE_KEY = 'dit-portal-grievances';
export const GRIEVANCE_REFERENCE_PREFIX = 'GRI';
export const MIN_GRIEVANCE_LENGTH = 20;
