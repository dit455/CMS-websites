import type { WorkflowStatus } from "../types/tis";

const statusStyles: Record<WorkflowStatus, string> = {
  draft: "border-slate-200 bg-slate-100 text-slate-700",
  submitted: "border-cyan-200 bg-cyan-50 text-cyan-800",
  under_review: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  rejected: "border-red-200 bg-red-50 text-red-800",
  sent_back: "border-amber-200 bg-amber-50 text-amber-800"
};

const statusLabels: Record<WorkflowStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  sent_back: "Sent Back"
};

export function StatusBadge({ status }: { status: WorkflowStatus }) {
  return (
    <span className={`inline-flex rounded-badge border px-2.5 py-1 text-xs font-black ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
