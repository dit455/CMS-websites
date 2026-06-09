import {
  ArrowRight,
  ArrowUp,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Headphones,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Shuffle,
  TicketCheck,
  UserRoundCheck,
  Users,
  X
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TransferWorkflowSection, VacancyDashboardSection } from "../components/HomeAnalyticsSections";
import type { LucideIcon } from "lucide-react";
import { DEMO_FEATURE_EVENT, openDemoFeature } from "../../../shared/lib/demo-actions";
import type { DemoFeatureDetail } from "../../../shared/lib/demo-actions";
import { useCmsContent } from "../../../shared/hooks/useCmsContent";

interface ServiceCard {
  label: string;
  description: string;
  action: string;
  icon: LucideIcon;
  metric: string;
}

interface HeroCta {
  label: string;
  href?: string;
  feature?: string;
  variant: "primary" | "secondary";
}

interface PortalSlide {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon;
  visualLabel: string;
  visualMeta: string;
  ctas: HeroCta[];
}

interface QuickService {
  label: string;
  icon: LucideIcon;
  href?: string;
  feature?: string;
}

const dashboardWidgets = [
  { label: "Teacher Records", value: "12.5K", icon: Users },
  { label: "Transfer Requests", value: "8.2K", icon: Shuffle },
  { label: "Approvals", value: "6.9K", icon: ClipboardCheck },
  { label: "Grievances", value: "95%", icon: TicketCheck }
];

const portalSlides: PortalSlide[] = [
  {
    eyebrow: "Official Government Portal",
    title: "Teacher Information System",
    description: "Teacher records, transfers, grievances, helpdesk, and orders in one secure portal.",
    image: "/tis-governance-command-center.png",
    imageAlt: "Digital command center showing teacher governance dashboards",
    icon: ShieldCheck,
    visualLabel: "Unified teacher lifecycle view",
    visualMeta: "Profile, service book, orders, and helpdesk",
    ctas: [
      { label: "Teacher Login", href: "/login?role=teacher", variant: "primary" },
      { label: "Explore Services", href: "/#teacher-services", variant: "secondary" }
    ]
  },
  {
    eyebrow: "Transfer Counselling",
    title: "Digital Transfer Counselling",
    description: "Apply, choose preferences, track approval, and download e-signed orders.",
    image: "/tis-campus.png",
    imageAlt: "Government school campus illustration for transfer counselling",
    icon: Shuffle,
    visualLabel: "Counselling workflow",
    visualMeta: "Eligibility, preferences, approval, joining",
    ctas: [
      { label: "Apply Transfer", feature: "Apply for Transfer", variant: "primary" },
      { label: "View Workflow", href: "/#transfer-orders", variant: "secondary" }
    ]
  },
  {
    eyebrow: "Vacancy Dashboard",
    title: "Live Vacancy Position",
    description: "View region-wise and post-wise vacancies before choosing preferences.",
    image: "/tis-governance-command-center.png",
    imageAlt: "Analytics dashboard illustration for vacancy position",
    icon: TicketCheck,
    visualLabel: "Region vacancy intelligence",
    visualMeta: "Schools, posts, and live availability",
    ctas: [
      { label: "Vacancy Position", href: "/#vacancy-list", variant: "primary" },
      { label: "Download PDF", feature: "Download Vacancy PDF", variant: "secondary" }
    ]
  },
  {
    eyebrow: "Grievance & Helpdesk",
    title: "Support and Grievance Tracking",
    description: "Raise grievances or helpdesk tickets and track official responses.",
    image: "/tis-campus.png",
    imageAlt: "Education department campus visual for grievance and helpdesk support",
    icon: Headphones,
    visualLabel: "Citizen support desk",
    visualMeta: "Acknowledgement, escalation, resolution",
    ctas: [
      { label: "Lodge Grievance", feature: "Raise Grievance", variant: "primary" },
      { label: "Helpdesk", feature: "Helpdesk", variant: "secondary" }
    ]
  }
];

const quickServices: QuickService[] = [
  { label: "Teacher Login", icon: UserRoundCheck, href: "/login?role=teacher" },
  { label: "Apply Transfer", icon: Shuffle, feature: "Apply for Transfer" },
  { label: "Vacancy Position", icon: TicketCheck, href: "/#vacancy-list" },
  { label: "Notifications", icon: Bell, href: "/#latest-updates" },
  { label: "Transfer Orders", icon: Download, href: "/#transfer-orders" },
  { label: "Helpdesk", icon: Headphones, href: "/helpdesk" }
];

