import {
  Accessibility,
  BarChart3,
  Bell,
  BookOpenCheck,
  ChevronDown,
  Download,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  Keyboard,
  Languages,
  ListChecks,
  Menu,
  MessageSquareText,
  Minus,
  Moon,
  PhoneCall,
  Plus,
  School,
  ScrollText,
  ShieldCheck,
  Shuffle,
  UserRoundCheck,
  Volume2,
  X
} from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCmsContent } from "../hooks/useCmsContent";
import type { LucideIcon } from "lucide-react";
import { openDemoFeature } from "../lib/demo-actions";

interface AccessibilityTopBarProps {
  darkMode: boolean;
  highContrast: boolean;
  language: string;
  onDecreaseFont: () => void;
  onIncreaseFont: () => void;
  onToggleContrast: () => void;
  onToggleDarkMode: () => void;
  onToggleLanguage: () => void;
}

interface DropdownItem {
  label: string;
  description: string;
  to?: string;
  icon: LucideIcon;
  demoTitle?: string;
}

interface DropdownMenuConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  items: DropdownItem[];
  variant?: "standard" | "mega";
}

const dropdownMenus: DropdownMenuConfig[] = [
  {
    id: "teacher-services",
    label: "Teacher Services",
    icon: UserRoundCheck,
    items: [
      { label: "Profile Management", description: "Update service profile, qualification, and posting details.", icon: UserRoundCheck, demoTitle: "Profile Management" },
      { label: "Transfer Application", description: "Submit preferences for online transfer counselling.", icon: Shuffle, demoTitle: "Apply for Transfer" },
      { label: "Service Records", description: "Access verified records, orders, and acknowledgements.", icon: FileText, demoTitle: "Service Records" },
      { label: "Helpdesk", description: "Raise technical tickets and track support requests.", icon: HelpCircle, demoTitle: "Helpdesk" }
    ]
  },
  {
    id: "transfer-counselling",
    label: "Transfer Counselling",
    icon: Shuffle,
    variant: "mega",
    items: [
      { label: "Vacancy Position", description: "Region-wise and school-wise vacancies for counselling.", to: "/#vacancy-list", icon: ListChecks },
      { label: "Transfer Schedule", description: "Round schedule, slot timing, and counselling calendar.", to: "/#latest-updates", icon: BookOpenCheck },
      { label: "Counselling Guidelines", description: "Eligibility, category priority, seniority, and process rules.", to: "/#transfer-orders", icon: ShieldCheck },
      { label: "Transfer Orders", description: "Published e-signed transfer orders and circulars.", to: "/#transfer-orders", icon: ScrollText },
      { label: "Appeals", description: "Appeal window, grievance review, and objection status.", to: "/#grievance", icon: MessageSquareText }
    ]
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    items: [
      { label: "Latest Circulars", description: "Department circulars and public orders.", to: "/#latest-updates", icon: FileText },
      { label: "Transfer Notices", description: "Counselling announcements and transfer alerts.", to: "/#latest-updates", icon: Shuffle },
      { label: "Vacancy Updates", description: "Live updates to vacancy lists and dashboards.", to: "/#vacancy-list", icon: ListChecks },
      { label: "Grievance Notices", description: "Committee notices and appeal updates.", to: "/#grievance", icon: MessageSquareText }
    ]
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    items: [
      { label: "Vacancy Dashboard", description: "Analytics on schools, posts, and vacancies.", to: "/#vacancy-list", icon: BarChart3 },
      { label: "Transfer Statistics", description: "Application, verification, counselling, and joining metrics.", to: "/#transfer-orders", icon: Shuffle },
      { label: "Public Disclosure", description: "Published reports for public transparency.", to: "/#latest-updates", icon: FileText },
      { label: "MIS Dashboard", description: "Role-based department analytics login.", icon: School, demoTitle: "MIS Dashboard" }
    ]
  }
];

