import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { AlertTriangle, Bell, FileCheck2, GripVertical, ListChecks, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CategoryPill } from "../../../shared/components/CategoryPill";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { categoryDescriptions, transferPolicyRules, vacancies, vacancySources } from "../../../shared/lib/mockData";
import { queryKeys } from "../../../shared/lib/queryKeys";
import type { TransferCategory, Vacancy } from "../../../shared/types/tis";

const categoryTokens: Record<TransferCategory, string> = {
  A: "border-cat-a",
  B: "border-cat-b",
  C: "border-cat-c",
  D: "border-cat-d",
  E: "border-cat-e",
  F: "border-cat-f",
  G: "border-cat-g",
  H: "border-cat-h",
  I: "border-cat-i",
  J: "border-cat-j",
  K: "border-cat-k"
};

export function MandatoryTransferBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-amber-300 bg-amber-50 p-4 text-amber-900">
      <span className="inline-flex items-center gap-2 font-bold">
        <AlertTriangle size={18} />
        Compulsory transfer alert: prescribed tenure or workload criteria matched. Submit three choices before the deadline.
      </span>
      <span className="inline-flex items-center gap-2 text-sm font-bold">
        <Bell size={16} /> SMS, e-mail, and login prompt enabled
      </span>
      <button className="rounded-btn bg-amber-200 px-3 py-2 text-sm font-black" onClick={() => setDismissed(true)}>
        Acknowledge
      </button>
    </div>
  );
}

const categoryStatus: Record<TransferCategory, string> = {
  A: "Disability proof",
  B: "Medical proof",
  C: "Dependent disability",
  D: "Spouse/legal status",
  E: "Retirement window",
  F: "Rural 6 years",
  G: "Rural 3 years",
  H: "Urban tenure",
  I: "Outlying return",
  J: "Outlying option",
  K: "General review"
};

