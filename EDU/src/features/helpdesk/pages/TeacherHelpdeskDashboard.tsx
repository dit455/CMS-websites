import { PageHeader } from "../../../shared/components/PageHeader";
import { PublicTicketLookup, TicketKanban } from "../components/TicketKanban";

export function TeacherHelpdeskDashboard() {
  return (
    <div className="space-y-4">
      <PageHeader breadcrumb={["Teacher", "Helpdesk"]} title="My Helpdesk Tickets" description="Read-only ticket kanban with thread view and reopen action on closed tickets." />
      <PublicTicketLookup />
      <TicketKanban readOnly />
    </div>
  );
}
