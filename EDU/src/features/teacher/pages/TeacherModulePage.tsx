import { AuditTrail } from "../../../shared/components/AuditTrail";
import { PageHeader } from "../../../shared/components/PageHeader";
import { auditTrail } from "../../../shared/lib/mockData";
import { TeacherEntryForm } from "../components/TeacherEntryForm";

export function TeacherModulePage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={["Department", "Teacher Module"]}
        title="Teacher Information Entry and Workflow"
        description="Controlled 8-tab profile form with Zod validation, auditable fields, dynamic service rows, mandatory document upload, preview, and session draft autosave."
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TeacherEntryForm />
        <aside className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="mb-5 text-xl font-black text-slate-950">Audit Trail</h2>
          <AuditTrail entries={auditTrail} />
        </aside>
      </div>
    </div>
  );
}
