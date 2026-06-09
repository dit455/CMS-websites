import { DndContext, type DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { MessageSquare, RotateCcw, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { tickets as sourceTickets } from "../../../shared/lib/mockData";
import type { Ticket, TicketStatus } from "../../../shared/types/tis";

const statuses: TicketStatus[] = ["Submitted", "Initiated", "In Process", "Closed"];

export function TicketThreadSheet({ ticket, onClose }: { ticket?: Ticket; onClose: () => void }) {
  if (!ticket) return null;

  const trail = [
    "Submitted by teacher with attachment",
    "Seen by helpdesk operator",
    "Assigned to concerned official",
    ticket.status === "Closed" ? "Closed with SMS/e-mail notification" : "Remarks updated by assigned official"
  ];

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 rounded-t-card border border-slate-200 bg-white p-5 shadow-soft lg:left-auto lg:top-20 lg:h-[calc(100vh-5rem)] lg:w-[420px] lg:rounded-l-card lg:rounded-tr-none">
      <button className="float-right rounded-btn border border-slate-200 px-3 py-1 text-sm font-black" onClick={onClose}>Close</button>
      <h2 className="text-xl font-black">{ticket.number}</h2>
      <p className="mt-1 text-sm text-slate-600">{ticket.title}</p>
      <ol className="mt-5 space-y-4 border-l border-slate-200 pl-4">
        {trail.map((item, index) => (
          <li key={item}>
            <strong className="block">{item}</strong>
            <small className="text-slate-500">{index + 1} hour ago - {ticket.actor}</small>
          </li>
        ))}
      </ol>
      {ticket.status === "Closed" ? (
        <button className="mt-5 inline-flex items-center gap-2 rounded-btn bg-copper px-4 py-2 font-black text-white">
          <RotateCcw size={18} /> Reopen
        </button>
      ) : null}
    </aside>
  );
}

function KanbanCard({ ticket, readOnly, onOpen }: { ticket: Ticket; readOnly: boolean; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: ticket.id, disabled: readOnly });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      className="rounded-btn border border-slate-200 bg-slate-50 p-3 text-left text-sm"
      onClick={onOpen}
      {...attributes}
      {...listeners}
    >
      <span className="inline-flex items-center gap-2 font-black"><MessageSquare size={15} /> {ticket.number}</span>
      <span className="mt-1 block text-slate-600">{ticket.title}</span>
      {ticket.status === "Submitted" ? <span className="mt-2 inline-flex rounded-badge bg-amber-50 px-2 py-1 text-xs font-black text-amber-800">FIFO queue</span> : null}
      <small className="mt-2 block text-slate-400">{ticket.updatedAt}</small>
    </button>
  );
}

function KanbanColumn({
  status,
  tickets,
  readOnly,
  onOpen
}: {
  status: TicketStatus;
  tickets: Ticket[];
  readOnly: boolean;
  onOpen: (ticket: Ticket) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className={`rounded-card border border-slate-200 bg-white p-3 shadow-soft ${isOver ? "ring-2 ring-primary" : ""}`}>
      <div className="mb-3 flex items-center justify-between">
        <strong>{status}</strong>
        <span className="rounded-badge bg-surface px-2 py-1 text-xs font-black text-primary">{tickets.length}</span>
      </div>
      <div className="grid min-h-28 gap-2">
        {tickets.map((ticket) => (
          <KanbanCard ticket={ticket} readOnly={readOnly} onOpen={() => onOpen(ticket)} key={ticket.id} />
        ))}
      </div>
    </div>
  );
}

export function TicketKanban({ readOnly = false }: { readOnly?: boolean }) {
  const [tickets, setTickets] = useState(sourceTickets);
  const [selected, setSelected] = useState<Ticket | undefined>();
  const onDragEnd = (event: DragEndEvent) => {
    if (readOnly || !event.over) return;
    setTickets((items) =>
      items.map((item) => (item.id === event.active.id ? { ...item, status: String(event.over?.id) as TicketStatus } : item))
    );
  };

  return (
    <>
      <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-black text-slate-950">Helpdesk Routing Rules</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Submitted tickets are accessed FIFO by helpdesk users.",
            "Multiple-user selection marks the ticket as seen.",
            "Tickets can be assigned to concerned officials or sent back with comments.",
            "Closed tickets send SMS/e-mail and can be reopened by the employee."
          ].map((rule) => <div className="rounded-btn bg-surface p-3 text-sm font-bold text-slate-700" key={rule}>{rule}</div>)}
        </div>
      </section>
      <DndContext onDragEnd={onDragEnd}>
        <div className="grid gap-3 xl:grid-cols-4">
          {statuses.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tickets={tickets.filter((ticket) => ticket.status === status)}
              readOnly={readOnly}
              onOpen={setSelected}
            />
          ))}
        </div>
      </DndContext>
      <TicketThreadSheet ticket={selected} onClose={() => setSelected(undefined)} />
    </>
  );
}

export function PublicTicketLookup() {
  const [ticketNumber, setTicketNumber] = useState("HD-2026-00418");
  const [submissionDate, setSubmissionDate] = useState("2026-06-03");

  return (
    <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <Search className="text-primary" size={20} />
        <h2 className="text-xl font-black text-slate-950">Track Ticket Without Login</h2>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <label className="block text-sm font-bold text-slate-700">
          Ticket number
          <input className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" value={ticketNumber} onChange={(event) => setTicketNumber(event.target.value)} />
        </label>
        <label className="block text-sm font-bold text-slate-700">
          Submission date
          <input type="date" className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" value={submissionDate} onChange={(event) => setSubmissionDate(event.target.value)} />
        </label>
        <button className="self-end rounded-btn bg-primary px-4 py-3 font-black text-white" onClick={() => toast.success(`${ticketNumber} is In Process with remarks available for ${submissionDate}`)}>
          Check Status
        </button>
      </div>
    </section>
  );
}
