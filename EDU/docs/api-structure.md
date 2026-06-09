# REST API Structure

Base path: `/api/v1`

All private endpoints require JWT and RBAC. Mutating endpoints also write audit log entries.

## Auth

| Method | Path | Purpose | Roles |
| --- | --- | --- | --- |
| POST | `/auth/login/otp/request` | Send OTP | Public |
| POST | `/auth/login/otp/verify` | Verify OTP and issue JWT | Public |
| POST | `/auth/refresh` | Rotate tokens | Authenticated |
| POST | `/auth/logout` | End session | Authenticated |
| GET | `/auth/me` | Current user and permissions | Authenticated |

## Teacher Profile

| Method | Path | Purpose | Roles |
| --- | --- | --- | --- |
| GET | `/teachers/me` | Teacher profile | Teacher |
| PATCH | `/teachers/me` | Save profile draft | Teacher |
| POST | `/teachers/me/submit` | Submit profile for review | Teacher |
| GET | `/teachers/:id` | Official profile view | Reviewer, Approver, Admin |
| POST | `/teachers/:id/documents` | Upload document metadata | Teacher, Admin |
| POST | `/teachers/:id/return` | Return profile for correction | Reviewer |
| POST | `/teachers/:id/recommend` | Recommend approval | Reviewer |
| POST | `/teachers/:id/approve` | Approve profile | Approver |

## Transfer and Counselling

| Method | Path | Purpose | Roles |
| --- | --- | --- | --- |
| GET | `/vacancies` | Public or authenticated vacancy list | Public |
| POST | `/transfers/applications` | Create transfer application | Teacher |
| GET | `/transfers/applications/me` | Teacher transfer applications | Teacher |
| GET | `/transfers/applications` | Transfer desk queue | Transfer Officer |
| POST | `/transfers/applications/:id/verify` | Verify request | Transfer Officer |
| POST | `/transfers/eligibility/evaluate` | Run eligibility engine | Transfer Officer |
| POST | `/transfers/counselling/generate-merit` | Generate merit list | Transfer Officer |
| POST | `/transfers/counselling/allocate` | Allocate vacancy | Transfer Officer |
| POST | `/transfers/orders/:id/sign` | Digital signature request | Approver |
| GET | `/transfers/orders/public` | Published orders | Public |
| POST | `/transfers/appeals` | Submit appeal | Teacher |

## Helpdesk

| Method | Path | Purpose | Roles |
| --- | --- | --- | --- |
| POST | `/tickets` | Raise ticket | Teacher |
| GET | `/tickets/me` | Track teacher tickets | Teacher |
| GET | `/tickets` | Helpdesk queue | Helpdesk, Admin |
| PATCH | `/tickets/:id/assign` | Assign ticket | Helpdesk |
| PATCH | `/tickets/:id/status` | Update status | Helpdesk |
| POST | `/tickets/:id/reopen` | Reopen ticket | Teacher, Helpdesk |

## Admin

| Method | Path | Purpose | Roles |
| --- | --- | --- | --- |
| GET | `/masters/:entity` | List master data | Admin |
| POST | `/masters/:entity` | Create master record | Admin |
| PATCH | `/masters/:entity/:id` | Update master record | Admin |
| POST | `/users` | Create user | Admin |
| PATCH | `/users/:id/activate` | Activate user | Admin |
| PATCH | `/users/:id/deactivate` | Deactivate user | Admin |
| POST | `/workflows` | Configure workflow | Admin |
| PATCH | `/roles/:id/permissions` | Configure permissions | Super Admin |

## Reports

| Method | Path | Purpose | Roles |
| --- | --- | --- | --- |
| GET | `/reports/teachers` | Teacher reports | Reviewer, Approver, Admin |
| GET | `/reports/transfers` | Transfer reports | Transfer Officer, Admin |
| GET | `/reports/grievances` | Ticket and SLA reports | Helpdesk, Admin |
| GET | `/reports/rti` | RTI reports | Admin |
| POST | `/reports/export` | Create export job | Authorized role |
| GET | `/reports/export/:jobId` | Download export | Authorized role |

## Cross-Cutting DTOs

```ts
interface AuditContext {
  actorUserId: string;
  role: string;
  ipAddress: string;
  userAgent: string;
  correlationId: string;
}

interface WorkflowActionDto {
  entityType: "teacher_profile" | "transfer_application" | "ticket" | "appeal";
  entityId: string;
  action: "submit" | "return" | "recommend" | "approve" | "reject" | "sign";
  remarks?: string;
}
```
