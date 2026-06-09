import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  breadcrumb: string[];
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ breadcrumb, title, description, actions }: PageHeaderProps) {
  return (
    <section className="mb-4 rounded-card border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center gap-1 text-xs font-bold uppercase text-slate-500">
        {breadcrumb.map((item, index) => (
          <span className="inline-flex items-center gap-1" key={item}>
            {item}
            {index < breadcrumb.length - 1 ? <ChevronRight size={13} /> : null}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">{title}</h1>
          {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </section>
  );
}
