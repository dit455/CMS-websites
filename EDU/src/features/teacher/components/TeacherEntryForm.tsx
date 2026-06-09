import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, Clock, FileText, Plus, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm, useFormContext, useWatch } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { z } from "zod";
import { formatFileSize } from "../../../shared/lib/utils";
import { useTeacherDraftStore } from "../stores/draft-store";
import { tabSchemas, type TeacherFormValues } from "../schemas/teacherSchemas";

type TabKey = keyof typeof tabSchemas;

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "personal", label: "Personal" },
  { key: "qualification", label: "Qualification" },
  { key: "employee", label: "Employee" },
  { key: "school", label: "School" },
  { key: "post", label: "Post" },
  { key: "promotion", label: "Promotion" },
  { key: "service", label: "Service" },
  { key: "placement", label: "Placement" }
];

const fullSchema = z.object({
  ...tabSchemas.personal.shape,
  ...tabSchemas.qualification.shape,
  ...tabSchemas.employee.shape,
  ...tabSchemas.school.shape,
  ...tabSchemas.post.shape,
  ...tabSchemas.promotion.shape,
  ...tabSchemas.service.shape,
  ...tabSchemas.placement.shape
});

const defaultValues: TeacherFormValues = {
  name: "R. Kavitha",
  fatherName: "R. Raman",
  gender: "Female",
  dob: "1970-08-12",
  maritalStatus: "Married",
  spouseGovernmentServant: true,
  spouseName: "R. Mohan",
  spousePlaceOfDuty: "Directorate of Education, Puducherry",
  widow: false,
  legallySeparatedNotRemarried: false,
  physicallyChallenged: false,
  disabilityBand: "",
  homeRegion: "Puducherry",
  mobileNumber: "9876543210",
  email: "kavitha.edu@gov.in",
  address: "Lawspet, Puducherry",
  medicalGrounds: true,
  medicalCondition: "heart transplantation",
  medicalDetails: "Cardiology follow-up certificate submitted",
  childMedicalStatus: false,
  childMedicalCondition: "",
  mandatoryDocument: { name: "medical-certificate.pdf", size: 842000 },
  degree: "M.Sc, B.Ed",
  subject: "Mathematics",
  handlingSubjects: "Mathematics, Applied Mathematics",
  extraCurricularActivities: "NCC and Mathematics Club",
  nationalAwardee: false,
  ncc: true,
  nss: false,
  scoutMasterGuideCaptain: false,
  employeeCode: "PY-EDU-1482",
  payCode: "Level 10",
  gpf: "GPF-29418",
  seniorityNumber: "SEN-2021-118",
  aadhaarMasked: "XXXX-XXXX-2184",
  nationalCodeSsa: "SSA3402010",
  schoolName: "GHSS Kalapet",
  udiseCode: "34020100108",
  resultBand: "99-95%",
  initialPost: "TGT Mathematics",
  initialAppointmentDate: "2002-06-10",
  presentPost: "PGT Mathematics",
  presentPostDate: "2021-06-14",
  probationDate: "2004-06-10",
  completionDate: "2005-06-10",
  recruitmentMode: "Direct recruitment",
  fromPost: "TGT Mathematics",
  toPost: "PGT Mathematics",
  promotionDate: "2021-06-14",
  promotionSeniorityNumber: "SEN-PROM-2021-118",
  regularizationDate: "2022-06-14",
  promotionRemarks: "Promotion order verified",
  serviceHistory: [{ schoolName: "GHSS Kalapet", schoolCode: "PY-1021", udiseCode: "34020100108", postHeld: "PGT Mathematics", fromDate: "2021-06-14", toDate: "2026-06-03", remarks: "Present posting" }],
  placementHistory: [{ schoolName: "GHSS Kalapet", postHeld: "PGT Mathematics", fromDate: "2021-06-14", toDate: "2026-06-03", remarks: "Eligible for near retirement consideration" }]
};

function CompletionDot({ state }: { state: "filled" | "partial" | "empty" }) {
  return (
    <span
      className={`h-2.5 w-2.5 rounded-full ${
        state === "filled" ? "bg-emerald-500" : state === "partial" ? "bg-amber-400" : "bg-slate-300"
      }`}
      aria-label={`${state} completion`}
    />
  );
}

function completionState(schema: z.ZodTypeAny, values: TeacherFormValues) {
  const result = schema.safeParse(values);
  if (result.success) return "filled" as const;
  const issues = result.error.issues.length;
  return issues <= 2 ? ("partial" as const) : ("empty" as const);
}