function topBarButtonClass(active = false) {
  return `inline-flex min-h-6 items-center justify-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-black text-white transition focus-visible:outline-white ${
    active
      ? "border-teal-200 bg-white/20"
      : "border-white/20 bg-white/[0.08] hover:border-white/45 hover:bg-white/[0.15]"
  }`;
}

function isTargetActive(pathname: string, hash: string, to: string) {
  if (to === "/") return pathname === "/" && (hash === "" || hash === "#home");
  if (to.startsWith("/#")) return pathname === "/" && hash === to.replace("/", "");
  return pathname === to.split("?")[0];
}

function navTriggerClass(active: boolean) {
  return `group inline-flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap border-b-[3px] px-2.5 py-3 text-sm transition duration-300 focus-visible:outline-primary 2xl:justify-center 2xl:px-3 ${
    active
      ? "border-secondary font-black text-primary"
      : "border-transparent font-bold text-slate-700 hover:-translate-y-0.5 hover:border-secondary/70 hover:bg-emerald-50/70 hover:text-primary"
  }`;
}

export function AccessibilityTopBar({
  darkMode,
  highContrast,
  language,
  onDecreaseFont,
  onIncreaseFont,
  onToggleContrast,
  onToggleDarkMode,
  onToggleLanguage
}: AccessibilityTopBarProps) {
  return (
    <section className="bg-[#062B43] px-4 text-white" aria-label="Accessibility tools">
      <div className="mx-auto flex min-h-[34px] max-w-7xl flex-wrap items-center justify-center gap-1.5 py-1 sm:justify-between">
        <a className="inline-flex min-h-6 items-center rounded-full px-2.5 py-1 text-[11px] font-black text-white transition hover:bg-white/[0.12] focus-visible:outline-white" href="#main-content">
          Skip to Main Content
        </a>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <button className={topBarButtonClass()} type="button" onClick={onIncreaseFont} aria-label="Increase font size">
            <Plus size={13} /> A+
          </button>
          <button className={topBarButtonClass()} type="button" onClick={onDecreaseFont} aria-label="Decrease font size">
            <Minus size={13} /> A-
          </button>
          <button className={topBarButtonClass(highContrast)} type="button" onClick={onToggleContrast} aria-pressed={highContrast}>
            <Accessibility size={13} /> Contrast
          </button>
          <button className={topBarButtonClass(darkMode)} type="button" onClick={onToggleDarkMode} aria-pressed={darkMode}>
            <Moon size={13} /> Dark Mode
          </button>
          <button className={topBarButtonClass()} type="button">
            <Volume2 size={13} /> Screen Reader
          </button>
          <button className={topBarButtonClass()} type="button" onClick={onToggleLanguage} aria-label="Toggle language">
            <Languages size={13} /> {language === "English" ? "English / தமிழ்" : "தமிழ் / English"}
          </button>
          <button className={topBarButtonClass()} type="button">
            <Keyboard size={13} /> Keyboard
          </button>
        </div>
      </div>
    </section>
  );
}

