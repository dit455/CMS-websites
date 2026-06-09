import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({ open, title, description, confirmLabel = "Confirm", onConfirm, onClose }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" role="presentation">
      <div className="w-full max-w-md rounded-card border border-slate-200 bg-white p-5 shadow-soft" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-btn bg-red-50 text-red-700">
            <AlertTriangle size={20} />
          </span>
          <div>
            <h2 id="confirm-title" className="text-lg font-black text-slate-950">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded-btn border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700" onClick={onClose}>
            Cancel
          </button>
          <button className="rounded-btn bg-red-600 px-4 py-2 text-sm font-bold text-white" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
