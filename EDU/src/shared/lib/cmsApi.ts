/**
 * CMS API service for the EDU template.
 * Talks to the Django backend; returns null on any failure so the template
 * keeps working from its hardcoded defaults when the backend is offline.
 */

export const CMS_ENABLED = import.meta.env.VITE_ENABLE_CMS === 'true';

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const SITE_KEY =
  new URLSearchParams(window.location.search).get('site') ||
  import.meta.env.VITE_SITE_KEY ||
  '';

function withSite(path: string): string {
  if (!SITE_KEY) return path;
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}site=${encodeURIComponent(SITE_KEY)}`;
}

async function get<T>(path: string): Promise<T | null> {
  if (!CMS_ENABLED) return null;
  try {
    const res = await fetch(`${API_BASE}${withSite(path)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[cmsApi] ${path} unavailable → using fallback. (${(err as Error).message})`);
    return null;
  }
}

const unwrap = <T>(data: T[] | { results: T[] } | T | null): T[] | T | null => {
  if (!data) return null;
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && data !== null && 'results' in data) {
    return (data as { results: T[] }).results;
  }
  return data;
};

export interface CmsSiteSettings {
  department_name?: string;
  government_name?: string;
  helpdesk_email?: string;
  phone?: string;
  address?: string;
  footer_description?: string;
  web_information_manager?: string;
  web_information_manager_designation?: string;
  web_information_manager_email?: string;
  facebook_url?: string;
  twitter_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
}

export interface CmsMenuItem {
  id: number;
  label: string;
  href: string;
  icon: string;
  badge: string;
  is_mega_menu: boolean;
  order: number;
  children?: CmsMenuItem[];
}

export interface CmsOfficial {
  id: number;
  name: string;
  role: string;
  initials: string;
  photo_url?: string;
  email?: string;
  order: number;
}

export interface CmsHeroBanner {
  id: number;
  kicker?: string;
  title: string;
  description?: string;
  image_url?: string;
  variant?: string;
  primary_cta_label?: string;
  primary_cta_href?: string;
  secondary_cta_label?: string;
  secondary_cta_href?: string;
}

export interface CmsNotification {
  id: number;
  title: string;
  description?: string;
  category?: string;
  publish_date?: string;
  is_important?: boolean;
  attachment_url?: string;
}

export interface CmsPortalStat {
  id: number;
  value: string;
  label: string;
}

export interface CmsService {
  id: number;
  title: string;
  desc?: string;
  accent?: string;
  surface?: string;
  icon?: string;
}

export interface CmsTransferRound {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  status: 'upcoming' | 'active' | 'closed';
  order: number;
}

export interface CmsQuickButton {
  id: number;
  label: string;
  href: string;
  icon: string;
  order: number;
}

export interface EduCounter {
  id: number;
  label: string;
  value: string;
  order: number;
}

export interface EduGrievanceStat {
  id: number;
  label: string;
  value: string;
  helper: string;
  order: number;
}

export interface EduTrustPoint {
  id: number;
  text: string;
  order: number;
}

export interface EduFooterLink {
  id: number;
  label: string;
  href: string;
  order: number;
}

export interface EduFooterGroup {
  id: number;
  heading: string;
  order: number;
  links: EduFooterLink[];
}

export const cmsApi = {
  settings:        () => get<CmsSiteSettings>('/portal/settings/').then(unwrap) as Promise<CmsSiteSettings | null>,
  menu:            () => get<CmsMenuItem[]>('/menu/').then(unwrap) as Promise<CmsMenuItem[] | null>,
  officials:       () => get<CmsOfficial[]>('/portal/officials/').then(unwrap) as Promise<CmsOfficial[] | null>,
  heroBanners:     () => get<CmsHeroBanner[]>('/hero-banners/').then(unwrap) as Promise<CmsHeroBanner[] | null>,
  notifications:   () => get<CmsNotification[]>('/notifications/').then(unwrap) as Promise<CmsNotification[] | null>,
  stats:           () => get<CmsPortalStat[]>('/portal/stats/').then(unwrap) as Promise<CmsPortalStat[] | null>,
  services:        () => get<CmsService[]>('/services/').then(unwrap) as Promise<CmsService[] | null>,
  // EDU-specific
  transferRounds:  () => get<CmsTransferRound[]>('/edu/transfer-rounds/').then(unwrap)  as Promise<CmsTransferRound[] | null>,
  quickButtons:    () => get<CmsQuickButton[]>('/edu/quick-buttons/').then(unwrap)       as Promise<CmsQuickButton[] | null>,
  eduCounters:     () => get<EduCounter[]>('/edu/counters/').then(unwrap)               as Promise<EduCounter[] | null>,
  grievanceStats:  () => get<EduGrievanceStat[]>('/edu/grievance-stats/').then(unwrap)  as Promise<EduGrievanceStat[] | null>,
  trustPoints:     () => get<EduTrustPoint[]>('/edu/trust-points/').then(unwrap)        as Promise<EduTrustPoint[] | null>,
  eduFooterGroups: () => get<EduFooterGroup[]>('/edu/footer-groups/').then(unwrap)      as Promise<EduFooterGroup[] | null>,
};

export default cmsApi;
