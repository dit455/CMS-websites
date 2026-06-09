import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Download, FileSearch, FileSignature, Gavel, ListChecks, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CategoryPill } from "../../../shared/components/CategoryPill";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { transferApplications, transferPolicyRules, vacancies, vacancySources } from "../../../shared/lib/mockData";
import type { TransferApplication } from "../../../shared/types/tis";

const columnHelper = createColumnHelper<TransferApplication>();

export function SendBackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [reason, setReason] = useState("");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" role="presentation">
      <div className="w-full max-w-lg rounded-card border border-slate-200 bg-white p-5 shadow-soft" role="dialog" aria-modal="true" aria-labelledby="send-back-title">
        <h2 id="send-back-title" className="text-xl font-black text-slate-950">Send back transfer application</h2>
        <label className="mt-4 block text-sm font-bold text-slate-700">
          Mandatory reason
          <textarea className="mt-2 min-h-32 w-full rounded-btn border border-slate-200 px-3 py-3" value={reason} onChange={(event) => setReason(event.target.value)} />
        </label>
        <p className={`mt-2 text-sm font-bold ${reason.length >= 20 ? "text-emerald-700" : "text-orange-700"}`}>{reason.length}/20 characters minimum</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded-btn border border-slate-200 px-4 py-2 text-sm font-bold" onClick={onClose}>Cancel</button>
          <button
            className="rounded-btn bg-copper px-4 py-2 text-sm font-bold text-white disabled:bg-slate-300"
            disabled={reason.length < 20}
            onClick={() => {
              toast.success("Application sent back for employee correction");
              onClose();
            }}
          >
            Send Back
          </button>
        </div>
      </div>
    </div>
  );
}

