import { PageHeader } from "../../../shared/components/PageHeader";
import { ReportCatalog, ReportFilterPanel, ReportSummaryBar, ReportTable } from "../components/MISComponents";

export function MISModulePage() {
  return (
    <div className="space-y-4">
      <PageHeader breadcrumb={["Department", "MIS"]} title="MIS Reports" description="Sticky filter panel, regional distribution chart, TanStack Table, column visibility, and export actions." />
      <ReportCatalog />
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <ReportFilterPanel />
        <div className="space-y-4">
          <ReportSummaryBar />
          <ReportTable />
        </div>
      </div>
    </div>
  );
}