const notifications = [
  { title: "Transfer Counselling Schedule 2026", category: "Transfer", date: "03 Jun 2026", size: "1.2 MB" },
  { title: "Region-wise Vacancy Publication", category: "Vacancy", date: "02 Jun 2026", size: "840 KB" },
  { title: "Grievance Committee Notice", category: "Grievance", date: "31 May 2026", size: "620 KB" },
  { title: "Transfer Appeal Window Notification", category: "Transfer", date: "29 May 2026", size: "790 KB" },
  { title: "Circulars and Transfer Orders", category: "Circular", date: "28 May 2026", size: "2.4 MB" }
];

const notificationBadgeStyles: Record<string, string> = {
  Transfer: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Vacancy: "bg-teal-50 text-teal-700 border-teal-100",
  Grievance: "bg-amber-50 text-amber-800 border-amber-100",
  Circular: "bg-cyan-50 text-cyan-700 border-cyan-100"
};

const teacherActions: ServiceCard[] = [
  { label: "Update Profile", description: "Edit personal, service, qualification, and posting details.", action: "Open profile", icon: UserRoundCheck, metric: "82% profile readiness" },
  { label: "Apply for Transfer", description: "Choose vacancies and submit counselling preferences.", action: "Start application", icon: Shuffle, metric: "3 choices allowed" },
  { label: "Track Application", description: "Monitor verification, approval, and counselling status.", action: "Track status", icon: ClipboardCheck, metric: "Live workflow status" },
  { label: "Raise Grievance", description: "Submit grievance or objection with supporting evidence.", action: "Raise request", icon: HelpCircle, metric: "Committee review trail" },
  { label: "Helpdesk Ticket", description: "Get technical and workflow support through ticketing.", action: "Create ticket", icon: Headphones, metric: "Open ticket tracking" },
  { label: "Download Orders", description: "Access signed orders, circulars, and acknowledgements.", action: "Download", icon: Download, metric: "e-signed documents" }
];

const teacherCounters = [
  { label: "Pending Applications", value: "14" },
  { label: "Open Tickets", value: "08" },
  { label: "Transfer Status", value: "Live" },
  { label: "Pending Grievances", value: "05" }
];

const grievanceStats = [
  { label: "Resolution Rate", value: "95%", helper: "cases closed with official remarks" },
  { label: "Average Resolution Time", value: "7 days", helper: "for complete applications" },
  { label: "Complaints Resolved", value: "6,120+", helper: "department-level grievance decisions" }
];

const grievanceTrust = ["Acknowledgement number issued instantly", "Evidence upload supported", "Committee decision trail visible", "SMS and e-mail status alerts"];

const footerLinkGroups = [
  { heading: "Teacher Services", links: ["Profile Management", "Transfer Counselling", "Vacancy Dashboard", "Grievance Portal", "Helpdesk"] },
  { heading: "Resources", links: ["User Guide", "FAQ", "Transfer Policy", "Circulars", "Downloads"] },
  { heading: "Important Links", links: ["Government of Puducherry", "Directorate of School Education", "Digital India", "NIC"] },
  { heading: "Support", links: ["Contact Us", "User Guide", "Helpdesk", "Feedback"] },
  { heading: "Portal Information", links: ["Privacy Policy", "Accessibility Statement", "Terms and Conditions", "Sitemap"] }
];

const complianceBadges = ["GIGW Compliant", "WCAG 2.1 Accessible", "Secure HTTPS", "Government Cloud Hosted"];

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto mb-8 max-w-3xl text-center">
      <p className="text-xs font-black uppercase text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">{description}</p>
    </div>
  );
}

