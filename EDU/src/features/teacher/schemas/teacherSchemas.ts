import { z } from "zod";

const docSchema = z
  .any()
  .refine((value) => Boolean(value?.name), "Mandatory document upload is required");

export const personalSchema = z.object({
  name: z.string().min(2, "Name is required"),
  fatherName: z.string().min(2, "Father name is required"),
  gender: z.enum(["Female", "Male", "Other"]),
  dob: z.string().min(1, "Date of birth is required"),
  maritalStatus: z.enum(["Single", "Married"]),
  spouseGovernmentServant: z.boolean(),
  spouseName: z.string().optional(),
  spousePlaceOfDuty: z.string().optional(),
  widow: z.boolean(),
  legallySeparatedNotRemarried: z.boolean(),
  physicallyChallenged: z.boolean(),
  disabilityBand: z.string().optional(),
  homeRegion: z.enum(["Puducherry", "Karaikal", "Mahe", "Yanam"]),
  mobileNumber: z.string().min(10, "Mobile number is required"),
  email: z.string().email("Valid email is required"),
  address: z.string().min(5, "Address is required"),
  medicalGrounds: z.boolean(),
  medicalCondition: z.string().optional(),
  medicalDetails: z.string().optional(),
  childMedicalStatus: z.boolean(),
  childMedicalCondition: z.string().optional(),
  mandatoryDocument: docSchema
});

export const qualSchema = z.object({
  degree: z.string().min(2),
  subject: z.string().min(2),
  handlingSubjects: z.string().min(2),
  extraCurricularActivities: z.string().optional(),
  nationalAwardee: z.boolean(),
  ncc: z.boolean(),
  nss: z.boolean(),
  scoutMasterGuideCaptain: z.boolean()
});

export const employeeSchema = z.object({
  employeeCode: z.string().min(4),
  payCode: z.string().min(2),
  gpf: z.string().min(2),
  seniorityNumber: z.string().min(1),
  aadhaarMasked: z.string().optional(),
  nationalCodeSsa: z.string().min(10)
});

export const schoolSchema = z.object({
  schoolName: z.string().min(2),
  udiseCode: z.string().min(4),
  resultBand: z.enum(["100%", "99-95%", "94-90%", "Below 90%"])
});

export const postSchema = z.object({
  initialPost: z.string().min(2),
  initialAppointmentDate: z.string().min(1),
  presentPost: z.string().min(2),
  presentPostDate: z.string().min(1),
  probationDate: z.string().min(1),
  completionDate: z.string().min(1),
  recruitmentMode: z.string().min(2)
});

export const promotionSchema = z.object({
  fromPost: z.string().min(2),
  toPost: z.string().min(2),
  promotionDate: z.string().min(1),
  promotionSeniorityNumber: z.string().min(1),
  regularizationDate: z.string().min(1),
  promotionRemarks: z.string().optional()
});

export const serviceSchema = z.object({
  serviceHistory: z.array(
    z.object({
      schoolName: z.string().min(2),
      schoolCode: z.string().min(2),
      udiseCode: z.string().min(4),
      postHeld: z.string().min(2),
      fromDate: z.string().min(1),
      toDate: z.string().min(1),
      remarks: z.string().optional()
    })
  )
});

export const placementSchema = z.object({
  placementHistory: z.array(
    z.object({
      schoolName: z.string().min(2),
      postHeld: z.string().min(2),
      fromDate: z.string().min(1),
      toDate: z.string().min(1),
      remarks: z.string().optional()
    })
  )
});

export const tabSchemas = {
  personal: personalSchema,
  qualification: qualSchema,
  employee: employeeSchema,
  school: schoolSchema,
  post: postSchema,
  promotion: promotionSchema,
  service: serviceSchema,
  placement: placementSchema
};

export type TeacherFormValues = z.infer<typeof personalSchema> &
  z.infer<typeof qualSchema> &
  z.infer<typeof employeeSchema> &
  z.infer<typeof schoolSchema> &
  z.infer<typeof postSchema> &
  z.infer<typeof promotionSchema> &
  z.infer<typeof serviceSchema> &
  z.infer<typeof placementSchema>;