export function EligibilityGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {(Object.keys(categoryDescriptions) as TransferCategory[]).map((category) => {
        const highlighted = ["E", "F", "H"].includes(category);
        return (
          <article
            className={`rounded-card border border-l-4 bg-white p-4 shadow-sm ${categoryTokens[category]} ${
              highlighted ? "border-primary/30 bg-surface" : "border-slate-200"
            }`}
            key={category}
          >
            <div className="flex items-center justify-between gap-2">
              <CategoryPill category={category} />
              <span className={`rounded-badge px-2 py-1 text-xs font-black ${highlighted ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                {categoryStatus[category]}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{categoryDescriptions[category]}</p>
          </article>
        );
      })}
    </div>
  );
}

export function TransferPolicyPanel() {
  const workflow = ["Teacher", "Verification", "Counselling", "Approval", "Transfer Order"];

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <ListChecks className="text-primary" size={20} />
          <h2 className="text-xl font-black text-slate-950">Transfer Counselling Policy</h2>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {transferPolicyRules.map((rule) => (
            <div className="rounded-btn border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700" key={rule}>
              {rule}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <FileCheck2 className="text-primary" size={20} />
          <h2 className="text-xl font-black text-slate-950">DPR Workflow</h2>
        </div>
        <ol className="mt-4 space-y-3">
          {workflow.map((step, index) => (
            <li className="flex items-center gap-3" key={step}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-black text-white">{index + 1}</span>
              <strong className="text-sm text-slate-800">{step}</strong>
            </li>
          ))}
        </ol>
        <p className="mt-4 rounded-btn bg-amber-50 p-3 text-sm font-bold text-amber-900">
          Choices may be changed or withdrawn only until the published deadline. After deadline, submitted data is locked for scrutiny.
        </p>
      </div>
    </section>
  );
}

const columnHelper = createColumnHelper<Vacancy>();

function vacancyColumns(onAdd: (vacancy: Vacancy) => void) {
  return [
    columnHelper.accessor("school", { header: "School" }),
    columnHelper.accessor("region", { header: "Region" }),
    columnHelper.accessor("subject", { header: "Subject" }),
    columnHelper.accessor("postType", { header: "Post" }),
    columnHelper.accessor("vacancy", { header: "Vacancy" }),
    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <button className="rounded-btn bg-primary px-3 py-2 text-xs font-black text-white" onClick={() => onAdd(row.original)}>
          Add to choices
        </button>
      )
    })
  ];
}

export function VacancySelector({ choices, setChoices }: { choices: Vacancy[]; setChoices: (choices: Vacancy[]) => void }) {
  const [filters, setFilters] = useState({ region: "All", subject: "All", postType: "All", schoolType: "Government" });
  const debouncedFilters = useDebounce(filters, 300);
  const { data = [] } = useQuery({
    queryKey: queryKeys.transferVacancies(debouncedFilters),
    queryFn: async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 180));
      return vacancies.filter((item) => {
        return (
          (debouncedFilters.region === "All" || item.region === debouncedFilters.region) &&
          (debouncedFilters.subject === "All" || item.subject === debouncedFilters.subject) &&
          (debouncedFilters.postType === "All" || item.postType === debouncedFilters.postType)
        );
      });
    }
  });
  const columns = useMemo(() => vacancyColumns((vacancy) => {
    if (choices.some((choice) => choice.id === vacancy.id)) return toast.info("Vacancy already selected");
    if (choices.length >= 3) return toast.error("Only three choices are allowed");
    setChoices([...choices, vacancy]);
  }), [choices, setChoices]);
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="rounded-card border border-slate-200 bg-white p-4 shadow-soft">
        <h2 className="font-black text-slate-950">Vacancy Filters</h2>
        {[
          ["region", ["All", "Puducherry", "Karaikal", "Mahe", "Yanam"]],
          ["subject", ["All", "Mathematics", "Science", "Primary", "English", "Tamil"]],
          ["postType", ["All", "PGT", "TGT", "Primary Teacher", "Special Educator"]]
        ].map(([key, values]) => (
          <label className="mt-4 block text-sm font-bold text-slate-700" key={key as string}>
            {String(key)}
            <select className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-2" value={filters[key as keyof typeof filters]} onChange={(event) => setFilters({ ...filters, [key as string]: event.target.value })}>
              {(values as string[]).map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        ))}
        <fieldset className="mt-4 text-sm font-bold text-slate-700">
          <legend>School type</legend>
          <label className="mt-2 flex gap-2"><input type="radio" checked readOnly /> Government</label>
        </fieldset>
        <div className="mt-5 rounded-btn bg-surface p-3">
          <strong className="text-sm text-slate-900">Vacancy sources</strong>
          <ul className="mt-2 space-y-2 text-xs font-bold leading-5 text-slate-600">
            {vacancySources.map((source) => <li key={source}>{source}</li>)}
          </ul>
        </div>
      </aside>
      <div className="overflow-hidden rounded-card border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700">
          Public school-wise and position-wise vacancy list with real-time updates during counselling.
        </div>
        <div className="max-h-[430px] overflow-auto">
          <table className="min-w-[820px] text-sm">
            <thead className="sticky top-0 bg-slate-50 text-left text-xs uppercase text-slate-500">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => <th className="p-3" key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>)}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr className="border-t border-slate-200" key={row.id}>
                  {row.getVisibleCells().map((cell) => <td className="p-3" key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SortableChoice({ vacancy, onClear }: { vacancy: Vacancy; onClear: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: vacancy.id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className="flex items-center gap-2 rounded-btn border border-slate-200 bg-white p-2">
      <button className="cursor-grab text-slate-400" {...attributes} {...listeners} aria-label="Reorder choice">
        <GripVertical size={16} />
      </button>
      <span className="min-w-0 flex-1 truncate text-sm font-bold">{vacancy.school}</span>
      <button onClick={onClear} className="rounded bg-slate-100 p-1 text-slate-500" aria-label="Clear choice">
        <X size={14} />
      </button>
    </div>
  );
}

export function ChoiceSummaryBar({ choices, setChoices }: { choices: Vacancy[]; setChoices: (choices: Vacancy[]) => void }) {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = choices.findIndex((item) => item.id === active.id);
      const newIndex = choices.findIndex((item) => item.id === over.id);
      setChoices(arrayMove(choices, oldIndex, newIndex));
    }
  };

  return (
    <div className="sticky bottom-4 z-20 rounded-card border border-slate-200 bg-white/95 p-3 shadow-soft backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <strong>Choice Summary</strong>
        <button
          className="rounded-btn bg-primary px-4 py-2 text-sm font-black text-white disabled:bg-slate-300"
          disabled={choices.length !== 3}
          onClick={() => toast.success("Transfer application submitted; reference TR-2026-0451 generated")}
        >
          Submit choices
        </button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={choices.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-2 md:grid-cols-3">
            {[0, 1, 2].map((slot) => {
              const choice = choices[slot];
              return choice ? (
                <SortableChoice key={choice.id} vacancy={choice} onClear={() => setChoices(choices.filter((item) => item.id !== choice.id))} />
              ) : (
                <div className="rounded-btn border border-dashed border-slate-300 bg-slate-50 p-2 text-sm font-bold text-slate-400" key={slot}>
                  Choice slot {slot + 1}
                </div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export function ApplicationPreview({ choices }: { choices: Vacancy[] }) {
  return (
    <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-xl font-black text-slate-950">Application Preview</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-btn border border-slate-200 p-3"><small className="font-black uppercase text-slate-400">Teacher</small><strong className="block">R. Kavitha</strong></div>
        <div className="rounded-btn border border-slate-200 p-3"><small className="font-black uppercase text-slate-400">Category</small><strong className="block">E - Near retirement</strong></div>
        <div className="rounded-btn border border-slate-200 p-3"><small className="font-black uppercase text-slate-400">Latest Documents</small><strong className="block">2 proofs attached</strong></div>
      </div>
      <ol className="mt-4 grid gap-2">
        {choices.map((choice, index) => <li className="rounded-btn bg-surface p-3 font-bold" key={choice.id}>{index + 1}. {choice.school}</li>)}
      </ol>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-btn bg-slate-50 p-3 text-sm font-bold text-slate-700">Preview must be confirmed before final submit.</div>
        <div className="rounded-btn bg-slate-50 p-3 text-sm font-bold text-slate-700">Reference number is generated after submission.</div>
        <div className="rounded-btn bg-slate-50 p-3 text-sm font-bold text-slate-700">Changes and withdrawal stay open until deadline.</div>
      </div>
    </section>
  );
}