function TabNav({ active, setActive, values }: { active: TabKey; setActive: (tab: TabKey) => void; values: TeacherFormValues }) {
  return (
    <div>
      <div className="hidden overflow-x-auto rounded-card border border-slate-200 bg-white p-2 md:flex">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`mr-2 inline-flex items-center gap-2 whitespace-nowrap rounded-btn px-3 py-2 text-sm font-black ${
              active === tab.key ? "bg-primary text-white" : "text-slate-700 hover:bg-surface"
            }`}
          >
            <CompletionDot state={completionState(tabSchemas[tab.key], values)} />
            {tab.label}
          </button>
        ))}
      </div>
      <label className="block md:hidden">
        <span className="text-sm font-bold text-slate-700">Select profile tab</span>
        <select className="mt-2 w-full rounded-btn border border-slate-200 bg-white px-3 py-3" value={active} onChange={(event) => setActive(event.target.value as TabKey)}>
          {tabs.map((tab) => (
            <option value={tab.key} key={tab.key}>
              {tab.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function AuditableField({ name, label, type = "text" }: { name: keyof TeacherFormValues; label: string; type?: string }) {
  const { register, getValues } = useFormContext<TeacherFormValues>();
  const addDiff = useTeacherDraftStore((state) => state.addDiff);
  const [before, setBefore] = useState<unknown>(getValues(name));

  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input
        type={type}
        className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3 text-sm"
        {...register(name)}
        onFocus={() => setBefore(getValues(name))}
        onBlur={() => {
          const after = getValues(name);
          if (before !== after) addDiff(String(name), before, after);
        }}
      />
    </label>
  );
}

function ConditionalField({
  watchName,
  when,
  children
}: {
  watchName: keyof TeacherFormValues;
  when: unknown;
  children: React.ReactNode;
}) {
  const value = useWatch<TeacherFormValues>({ name: watchName });
  return value === when ? <>{children}</> : null;
}

function DisabilityBandSelector() {
  const { control } = useFormContext<TeacherFormValues>();
  const bands = ["40-50%", "56-69%", "70-79%", "80%+"];

  return (
    <Controller
      control={control}
      name="disabilityBand"
      render={({ field }) => (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {bands.map((band, index) => (
            <button
              type="button"
              className={`rounded-card border bg-white p-4 text-left shadow-sm ${field.value === band ? "border-primary ring-2 ring-primary/20" : "border-slate-200"}`}
              style={{ borderLeftWidth: 6, borderLeftColor: ["#7C3AED", "#DC2626", "#059669", "#0369A1"][index] }}
              onClick={() => field.onChange(band)}
              key={band}
            >
              <strong>{band}</strong>
              <span className="mt-1 block text-xs text-slate-500">Disability percentage band</span>
            </button>
          ))}
        </div>
      )}
    />
  );
}

function MandatoryDocUpload() {
  const { setValue, watch } = useFormContext<TeacherFormValues>();
  const file = watch("mandatoryDocument") as { name?: string; size?: number } | undefined;
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"], "image/*": [".png", ".jpg", ".jpeg"] },
    multiple: false,
    onDrop: (files) => {
      setValue("mandatoryDocument", files[0], { shouldValidate: true, shouldDirty: true });
      toast.success("Mandatory document attached");
    }
  });

  return (
    <div {...getRootProps()} className={`rounded-card border-2 border-dashed p-5 text-center ${isDragActive ? "border-primary bg-surface" : "border-slate-300 bg-white"}`}>
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto text-primary" />
      <strong className="mt-2 block">Mandatory Document Upload</strong>
      <p className="text-sm text-slate-500">Drop PDF/image proof or click to browse.</p>
      {file?.name ? (
        <span className="mt-3 inline-flex rounded-badge bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">
          {file.name} {file.size ? `- ${formatFileSize(file.size)}` : ""}
        </span>
      ) : null}
    </div>
  );
}

function ServiceHistoryTable() {
  const { control, register } = useFormContext<TeacherFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "serviceHistory" });

  return (
    <div className="overflow-x-auto rounded-card border border-slate-200">
      <table className="min-w-[980px] text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="p-3">School Name</th>
            <th className="p-3">School Code</th>
            <th className="p-3">UDISE Code</th>
            <th className="p-3">Post Held</th>
            <th className="p-3">From</th>
            <th className="p-3">To</th>
            <th className="p-3">Remarks</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr className="border-t border-slate-200" key={field.id}>
              <td className="p-2"><input className="w-full rounded-btn border border-slate-200 px-2 py-2" {...register(`serviceHistory.${index}.schoolName`)} /></td>
              <td className="p-2"><input className="w-full rounded-btn border border-slate-200 px-2 py-2" {...register(`serviceHistory.${index}.schoolCode`)} /></td>
              <td className="p-2"><input className="w-full rounded-btn border border-slate-200 px-2 py-2" {...register(`serviceHistory.${index}.udiseCode`)} /></td>
              <td className="p-2"><input className="w-full rounded-btn border border-slate-200 px-2 py-2" {...register(`serviceHistory.${index}.postHeld`)} /></td>
              <td className="p-2"><input type="date" className="w-full rounded-btn border border-slate-200 px-2 py-2" {...register(`serviceHistory.${index}.fromDate`)} /></td>
              <td className="p-2"><input type="date" className="w-full rounded-btn border border-slate-200 px-2 py-2" {...register(`serviceHistory.${index}.toDate`)} /></td>
              <td className="p-2"><input className="w-full rounded-btn border border-slate-200 px-2 py-2" {...register(`serviceHistory.${index}.remarks`)} /></td>
              <td className="p-2">
                <button type="button" className="rounded-btn bg-red-50 p-2 text-red-700" onClick={() => remove(index)} aria-label="Remove service history row">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="m-3 inline-flex items-center gap-2 rounded-btn border border-slate-200 px-3 py-2 text-sm font-black" onClick={() => append({ schoolName: "", schoolCode: "", udiseCode: "", postHeld: "", fromDate: "", toDate: "", remarks: "" })}>
        <Plus size={16} /> Add Row
      </button>
    </div>
  );
}

function PlacementHistoryTable() {
  const { control, register } = useFormContext<TeacherFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "placementHistory" });

  return (
    <div className="overflow-x-auto rounded-card border border-slate-200">
      <table className="min-w-[760px] text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="p-3">School Name</th>
            <th className="p-3">Post Held</th>
            <th className="p-3">From</th>
            <th className="p-3">To</th>
            <th className="p-3">Remarks</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr className="border-t border-slate-200" key={field.id}>
              <td className="p-2"><input className="w-full rounded-btn border border-slate-200 px-2 py-2" {...register(`placementHistory.${index}.schoolName`)} /></td>
              <td className="p-2"><input className="w-full rounded-btn border border-slate-200 px-2 py-2" {...register(`placementHistory.${index}.postHeld`)} /></td>
              <td className="p-2"><input type="date" className="w-full rounded-btn border border-slate-200 px-2 py-2" {...register(`placementHistory.${index}.fromDate`)} /></td>
              <td className="p-2"><input type="date" className="w-full rounded-btn border border-slate-200 px-2 py-2" {...register(`placementHistory.${index}.toDate`)} /></td>
              <td className="p-2"><input className="w-full rounded-btn border border-slate-200 px-2 py-2" {...register(`placementHistory.${index}.remarks`)} /></td>
              <td className="p-2">
                <button type="button" className="rounded-btn bg-red-50 p-2 text-red-700" onClick={() => remove(index)} aria-label="Remove service placement row">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="m-3 inline-flex items-center gap-2 rounded-btn border border-slate-200 px-3 py-2 text-sm font-black" onClick={() => append({ schoolName: "", postHeld: "", fromDate: "", toDate: "", remarks: "" })}>
        <Plus size={16} /> Add Placement Row
      </button>
    </div>
  );
}

function FormPreview({ values, editTab }: { values: TeacherFormValues; editTab: (tab: TabKey) => void }) {
  return (
    <div className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-950">Printable Form Preview</h2>
        <FileText className="text-primary" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Teacher", values.name, "personal"],
          ["Employee Code", values.employeeCode, "employee"],
          ["Current School", values.schoolName, "school"],
          ["Present Post", values.presentPost, "post"],
          ["Qualification", values.degree, "qualification"],
          ["Placement", values.placementHistory?.[0]?.remarks ?? "Service placement captured", "placement"]
        ].map(([label, value, tab]) => (
          <div className="rounded-btn border border-slate-200 p-3" key={label}>
            <small className="font-black uppercase text-slate-400">{label}</small>
            <strong className="block text-slate-900">{value}</strong>
            <button type="button" className="mt-1 text-xs font-black text-primary" onClick={() => editTab(tab as TabKey)}>
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DraftSaveIndicator() {
  const { watch } = useFormContext<TeacherFormValues>();
  const markSaved = useTeacherDraftStore((state) => state.markSaved);
  const lastSavedAt = useTeacherDraftStore((state) => state.lastSavedAt);
  const mutation = useMutation({
    mutationFn: async (values: TeacherFormValues) => {
      await new Promise((resolve) => window.setTimeout(resolve, 250));
      return values;
    },
    onSuccess: () => markSaved()
  });

  useEffect(() => {
    const timer = window.setInterval(() => mutation.mutate(watch()), 30000);
    return () => window.clearInterval(timer);
  }, [mutation, watch]);

  return (
    <div className="sticky bottom-3 z-20 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-slate-200 bg-white/95 p-3 shadow-soft backdrop-blur">
      <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
        <Clock size={16} className="text-primary" />
        Draft saved {lastSavedAt ? `- ${new Date(lastSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "- pending"}
      </span>
      <button type="button" onClick={() => mutation.mutate(watch())} className="rounded-btn bg-primary px-4 py-2 text-sm font-black text-white">
        Save Draft
      </button>
    </div>
  );
}

function PersonalTab() {
  const { register } = useFormContext<TeacherFormValues>();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <AuditableField name="name" label="Name" />
      <AuditableField name="fatherName" label="Father Name" />
      <label className="block text-sm font-bold text-slate-700">
        Gender
        <select className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" {...register("gender")}>
          <option>Female</option>
          <option>Male</option>
          <option>Other</option>
        </select>
      </label>
      <AuditableField name="dob" label="Date of Birth" type="date" />
      <label className="block text-sm font-bold text-slate-700">
        Marital Status
        <select className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" {...register("maritalStatus")}>
          <option>Single</option>
          <option>Married</option>
        </select>
      </label>
      <ConditionalField watchName="maritalStatus" when="Married">
        <AuditableField name="spouseName" label="Spouse Details" />
      </ConditionalField>
      <ConditionalField watchName="maritalStatus" when="Married">
        <label className="flex items-center gap-2 rounded-btn border border-slate-200 p-3 text-sm font-bold">
          <input type="checkbox" {...register("spouseGovernmentServant")} />
          Spouse is a government servant
        </label>
      </ConditionalField>
      <ConditionalField watchName="spouseGovernmentServant" when={true}>
        <AuditableField name="spousePlaceOfDuty" label="Spouse Place of Duty" />
      </ConditionalField>
      <label className="flex items-center gap-2 rounded-btn border border-slate-200 p-3 text-sm font-bold">
        <input type="checkbox" {...register("widow")} />
        Widow
      </label>
      <label className="flex items-center gap-2 rounded-btn border border-slate-200 p-3 text-sm font-bold">
        <input type="checkbox" {...register("legallySeparatedNotRemarried")} />
        Legally separated and not remarried
      </label>
      <label className="flex items-center gap-2 rounded-btn border border-slate-200 p-3 text-sm font-bold">
        <input type="checkbox" {...register("physicallyChallenged")} />
        Physically challenged
      </label>
      <label className="flex items-center gap-2 rounded-btn border border-slate-200 p-3 text-sm font-bold">
        <input type="checkbox" {...register("medicalGrounds")} />
        Medical grounds
      </label>
      <ConditionalField watchName="physicallyChallenged" when={true}>
        <div className="md:col-span-2">
          <DisabilityBandSelector />
        </div>
      </ConditionalField>
      <ConditionalField watchName="medicalGrounds" when={true}>
        <label className="block text-sm font-bold text-slate-700">
          Medical Condition
          <select className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" {...register("medicalCondition")}>
            <option>cancer</option>
            <option>neuro surgery</option>
            <option>bone TB</option>
            <option>kidney transplantation</option>
            <option>liver transplantation</option>
            <option>heart transplantation</option>
          </select>
        </label>
      </ConditionalField>
      <ConditionalField watchName="medicalGrounds" when={true}>
        <AuditableField name="medicalDetails" label="Medical Details" />
      </ConditionalField>
      <label className="flex items-center gap-2 rounded-btn border border-slate-200 p-3 text-sm font-bold">
        <input type="checkbox" {...register("childMedicalStatus")} />
        Remarkable medical status of children
      </label>
      <ConditionalField watchName="childMedicalStatus" when={true}>
        <label className="block text-sm font-bold text-slate-700">
          Child Medical Condition
          <select className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" {...register("childMedicalCondition")}>
            <option>juvenile diabetic</option>
            <option>intellectual disability</option>
            <option>cancer</option>
            <option>born with holes in heart</option>
          </select>
        </label>
      </ConditionalField>
      <label className="block text-sm font-bold text-slate-700">
        Home Region
        <select className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" {...register("homeRegion")}>
          <option>Puducherry</option>
          <option>Karaikal</option>
          <option>Mahe</option>
          <option>Yanam</option>
        </select>
      </label>
      <AuditableField name="mobileNumber" label="Mobile Number" />
      <AuditableField name="email" label="E-Mail ID" />
      <div className="md:col-span-2">
        <AuditableField name="address" label="Address" />
      </div>
      <div className="md:col-span-2">
        <MandatoryDocUpload />
      </div>
    </div>
  );
}

export function TeacherEntryForm() {
  const [active, setActive] = useState<TabKey>("personal");
  const methods = useForm<TeacherFormValues>({
    resolver: zodResolver(fullSchema),
    mode: "onTouched",
    defaultValues
  });
  const values = methods.watch();
  const onSubmit = methods.handleSubmit(() => toast.success("Teacher profile submitted for workflow approval"));

  const activeBody = useMemo(() => {
    if (active === "personal") return <PersonalTab />;
    if (active === "qualification")
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <AuditableField name="degree" label="Degree" />
          <AuditableField name="subject" label="Main Subject" />
          <AuditableField name="handlingSubjects" label="Handling Subjects" />
          <AuditableField name="extraCurricularActivities" label="Extra-Curricular Activities" />
          <label className="flex items-center gap-2 rounded-btn border border-slate-200 p-3 text-sm font-bold"><input type="checkbox" {...methods.register("nationalAwardee")} /> National Awardee</label>
          <label className="flex items-center gap-2 rounded-btn border border-slate-200 p-3 text-sm font-bold"><input type="checkbox" {...methods.register("ncc")} /> NCC ANO, min 3 years</label>
          <label className="flex items-center gap-2 rounded-btn border border-slate-200 p-3 text-sm font-bold"><input type="checkbox" {...methods.register("nss")} /> NSS Coordinator, min 3 years</label>
          <label className="flex items-center gap-2 rounded-btn border border-slate-200 p-3 text-sm font-bold"><input type="checkbox" {...methods.register("scoutMasterGuideCaptain")} /> Scout Master / Guide Captain, min 3 years</label>
        </div>
      );
    if (active === "employee")
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <AuditableField name="employeeCode" label="Employee Code" />
          <AuditableField name="payCode" label="Employee Pay Code" />
          <AuditableField name="gpf" label="GPF / PRAN" />
          <AuditableField name="seniorityNumber" label="Seniority Number" />
          <AuditableField name="aadhaarMasked" label="Aadhaar Code (optional / masked)" />
          <AuditableField name="nationalCodeSsa" label="National Code (SSA) 10 digit" />
        </div>
      );
    if (active === "school")
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <AuditableField name="schoolName" label="School Name" />
          <AuditableField name="udiseCode" label="UDISE Code" />
          <label className="block text-sm font-bold text-slate-700">
            School Results, Last Academic Year
            <select className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" {...methods.register("resultBand")}>
              <option>100%</option>
              <option>99-95%</option>
              <option>94-90%</option>
              <option>Below 90%</option>
            </select>
          </label>
        </div>
      );
    if (active === "post")
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <AuditableField name="initialPost" label="Initial Post" />
          <AuditableField name="initialAppointmentDate" label="Initial Appointment Date" type="date" />
          <AuditableField name="presentPost" label="Present Post" />
          <AuditableField name="presentPostDate" label="Present Post Date" type="date" />
          <AuditableField name="probationDate" label="Probation Date" type="date" />
          <AuditableField name="completionDate" label="Completion Date" type="date" />
          <AuditableField name="recruitmentMode" label="Mode of Recruitment" />
        </div>
      );
    if (active === "promotion")
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <AuditableField name="fromPost" label="From Post" />
          <AuditableField name="toPost" label="To Post" />
          <AuditableField name="promotionDate" label="Promotion Date" type="date" />
          <AuditableField name="promotionSeniorityNumber" label="Seniority Number" />
          <AuditableField name="regularizationDate" label="Regularization Date" type="date" />
          <AuditableField name="promotionRemarks" label="Remarks" />
        </div>
      );
    if (active === "service") return <ServiceHistoryTable />;
    return <PlacementHistoryTable />;
  }, [active, methods]);

  return (
    <FormProvider {...methods}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <TabNav active={active} setActive={setActive} values={values} />
        <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">{activeBody}</section>
        <FormPreview values={values} editTab={setActive} />
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className="rounded-btn border border-slate-200 px-4 py-2 font-black" onClick={() => toast.info("Returned to reviewer correction queue")}>
            Return for Correction
          </button>
          <button type="submit" className="inline-flex items-center gap-2 rounded-btn bg-primary px-4 py-2 font-black text-white">
            <Check size={18} /> Submit for Review
          </button>
        </div>
        <DraftSaveIndicator />
      </form>
    </FormProvider>
  );
}
