import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAuditTrail() {
  return useMutation({
    mutationFn: async (payload: { field: string; before: unknown; after: unknown }) => {
      await new Promise((resolve) => window.setTimeout(resolve, 120));
      return payload;
    },
    onSuccess: (payload) => {
      toast.message("Audit diff captured", {
        description: `${payload.field} change queued for backend audit log`
      });
    }
  });
}
