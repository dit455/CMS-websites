import { PageHeader } from "../../../shared/components/PageHeader";
import { MasterDataUpload, RoleMatrix, UserOfficeMappingPanel, WorkflowBuilder } from "../components/AdminComponents";

export function AdminModulePage() {
  return (
    <div className="space-y-4">
      <PageHeader breadcrumb={["Admin", "Configuration"]} title="Administration Console" description="Role matrix, SortableJS workflow hierarchy, and Excel master-data upload with row-level validation preview." />
      <RoleMatrix />
      <UserOfficeMappingPanel />
      <div className="grid gap-4 xl:grid-cols-2">
        <WorkflowBuilder />
        <MasterDataUpload />
      </div>
    </div>
  );
}