export function GovernmentIdentityHeader() {
  const { settings } = useCmsContent();

  const deptName = settings?.department_name || "Directorate of School Education";
  const govName  = settings?.government_name  || "Education Department, Government of Puducherry";

  return (
    <header className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-white via-emerald-50/80 to-teal-50/70">
      <div className="absolute left-1/2 top-3 h-24 w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.16),rgba(16,185,129,0.08),transparent_70%)] blur-2xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-4 px-4 py-4 md:min-h-[132px] md:grid-cols-[112px_minmax(0,1fr)_112px] md:gap-6 lg:grid-cols-[140px_minmax(0,1fr)_140px]">
        <div className="text-center md:hidden">
          <span className="inline-flex rounded-full border border-primary/15 bg-white/85 px-4 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary shadow-sm">
            Official Government Portal
          </span>
        </div>

        <div className="flex items-center justify-center gap-5 md:contents">
          <Link
            aria-label="Teacher Information System home"
            className="grid h-[76px] w-[76px] place-items-center rounded-[20px] border border-emerald-100 bg-white/95 p-2 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-emerald md:col-start-1 md:row-start-1 md:mx-0"
            to="/"
          >
            <img className="h-16 w-16 object-contain" src="/gov-emblem.png" alt="Government of Puducherry emblem" width={64} height={64} decoding="async" />
          </Link>

          <div className="grid h-[76px] w-[76px] place-items-center rounded-[20px] border border-emerald-100 bg-white/95 p-2 shadow-soft backdrop-blur md:col-start-3 md:row-start-1 md:ml-auto">
            <img className="h-16 w-16 object-contain" src="/education-header-logo.png" alt="Education Department building logo" width={64} height={64} decoding="async" />
          </div>
        </div>

        <div className="text-center md:col-start-2 md:row-start-1">
          <span className="hidden rounded-full border border-primary/15 bg-white/85 px-4 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary shadow-sm md:inline-flex">
            Official Government Portal
          </span>
          <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-[#073B5A] sm:text-4xl lg:text-[42px]">
            {deptName}
          </h1>
          <p className="mt-1 text-[16px] font-black text-primary md:text-[18px]">Teacher Information System</p>
          <p className="text-[13px] font-bold text-slate-600 md:text-sm">{govName}</p>
        </div>
      </div>
      <div className="grid h-1 grid-cols-3" aria-hidden="true">
        <span className="bg-warning" />
        <span className="bg-white">
          <span className="mx-auto block h-full w-1/2 bg-accent" />
        </span>
        <span className="bg-primary" />
      </div>
    </header>
  );
}

function DropdownMenu({
  menu,
  onClose,
  onOpen,
  onItemSelect,
  open,
  selected,
  onToggle
}: {
  menu: DropdownMenuConfig;
  onClose: () => void;
  onOpen: (id: string) => void;
  onItemSelect: () => void;
  open: boolean;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const Icon = menu.icon;
  const panelSize = menu.variant === "mega" ? "2xl:w-[620px] 2xl:grid-cols-2" : "2xl:w-[330px] 2xl:grid-cols-1";
  const panelId = `${menu.id}-dropdown-panel`;
  const triggerId = `${menu.id}-dropdown-trigger`;
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const focusMenuItem = (position: "first" | "last" = "first") => {
    window.setTimeout(() => {
      const items = panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
      if (!items?.length) return;
      items[position === "first" ? 0 : items.length - 1].focus();
    }, 0);
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const currentIndex = items.findIndex((item) => item === document.activeElement);

    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      triggerRef.current?.focus();
      return;
    }

    if (!items.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(Math.max(currentIndex, 0) + 1) % items.length].focus();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(currentIndex <= 0 ? items.length : currentIndex) - 1].focus();
    }

    if (event.key === "Home") {
      event.preventDefault();
      items[0].focus();
    }

    if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1].focus();
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => onOpen(menu.id)}
      onMouseLeave={onClose}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onClose();
      }}
    >
      <button
        id={triggerId}
        ref={triggerRef}
        className={navTriggerClass(selected)}
        type="button"
        aria-haspopup="true"
        aria-controls={panelId}
        aria-expanded={open}
        onClick={() => onToggle(menu.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
            event.preventDefault();
            onOpen(menu.id);
            focusMenuItem("first");
          }
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
          }
        }}
      >
        <Icon className="transition group-hover:text-secondary" size={17} aria-hidden="true" />
        <span>{menu.label}</span>
        <ChevronDown className={`transition ${open ? "rotate-180 text-secondary" : "text-slate-400"}`} size={15} aria-hidden="true" />
      </button>
      <div
        id={panelId}
        ref={panelRef}
        role="menu"
        aria-labelledby={triggerId}
        onKeyDown={handleMenuKeyDown}
        className={`${open ? "grid" : "hidden"} left-0 top-full z-[120] mt-2 gap-2 rounded-[22px] border border-slate-200 bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.18)] 2xl:absolute 2xl:top-[calc(100%+0.15rem)] 2xl:mt-0 ${panelSize}`}
      >
        {menu.variant === "mega" ? (
          <div className="rounded-[18px] bg-gradient-to-br from-primary to-secondary p-4 text-white 2xl:row-span-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-50">Transfer Counselling</p>
            <strong className="mt-2 block text-xl leading-tight">Transparent teacher movement lifecycle</strong>
            <p className="mt-2 text-sm font-semibold leading-6 text-emerald-50">Vacancy, schedule, counselling rules, orders, and appeals in one guided menu.</p>
          </div>
        ) : null}
        {menu.items.map((item) => {
          const ItemIcon = item.icon;
          const content = (
            <>
              <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-surface text-primary transition group-hover/menu:bg-primary group-hover/menu:text-white">
                <ItemIcon size={19} aria-hidden="true" />
              </span>
              <span className="min-w-0 text-left">
                <strong className="block text-sm text-slate-950">{item.label}</strong>
                <small className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{item.description}</small>
              </span>
            </>
          );

          if (!item.to) {
            return (
              <button
                className="group/menu grid grid-cols-[40px_minmax(0,1fr)] gap-3 rounded-[16px] border border-transparent p-3 transition hover:-translate-y-0.5 hover:border-teal-100 hover:bg-emerald-50/70 focus-visible:outline-primary"
                type="button"
                role="menuitem"
                key={item.label}
                onClick={() => {
                  onItemSelect();
                  openDemoFeature(item.demoTitle ?? item.label);
                }}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              className="group/menu grid grid-cols-[40px_minmax(0,1fr)] gap-3 rounded-[16px] border border-transparent p-3 transition hover:-translate-y-0.5 hover:border-teal-100 hover:bg-emerald-50/70 focus-visible:outline-primary"
              to={item.to}
              role="menuitem"
              key={item.label}
              onClick={onItemSelect}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function MainNavigation() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeHash, setActiveHash] = useState("#home");
  const { pathname, hash } = useLocation();
  const currentHash = pathname === "/" ? activeHash : hash;
  const transferActive = currentHash === "#vacancy-list" || currentHash === "#transfer-orders";
  const notificationsActive = currentHash === "#latest-updates";
  const reportsActive = currentHash === "#vacancy-list" || currentHash === "#transfer-orders";

  const dropdownActiveMap: Record<string, boolean> = {
    "teacher-services": currentHash === "#teacher-services",
    "transfer-counselling": transferActive,
    notifications: notificationsActive,
    reports: reportsActive
  };

  useEffect(() => {
    if (pathname !== "/") return;
    setActiveHash(hash || "#home");
  }, [hash, pathname]);

  useEffect(() => {
    if (pathname !== "/") return undefined;

    const sectionIds = ["home", "teacher-services", "latest-updates", "transfer-orders", "vacancy-list", "grievance", "downloads", "contact"];
    let frameId = 0;

    const updateActiveHash = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const probePosition = window.scrollY + 180;
        let nextHash = "#home";

        sectionIds.forEach((id) => {
          const section = document.getElementById(id);
          if (section && section.offsetTop <= probePosition) nextHash = `#${id}`;
        });

        setActiveHash(nextHash);
      });
    };

    updateActiveHash();
    window.addEventListener("scroll", updateActiveHash, { passive: true });
    window.addEventListener("resize", updateActiveHash);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateActiveHash);
      window.removeEventListener("resize", updateActiveHash);
    };
  }, [pathname]);

  const closeMenus = () => {
    setOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav className="relative z-[90] border-b border-slate-200 bg-white/[0.98] px-4 shadow-sm backdrop-blur-xl" aria-label="Public portal navigation">
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 py-2">
        <button
          className="inline-flex items-center gap-2 rounded-btn border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-primary/30 hover:bg-surface hover:text-primary 2xl:hidden"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="public-navigation-menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />} Menu
        </button>

        <div id="public-navigation-menu" className={`${open ? "grid" : "hidden"} order-3 w-full gap-1 rounded-[22px] border border-slate-200 bg-white p-3 shadow-soft 2xl:order-none 2xl:flex 2xl:w-auto 2xl:flex-1 2xl:items-center 2xl:gap-1 2xl:border-0 2xl:bg-transparent 2xl:p-0 2xl:shadow-none`}>
          <Link className={navTriggerClass(isTargetActive(pathname, currentHash, "/"))} to="/" onClick={closeMenus}>
            <Home size={17} aria-hidden="true" />
            <span>Home</span>
          </Link>

          {dropdownMenus.map((menu) => (
            <DropdownMenu
              menu={menu}
              onClose={() => setActiveDropdown(null)}
              onOpen={(id) => setActiveDropdown(id)}
              onItemSelect={closeMenus}
              open={activeDropdown === menu.id}
              selected={activeDropdown === menu.id || dropdownActiveMap[menu.id]}
              onToggle={(id) => setActiveDropdown((value) => (value === id ? null : id))}
              key={menu.id}
            />
          ))}

          <Link className={navTriggerClass(isTargetActive(pathname, currentHash, "/#contact"))} to="/#contact" onClick={closeMenus}>
            <PhoneCall size={17} aria-hidden="true" />
            <span>Contact</span>
          </Link>

          <div className="mt-2 grid gap-2 border-t border-slate-100 pt-3 2xl:ml-auto 2xl:mt-0 2xl:flex 2xl:shrink-0 2xl:items-center 2xl:justify-end 2xl:border-t-0 2xl:pt-0">
            <Link className="relative inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-surface hover:text-primary" to="/#latest-updates" onClick={closeMenus}>
              <Bell size={17} />
              <span>Notifications</span>
              <span className="-mr-1 rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-black text-white">12</span>
            </Link>
            <Link className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-surface hover:text-primary" to="/#downloads" onClick={closeMenus}>
              <Download size={17} /> Downloads
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-emerald"
              to="/login?role=teacher"
              onClick={closeMenus}
            >
              <GraduationCap size={16} /> Teacher Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function NotificationFlashBar() {
  return (
    <section className="relative z-0 overflow-hidden border-b border-amber-200 bg-[#FFF7E6] px-4" aria-label="Latest updates" aria-live="polite">
      <div className="mx-auto grid min-h-10 max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-2 text-sm">
        <span className="whitespace-nowrap rounded-full bg-[#073B5A] px-3 py-1 text-xs font-black uppercase text-white">Latest Updates</span>
        <div className="group relative h-7 min-w-0 overflow-hidden">
          <div className="absolute inset-y-0 left-0 inline-flex min-w-max items-center gap-3 whitespace-nowrap text-slate-800 motion-safe:animate-marquee group-hover:[animation-play-state:paused]">
            <span className="animate-pulse rounded-full bg-danger px-2 py-0.5 text-[10px] font-black text-white">NEW</span>
            <span>Transfer Counselling Schedule 2026 published | Region-wise Vacancy List updated | Grievance Committee Notice released | Transfer Appeal Window open till 10 days from order issue</span>
            <span aria-hidden="true">Transfer Counselling Schedule 2026 published | Region-wise Vacancy List updated | Grievance Committee Notice released | Transfer Appeal Window open till 10 days from order issue</span>
          </div>
        </div>
        <Link className="whitespace-nowrap rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-black text-[#073B5A] shadow-sm transition hover:border-primary/30 hover:text-primary" to="/#latest-updates">
          View All
        </Link>
      </div>
    </section>
  );
}

export function HeaderLayout(props: AccessibilityTopBarProps) {
  return (
    <div className="relative z-40 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
      <AccessibilityTopBar {...props} />
      <GovernmentIdentityHeader />
      <MainNavigation />
      <NotificationFlashBar />
    </div>
  );
}
