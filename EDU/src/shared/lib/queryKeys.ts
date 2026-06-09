export const queryKeys = {
  teacher: (id: string) => ["teacher", id] as const,
  transferVacancies: (filters: unknown) => ["transfer", "vacancies", filters] as const,
  transferApplications: () => ["transfer", "applications"] as const,
  tickets: () => ["helpdesk", "tickets"] as const,
  reports: (type: string, filters: unknown) => ["reports", type, filters] as const
};
