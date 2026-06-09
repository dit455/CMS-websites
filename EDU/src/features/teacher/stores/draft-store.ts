import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface DraftState {
  lastSavedAt?: string;
  fieldDiffs: Array<{ field: string; before: unknown; after: unknown; at: string }>;
  markSaved: () => void;
  addDiff: (field: string, before: unknown, after: unknown) => void;
}

export const useTeacherDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      lastSavedAt: undefined,
      fieldDiffs: [],
      markSaved: () => set({ lastSavedAt: new Date().toISOString() }),
      addDiff: (field, before, after) =>
        set((state) => ({
          fieldDiffs: [...state.fieldDiffs.slice(-24), { field, before, after, at: new Date().toISOString() }]
        }))
    }),
    {
      name: "tis-teacher-draft-session",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
