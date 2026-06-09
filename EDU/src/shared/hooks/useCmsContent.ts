import { useEffect, useState } from 'react';
import {
  cmsApi,
  type CmsSiteSettings,
  type CmsMenuItem,
  type CmsOfficial,
  type CmsHeroBanner,
  type CmsNotification,
  type CmsPortalStat,
  type CmsService,
  type CmsTransferRound,
  type CmsQuickButton,
  type EduCounter,
  type EduGrievanceStat,
  type EduTrustPoint,
  type EduFooterGroup,
} from '../lib/cmsApi';

export interface CmsContent {
  settings:        CmsSiteSettings    | null;
  menu:            CmsMenuItem[]      | null;
  officials:       CmsOfficial[]      | null;
  heroBanners:     CmsHeroBanner[]    | null;
  notifications:   CmsNotification[]  | null;
  stats:           CmsPortalStat[]    | null;
  services:        CmsService[]       | null;
  // EDU-specific
  transferRounds:  CmsTransferRound[] | null;
  quickButtons:    CmsQuickButton[]   | null;
  eduCounters:     EduCounter[]       | null;
  grievanceStats:  EduGrievanceStat[] | null;
  trustPoints:     EduTrustPoint[]    | null;
  eduFooterGroups: EduFooterGroup[]   | null;
  loading: boolean;
}

const DEFAULT: CmsContent = {
  settings: null, menu: null, officials: null,
  heroBanners: null, notifications: null, stats: null, services: null,
  transferRounds: null, quickButtons: null,
  eduCounters: null, grievanceStats: null, trustPoints: null, eduFooterGroups: null,
  loading: true,
};

export function useCmsContent(): CmsContent {
  const [state, setState] = useState<CmsContent>(DEFAULT);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      const [
        settings, menu, officials,
        heroBanners, notifications, stats, services,
        transferRounds, quickButtons,
        eduCounters, grievanceStats, trustPoints, eduFooterGroups,
      ] = await Promise.all([
        cmsApi.settings(),
        cmsApi.menu(),
        cmsApi.officials(),
        cmsApi.heroBanners(),
        cmsApi.notifications(),
        cmsApi.stats(),
        cmsApi.services(),
        cmsApi.transferRounds(),
        cmsApi.quickButtons(),
        cmsApi.eduCounters(),
        cmsApi.grievanceStats(),
        cmsApi.trustPoints(),
        cmsApi.eduFooterGroups(),
      ]);

      if (!cancelled) {
        setState({
          settings, menu, officials,
          heroBanners, notifications, stats, services,
          transferRounds, quickButtons,
          eduCounters, grievanceStats, trustPoints, eduFooterGroups,
          loading: false,
        });
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return state;
}
