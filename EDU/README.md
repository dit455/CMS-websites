# Teacher Information System (TIS)

Enterprise-grade Teacher Information System portal prototype for the Education Department, Government of Puducherry.

## What is included

- React 18, TypeScript, Vite frontend
- React Router v6 role-based routed shells with lazy route pages
- Zustand auth and sessionStorage draft state
- TanStack Query v5 query keys and mutation-ready mock flows
- React Hook Form + Zod 8-tab teacher profile wizard
- Tailwind CSS v3 design tokens, shadcn-style owned components
- TanStack Table scrutiny/report tables
- react-dropzone mandatory document and master upload surfaces
- dnd-kit transfer choice sorting and helpdesk kanban movement
- SortableJS workflow hierarchy builder
- Recharts MIS summary charts
- sonner workflow/toast notifications
- Public transparency portal with the generated digital governance hero
- Frontend-only demo OTP login for Teacher, Department, and Admin roles

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Key files

- `src/app/router.tsx` - lazy role-based routes and shell layouts
- `src/app/providers.tsx` - QueryClient and notification providers
- `src/features/teacher/components/TeacherEntryForm.tsx` - RHF + Zod teacher wizard
- `src/features/transfer/components/EmployeeTransferComponents.tsx` - eligibility, vacancies, choices, preview
- `src/features/transfer/components/DepartmentTransferComponents.tsx` - scrutiny, counselling, order viewer
- `src/features/helpdesk/components/HelpdeskDrawer.tsx` - persistent drawer ticket wizard
- `src/shared/components/` - AuditTrail, StatusBadge, CategoryPill, PageHeader, ConfirmDialog, EmptyState
- `src/styles/globals.css` - global Tailwind stylesheet entrypoint
- `docs/architecture.md` - deployment, security, and integration architecture

## Production path

This snapshot is a frontend demo and does not include a database schema. When backend work resumes, replace the mock API helpers in `src/shared/lib/api.ts` with authenticated REST calls and add the server-side RBAC/data model separately.
