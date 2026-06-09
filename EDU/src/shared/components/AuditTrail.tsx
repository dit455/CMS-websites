import { initials } from "../lib/utils";
import type { AuditEntry } from "../types/tis";

export function AuditTrail({ entries }: { entries: AuditEntry[] }) {
  return (
    <ol className="relative space-y-4 border-l border-slate-200 pl-5">
      {entries.map((entry) => (
        <li key={`${entry.timestamp}-${entry.action}`} className="relative">
          <span className="absolute -left-[2.15rem] grid h-9 w-9 place-items-center rounded-full border-4 border-white bg-primary text-xs font-black text-white shadow-soft">
            {initials(entry.actor)}
          </span>
          <div className="rounded-card border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <strong>{entry.action}</strong>
              <span className="rounded-badge bg-surface px-2 py-1 text-xs font-bold text-primary">{entry.role}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{entry.remarks}</p>
            <div className="mt-2 text-xs font-semibold text-slate-400">
              {entry.actor} · {entry.timestamp}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