const ServiceTile = memo(function ServiceTile({ service }: { service: ServiceCard }) {
  const Icon = service.icon;

  return (
    <article
      className="group rounded-[20px] border border-slate-200 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-emerald"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-[18px] bg-gradient-to-br from-primary to-secondary text-white shadow-[0_14px_30px_rgba(15,118,110,0.22)] transition group-hover:scale-105">
          <Icon size={28} />
        </span>
        <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-right text-[11px] font-black uppercase text-emerald-700">
          {service.metric}
        </span>
      </div>
      <div className="mt-5">
        <h3 className="text-xl font-black text-slate-950">{service.label}</h3>
        <p className="mt-3 min-h-16 text-sm leading-6 text-slate-600">{service.description}</p>
        <button
          className="mt-5 inline-flex items-center gap-2 rounded-btn bg-primary px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-primary-dark"
          type="button"
          onClick={() => openDemoFeature(service.label)}
        >
          {service.action} <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
});

function footerLinkTarget(item: string) {
  if (item.includes("Transfer") || item.includes("Policy")) return "/#transfer-orders";
  if (item.includes("Vacancy")) return "/#vacancy-list";
  if (item.includes("Grievance")) return "/#grievance";
  if (item.includes("Downloads")) return "/#downloads";
  if (item.includes("Circular")) return "/#latest-updates";
  if (item.includes("Contact")) return "/#contact";
  return "";
}

function DemoFeatureModal({ feature, onClose }: { feature: DemoFeatureDetail | null; onClose: () => void }) {
  if (!feature) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/60 p-4" role="presentation">
      <section
        className="w-full max-w-md rounded-[24px] border border-white/70 bg-white/95 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.24)] backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-feature-title"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Demo Mode</p>
            <h2 id="demo-feature-title" className="mt-1 text-2xl font-black text-slate-950">{feature.title}</h2>
          </div>
          <button className="rounded-btn border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50" type="button" onClick={onClose} aria-label="Close demo feature dialog">
            <X size={18} />
          </button>
        </div>
        <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">
          {feature.description ?? "Demo feature coming soon. For this showcase, the homepage is fully polished while backend workflows remain disabled."}
        </p>
        <div className="mt-5 rounded-[18px] border border-emerald-100 bg-surface p-4 text-sm font-bold leading-6 text-slate-700">
          This button is intentionally kept demo-safe. Production login, transfer, download, and helpdesk modules can be connected after approval.
        </div>
        <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-btn bg-primary px-4 py-3 font-black text-white shadow-soft transition hover:bg-primary-dark" type="button" onClick={onClose}>
          Continue Demo
        </button>
      </section>
    </div>
  );
}

function GrievanceTrackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [reference, setReference] = useState("GRV-2026-00418");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" role="presentation">
      <section className="w-full max-w-lg rounded-[20px] border border-white/70 bg-white/95 p-5 shadow-soft backdrop-blur-xl" role="dialog" aria-modal="true" aria-labelledby="grievance-track-title">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-primary">Public Grievance Tracking</p>
            <h2 id="grievance-track-title" className="mt-1 text-2xl font-black text-slate-950">Track grievance status</h2>
          </div>
          <button className="rounded-btn border border-slate-200 p-2 text-slate-600" type="button" onClick={onClose} aria-label="Close grievance tracking">
            <X size={18} />
          </button>
        </div>
        <label className="mt-5 block text-sm font-bold text-slate-700">
          Grievance reference number
          <input className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" value={reference} onChange={(event) => setReference(event.target.value)} />
        </label>
        <div className="mt-4 rounded-card border border-slate-200 bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <strong className="text-slate-950">{reference || "Reference required"}</strong>
            <span className="rounded-badge bg-amber-50 px-2 py-1 text-xs font-black text-amber-800">In Review</span>
          </div>
          <ol className="mt-4 grid gap-2 text-sm font-bold text-slate-600">
            <li>Submitted: 03 Jun 2026</li>
            <li>Assigned to: Grievance Review Cell</li>
            <li>Expected disposal: 7 working days</li>
          </ol>
        </div>
        <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-btn bg-primary px-4 py-3 font-black text-white" type="button">
          <Search size={18} /> Refresh Status
        </button>
      </section>
    </div>
  );
}

