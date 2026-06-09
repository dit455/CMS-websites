import {
  Activity,
  BarChart3,
  Building2,
  Download,
  FileSignature,
  FileSpreadsheet,
  Filter,
  LogIn,
  MapPin,
  Search,
  School,
  ShieldCheck,
  Shuffle,
  TicketCheck,
  TrendingUp,
  Users
} from "lucide-react";
import { memo, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { openDemoFeature } from "../../../shared/lib/demo-actions";

interface WorkflowStep {
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
  time: string;
}

interface VacancyRow {
  region: string;
  schools: number;
  teachers: number;
  vacancies: number;
  schoolType: string;
  post: string;
  schoolName: string;
  status: "High Demand" | "Moderate" | "Available" | "Low Vacancy";
  x: number;
  y: number;
}

interface VacancySummary {
  label: string;
  value: string;
  helper: string;
  trend: string;
  icon: LucideIcon;
}

const transferSteps: WorkflowStep[] = [
  {
    title: "Login",
    description: "Sign in securely with teacher credentials.",
    detail: "Use the teacher portal login to access transfer services and application status.",
    icon: LogIn,
    time: "Instant"
  },
  {
    title: "Verify Profile",
    description: "Confirm service, cadre, and eligibility details.",
    detail: "Profile data is checked before transfer preferences are accepted.",
    icon: ShieldCheck,
    time: "1-2 days"
  },
  {
    title: "Choose Vacancy",
    description: "Select preferred schools from published vacancies.",
    detail: "Teachers choose eligible vacancies according to category and cadre rules.",
    icon: School,
    time: "1 day"
  },
  {
    title: "Counselling",
    description: "Attend counselling based on priority and seniority.",
    detail: "The counselling process matches preferences with available posts.",
    icon: Users,
    time: "2-3 days"
  },
  {
    title: "e-Signed Transfer Order",
    description: "Digitally signed transfer order is generated and published.",
    detail: "Approved transfer orders are published digitally for download.",
    icon: FileSignature,
    time: "1 day"
  },
  {
    title: "Report & Join",
    description: "Join the assigned institution and update status.",
    detail: "Reporting and joining details are updated in the department system.",
    icon: Building2,
    time: "Within 7 days"
  }
];

const allocationFlow = ["Category Priority", "Cadre Seniority", "Vacancy Availability", "Department Approval", "e-Signed Transfer Order"];

const vacancyRows: VacancyRow[] = [
  {
    region: "Puducherry",
    schools: 278,
    teachers: 8350,
    vacancies: 146,
    schoolType: "Government Higher Secondary",
    post: "PGT",
    schoolName: "GHSS Kalapet",
    status: "High Demand",
    x: 24,
    y: 24
  },
  {
    region: "Karaikal",
    schools: 78,
    teachers: 2380,
    vacancies: 52,
    schoolType: "Government High School",
    post: "TGT",
    schoolName: "GHS Karaikalmedu",
    status: "Moderate",
    x: 66,
    y: 28
  },
  {
    region: "Mahe",
    schools: 32,
    teachers: 910,
    vacancies: 18,
    schoolType: "Primary School",
    post: "Primary Teacher",
    schoolName: "GPS Mahe",
    status: "Low Vacancy",
    x: 38,
    y: 72
  },
  {
    region: "Yanam",
    schools: 34,
    teachers: 860,
    vacancies: 24,
    schoolType: "Government Middle School",
    post: "TGT",
    schoolName: "GMS Yanam",
    status: "Available",
    x: 76,
    y: 68
  }
];

const vacancySummary: VacancySummary[] = [
  { label: "Total Schools", value: "422", helper: "institutions covered", trend: "+12 mapped", icon: Building2 },
  { label: "Total Teachers", value: "12,500+", helper: "verified records", trend: "Live HRMS", icon: Users },
  { label: "Available Vacancies", value: "240", helper: "open posts", trend: "+18 today", icon: TicketCheck },
  { label: "Vacancy Updated", value: "Live", helper: "during counselling", trend: "Real-time", icon: Activity }
];

const heatMax = Math.max(...vacancyRows.map((row) => row.vacancies));

function statusTone(status: VacancyRow["status"]) {
  if (status === "High Demand") return "bg-red-50 text-red-700 border-red-100";
  if (status === "Moderate") return "bg-amber-50 text-amber-700 border-amber-100";
  if (status === "Available") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  return "bg-teal-50 text-teal-700 border-teal-100";
}

export const WorkflowStepNode = memo(function WorkflowStepNode({ step, index, isLast }: { step: WorkflowStep; index: number; isLast: boolean }) {
  const Icon = step.icon;
  const [expanded, setExpanded] = useState(false);
  const detailsId = `transfer-workflow-step-${index + 1}`;

  return (
    <div
      className="relative flex gap-4 lg:block lg:text-center"
    >
      <div className="relative z-10 shrink-0 lg:mx-auto lg:w-fit">
        <span className="grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-primary to-secondary text-white shadow-[0_18px_34px_rgba(15,118,110,0.24)]">
          <Icon size={34} strokeWidth={2.2} />
        </span>
        <span className="absolute -right-1 -top-1 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-accent text-sm font-black text-white shadow-sm">
          {index + 1}
        </span>
      </div>

      <div className="min-w-0 pb-8 lg:pb-0">
        <h3 className="text-lg font-black leading-6 text-slate-950 lg:mt-4">{step.title}</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{step.description}</p>
        <button
          className="mt-3 inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-white px-3 py-1 text-xs font-black text-primary shadow-sm transition hover:border-teal-200 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-controls={detailsId}
          aria-label={`${expanded ? "Hide details for" : "Learn more about"} ${step.title}`}
        >
          {expanded ? "Hide details" : "Learn more"}
        </button>
        {expanded ? (
          <p
            id={detailsId}
            className="mt-3 rounded-[16px] border border-emerald-100 bg-white p-3 text-sm font-semibold leading-6 text-slate-600 shadow-sm"
          >
            {step.detail}
          </p>
        ) : null}
      </div>

      {!isLast ? (
        <span className="absolute left-10 top-20 h-[calc(100%-3.5rem)] w-1 -translate-x-1/2 overflow-hidden rounded-full bg-emerald-100 lg:left-[calc(50%+3rem)] lg:right-[calc(-50%+3rem)] lg:top-10 lg:h-1 lg:w-auto lg:translate-x-0" aria-hidden="true">
          <span
            className="block h-full w-full rounded-full bg-gradient-to-b from-accent to-secondary lg:bg-gradient-to-r"
          />
        </span>
      ) : null}
    </div>
  );
});

export function TransferWorkflowSection() {
  return (
    <section id="transfer-orders" className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50 px-4 py-8">
      <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "radial-gradient(rgba(15,118,110,0.12) 1px, transparent 1px)", backgroundSize: "24px 24px" }} aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Transfer Workflow</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Teacher Journey Timeline</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
            Understand the complete transfer process at a glance, from login to joining.
          </p>
        </div>

        <div className="relative mt-12 rounded-[28px] border border-emerald-100 bg-white/80 p-5 shadow-soft backdrop-blur">
          <div className="grid gap-2 lg:grid-cols-6">
            {transferSteps.map((step, index) => (
              <WorkflowStepNode step={step} index={index} isLast={index === transferSteps.length - 1} key={step.title} />
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[16px] bg-surface text-primary">
                <Shuffle size={22} />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">How Transfer Allocation Works</p>
                <h3 className="text-xl font-black text-slate-950">Simple rule order</h3>
              </div>
            </div>
            <div className="mt-5 grid gap-2">
              {allocationFlow.map((item, index) => (
                <div className="grid justify-items-center gap-2 text-center" key={item}>
                  <span className="w-full rounded-[16px] border border-emerald-100 bg-surface px-4 py-3 text-sm font-black text-slate-800">
                    {item}
                  </span>
                  {index < allocationFlow.length - 1 ? <span className="text-primary" aria-hidden="true">&darr;</span> : null}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[16px] bg-surface text-primary">
                <Activity size={22} />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">Expected Timeline</p>
                <h3 className="text-xl font-black text-slate-950">Estimated stage duration</h3>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {transferSteps.map((step, index) => (
                <div className="flex items-center justify-between gap-3 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3" key={step.title}>
                  <span className="text-sm font-black text-slate-800">{index + 1}. {step.title}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-primary shadow-sm">{step.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export const VacancySummaryCard = memo(function VacancySummaryCard({ item }: { item: VacancySummary }) {
  const Icon = item.icon;

  return (
    <article
      className="rounded-[18px] border border-white/80 bg-white/90 p-4 shadow-soft backdrop-blur transition hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-primary/10 text-primary">
          <Icon size={23} />
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-black text-emerald-700">
          <TrendingUp size={13} /> {item.trend}
        </span>
      </div>
      <strong className="mt-4 block text-3xl font-black text-slate-950">{item.value}</strong>
      <span className="mt-1 block text-sm font-black text-slate-700">{item.label}</span>
      <small className="mt-1 block font-semibold text-slate-500">{item.helper}</small>
    </article>
  );
});

export function VacancyHeatBar({ vacancies }: { vacancies: number }) {
  const width = Math.max(12, (vacancies / heatMax) * 100);

  return (
    <div className="h-3 min-w-32 overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,#10B981,#14B8A6)]"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function VacancyTable({ rows }: { rows: VacancyRow[] }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-[18px] border border-slate-200 bg-white">
      <table className="min-w-[760px] text-sm">
        <thead>
          <tr>
            <th>Region</th>
            <th>Schools</th>
            <th>Teachers</th>
            <th>Vacancies</th>
            <th>Vacancy Heat</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? rows.map((row) => (
            <tr key={row.region}>
              <td>
                <span className="font-black text-slate-950">{row.region}</span>
                <small className="mt-1 block font-bold text-slate-500">{row.schoolName}</small>
              </td>
              <td>{row.schools}</td>
              <td>{row.teachers.toLocaleString("en-IN")}</td>
              <td><span className="font-black text-slate-950">{row.vacancies}</span></td>
              <td><VacancyHeatBar vacancies={row.vacancies} /></td>
              <td><span className={`rounded-full border px-3 py-1 text-xs font-black ${statusTone(row.status)}`}>{row.status}</span></td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6} className="py-8 text-center">
                <strong className="block text-slate-950">No vacancies match the selected filters</strong>
                <span className="mt-1 block text-sm font-semibold text-slate-500">Adjust the region, school type, post, or search text.</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function RegionMapCard({ rows, activeRegion, setActiveRegion }: { rows: VacancyRow[]; activeRegion: VacancyRow; setActiveRegion: (row: VacancyRow) => void }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Interactive Region Map</p>
        </div>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">Live markers</span>
      </div>

      <div className="relative mt-5 min-h-[520px] overflow-hidden rounded-[22px] border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M24 24 C42 8 54 10 66 28" fill="none" stroke="rgba(15,118,110,0.28)" strokeWidth="0.8" strokeDasharray="3 2" />
          <path d="M24 24 C20 50 28 65 38 72" fill="none" stroke="rgba(20,184,166,0.28)" strokeWidth="0.8" strokeDasharray="3 2" />
          <path d="M66 28 C78 40 84 54 76 68" fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth="0.8" strokeDasharray="3 2" />
        </svg>
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/25 bg-white/55" />

        {rows.map((region) => {
          const selected = activeRegion.region === region.region;
          return (
            <button
              className={`group absolute z-10 rounded-full border-2 px-3 py-2 text-xs font-black shadow-soft transition hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primary/40 ${selected ? "border-primary bg-primary text-white shadow-[0_0_32px_rgba(20,184,166,0.42)]" : "border-white bg-white text-slate-700"}`}
              style={{ left: `${region.x}%`, top: `${region.y}%` }}
              onMouseEnter={() => setActiveRegion(region)}
              onFocus={() => setActiveRegion(region)}
              onClick={() => setActiveRegion(region)}
              type="button"
              key={region.region}
            >
              <span className={`absolute -left-1 -top-1 h-4 w-4 rounded-full ${selected ? "bg-emerald-300" : "bg-primary/40"} animate-ping`} />
              <MapPin size={14} className="inline" /> {region.region}
              <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 hidden w-44 -translate-x-1/2 rounded-[14px] border border-white bg-white/95 p-3 text-left text-slate-700 shadow-soft backdrop-blur group-hover:block group-focus:block">
                <strong className="block text-slate-950">{region.region}</strong>
                <small className="mt-2 block">Schools: {region.schools}</small>
                <small className="block">Teachers: {region.teachers.toLocaleString("en-IN")}</small>
                <small className="block">Vacancies: {region.vacancies}</small>
              </span>
            </button>
          );
        })}

        <div className="absolute bottom-4 left-4 right-4 rounded-[18px] border border-white/80 bg-white/90 p-4 shadow-soft backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <strong className="text-lg text-slate-950">{activeRegion.region}</strong>
            <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusTone(activeRegion.status)}`}>{activeRegion.status}</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <span><b className="block text-primary">{activeRegion.schools}</b> Schools</span>
            <span><b className="block text-primary">{activeRegion.teachers.toLocaleString("en-IN")}</b> Teachers</span>
            <span><b className="block text-primary">{activeRegion.vacancies}</b> Vacancies</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function VacancyDashboardSection() {
  const [regionFilter, setRegionFilter] = useState("All");
  const [schoolTypeFilter, setSchoolTypeFilter] = useState("All");
  const [postFilter, setPostFilter] = useState("All");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [activeRegion, setActiveRegion] = useState(vacancyRows[0]);

  const regionOptions = ["All", ...vacancyRows.map((row) => row.region)];
  const schoolTypeOptions = ["All", ...Array.from(new Set(vacancyRows.map((row) => row.schoolType)))];
  const postOptions = ["All", ...Array.from(new Set(vacancyRows.map((row) => row.post)))];
  const filteredRows = useMemo(
    () =>
      vacancyRows.filter((row) => {
        const regionMatch = regionFilter === "All" || row.region === regionFilter;
        const schoolTypeMatch = schoolTypeFilter === "All" || row.schoolType === schoolTypeFilter;
        const postMatch = postFilter === "All" || row.post === postFilter;
        const searchMatch = row.schoolName.toLowerCase().includes(schoolSearch.toLowerCase()) || row.region.toLowerCase().includes(schoolSearch.toLowerCase());
        return regionMatch && schoolTypeMatch && postMatch && searchMatch;
      }),
    [postFilter, regionFilter, schoolSearch, schoolTypeFilter]
  );

  return (
    <section id="vacancy-list" className="bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Real-Time Vacancy Dashboard</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Vacancy intelligence dashboard</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
            Region-wise, school-wise, and post-wise vacancy position updated during counselling.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {vacancySummary.map((item) => <VacancySummaryCard item={item} key={item.label} />)}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_560px]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Live Analytics</p>
                <h3 className="mt-1 text-2xl font-black text-slate-950">Region vacancy position</h3>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                <Activity size={14} /> Updated live
              </span>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
              <label className="flex items-center gap-2 rounded-btn border border-slate-200 bg-slate-50 px-3 py-2">
                <Search size={18} className="text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm font-semibold outline-none"
                  placeholder="Search by school name"
                  value={schoolSearch}
                  onChange={(event) => setSchoolSearch(event.target.value)}
                />
              </label>
              <label className="flex items-center gap-2 rounded-btn border border-slate-200 bg-white px-3 py-2">
                <Filter size={16} className="text-slate-400" />
                <select className="w-full bg-transparent text-sm font-semibold outline-none" value={regionFilter} onChange={(event) => setRegionFilter(event.target.value)} aria-label="Region filter">
                  {regionOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <select className="rounded-btn border border-slate-200 bg-white px-3 py-2 text-sm font-semibold" value={schoolTypeFilter} onChange={(event) => setSchoolTypeFilter(event.target.value)} aria-label="School type filter">
                {schoolTypeOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
              <select className="rounded-btn border border-slate-200 bg-white px-3 py-2 text-sm font-semibold" value={postFilter} onChange={(event) => setPostFilter(event.target.value)} aria-label="Post designation filter">
                {postOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>

            <VacancyTable rows={filteredRows} />

            <div className="mt-5 flex flex-wrap gap-3">
              {filteredRows.length === 0 ? (
                <button
                  className="inline-flex items-center gap-2 rounded-btn border border-teal-200 bg-surface px-4 py-2 text-sm font-black text-primary shadow-sm"
                  type="button"
                  onClick={() => {
                    setRegionFilter("All");
                    setSchoolTypeFilter("All");
                    setPostFilter("All");
                    setSchoolSearch("");
                  }}
                >
                  Reset Filters
                </button>
              ) : null}
              <button
                className="inline-flex items-center gap-2 rounded-btn bg-primary px-4 py-2 text-sm font-black text-white shadow-soft"
                type="button"
                onClick={() => openDemoFeature("View Vacancy List", "The full vacancy list module will be connected in the production portal.")}
              >
                <BarChart3 size={16} /> View Full Vacancy List
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-btn border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm"
                type="button"
                onClick={() => openDemoFeature("Download Vacancy PDF")}
              >
                <Download size={16} /> Download Vacancy PDF
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-btn border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm"
                type="button"
                onClick={() => openDemoFeature("Export Vacancy Excel")}
              >
                <FileSpreadsheet size={16} /> Export Excel
              </button>
            </div>
          </div>

          <RegionMapCard rows={vacancyRows} activeRegion={activeRegion} setActiveRegion={setActiveRegion} />
        </div>
      </div>
    </section>
  );
}