export function ScrutinyTable() {
  const [sendBackOpen, setSendBackOpen] = useState(false);
  const columns = useMemo(
    () => [
      columnHelper.display({ id: "select", header: "", cell: () => <input type="checkbox" aria-label="Bulk select row" /> }),
      columnHelper.accessor("teacher", { header: "Teacher name" }),
      columnHelper.accessor("category", { header: "Category", cell: ({ getValue }) => <CategoryPill category={getValue()} /> }),
      columnHelper.accessor("choices", { header: "Choices", cell: ({ getValue }) => getValue().join(", ") }),
      columnHelper.accessor("submittedDate", { header: "Submitted" }),
      columnHelper.accessor("status", { header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue()} /> }),
      columnHelper.display({
        id: "documents",
        header: "Documents",
        cell: () => <button className="inline-flex items-center gap-1 rounded-btn border border-slate-200 px-2 py-1 text-xs font-black"><FileSearch size={14} /> View latest</button>
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex flex-wrap gap-2">
            <button className="rounded-btn border border-slate-200 px-2 py-1 text-xs font-black">Approve</button>
            <button className="rounded-btn border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-black text-orange-800" onClick={() => setSendBackOpen(true)}>Send back</button>
          </div>
        )
      })
    ],
    []
  );
  const table = useReactTable({ data: transferApplications, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">Scrutiny Table</h2>
          <p className="mt-1 text-sm text-slate-600">Review latest eligibility documents, send back for correction, or approve for category-wise publication.</p>
        </div>
        <button className="rounded-btn bg-primary px-3 py-2 text-sm font-black text-white">Mass Approval</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[1040px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>{headerGroup.headers.map((header) => <th className="p-3" key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>)}</tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr className="border-t border-slate-200" key={row.id}>{row.getVisibleCells().map((cell) => <td className="p-3" key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-btn bg-surface p-3 text-sm font-bold text-slate-700">Sent-back applications reopen only for employee resubmission.</div>
        <div className="rounded-btn bg-surface p-3 text-sm font-bold text-slate-700">Grievances and objections capture evidence, committee decision, and category correction.</div>
        <div className="rounded-btn bg-surface p-3 text-sm font-bold text-slate-700">Approved records publish category-wise lists before counselling.</div>
      </div>
      <SendBackModal open={sendBackOpen} onClose={() => setSendBackOpen(false)} />
    </section>
  );
}

export function TransferGovernancePanel() {
  const items = [
    { icon: Gavel, title: "Grievance Review", body: "Link objections to the transfer request, capture supporting documents, and upload committee decisions." },
    { icon: ListChecks, title: "Category-wise List", body: "Generate approved lists in alphabetical category order with cadre seniority inside each category." },
    { icon: UploadCloud, title: "Direct Posting Entry", body: "Record promotional and administrative transfers by uploading the digitally signed transfer order." },
    { icon: AlertTriangle, title: "Vacancy Integrity", body: "Refresh resultant vacancies immediately and prevent post-order cancellation or modification." }
  ];

  return (
    <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-xl font-black text-slate-950">Department Transfer Controls</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <article className="rounded-card border border-slate-200 bg-slate-50 p-4" key={item.title}>
              <Icon className="text-primary" size={20} />
              <strong className="mt-3 block text-slate-950">{item.title}</strong>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function CounsellingBoard() {
  const queryClient = useQueryClient();
  const [queue, setQueue] = useState(() => [...transferApplications].sort((a, b) => a.category.localeCompare(b.category) || a.teacher.localeCompare(b.teacher)));
  const { data = vacancies } = useQuery({ queryKey: ["transfer", "live-vacancy-board"], queryFn: async () => vacancies });
  const current = queue[0];

  return (
    <section className="space-y-4">
      <div className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-black">Counselling Rules</h2>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {transferPolicyRules.slice(0, 6).map((rule) => <div className="rounded-btn bg-slate-50 p-3 text-sm font-bold text-slate-700" key={rule}>{rule}</div>)}
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black">Category Queue</h2>
          <p className="mt-1 text-sm text-slate-600">Alphabetical category order, then cadre seniority.</p>
          <div className="mt-4 grid gap-2">
            {queue.map((item, index) => (
              <div className={`rounded-btn border p-3 ${index === 0 ? "border-primary bg-surface" : "border-slate-200"}`} key={item.id}>
                <CategoryPill category={item.category} />
                <strong className="mt-2 block">{item.teacher}</strong>
              </div>
            ))}
          </div>
          <button
            className="mt-4 w-full rounded-btn bg-primary px-4 py-3 font-black text-white"
            onClick={() => {
              setQueue(queue.slice(1));
              queryClient.invalidateQueries({ queryKey: ["transfer", "live-vacancy-board"] });
              toast.success("Posting confirmed and vacancy board refreshed");
            }}
          >
            Process next
          </button>
        </div>
        <div className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black">Live Vacancy Board</h2>
          <p className="mt-1 text-sm text-slate-600">Current teacher: {current?.teacher ?? "Queue completed"}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <AnimatePresence>
              {data.map((vacancy) => (
                <motion.article layout exit={{ opacity: 0, scale: 0.95 }} className="rounded-card border border-slate-200 p-4" key={vacancy.id}>
                  <strong>{vacancy.school}</strong>
                  <p className="text-sm text-slate-600">{vacancy.region} - {vacancy.postType} - {vacancy.vacancy} posts</p>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-4 rounded-btn bg-amber-50 p-3 text-sm font-bold text-amber-900">
            If preferred choices are unavailable, allot from available vacancies or by system/random allocation. Same-school next tenure is blocked except eligible retirement-continuation cases.
          </div>
          <div className="mt-4 rounded-btn bg-surface p-3 text-sm font-bold text-slate-700">
            Vacancy sources: {vacancySources.join("; ")}.
          </div>
        </div>
      </div>
    </section>
  );
}

export function TransferOrderViewer() {
  return (
    <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">Transfer Order Viewer</h2>
          <p className="text-sm text-slate-600">Generate department-format orders with reporting period, terms, and digital signature.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-badge bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-800">
          <FileSignature size={16} /> Digital signature verified
        </span>
      </div>
      <div className="grid min-h-[280px] place-items-center rounded-card border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <FileSignature className="text-primary" size={42} />
        <strong className="mt-3 block">Government Transfer Order PDF</strong>
        <p className="mt-1 text-sm text-slate-600">Order number EDN/TR/2026/0148 - published to employee login and transferred list.</p>
        <button className="mt-4 inline-flex items-center gap-2 rounded-btn bg-primary px-4 py-2 font-black text-white">
          <Download size={18} /> Download
        </button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-btn bg-slate-50 p-3 text-sm font-bold text-slate-700">Reporting period and service terms embedded.</div>
        <div className="rounded-btn bg-slate-50 p-3 text-sm font-bold text-slate-700">Order cannot be cancelled or modified after issue.</div>
        <div className="rounded-btn bg-slate-50 p-3 text-sm font-bold text-slate-700">Appeal may be filed within 10 days of order.</div>
        <div className="rounded-btn bg-slate-50 p-3 text-sm font-bold text-slate-700">Competent officer decision due within 15 days.</div>
      </div>
    </section>
  );
}
