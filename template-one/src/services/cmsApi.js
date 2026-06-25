/**
 * DIT CMS API Service
 * ===================
 * One place that talks to the Django backend. Uses the browser `fetch`
 * (no extra dependency). Every call fails gracefully and returns null so the
 * site keeps working from defaultContent.js when the backend is offline.
 *
 * Configure the backend URL with VITE_API_BASE_URL in a .env file:
 *   VITE_API_BASE_URL=http://localhost:8000/api
 */

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Which website this build represents.
// Priority: ?site= URL param (dev switching) → build-time VITE_SITE_KEY (.env) → empty
// This lets you open  ?site=health  and  ?site=site2  from the same dev server.
export const SITE_KEY =
  new URLSearchParams(window.location.search).get('site') ||
  import.meta.env.VITE_SITE_KEY ||
  '';

/** Append the site key to a path's query string (if a key is configured). */
function withSite(path) {
  if (!SITE_KEY) return path;
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}site=${encodeURIComponent(SITE_KEY)}`;
}

/** GET a path under API_BASE. Returns parsed JSON, or null on any failure. */
async function get(path) {
  try {
    const res = await fetch(`${API_BASE}${withSite(path)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[cmsApi] ${path} unavailable → using fallback. (${err.message})`);
    return null;
  }
}

/** DRF list endpoints return { results: [...] } when paginated, else a plain array. */
const unwrap = (data) => {
  if (!data) return null;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return data; // single object (e.g. about/settings)
};

export const cmsApi = {
  menu:          () => get('/menu/').then(unwrap),
  heroBanners:   () => get('/hero-banners/').then(unwrap),
  services:      () => get('/services/').then(unwrap),
  documents:     () => get('/documents/').then(unwrap),
  notifications: () => get('/notifications/').then(unwrap),
  downloads:     () => get('/downloads/').then(unwrap),
  newsTicker:    () => get('/news/ticker/').then(unwrap),
  about:         () => get('/about/').then(unwrap),
  officials:     () => get('/portal/officials/').then(unwrap),
  partners:      () => get('/portal/partners/').then(unwrap),
  stats:         () => get('/portal/stats/').then(unwrap),
  quickLinks:    () => get('/portal/quick-links/').then(unwrap),
  resourceGroups: () => get('/portal/resource-groups/').then(unwrap),
  footerLinks:    () => get('/portal/footer-links/').then(unwrap),
  settings:      () => get('/portal/settings/').then(unwrap),
  siteConfig:    () => get('/site-config/').then(unwrap),
};

export default cmsApi;
