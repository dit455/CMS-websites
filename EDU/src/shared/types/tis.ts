import type { LucideIcon } from "lucide-react";

export type PortalRole = "teacher" | "school-admin" | "department" | "admin";
export type WorkflowStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected" | "sent_back";
export type TransferCategory = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K";
export type TicketStatus = "Submitted" | "Initiated" | "In Process" | "Closed";

export interface NavRoute {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface AuditEntry {
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  remarks: string;
}

export interface Vacancy {
  id: string;
  school: string;
  region: "Puducherry" | "Karaikal" | "Mahe" | "Yanam";
  subject: string;
  postType: string;
  schoolType: string;
  vacancy: number;
}

export interface TransferApplication {
  id: string;
  teacher: string;
  category: TransferCategory;
  choices: string[];
  submittedDate: string;
  status: WorkflowStatus;
}

export interface Ticket {
  id: string;
  number: string;
  title: string;
  status: TicketStatus;
  actor: string;
  updatedAt: string;
}

export interface ReportRow {
  id: string;
  region: string;
  postType: string;
  category: TransferCategory;
  total: number;
  pending: number;
}
