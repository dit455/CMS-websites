/**
 * cmsMapper.js
 * ============
 * Converts the JSON the Django CMS returns into the exact shape the existing
 * React components expect (the same keys used in defaultContent.js).
 *
 * Each mapper is defensive: if the API value is missing/empty it returns
 * `undefined` so the caller can fall back to the default content.
 */

const nonEmpty = (arr) => (Array.isArray(arr) && arr.length > 0 ? arr : undefined);

/** Hero banner slides → content.heroSlides */
export const mapHeroSlides = (apiSlides) =>
  nonEmpty(apiSlides)?.map((s) => ({
    id: s.id,
    imageUrl: s.image_url || null,
    imageKey: null,
    kicker: s.kicker,
    title: s.title,
    description: s.description,
    primaryCta: s.primary_cta_label || '',
    primaryHref: s.primary_cta_href || '#services',
    secondaryCta: s.secondary_cta_label || '',
    secondaryHref: s.secondary_cta_href || '',
    variant: s.variant || 'danger',
  }));

/** Services → content.services */
export const mapServices = (apiServices) =>
  nonEmpty(apiServices)?.map((s) => ({
    id: s.id,
    icon: s.icon,
    title: s.title,
    desc: s.desc,
    accent: s.accent,
    surface: s.surface,
    links: nonEmpty(s.links)?.map((l) => ({ label: l.label, href: l.href })) || [],
  }));

/** Documents → content.documents (Documents.jsx reads title/category/desc/type/meta) */
const titleCase = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);

export const mapDocuments = (apiDocs) =>
  nonEmpty(apiDocs)?.map((d) => ({
    id: d.id,
    title: d.title,
    category: titleCase(d.category), // API uses lowercase keys; UI uses 'Guidelines' etc.
    desc: d.description || '',
    type: d.file_type || 'PDF',
    meta: d.file_size_display || '',
    fileUrl: d.file_url || d.external_url || null,
    publishDate: d.publish_date || null,
  }));

/** Downloads → content.downloads */
export const mapDownloads = (apiDownloads) =>
  nonEmpty(apiDownloads)?.map((d) => ({
    id: d.id,
    title: d.title,
    category: titleCase(d.category),
    desc: d.description || '',
    type: d.file_type || 'PDF',
    meta: d.file_size_display || '',
    fileUrl: d.file_url || null,
  }));

/** Notifications → content.notifications */
export const mapNotifications = (apiNotes) =>
  nonEmpty(apiNotes)?.map((n) => ({
    id: n.id,
    title: n.title,
    category: titleCase(n.category),
    description: n.description || '',
    attachmentUrl: n.attachment_url || null,
    publishDate: n.publish_date,
    isImportant: n.is_important,
  }));

/** News ticker → content.newsItems (array of strings) */
export const mapNewsTicker = (apiTicker) =>
  nonEmpty(apiTicker)?.map((t) => t.text);

/** Officials → content.officials */
export const mapOfficials = (apiOfficials) =>
  nonEmpty(apiOfficials)?.map((o) => ({
    id: o.id,
    name: o.name,
    role: o.role,
    photoUrl: o.photo_url || null,
    imageKey: null,
    initials: o.initials || '',
    email: o.email || '',
  }));

/** Partners → connected platforms list used by GovernmentPartners.jsx */
export const mapPartners = (apiPartners) =>
  nonEmpty(apiPartners)?.map((p) => ({
    name: p.name,
    logo: p.wordmark || p.name,
    initials: p.initials || '',
    logoImage: p.logo_image || null,
    logoAlt: p.logo_alt || `${p.name} logo`,
    description: p.description || '',
    url: p.url || '#',
    tone: p.tone || 'blue',
  }));

/** Hero stat tiles → content.portalStats */
export const mapStats = (apiStats) =>
  nonEmpty(apiStats)?.map((s) => ({ value: s.value, label: s.label }));

/** Quick links → content.quickLinks */
export const mapQuickLinks = (apiLinks) =>
  nonEmpty(apiLinks)?.map((l) => ({
    label: l.label,
    caption: l.caption,
    icon: l.icon,
    href: l.href,
    accent: l.accent,
    surface: l.surface,
  }));

/** Citizen resource cards → content.resourceGroups */
export const mapResourceGroups = (apiGroups) =>
  nonEmpty(apiGroups)?.map((g) => ({
    id: g.slug,
    eyebrow: g.eyebrow,
    title: g.title,
    description: g.description,
    icon: g.icon,
    accent: g.accent,
    surface: g.surface,
    href: g.href,
    cta: g.cta,
    points: Array.isArray(g.points) ? g.points : [],
  }));

/** Footer citizen service links → content.footerLinks */
export const mapFooterLinks = (apiLinks) =>
  nonEmpty(apiLinks)?.map((l) => ({
    label: l.label,
    href: l.href,
    icon: l.icon,
  }));

/** About page → content.about (full object) */
export const mapAbout = (a) => {
  if (!a || typeof a !== 'object') return undefined;
  return {
    heroKicker: a.hero_kicker,
    heroTitle: a.hero_title,
    heroDescription: a.hero_description,
    introPara1: a.intro_para1,
    introPara2: a.intro_para2,
    visionTitle: a.vision_title,
    visionText: a.vision_text,
    missionTitle: a.mission_title,
    missionPoints: nonEmpty(a.mission_points)?.map((m) => m.text) || [],
    keyFunctions: nonEmpty(a.key_functions)?.map((k) => k.text) || [],
    initiativeFocus: nonEmpty(a.initiative_points)?.map((i) => i.text) || [],
    citizenServicesTitle: a.citizen_services_title,
    citizenServicesText: a.citizen_services_text,
    innovationTitle: a.innovation_title,
    innovationPara1: a.innovation_para1,
    innovationPara2: a.innovation_para2,
    commitmentTitle: a.commitment_title,
    commitmentText: a.commitment_text,
    commitmentTagline: a.commitment_tagline,
  };
};

/** Site settings → partial content.site (only override the keys the CMS owns) */
export const mapSiteSettings = (s) => {
  if (!s || typeof s !== 'object') return undefined;
  const out = {};
  if (s.department_name) out.departmentName = s.department_name;
  if (s.government_name) out.governmentName = s.government_name;
  if (s.helpdesk_email) out.helpdeskEmail = s.helpdesk_email;
  if (s.phone) out.phone = s.phone;
  if (s.address) out.address = s.address;
  if (s.overview_description) out.overviewDescription = s.overview_description;
  if (s.footer_description) out.footerDescription = s.footer_description;
  if (s.web_information_manager) out.webInformationManager = s.web_information_manager;
  if (s.web_information_manager_designation)
    out.webInformationManagerDesignation = s.web_information_manager_designation;
  if (s.web_information_manager_email)
    out.webInformationManagerEmail = s.web_information_manager_email;
  if (s.facebook_url)  out.facebookUrl  = s.facebook_url;
  if (s.twitter_url)   out.twitterUrl   = s.twitter_url;
  if (s.youtube_url)   out.youtubeUrl   = s.youtube_url;
  if (s.linkedin_url)  out.linkedinUrl  = s.linkedin_url;
  return Object.keys(out).length ? out : undefined;
};
