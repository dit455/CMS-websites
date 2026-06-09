import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Download, FileBarChart, RotateCcw } from "lucide-react";
import { CategoryPill } from "../../../shared/components/CategoryPill";
import { misReportGroups, reportRows } from "../../../shared/lib/mockData";
import type { ReportRow } from "../../../shared/types/tis";

const reportGroupLabels: Record<keyof typeof misReportGroups, string> = {
  employee: "Employee Reports",
  preferential: "Department Preferential",
  grievance: "Grievance Reports",
  transfer: "Transfer Reports",
  rti: "RTI Reports",
  vigilance: "Vigilance Clearance"
};

export function ReportCatalog({ groups = Object.keys(misReportGroups) as Array<keyof typeof misReportGroups> }: { groups?: Array<keyof typeof misReportGroups> }) {
  return (
    <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <FileBarChart className="text-primary" size={20} />
        <h2 className="text-xl font-black text-slate-950">DPR Report Catalogue</h2>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <article className="rounded-card border border-slate-200 bg-slate-50 p-4" key={group}>
            <strong className="text-slate-950">{reportGroupLabels[group]}</strong>
            <ul className="mt-3 space-y-2 text-sm font-bold leading-5 text-slate-600">
              {misReportGroups[group].map((report) => <li key={report}>{report}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ReportFilterPanel() {
  const [range, setRange] = useState<DateRange | undefined>();
  return (
    <aside className="rounded-card border border-slate-200 bg-white p-4 shadow-soft lg:sticky lg:top-20">
      <h2 className="text-xl font-black">Report Filters</h2>
      <div className="mt-4 overflow-hidden rounded-card border border-slate-200">
        <DayPicker mode="range" selected={range} onSelect={setRange} />
      </div>
      {["Puducherry", "Karaikal", "Mahe", "Yanam"].map((region) => (
        <label className="mt-3 flex items-center gap-2 text-sm font-bold" key={region}>
          <input type="checkbox" defaultChecked /> {region}
        </label>
      ))}
      <select className="mt-4 w-full rounded-btn border border-slate-200 px-3 py-2">
        <option>All post types</option>
        <option>PGT</option>
        <option>TGT</option>
      </select>
      <select className="mt-3 w-full rounded-btn border border-slate-200 px-3 py-2">
        <option>All report families</option>
        <option>Employee</option>
        <option>Preferential category</option>
        <option>Grievance</option>
        <option>Transfer</option>
        <option>RTI</option>
        <option>Vigilance</option>
      </select>
      <div className="mt-4 flex gap-2">
        <button className="flex-1 rounded-btn bg-primary px-3 py-2 text-sm font-black text-white">Generate report</button>
        <button className="rounded-btn border border-slate-200 px-3 py-2 text-slate-600" aria-label="Reset filters"><RotateCcw size={18} /></button>
      </div>
    </aside>
  );
}

export function ReportSummaryBar() {
  const total = reportRows.reduce((sum, row) => sum + row.total, 0);
  const pending = reportRows.reduce((sum, row) => sum + row.pending, 0);
  return (
    <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-btn bg-surface p-4"><small className="font-black uppercase text-primary">Total count</small><strong className="block text-3xl">{total}</strong></div>
        <div className="rounded-btn bg-amber-50 p-4"><small className="font-black uppercase text-amber-700">Pending</small><strong className="block text-3xl">{pending}</strong></div>
        <div className="rounded-btn bg-emerald-50 p-4"><small className="font-black uppercase text-emerald-700">Regions</small><strong className="block text-3xl">4</strong></div>
      </div>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={reportRows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#0F766E" radius={[8, 8, 0, 0]} />
            <Bar dataKey="pending" fill="#F59E0B" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

const columnHelper = createColumnHelper<ReportRow>();

export function ReportTable() {
  const [columnVisibility, setColumnVisibility] = useState({});
  const columns = useMemo(
    () => [
      columnHelper.accessor("region", { header: "Region" }),
      columnHelper.accessor("postType", { header: "Post Type" }),
      columnHelper.accessor("category", { header: "Category", cell: ({ getValue }) => <CategoryPill category={getValue()} /> }),
      columnHelper.accessor("total", { header: "Total" }),
      columnHelper.accessor("pending", { header: "Pending" })
    ],
    []
  );
  const table = useReactTable({ data: reportRows, columns, state: { columnVisibility }, onColumnVisibilityChange: setColumnVisibility, getCoreRowModel: getCoreRowModel() });

  return (
    <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black">Report Table</h2>
        <div className="flex flex-wrap gap-2">
          {table.getAllLeafColumns().map((column) => (
            <label className="rounded-badge bg-slate-100 px-2 py-1 text-xs font-bold" key={column.id}>
              <input className="mr-1" type="checkbox" checked={column.getIsVisible()} onChange={column.getToggleVisibilityHandler()} />
              {column.id}
            </label>
          ))}
          <button className="inline-flex items-center gap-2 rounded-btn bg-primary px-3 py-2 text-sm font-black text-white"><Download size={16} /> Export Excel</button>
          <button className="inline-flex items-center gap-2 rounded-btn border border-slate-200 px-3 py-2 text-sm font-black"><Download size={16} /> Export PDF</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[720px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            {table.getHeaderGroups().map((headerGroup) => <tr key={headerGroup.id}>{headerGroup.headers.map((header) => <th className="p-3" key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>)}</tr>)}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => <tr className="border-t border-slate-200" key={row.id}>{row.getVisibleCells().map((cell) => <td className="p-3" key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}
