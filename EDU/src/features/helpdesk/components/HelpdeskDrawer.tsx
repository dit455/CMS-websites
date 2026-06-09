import { Copy, HelpCircle, MonitorCog, Paperclip, Send, UserRoundX, X } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const problemTypes = [
  { label: "Login Issues", icon: UserRoundX },
  { label: "Profile Issues", icon: MonitorCog },
  { label: "Transfer Counselling", icon: Send },
  { label: "Grievance / Appeal", icon: HelpCircle },
  { label: "Technical Issues", icon: HelpCircle }
];

function ProblemTypeSelect({ value, setValue }: { value: string; setValue: (value: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {problemTypes.map((item) => {
        const Icon = item.icon;
        return (
          <button
            type="button"
            className={`rounded-card border p-4 text-left ${value === item.label ? "border-primary bg-surface" : "border-slate-200 bg-white"}`}
            onClick={() => setValue(item.label)}
            key={item.label}
          >
            <Icon className="text-primary" />
            <strong className="mt-3 block text-sm">{item.label}</strong>
          </button>
        );
      })}
    </div>
  );
}

function ProblemDetailForm({ details, setDetails, setAttachment }: { details: string; setDetails: (value: string) => void; setAttachment: (value: string) => void }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"], "image/*": [".png", ".jpg", ".jpeg"] },
    multiple: false,
    onDrop: (files) => setAttachment(files[0]?.name ?? "")
  });

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-slate-700">
        Problem details <span className="text-red-600">*</span>
        <textarea className="mt-2 min-h-32 w-full rounded-btn border border-slate-200 px-3 py-3" value={details} onChange={(event) => setDetails(event.target.value)} />
      </label>
      <div {...getRootProps()} className="rounded-card border-2 border-dashed border-slate-300 bg-white p-5 text-center">
        <input {...getInputProps()} />
        <Paperclip className="mx-auto text-primary" />
        <strong className="mt-2 block text-sm">Attach text proof, PDF, or image</strong>
      </div>
      {details.trim().length < 15 ? <p className="text-sm font-bold text-orange-700">Enter at least 15 characters so the helpdesk can route the ticket.</p> : null}
    </div>
  );
}

function TicketSuccessCard({ number }: { number: string }) {
  return (
    <div className="rounded-card border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
      <strong className="block text-lg">Ticket submitted</strong>
      <p className="mt-1 text-sm">Your ticket number is {number}</p>
      <p className="mt-1 text-sm">Use the dashboard or public lookup with submission date to track status and remarks.</p>
      <button
        className="mt-3 inline-flex items-center gap-2 rounded-btn bg-emerald-700 px-3 py-2 text-sm font-black text-white"
        onClick={() => navigator.clipboard.writeText(number).then(() => toast.success("Ticket number copied"))}
      >
        <Copy size={16} /> Copy number
      </button>
    </div>
  );
}

export function HelpdeskDrawer() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [problemType, setProblemType] = useState("Profile Issues");
  const [details, setDetails] = useState("");
  const [attachment, setAttachment] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");

  return (
    <>
      <button
        className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-copper px-5 py-3 font-black text-white shadow-soft"
        onClick={() => setOpen(true)}
      >
        <HelpCircle size={20} /> Helpdesk
      </button>
      <aside
        className="fixed inset-y-0 right-0 z-40 w-full max-w-md border-l border-slate-200 bg-white p-5 shadow-soft transition-transform data-[state=closed]:translate-x-full data-[state=open]:translate-x-0"
        data-state={open ? "open" : "closed"}
        aria-label="Helpdesk drawer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase text-primary">Helpdesk drawer</p>
            <h2 className="text-2xl font-black">Raise Ticket</h2>
          </div>
          <button className="rounded-btn border border-slate-200 p-2" onClick={() => setOpen(false)} aria-label="Close helpdesk">
            <X />
          </button>
        </div>
        <div className="mt-5 flex gap-2">
          {[1, 2, 3].map((item) => (
            <span className={`h-2 flex-1 rounded-full ${step >= item ? "bg-primary" : "bg-slate-200"}`} key={item} />
          ))}
        </div>
        <div className="mt-5">
          {ticketNumber ? (
            <TicketSuccessCard number={ticketNumber} />
          ) : step === 1 ? (
            <ProblemTypeSelect value={problemType} setValue={setProblemType} />
          ) : step === 2 ? (
            <ProblemDetailForm details={details} setDetails={setDetails} setAttachment={setAttachment} />
          ) : (
            <div className="rounded-card border border-slate-200 p-4">
              <h3 className="font-black">Confirm and submit</h3>
              <p className="mt-2 text-sm text-slate-600">{problemType}</p>
              <p className="mt-2 text-sm text-slate-600">{details || "No details entered"}</p>
              {attachment ? <p className="mt-2 text-sm font-bold text-primary">{attachment}</p> : null}
            </div>
          )}
        </div>
        {!ticketNumber ? (
          <div className="absolute inset-x-5 bottom-5 flex gap-2">
            <button className="flex-1 rounded-btn border border-slate-200 px-4 py-3 font-black" onClick={() => setStep(Math.max(1, step - 1))}>
              Back
            </button>
            <button
              className="flex-1 rounded-btn bg-primary px-4 py-3 font-black text-white"
              onClick={() => {
                if (step === 2 && details.trim().length < 15) {
                  toast.error("Problem details are mandatory");
                  return;
                }
                if (step < 3) return setStep(step + 1);
                setTicketNumber("HD-2026-00492");
                toast.success("Ticket submitted; SMS/email confirmation queued");
              }}
            >
              {step === 3 ? "Submit" : "Next"}
            </button>
          </div>
        ) : null}
      </aside>
    </>
  );
}
