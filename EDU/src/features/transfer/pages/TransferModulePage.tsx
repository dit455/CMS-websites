import { PageHeader } from "../../../shared/components/PageHeader";
import { CounsellingBoard, ScrutinyTable, TransferGovernancePanel, TransferOrderViewer } from "../components/DepartmentTransferComponents";

export function TransferModulePage() {
  return (
    <div className="space-y-4">
      <PageHeader breadcrumb={["Department", "Transfer Module"]} title="Transfer Scrutiny and Counselling" description="Server-style TanStack scrutiny table, send-back workflow, live counselling board, vacancy refresh, and digital order preview." />
      <TransferGovernancePanel />
      <ScrutinyTable />
      <CounsellingBoard />
      <TransferOrderViewer />
    </div>
  );
}
