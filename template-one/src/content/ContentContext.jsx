import { useEffect, useMemo, useState } from 'react';
import defaultContent from './defaultContent';
import { ContentContext } from './contentStore';
import { cmsApi } from '../services/cmsApi';
import {
  mapHeroSlides,
  mapServices,
  mapDocuments,
  mapDownloads,
  mapNotifications,
  mapNewsTicker,
  mapOfficials,
  mapPartners,
  mapStats,
  mapQuickLinks,
  mapResourceGroups,
  mapFooterLinks,
  mapAbout,
  mapSiteSettings,
} from '../services/cmsMapper';

const cloneContent = (c) => JSON.parse(JSON.stringify(c));

/** Merge API responses into the base content object. Only overwrites keys that the API actually returned. */
const applyApiData = (base, api) => {
  const next = cloneContent(base);

  const apply = (mapped, key) => {
    if (mapped !== undefined) next[key] = mapped;
  };

  apply(mapHeroSlides(api.heroSlides),         'heroSlides');
  apply(mapServices(api.services),             'services');
  apply(mapDocuments(api.documents),           'documents');
  apply(mapDownloads(api.downloads),           'downloads');
  apply(mapNotifications(api.notifications),   'notifications');
  apply(mapNewsTicker(api.newsTicker),         'newsItems');
  apply(mapOfficials(api.officials),            'officials');
  apply(mapPartners(api.partners),             'partners');
  apply(mapStats(api.stats),                   'portalStats');
  apply(mapQuickLinks(api.quickLinks),         'quickLinks');
  apply(mapResourceGroups(api.resourceGroups), 'resourceGroups');
  apply(mapFooterLinks(api.footerLinks),       'footerLinks');
  apply(mapAbout(api.about),                   'about');

  const siteOverride = mapSiteSettings(api.settings);
  if (siteOverride) next.site = { ...next.site, ...siteOverride };

  return next;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(() => cloneContent(defaultContent));
  const [menu, setMenu]       = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      const [
        heroSlides, services, documents, downloads, notifications, newsTicker,
        officials, partners, stats, quickLinks, resourceGroups, footerLinks,
        about, settings, menuData,
      ] = await Promise.all([
        cmsApi.heroBanners(),
        cmsApi.services(),
        cmsApi.documents(),
        cmsApi.downloads(),
        cmsApi.notifications(),
        cmsApi.newsTicker(),
        cmsApi.officials(),
        cmsApi.partners(),
        cmsApi.stats(),
        cmsApi.quickLinks(),
        cmsApi.resourceGroups(),
        cmsApi.footerLinks(),
        cmsApi.about(),
        cmsApi.settings(),
        cmsApi.menu(),
      ]);

      if (cancelled) return;

      setContent((base) =>
        applyApiData(base, {
          heroSlides, services, documents, downloads, notifications, newsTicker,
          officials, partners, stats, quickLinks, resourceGroups, footerLinks, about, settings,
        })
      );

      if (menuData) setMenu(menuData);
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const resetContent = () => setContent(cloneContent(defaultContent));

  const value = useMemo(
    () => ({ content, setContent, resetContent, defaultContent: cloneContent(defaultContent), menu }),
    [content, menu],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};
