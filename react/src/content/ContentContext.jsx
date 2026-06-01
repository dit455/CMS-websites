import { useEffect, useMemo, useState } from 'react';
import defaultContent from './defaultContent';
import { ContentContext } from './contentStore';
import { cmsApi } from '../services/cmsApi';
import {
  mapHeroSlides, mapServices, mapDocuments, mapNotifications,
  mapNewsTicker, mapOfficials, mapPartners, mapStats, mapQuickLinks,
  mapAbout, mapSiteSettings, mapResourceGroups,
} from '../services/cmsMapper';

const STORAGE_KEY = 'dit-portal-cms-content';

const cloneContent = (content) => JSON.parse(JSON.stringify(content));

const legacyPaletteMap = {
  '#0d6efd': '#3B82F6',
  '#c0392b': '#4F46E5',
  '#d98c10': '#7C3AED',
  '#198754': '#10B981',
  '#8e44ad': '#4F46E5',
  'rgba(13,110,253,0.12)': 'rgba(59,130,246,0.12)',
  'rgba(13, 110, 253, 0.12)': 'rgba(59, 130, 246, 0.12)',
  'rgba(192,57,43,0.12)': 'rgba(79,70,229,0.12)',
  'rgba(192, 57, 43, 0.12)': 'rgba(79, 70, 229, 0.12)',
  'rgba(192, 57, 43, 0.14)': 'rgba(79, 70, 229, 0.12)',
  'rgba(217, 140, 16, 0.16)': 'rgba(124, 58, 237, 0.12)',
  'rgba(25,135,84,0.12)': 'rgba(16,185,129,0.12)',
  'rgba(25, 135, 84, 0.12)': 'rgba(16, 185, 129, 0.12)',
  'rgba(25, 135, 84, 0.14)': 'rgba(16, 185, 129, 0.12)',
  'rgba(142, 68, 173, 0.12)': 'rgba(79, 70, 229, 0.12)',
};

const migrateThemeValue = (value) => {
  if (typeof value !== 'string') return value;
  return legacyPaletteMap[value.toLowerCase()] || legacyPaletteMap[value] || value;
};

const migrateAccentContent = (items) => {
  if (!Array.isArray(items)) return items;

  return items.map((item) => ({
    ...item,
    accent: migrateThemeValue(item.accent),
    surface: migrateThemeValue(item.surface),
  }));
};

const mergeDefaultItemsByTitle = (savedItems, baseItems) => {
  const themedSavedItems = migrateAccentContent(Array.isArray(savedItems) ? savedItems : []);
  const savedTitles = new Set(themedSavedItems.map((item) => item.title));
  const missingBaseItems = baseItems.filter((item) => !savedTitles.has(item.title));

  return [...themedSavedItems, ...cloneContent(missingBaseItems)];
};

const mergeDefaultItemsById = (savedItems, baseItems) => {
  const themedSavedItems = migrateAccentContent(Array.isArray(savedItems) ? savedItems : []);
  const savedIds = new Set(themedSavedItems.map((item) => item.id));
  const missingBaseItems = baseItems.filter((item) => !savedIds.has(item.id));

  return [...themedSavedItems, ...cloneContent(missingBaseItems)];
};

const migratePortalStats = (savedStats, baseStats) => {
  const stats = Array.isArray(savedStats) ? cloneContent(savedStats) : cloneContent(baseStats);

  return stats.map((stat) => (
    stat.label === 'Core IT services' && stat.value === '3'
      ? { ...stat, value: '6' }
      : stat
  ));
};

const migrateSite = (baseSite, savedSite = {}) => {
  const mergedSite = { ...baseSite, ...savedSite };

  if (mergedSite.helpdeskEmail === 'helpdesk-email.py@supportgov.in') {
    mergedSite.helpdeskEmail = baseSite.helpdeskEmail;
  }

  if (!mergedSite.helpdeskEmailDisplay || mergedSite.helpdeskEmailDisplay === 'helpdesk-email.py@supportgov.in') {
    mergedSite.helpdeskEmailDisplay = baseSite.helpdeskEmailDisplay;
  }

  if (mergedSite.phone === '+91 86109 86100') {
    mergedSite.phone = baseSite.phone;
  }

  if (mergedSite.phoneCompact === '8610986100') {
    mergedSite.phoneCompact = baseSite.phoneCompact;
  }

  if (mergedSite.webInformationManager === 'Director, Directorate of Information Technology') {
    mergedSite.webInformationManager = baseSite.webInformationManager;
  }

  if (!mergedSite.webInformationManagerDesignation) {
    mergedSite.webInformationManagerDesignation = baseSite.webInformationManagerDesignation;
  }

  if (mergedSite.webInformationManagerEmail === 'helpdesk-email.py@supportgov.in') {
    mergedSite.webInformationManagerEmail = baseSite.webInformationManagerEmail;
  }

  if (!mergedSite.webInformationManagerEmailDisplay || mergedSite.webInformationManagerEmailDisplay === 'helpdesk-email.py@supportgov.in') {
    mergedSite.webInformationManagerEmailDisplay = baseSite.webInformationManagerEmailDisplay;
  }

  return mergedSite;
};

