import { PageHeader } from "../../../shared/components/PageHeader";
import { PublicTicketLookup, TicketKanban } from "../components/TicketKanban";

export function HelpdeskModulePage() {
  return (
    <div className="space-y-4">
      <PageHeader breadcrumb={["Department", "Helpdesk"]} title="Helpdesk Operations" description="Four-column ticket kanban for Submitted, Initiated, In Process, and Closed statuses with thread sheets." />
      <PublicTicketLookup />
      <TicketKanban />
    </div>
  );
}
