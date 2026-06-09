import { useState } from "react";
import { PageHeader } from "../../../shared/components/PageHeader";
import type { Vacancy } from "../../../shared/types/tis";
import { ApplicationPreview, ChoiceSummaryBar, EligibilityGrid, MandatoryTransferBanner, TransferPolicyPanel, VacancySelector } from "../components/EmployeeTransferComponents";

export function TeacherTransferDashboard() {
  const [choices, setChoices] = useState<Vacancy[]>([]);
  return (
    <div className="space-y-4">
      <PageHeader breadcrumb={["Teacher", "Transfer"]} title="Employee Transfer Dashboard" description="Eligibility, mandatory tenure alert, debounced vacancy filters, three-choice selection, drag reorder, and application preview." />
      <MandatoryTransferBanner />
      <TransferPolicyPanel />
      <EligibilityGrid />
      <VacancySelector choices={choices} setChoices={setChoices} />
      <ApplicationPreview choices={choices} />
      <ChoiceSummaryBar choices={choices} setChoices={setChoices} />
    </div>
  );
}