const migrateOfficials = (savedOfficials, baseOfficials) => {
  if (!Array.isArray(savedOfficials)) return cloneContent(baseOfficials);

  const director = baseOfficials.find((official) => official.imageKey === 'director');
  if (!director) return savedOfficials;

  return savedOfficials.map((official) => {
    const name = (official.name || '').toLowerCase();
    const role = (official.role || '').toLowerCase();
    const isLegacyDirector = name.includes('shivraj meena') || role.includes('director (it)');

    return isLegacyDirector ? cloneContent(director) : official;
  });
};

const mergeContent = (base, saved) => {
  if (!saved || typeof saved !== 'object') return cloneContent(base);

  const merged = {
    ...cloneContent(base),
    ...saved,
    site: migrateSite(base.site, saved.site),
  };

  merged.officials = migrateOfficials(saved.officials, base.officials);
  merged.portalStats = migratePortalStats(saved.portalStats, base.portalStats);
  merged.quickLinks = migrateAccentContent(merged.quickLinks);
  merged.homeHighlights = mergeDefaultItemsByTitle(saved.homeHighlights, base.homeHighlights);
  merged.services = mergeDefaultItemsByTitle(saved.services, base.services);
  merged.resourceGroups = mergeDefaultItemsById(saved.resourceGroups, base.resourceGroups);
  merged.documents = mergeDefaultItemsById(saved.documents, base.documents);

  return merged;
};

const loadStoredContent = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? mergeContent(defaultContent, JSON.parse(stored)) : cloneContent(defaultContent);
  } catch {
    return cloneContent(defaultContent);
  }
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(loadStoredContent);
  const [menu, setMenu] = useState(null);          // CMS-driven navbar (null = use fallback)
  const [cmsLoaded, setCmsLoaded] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  // ── Pull everything from the Django CMS once on mount and merge it in ──
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [
        heroRaw, servicesRaw, documentsRaw, notificationsRaw, tickerRaw,
        officialsRaw, partnersRaw, statsRaw, quickLinksRaw, aboutRaw,
        settingsRaw, menuRaw, resourceGroupsRaw,
      ] = await Promise.all([
        cmsApi.heroBanners(), cmsApi.services(), cmsApi.documents(),
        cmsApi.notifications(), cmsApi.newsTicker(), cmsApi.officials(),
        cmsApi.partners(), cmsApi.stats(), cmsApi.quickLinks(),
        cmsApi.about(), cmsApi.settings(), cmsApi.menu(),
        cmsApi.resourceGroups(),
      ]);

      if (cancelled) return;

      // Map → front-end shapes. Each is undefined when the API gave nothing.
      const heroSlides    = mapHeroSlides(heroRaw);
      const services      = mapServices(servicesRaw);
      const documents     = mapDocuments(documentsRaw);
      const notifications = mapNotifications(notificationsRaw);
      const newsItems     = mapNewsTicker(tickerRaw);
      const officials     = mapOfficials(officialsRaw);
      const partners      = mapPartners(partnersRaw);
      const portalStats   = mapStats(statsRaw);
      const quickLinks    = mapQuickLinks(quickLinksRaw);
      const resourceGroups = mapResourceGroups(resourceGroupsRaw);
      const about         = mapAbout(aboutRaw);
      const siteOverride  = mapSiteSettings(settingsRaw);

      // Merge CMS values OVER the current content; keep defaults where CMS is empty.
      setContent((prev) => ({
        ...prev,
        ...(heroSlides    ? { heroSlides } : {}),
        ...(services      ? { services } : {}),
        ...(documents     ? { documents } : {}),
        ...(notifications ? { notifications } : {}),
        ...(newsItems     ? { newsItems } : {}),
        ...(officials     ? { officials } : {}),
        ...(partners      ? { partners } : {}),
        ...(portalStats   ? { portalStats } : {}),
        ...(quickLinks    ? { quickLinks } : {}),
        ...(resourceGroups ? { resourceGroups } : {}),
        ...(about         ? { about } : {}),
        site: { ...prev.site, ...(siteOverride || {}) },
      }));

      if (Array.isArray(menuRaw) && menuRaw.length > 0) setMenu(menuRaw);
      setCmsLoaded(true);
    })();

    return () => { cancelled = true; };
  }, []);

  const resetContent = () => {
    const nextContent = cloneContent(defaultContent);
    setContent(nextContent);
    return nextContent;
  };

  const value = useMemo(
    () => ({
      content,
      setContent,
      resetContent,
      menu,
      cmsLoaded,
      defaultContent: cloneContent(defaultContent),
    }),
    [content, menu, cmsLoaded],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};
