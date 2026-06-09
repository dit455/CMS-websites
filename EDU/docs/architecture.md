# TIS Architecture

## Target Platform

The Teacher Information System is designed as a web-based e-Governance portal suitable for deployment in a Government Data Center.

## Logical Components

- Public portal: notices, vacancies, transfer orders, FAQ, contact, RTI summaries.
- Teacher self service: profile, documents, transfer applications, grievances, order downloads.
- Establishment workflow: reviewer checks, approver sanctions, digital signature queue.
- Transfer counselling: eligibility engine, vacancy management, merit list, allocation, appeals.
- Helpdesk: ticket intake, routing, SLA tracking, reopen flow, notifications.
- Admin: masters, users, roles, workflows, department configuration.
- MIS: operational reports, audit-logged exports, RTI reports.

## Frontend

- React 19 with TypeScript.
- Vite build pipeline.
- Redux Toolkit for local session role and UI preferences.
- React Query for server state.
- Material UI for accessible controls.
- Tailwind CSS for responsive layout primitives.
- Framer Motion for screen transitions.

## Future Backend

No database schema is included in the current frontend demo snapshot. When backend work resumes, the API can be introduced with a module layout such as:

- `AuthModule`: JWT, OTP, captcha, SSO/ePramaan adapters.
- `UserModule`: user lifecycle, activation, password reset.
- `TeacherModule`: teacher master data, service record, document metadata.
- `TransferModule`: eligibility, vacancies, preferences, merit list, allocation.
- `WorkflowModule`: stage routing, returns, recommendations, approvals.
- `SignatureModule`: DSC provider adapter and signed order registry.
- `HelpdeskModule`: tickets, assignments, SLA, reopen flow.
- `ReportsModule`: export jobs, report filters, RTI reports.
- `AuditModule`: immutable activity tracking.
- `NotificationModule`: SMS, email, portal notifications.

## Security

- JWT access tokens with refresh token rotation.
- OTP verified login for teachers and officials.
- Captcha on public forms and login.
- Role Based Access Control on both UI and API.
- Attribute checks for region, school, designation, and workflow stage.
- Audit logs for login, edit, upload, review, approve, sign, export, and admin actions.
- Session timeout and device activity tracking.
- File type validation, virus scan status, and document retention metadata.
- SSL/TLS at ingress, secure cookies, HSTS, CSP, and server-side rate limits.

## Accessibility and GIGW

- Semantic landmarks and skip link.
- Keyboard reachable navigation.
- High contrast mode.
- Responsive layouts for desktop, tablet, and mobile.
- Form labels and visible focus indicators.
- Avoid color-only status communication.

## Integrations

- SMS Gateway: OTP and status notifications.
- Email Gateway: ticket and workflow notifications.
- Digital Signature: transfer orders and approval documents.
- DigiLocker: optional document fetch and certificate verification.
- Aadhaar Verification: optional identity verification with masking and consent capture.
- UDISE: school and institution master synchronization.
- ePramaan: SSO-ready authentication boundary.

## Deployment

Suggested deployment units:

- `web`: static Vite output served by Nginx or object storage with CDN.
- `api`: NestJS container behind API gateway.
- `redis`: OTP, rate limit, and queue state.
- `worker`: export jobs, SMS/email dispatch, DSC callback processing.
- `object-store`: encrypted document storage with malware scan workflow.

Observability:

- Centralized logs with correlation IDs.
- Metrics for approvals, SLA, login failures, report exports, queue lag.
- Audit log retention aligned to department policy.
