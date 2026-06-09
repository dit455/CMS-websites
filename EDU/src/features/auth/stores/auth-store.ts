import { create } from "zustand";
import type { PortalRole } from "../../../shared/types/tis";

const storageKey = "tis-demo-auth";

const demoUsers: Record<PortalRole, string> = {
  teacher: "R. Kavitha",
  "school-admin": "School Admin - GHSS Kalapet",
  department: "Education Department Official",
  admin: "TIS System Administrator"
};

interface AuthState {
  role: PortalRole;
  userName: string;
  isAuthenticated: boolean;
  setRole: (role: PortalRole) => void;
  login: (role: PortalRole) => void;
  logout: () => void;
}

function readSession(): Pick<AuthState, "role" | "userName" | "isAuthenticated"> {
  if (typeof window === "undefined") return { role: "teacher", userName: "", isAuthenticated: false };
  const raw = window.sessionStorage.getItem(storageKey);
  if (!raw) return { role: "teacher", userName: "", isAuthenticated: false };

  try {
    const parsed = JSON.parse(raw) as Pick<AuthState, "role" | "userName" | "isAuthenticated">;
    return parsed.isAuthenticated ? parsed : { role: "teacher", userName: "", isAuthenticated: false };
  } catch {
    return { role: "teacher", userName: "", isAuthenticated: false };
  }
}

function writeSession(role: PortalRole, userName: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(storageKey, JSON.stringify({ role, userName, isAuthenticated: true }));
}

function clearSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(storageKey);
}

export const useAuthStore = create<AuthState>((set) => ({
  ...readSession(),
  setRole: (role) =>
    set((state) => {
      const userName = state.isAuthenticated ? demoUsers[role] : state.userName;
      if (state.isAuthenticated) writeSession(role, userName);
      return { role, userName };
    }),
  login: (role) => {
    const userName = demoUsers[role];
    writeSession(role, userName);
    set({ role, userName, isAuthenticated: true });
  },
  logout: () => {
    clearSession();
    set({ role: "teacher", userName: "", isAuthenticated: false });
  }
}));
