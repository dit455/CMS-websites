import { PageHeader } from "../../../shared/components/PageHeader";
import { ReportCatalog, ReportSummaryBar, ReportTable } from "../components/MISComponents";

export function EmployeeReportsPage() {
  return (
    <div className="space-y-4">
      <PageHeader breadcrumb={["Teacher", "Reports"]} title="Employee Reports" description="Teacher-side downloadable service, transfer, and helpdesk report surface." />
      <ReportCatalog groups={["employee", "transfer", "grievance"]} />
      <ReportSummaryBar />
      <ReportTable />
    </div>
  );
}
