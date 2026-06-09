import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Sortable from "sortablejs";
import { toast } from "sonner";
import { AlertTriangle, Building2, FileSpreadsheet, Save, Shuffle, Users } from "lucide-react";
import { dprAdminRoles } from "../../../shared/lib/mockData";

const employees = [
  { id: "PY-EDU-1482", name: "R. Kavitha", mobile: "9876543210", email: "kavitha.edu@gov.in", offices: ["GHSS Kalapet", "Directorate"], previous: "9876500001 / old.mail@gov.in" },
  { id: "PY-EDU-2041", name: "S. Manikandan", mobile: "9888899991", email: "manikandan.edu@gov.in", offices: ["Transfer Cell"], previous: "No prior change" },
  { id: "PY-EDU-1784", name: "A. Priya", mobile: "9876512345", email: "priya.edu@gov.in", offices: ["Karaikal Zone", "Grievance Cell"], previous: "priya.old@gov.in" },
  { id: "PY-EDU-1911", name: "M. Dinesh", mobile: "9888801234", email: "dinesh.edu@gov.in", offices: ["Helpdesk"], previous: "No prior change" }
];

export function RoleMatrix() {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  return (
    <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">Role Matrix</h2>
          <p className="mt-1 text-sm text-slate-600">DPR roles can be added or removed anytime after checking active tasks in the same office.</p>
        </div>
        {dirty ? <span className="inline-flex items-center gap-2 rounded-badge bg-amber-50 px-3 py-1 text-sm font-black text-amber-800"><AlertTriangle size={16} /> Unsaved changes</span> : null}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[1180px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr><th className="p-3">Employee</th>{dprAdminRoles.map((role) => <th className="p-3" key={role}>{role}</th>)}</tr>
          </thead>
          <tbody>
            {employees.map((employee, rowIndex) => (
              <tr className="border-t border-slate-200" key={employee.id}>
                <td className="p-3">
                  <strong className="block">{employee.name}</strong>
                  <span className="text-xs text-slate-500">{employee.id}</span>
                </td>
                {dprAdminRoles.map((role, colIndex) => (
                  <td className="p-3" key={role}>
                    <input
                      type="checkbox"
                      defaultChecked={(rowIndex + colIndex) % 3 === 0}
                      onChange={(event) => {
                        setDirty(true);
                        if (!event.currentTarget.checked) toast.info("Active tasks must be reassigned to the same role in the same office before removal");
                      }}
                      aria-label={`${employee.name} ${role}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="mt-4 inline-flex items-center gap-2 rounded-btn bg-primary px-4 py-2 font-black text-white" onClick={() => { setDirty(false); toast.success("Role matrix saved after active-task check"); }}>
        <Save size={18} /> Save changes
      </button>
    </section>
  );
}

export function UserOfficeMappingPanel() {
  return (
    <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <Users className="text-primary" size={20} />
        <h2 className="text-xl font-black">Employee and Office Mapping</h2>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[920px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr><th className="p-3">Employee ID</th><th className="p-3">Name</th><th className="p-3">Mobile</th><th className="p-3">E-mail</th><th className="p-3">Offices</th><th className="p-3">Earlier contact data</th></tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr className="border-t border-slate-200" key={employee.id}>
                <td className="p-3 font-bold">{employee.id}</td>
                <td className="p-3">{employee.name}</td>
                <td className="p-3">{employee.mobile}</td>
                <td className="p-3">{employee.email}</td>
                <td className="p-3">{employee.offices.join(", ")}</td>
                <td className="p-3">{employee.previous}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-btn bg-surface p-3 text-sm font-bold text-slate-700">Mobile and e-mail changes preserve earlier values.</div>
        <div className="rounded-btn bg-surface p-3 text-sm font-bold text-slate-700">One employee can map to multiple offices.</div>
        <div className="rounded-btn bg-red-50 p-3 text-sm font-bold text-red-800">Deactivate action blocked while employee is working in department.</div>
      </div>
    </section>
  );
}

export function WorkflowBuilder() {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [nodes, setNodes] = useState(["Director", "Joint Director", "Deputy Director", "Reviewer Desk", "School Head"]);

  useEffect(() => {
    if (!listRef.current) return;
    const sortable = Sortable.create(listRef.current, {
      animation: 150,
      onEnd: (event) => {
        if (event.oldIndex == null || event.newIndex == null) return;
        const next = [...nodes];
        const [moved] = next.splice(event.oldIndex, 1);
        next.splice(event.newIndex, 0, moved);
        setNodes(next);
      }
    });
    return () => sortable.destroy();
  }, [nodes]);

  return (
    <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <Shuffle className="text-primary" size={20} />
        <h2 className="text-xl font-black">Workflow Builder</h2>
      </div>
      <p className="mt-1 text-sm text-slate-600">Map each post to the next higher post across one-to-many, many-to-one, intra-office, and inter-department workflows.</p>
      <div className="mt-4 grid gap-2" ref={listRef}>
        {nodes.map((node) => (
          <div className="cursor-grab rounded-btn border border-slate-200 bg-slate-50 p-3 font-bold" key={node}>
            {node}
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <button className="rounded-btn border border-slate-200 px-4 py-2 font-black" onClick={() => setNodes([...nodes, "Next Higher Post"])}>
          Add mapping
        </button>
        <button className="rounded-btn border border-orange-200 bg-orange-50 px-4 py-2 font-black text-orange-800" onClick={() => toast.warning("De-mapping requires active task count review and reassignment confirmation")}>
          De-map office
        </button>
      </div>
    </section>
  );
}

export function MasterDataUpload() {
  const [fileName, setFileName] = useState("");
  const previewRows = [
    { row: 2, master: "GHSS Kalapet", status: "Valid", error: "" },
    { row: 3, master: "GHS Neravy", status: "Valid", error: "" },
    { row: 4, master: "", status: "Error", error: "School name is required" }
  ];
  const hasErrors = previewRows.some((row) => row.status === "Error");
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"], "application/vnd.ms-excel": [".xls"] },
    multiple: false,
    onDrop: (files) => setFileName(files[0]?.name ?? "")
  });

  return (
    <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <Building2 className="text-primary" size={20} />
        <h2 className="text-xl font-black">Master Data Upload</h2>
      </div>
      <div {...getRootProps()} className="mt-4 rounded-card border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <input {...getInputProps()} />
        <FileSpreadsheet className="mx-auto text-primary" />
        <strong className="mt-2 block">{fileName || "Drop preformatted Excel master file"}</strong>
        <p className="mt-1 text-sm font-bold text-slate-500">Screen entry is also supported; uploaded masters cannot be edited after creation.</p>
      </div>
      <div className="mt-4 overflow-x-auto rounded-card border border-slate-200">
        <table className="min-w-[620px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="p-3">Row No</th><th className="p-3">Master Value</th><th className="p-3">Status</th><th className="p-3">Error</th></tr></thead>
          <tbody>
            {previewRows.map((row) => (
              <tr className={`border-t border-slate-200 ${row.status === "Error" ? "bg-red-50" : ""}`} key={row.row}>
                <td className="p-3 font-bold">{row.row}</td>
                <td className="p-3">{row.master || "Missing"}</td>
                <td className="p-3">{row.status}</td>
                <td className="p-3" title={row.error}>{row.error}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 rounded-btn bg-amber-50 p-3 text-sm font-bold text-amber-900">
        Upload is all-or-nothing: no partial commit when any row has an error.
      </div>
      <button className="mt-4 rounded-btn bg-primary px-4 py-2 font-black text-white disabled:bg-slate-300" disabled={hasErrors}>
        Commit upload
      </button>
    </section>
  );
}