export function PublicHomePage() {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [notificationCategory, setNotificationCategory] = useState("All");
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [utilityOpen, setUtilityOpen] = useState(false);
  const [demoFeature, setDemoFeature] = useState<DemoFeatureDetail | null>(null);

  // ── CMS data ──────────────────────────────────────────────────────────────
  const {
    heroBanners, notifications: cmsNotifs, stats: cmsStats, services: cmsServices,
    quickButtons: cmsQuickButtons,
    eduCounters: cmsCounters,
    grievanceStats: cmsGrievanceStats,
    trustPoints: cmsTrustPoints,
    eduFooterGroups: cmsFooterGroups,
  } = useCmsContent();

  // Hero slides: use CMS banners when available, else fall back to hardcoded portalSlides
  const activeSlides: PortalSlide[] = useMemo(() => {
    if (heroBanners && heroBanners.length > 0) {
      return heroBanners.map((b) => ({
        eyebrow: b.kicker || "Official Government Portal",
        title: b.title,
        description: b.description || "",
        image: b.image_url || "/tis-governance-command-center.png",
        imageAlt: b.title,
        icon: ShieldCheck,
        visualLabel: b.kicker || "",
        visualMeta: b.description?.slice(0, 60) || "",
        ctas: [
          ...(b.primary_cta_label ? [{ label: b.primary_cta_label, href: b.primary_cta_href || "/", variant: "primary" as const }] : []),
          ...(b.secondary_cta_label ? [{ label: b.secondary_cta_label, href: b.secondary_cta_href || "#", variant: "secondary" as const }] : []),
        ],
      }));
    }
    return portalSlides;
  }, [heroBanners]);

  // Notifications: use CMS when available, else fall back to hardcoded
  const activeNotifications = useMemo(() => {
    if (cmsNotifs && cmsNotifs.length > 0) {
      return cmsNotifs.map((n) => ({
        title: n.title,
        category: n.category || "Circular",
        date: n.publish_date
          ? new Date(n.publish_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : "",
        size: "",
      }));
    }
    return notifications;
  }, [cmsNotifs]);

  // Dashboard widgets: use CMS stats when available, else fall back to hardcoded
  const activeWidgets = useMemo(() => {
    if (cmsStats && cmsStats.length > 0) {
      return cmsStats.map((s) => ({ label: s.label, value: s.value, icon: Users }));
    }
    return dashboardWidgets;
  }, [cmsStats]);

  // Teacher service cards: use CMS services when available
  const activeTeacherActions: ServiceCard[] = useMemo(() => {
    if (cmsServices && cmsServices.length > 0) {
      return cmsServices.map((s) => ({
        label: s.title,
        description: s.desc || "",
        action: "Learn more",
        icon: FileText,
        metric: "",
      }));
    }
    return teacherActions;
  }, [cmsServices]);

  // Quick service buttons
  const activeQuickServices = useMemo(() => {
    if (cmsQuickButtons && cmsQuickButtons.length > 0) {
      return cmsQuickButtons.map((b) => ({
        label: b.label,
        href: b.href || undefined,
        icon: FileText as typeof FileText,
      }));
    }
    return quickServices;
  }, [cmsQuickButtons]);

  // Teacher counters (Pending Applications, Open Tickets…)
  const activeTeacherCounters = useMemo(
    () => (cmsCounters && cmsCounters.length > 0 ? cmsCounters : teacherCounters),
    [cmsCounters],
  );

  // Grievance stats (Resolution Rate, Average Resolution Time…)
  const activeGrievanceStats = useMemo(
    () => (cmsGrievanceStats && cmsGrievanceStats.length > 0 ? cmsGrievanceStats : grievanceStats),
    [cmsGrievanceStats],
  );

  // Grievance trust badge list
  const activeTrustPoints = useMemo(
    () => (cmsTrustPoints && cmsTrustPoints.length > 0 ? cmsTrustPoints.map((p) => p.text) : grievanceTrust),
    [cmsTrustPoints],
  );

  // Footer link groups
  const activeFooterGroups = useMemo(
    () => (cmsFooterGroups && cmsFooterGroups.length > 0 ? cmsFooterGroups : null),
    [cmsFooterGroups],
  );

  const categories = useMemo(() => ["All", ...Array.from(new Set(activeNotifications.map((item) => item.category)))], [activeNotifications]);
  const filteredNotifications = useMemo(
    () => (notificationCategory === "All" ? activeNotifications : activeNotifications.filter((item) => item.category === notificationCategory)),
    [notificationCategory, activeNotifications]
  );
  const activeSlide = activeSlides[activeHeroSlide] ?? activeSlides[0];
  const ActiveSlideIcon = activeSlide.icon;
  const goToHeroSlide = useCallback((index: number) => setActiveHeroSlide((index + activeSlides.length) % activeSlides.length), [activeSlides]);

  useEffect(() => {
    const handleDemoFeature = (event: Event) => {
      setDemoFeature((event as CustomEvent<DemoFeatureDetail>).detail);
    };

    window.addEventListener(DEMO_FEATURE_EVENT, handleDemoFeature);
    return () => window.removeEventListener(DEMO_FEATURE_EVENT, handleDemoFeature);
  }, []);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setPrefersReducedMotion(motionPreference.matches);

    syncMotionPreference();
    motionPreference.addEventListener("change", syncMotionPreference);
    return () => motionPreference.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    if (heroPaused || prefersReducedMotion) return undefined;

    const timer = window.setInterval(() => {
      setActiveHeroSlide((index) => (index + 1) % activeSlides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [heroPaused, prefersReducedMotion, activeSlides]);

  return (
    <div className="overflow-x-hidden">
      <section id="home" className="bg-white py-3">
        <div
          className="w-full overflow-hidden border-y border-slate-200 bg-[#0B2540] text-white shadow-[0_22px_70px_rgba(15,23,42,0.2)]"
          role="region"
          aria-roledescription="carousel"
          aria-label="Government portal carousel"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
          onFocusCapture={() => setHeroPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeroPaused(false);
          }}
        >
          <div className="relative min-h-[420px] md:min-h-[430px]">
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(11,37,64,0.98)_0%,rgba(15,118,110,0.88)_54%,rgba(20,184,166,0.72)_100%)]" aria-hidden="true" />
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)", backgroundSize: "42px 42px" }} aria-hidden="true" />
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#ff9933_0%,#ffffff_50%,#138808_100%)]" aria-hidden="true" />
            <p className="sr-only" aria-live={heroPaused ? "polite" : "off"}>
              Slide {activeHeroSlide + 1} of {activeSlides.length}: {activeSlide.title}
            </p>

            <div className="relative mx-auto grid min-h-[420px] max-w-7xl items-center gap-6 p-5 md:min-h-[430px] md:p-8 lg:grid-cols-[minmax(0,1fr)_420px]">
              <div
                key={activeSlide.title}
                className="max-w-2xl"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-xs font-black uppercase text-emerald-50 backdrop-blur">
                  <ActiveSlideIcon size={15} /> {activeSlide.eyebrow}
                </span>
                <h1 className="mt-4 max-w-xl text-3xl font-black leading-tight tracking-tight md:text-5xl">
                  {activeSlide.title}
                </h1>
                <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-emerald-50 md:text-lg md:leading-7">
                  {activeSlide.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {activeSlide.ctas.map((cta) => {
                    const ctaClass = cta.variant === "primary"
                      ? "inline-flex items-center justify-center gap-2 rounded-btn bg-white px-5 py-3 text-sm font-black text-primary shadow-soft transition hover:-translate-y-0.5 hover:shadow-emerald"
                      : "inline-flex items-center justify-center gap-2 rounded-btn border border-white/40 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/16";

                    return cta.href ? (
                      <Link className={ctaClass} to={cta.href} key={cta.label}>
                        {cta.label} <ArrowRight size={17} />
                      </Link>
                    ) : (
                      <button className={ctaClass} type="button" onClick={() => openDemoFeature(cta.feature ?? cta.label)} key={cta.label}>
                        {cta.label} <ArrowRight size={17} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <figure
                key={activeSlide.visualLabel}
                className="relative hidden overflow-hidden rounded-[24px] border border-white/20 bg-white/10 p-3 shadow-[0_18px_48px_rgba(0,0,0,0.2)] backdrop-blur md:block"
              >
                <img
                  className="h-64 w-full rounded-[18px] object-cover lg:h-72"
                  src={activeSlide.image}
                  alt={activeSlide.imageAlt}
                  width={960}
                  height={540}
                  loading={activeHeroSlide === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
                <figcaption className="absolute inset-x-6 bottom-6 rounded-[18px] border border-white/25 bg-slate-950/72 p-4 shadow-soft backdrop-blur">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-slate-950">
                    <ActiveSlideIcon size={14} /> {activeSlide.visualLabel}
                  </span>
                  <strong className="mt-3 block text-lg font-black text-white">{activeSlide.visualMeta}</strong>
                </figcaption>
              </figure>
            </div>

            <div className="absolute inset-x-0 bottom-5 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 md:px-8">
              <div className="flex items-center gap-2">
                {activeSlides.map((slide, index) => (
                  <button
                    className={`h-2.5 rounded-full transition-all ${activeHeroSlide === index ? "w-8 bg-white" : "w-2.5 bg-white/45 hover:bg-white/70"}`}
                    type="button"
                    aria-label={`Show ${slide.title} slide`}
                    aria-current={activeHeroSlide === index ? "true" : undefined}
                    aria-pressed={activeHeroSlide === index}
                    onClick={() => goToHeroSlide(index)}
                    key={slide.title}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/18"
                  type="button"
                  aria-label="Previous hero slide"
                  onClick={() => goToHeroSlide(activeHeroSlide - 1)}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/18"
                  type="button"
                  aria-label="Next hero slide"
                  onClick={() => goToHeroSlide(activeHeroSlide + 1)}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Quick services" className="border-y border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto grid max-w-7xl gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {activeQuickServices.map((service) => {
            const Icon = service.icon;
            const className = "group inline-flex min-h-14 items-center justify-center gap-2 rounded-[16px] border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:text-primary";

            return service.href ? (
              <Link className={className} to={service.href} key={service.label}>
                <Icon className="text-primary" size={18} /> {service.label}
              </Link>
            ) : (
              <button className={className} type="button" onClick={() => openDemoFeature(service.feature ?? service.label)} key={service.label}>
                <Icon className="text-primary" size={18} /> {service.label}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-label="Portal statistics" className="bg-slate-50 px-4 py-5">
        <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {activeWidgets.map((widget) => {
            const Icon = widget.icon;
            return (
              <article className="flex items-center justify-between gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 shadow-sm" key={widget.label}>
                <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-surface text-primary">
                  <Icon size={21} />
                </span>
                <div className="min-w-0 text-right">
                  <strong className="block text-2xl font-black text-slate-950">{widget.value}</strong>
                  <span className="block text-xs font-black uppercase text-slate-500">{widget.label}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="teacher-services" className="relative z-10 bg-white px-4 pb-8 pt-16">
        <div className="mx-auto max-w-7xl">
          <div>
            <SectionHeading eyebrow="Teacher Services" title="Personal dashboard actions for teachers" description="Direct entry points for routine teacher workflows and downloadable records." />
            <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {activeTeacherCounters.map((item) => (
                <div className="rounded-[20px] border border-slate-200 bg-white p-4 text-center shadow-soft transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-emerald" key={item.label}>
                  <strong className="block text-2xl font-black text-primary">{item.value}</strong>
                  <span className="mt-1 block text-sm font-black text-slate-700">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activeTeacherActions.map((service) => <ServiceTile service={service} key={service.label} />)}
            </div>
          </div>

          <div id="latest-updates" className="mt-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-black uppercase text-primary">Notifications</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">Latest notifications and circulars</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Transfer schedules, vacancy publications, grievance notices, appeal updates, circulars, and orders.</p>
            </div>
            <div className="my-5 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  className={`rounded-btn px-4 py-2 text-sm font-black transition ${notificationCategory === category ? "bg-primary text-white shadow-soft" : "border border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-surface hover:text-primary"}`}
                  onClick={() => setNotificationCategory(category)}
                  type="button"
                  key={category}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="grid gap-3">
              {filteredNotifications.length > 0 ? filteredNotifications.map((item) => (
                <article className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-slate-200 border-l-4 border-l-accent bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-emerald" key={item.title}>
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-btn bg-surface text-primary"><FileText size={20} /></span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-slate-950">{item.title}</strong>
                        <span className="rounded-badge bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">NEW</span>
                        <span className={`rounded-badge border px-2 py-1 text-xs font-black ${notificationBadgeStyles[item.category] ?? notificationBadgeStyles.Circular}`}>{item.category}</span>
                      </div>
                      <small className="mt-1 block font-bold text-slate-500">PDF - {item.size} - Published {item.date}</small>
                    </div>
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-btn bg-primary px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-primary-dark"
                    type="button"
                    onClick={() => openDemoFeature(`Download ${item.category} Notice`)}
                  >
                    <Download size={16} /> Download
                  </button>
                </article>
              )) : (
                <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center" role="status">
                  <strong className="block text-slate-950">No notifications found</strong>
                  <span className="mt-1 block text-sm font-semibold text-slate-500">Try another category or check the latest circulars later.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <TransferWorkflowSection />

      <VacancyDashboardSection />

      <section id="grievance" className="bg-[linear-gradient(135deg,#F0FDFA,#ECFDF5)] px-4 pb-16 pt-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[24px] border border-emerald-100 bg-white/72 p-1 shadow-soft backdrop-blur">
          <div className="grid gap-6 rounded-[22px] bg-white/82 p-5 backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_360px] lg:p-7">
            <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
              <div className="relative min-h-56 overflow-hidden rounded-[22px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 shadow-sm">
                <div className="relative grid h-full place-items-center">
                  <div className="rounded-[20px] border border-emerald-100 bg-white/82 p-5 text-center shadow-soft backdrop-blur">
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-[0_18px_34px_rgba(15,118,110,0.24)]">
                      <HelpCircle size={34} />
                    </span>
                    <strong className="mt-4 block text-slate-950">Public Grievance</strong>
                    <small className="mt-1 block font-bold text-slate-500">Acknowledgement, review, and status visibility</small>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-primary">Public Grievance Redressal</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Raise and track grievances with confidence</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  Submit public grievances, attach supporting documents, receive an acknowledgement number, and view official status updates from the department.
                </p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {activeTrustPoints.map((item) => (
                    <span className="inline-flex items-center gap-2 rounded-btn bg-surface px-3 py-2 text-sm font-black text-slate-700" key={item}>
                      <CheckCircle2 className="text-emerald-600" size={16} /> {item}
                    </span>
                  ))}
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {activeGrievanceStats.map((item) => (
                    <article className="rounded-[18px] border border-emerald-100 bg-white/88 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-emerald" key={item.label}>
                      <strong className="block text-2xl font-black text-primary">{item.value}</strong>
                      <span className="mt-1 block text-sm font-black text-slate-800">{item.label}</span>
                      <small className="mt-1 block leading-5 text-slate-500">{item.helper}</small>
                    </article>
                  ))}
                </div>
              </div>
            </div>
            <aside className="grid content-center gap-4 rounded-[22px] border border-emerald-100 bg-white/78 p-5 shadow-sm backdrop-blur">
              <button
                className="inline-flex min-h-20 items-center justify-center gap-3 rounded-[20px] bg-primary px-5 py-4 text-lg font-black text-white shadow-soft transition hover:-translate-y-1 hover:bg-primary-dark hover:shadow-emerald"
                type="button"
                onClick={() => openDemoFeature("Raise Grievance")}
              >
                <Send size={24} /> Lodge Grievance
              </button>
              <button className="inline-flex min-h-20 items-center justify-center gap-3 rounded-[20px] border border-primary/25 bg-surface px-5 py-4 text-lg font-black text-primary shadow-sm transition hover:-translate-y-1 hover:bg-white" type="button" onClick={() => setTrackModalOpen(true)}>
                <Search size={24} /> Track Status
              </button>
              <p className="text-center text-sm font-bold leading-6 text-slate-500">Accessible public redressal with acknowledgement number and transparent status tracking.</p>
            </aside>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-[#0F172A] px-4 pt-16 text-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="border-b border-white/10 pb-6">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
              <div className="flex flex-wrap items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-[18px] border border-white/10 bg-white p-2">
                  <img className="h-10 w-10 object-contain" src="/gov-emblem.png" alt="Government of Puducherry emblem" width={40} height={40} loading="lazy" decoding="async" />
                </span>
                <span className="grid h-14 w-14 place-items-center rounded-[18px] border border-white/10 bg-white p-2">
                  <img className="h-10 w-10 object-contain" src="/education-header-logo.png" alt="Education Department logo" width={40} height={40} loading="lazy" decoding="async" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Directorate of School Education</p>
                  <strong className="mt-1 block text-xl font-black leading-tight text-white md:text-2xl">Teacher Information System</strong>
                  <span className="mt-1 block text-sm font-bold text-slate-400">Education Department, Government of Puducherry</span>
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-sm font-bold text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
                <span className="inline-flex items-center gap-3 rounded-[16px] bg-white/[0.05] px-3 py-2"><MapPin className="text-emerald-300" size={18} /> Puducherry, India</span>
                <a className="inline-flex items-center gap-3 rounded-[16px] bg-white/[0.05] px-3 py-2 transition hover:text-emerald-200" href="tel:04132207200"><Phone className="text-emerald-300" size={18} /> 0413-XXXXXXX</a>
                <a className="inline-flex items-center gap-3 rounded-[16px] bg-white/[0.05] px-3 py-2 transition hover:text-emerald-200" href="mailto:support@teacherportal.py.gov.in"><Mail className="text-emerald-300" size={18} /> support@teacherportal.py.gov.in</a>
                <a className="inline-flex items-center gap-3 rounded-[16px] bg-white/[0.05] px-3 py-2 transition hover:text-emerald-200" href="https://teacherportal.py.gov.in"><Globe2 className="text-emerald-300" size={18} /> teacherportal.py.gov.in</a>
              </div>
            </div>
          </div>

          <div id="downloads" className="grid gap-5 py-6 md:grid-cols-2 xl:grid-cols-5">
            {(activeFooterGroups ?? footerLinkGroups).map((group) => (
              <div key={group.heading}>
                <h3 className="font-black text-emerald-300">{group.heading}</h3>
                <ul className="mt-3 space-y-2 text-sm font-bold text-slate-400">
                  {(group.links as Array<{ label?: string; href?: string } | string>).map((item) => {
                    const isCms = typeof item === 'object';
                    const label = isCms ? (item as {label: string}).label : (item as string);
                    const href  = isCms ? ((item as {href?: string}).href || '/') : footerLinkTarget(item as string);
                    const linkClass = "group inline-flex items-center gap-2 text-left transition hover:text-emerald-200";

                    return (
                      <li key={label}>
                        {href ? (
                          <Link className={linkClass} to={href}>
                            <ChevronRight className="text-emerald-400 transition group-hover:translate-x-0.5" size={14} /> {label}
                          </Link>
                        ) : (
                          <button className={linkClass} type="button" onClick={() => openDemoFeature(label)}>
                            <ChevronRight className="text-emerald-400 transition group-hover:translate-x-0.5" size={14} /> {label}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 py-4 text-center">
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {complianceBadges.map((badge) => (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-black uppercase text-emerald-200" key={badge}>
                  <CheckCircle2 size={15} /> {badge}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-bold text-slate-400">
              <span>Visitor Counter: 25,48,120</span>
              <span>Version: 1.5.0</span>
              <span>Last Updated: 03 June 2026</span>
              <span>Copyright Directorate of School Education</span>
              <span>Powered by Puducherry e-Governance Society (PeGS)</span>
              <a className="inline-flex items-center gap-1 text-emerald-300 transition hover:text-emerald-100" href="https://py.gov.in">
                Government Portal <ExternalLink size={14} />
              </a>
            </div>
            <div className="mt-5 flex justify-center">
              <button
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-200 transition hover:border-emerald-200 hover:bg-emerald-300/20 hover:text-white"
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ArrowUp size={16} /> Back to Top
              </button>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {utilityOpen ? (
          <div
            className="grid w-[min(18rem,calc(100vw-2rem))] gap-2 rounded-[22px] border border-white/80 bg-white/95 p-3 shadow-[0_24px_70px_rgba(15,23,42,0.24)] backdrop-blur-xl"
          >
            <button
              className="inline-flex items-center gap-3 rounded-[16px] bg-surface px-4 py-3 text-sm font-black text-primary transition hover:bg-emerald-100"
              type="button"
              onClick={() => openDemoFeature("Helpdesk")}
            >
              <Headphones size={18} /> Helpdesk
            </button>
            <Link className="inline-flex items-center gap-3 rounded-[16px] bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-700 transition hover:bg-cyan-100" to="/#latest-updates">
              <Bell size={18} /> Notifications
            </Link>
            <a className="inline-flex items-center gap-3 rounded-[16px] bg-amber-50 px-4 py-3 text-sm font-black text-amber-800 transition hover:bg-amber-100" href="tel:04132207200">
              <Phone size={18} /> Call Support
            </a>
            <button className="inline-flex items-center gap-3 rounded-[16px] bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <ArrowUp size={18} /> Back to Top
            </button>
          </div>
        ) : null}
        <button
          className="inline-flex min-h-14 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-black text-white shadow-[0_18px_34px_rgba(15,118,110,0.28)] transition hover:-translate-y-1 hover:bg-primary-dark"
          type="button"
          aria-expanded={utilityOpen}
          aria-label="Toggle quick utility actions"
          onClick={() => setUtilityOpen((value) => !value)}
        >
          {utilityOpen ? <X size={19} /> : <MessageCircle size={19} />} Quick Help
        </button>
      </div>
      <GrievanceTrackModal open={trackModalOpen} onClose={() => setTrackModalOpen(false)} />
      <DemoFeatureModal feature={demoFeature} onClose={() => setDemoFeature(null)} />
    </div>
  );
}
