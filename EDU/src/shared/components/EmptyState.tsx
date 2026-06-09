import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  heading,
  subText,
  cta
}: {
  icon: LucideIcon;
  heading: string;
  subText: string;
  cta?: ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-card border border-dashed border-slate-300 bg-white p-8 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-btn bg-surface text-primary">
        <Icon size={24} />
      </span>
      <h2 className="mt-3 text-lg font-black text-slate-950">{heading}</h2>
      <p className="mt-1 max-w-md text-sm leading-6 text-slate-600">{subText}</p>
      {cta ? <div className="mt-4">{cta}</div> : null}
    </div>
  );
}
